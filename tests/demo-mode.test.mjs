import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";

class MemoryStorage {
  values = new Map();
  failWrites = false;
  getItem(key) {
    return this.values.get(key) ?? null;
  }
  setItem(key, value) {
    if (this.failWrites) throw new Error("Storage unavailable");
    this.values.set(key, String(value));
  }
  removeItem(key) {
    this.values.delete(key);
  }
  clear() {
    this.values.clear();
    this.failWrites = false;
  }
}

const originalFetch = globalThis.fetch;
const originals = Object.fromEntries(
  ["localStorage", "sessionStorage"].map((key) => [
    key,
    Object.getOwnPropertyDescriptor(globalThis, key),
  ]),
);
const local = new MemoryStorage();
const session = new MemoryStorage();
let server, demo, demoSession, storage, App, MemoList, MemoDetail, authApi;
let requests;

before(async () => {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: local,
  });
  Object.defineProperty(globalThis, "sessionStorage", {
    configurable: true,
    value: session,
  });
  server = await createServer({
    configFile: false,
    server: { middlewareMode: true },
    appType: "custom",
    define: {
      "import.meta.env.VITE_API_BASE_URL": JSON.stringify(
        "https://api.example.test",
      ),
    },
  });
  demo = (await server.ssrLoadModule("/src/stores/useDemoMemoStore.ts"))
    .useDemoMemoStore;
  demoSession = await server.ssrLoadModule(
    "/src/stores/useDemoSessionStore.ts",
  );
  storage = await server.ssrLoadModule("/src/demo/memoStorage.ts");
  App = (await server.ssrLoadModule("/src/App.tsx")).default;
  MemoList = (await server.ssrLoadModule("/src/components/MemoList.tsx"))
    .default;
  MemoDetail = (await server.ssrLoadModule("/src/components/MemoDetail.tsx"))
    .default;
  authApi = await server.ssrLoadModule("/src/api/auth.ts");
});

beforeEach(() => {
  local.clear();
  session.clear();
  demo.setState({ memos: [], isReady: false, error: null });
  demoSession.useDemoSessionStore.setState({ isActive: false });
  requests = [];
  globalThis.fetch = async (...args) => {
    requests.push(args);
    throw new Error("Network forbidden in demo tests");
  };
});

after(async () => {
  await server?.close();
  globalThis.fetch = originalFetch;
  for (const [key, descriptor] of Object.entries(originals)) {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else delete globalThis[key];
  }
});

test("first entry seeds six memos across all categories, with pinned and unpinned cards", () => {
  assert.equal(local.getItem(storage.DEMO_MEMOS_STORAGE_KEY), null);
  demo.getState().initialize();
  const { memos, isReady } = demo.getState();
  assert.equal(isReady, true);
  assert.equal(memos.length, 6);
  assert.deepEqual(
    new Set(memos.map((memo) => memo.category)),
    new Set(["Daily", "Work", "Others"]),
  );
  assert.ok(memos.some((memo) => memo.isPinned));
  assert.ok(memos.some((memo) => !memo.isPinned));
  assert.deepEqual(storage.loadDemoMemos(), memos);
  assert.equal(requests.length, 0);
});

test("CRUD and pin changes survive reloading the store without calling fetch", () => {
  demo.getState().initialize();
  const draft = {
    title: "QA memo",
    content: "Persistent content",
    category: "Work",
    date: "2026.10.13",
  };
  demo.getState().addMemo(draft);
  const id = demo.getState().memos[0].id;
  demo.getState().togglePin(id);
  demo
    .getState()
    .updateMemo(id, { ...draft, title: "Updated QA memo", category: "Others" });
  const saved = demo.getState().memos;
  demo.setState({ memos: [], isReady: false });
  demo.getState().initialize();
  assert.deepEqual(demo.getState().memos, saved);
  assert.equal(demo.getState().memos[0].title, "Updated QA memo");
  assert.equal(demo.getState().memos[0].isPinned, true);
  demo.getState().togglePin(id);
  assert.equal(storage.loadDemoMemos()[0].isPinned, false);
  demo.getState().deleteMemo(id);
  demo.getState().initialize();
  assert.equal(demo.getState().memos.length, 6);
  assert.ok(!demo.getState().memos.some((memo) => memo.id === id));
  assert.equal(requests.length, 0);
});

test("deleting every memo remains empty after reload and demo re-entry", () => {
  demo.getState().initialize();
  for (const memo of demo.getState().memos) demo.getState().deleteMemo(memo.id);
  demoSession.useDemoSessionStore.getState().startDemo();
  demoSession.useDemoSessionStore.getState().endDemo();
  demoSession.useDemoSessionStore.getState().startDemo();
  demo.getState().initialize();
  assert.deepEqual(demo.getState().memos, []);
  assert.deepEqual(storage.loadDemoMemos(), []);
});

test("demo session and mutations leave real auth, memo-store, and legacy memos untouched", () => {
  const existing = {
    "auth-storage": "real-auth-sentinel",
    "memo-store": "real-memos-sentinel",
    memos: "legacy-sentinel",
  };
  for (const [key, value] of Object.entries(existing))
    local.setItem(key, value);
  const state = demoSession.useDemoSessionStore;
  state.getState().startDemo();
  assert.equal(state.getState().isActive, true);
  assert.equal(session.getItem(demoSession.DEMO_SESSION_STORAGE_KEY), "active");
  assert.ok(!("accessToken" in state.getState()));
  demo.getState().initialize();
  demo.getState().togglePin(1);
  const saved = local.getItem(storage.DEMO_MEMOS_STORAGE_KEY);
  state.getState().endDemo();
  assert.equal(state.getState().isActive, false);
  assert.equal(session.getItem(demoSession.DEMO_SESSION_STORAGE_KEY), null);
  state.getState().startDemo();
  demo.getState().initialize();
  assert.equal(local.getItem(storage.DEMO_MEMOS_STORAGE_KEY), saved);
  for (const [key, value] of Object.entries(existing))
    assert.equal(local.getItem(key), value);
  assert.equal(requests.length, 0);
});

test("refresh restores the demo session independently of auth", async () => {
  demoSession.useDemoSessionStore.getState().startDemo();
  const module = server.moduleGraph.getModuleById(
    (
      await server.pluginContainer.resolveId(
        "/src/stores/useDemoSessionStore.ts",
      )
    ).id,
  );
  server.moduleGraph.invalidateModule(module);
  const reloaded = await server.ssrLoadModule(
    "/src/stores/useDemoSessionStore.ts",
  );
  assert.equal(reloaded.useDemoSessionStore.getState().isActive, true);
  reloaded.useDemoSessionStore.getState().endDemo();
  server.moduleGraph.invalidateModule(module);
  const exited = await server.ssrLoadModule(
    "/src/stores/useDemoSessionStore.ts",
  );
  assert.equal(exited.useDemoSessionStore.getState().isActive, false);
});

test("failed saves preserve both the displayed and persisted memos", () => {
  demo.getState().initialize();
  const before = demo.getState().memos;
  const saved = local.getItem(storage.DEMO_MEMOS_STORAGE_KEY);
  local.failWrites = true;
  assert.throws(() => demo.getState().deleteMemo(1), /저장하지 못했습니다/);
  assert.deepEqual(demo.getState().memos, before);
  assert.equal(local.getItem(storage.DEMO_MEMOS_STORAGE_KEY), saved);
});

test("corrupt or malformed saved demo data is reported and never overwritten", () => {
  for (const saved of [
    "broken JSON",
    JSON.stringify({ version: 1, memos: [{ category: "invalid" }] }),
    "null",
  ]) {
    local.setItem(storage.DEMO_MEMOS_STORAGE_KEY, saved);
    demo.getState().initialize();
    assert.equal(demo.getState().isReady, false);
    assert.match(demo.getState().error, /읽지 못했습니다/);
    assert.equal(local.getItem(storage.DEMO_MEMOS_STORAGE_KEY), saved);
  }
});

test("denied session storage does not activate demo mode", () => {
  session.failWrites = true;
  assert.throws(
    () => demoSession.useDemoSessionStore.getState().startDemo(),
    /저장소 사용을 허용/,
  );
  assert.equal(demoSession.useDemoSessionStore.getState().isActive, false);
});

test("existing memo screen, pinned ordering and detail render with the demo store", () => {
  demo.getState().initialize();
  const memoStore = { ...demo, getInitialState: demo.getState };
  const markup = renderToStaticMarkup(
    createElement(App, { memoStore, onExitDemo() {} }),
  );
  assert.match(markup, /DEMO MODE/);
  assert.match(markup, /데모 종료/);
  assert.match(markup, /메모 검색어/);
  assert.equal((markup.match(/상세 보기/g) ?? []).length, 6);
  const memos = [...demo.getState().memos].reverse();
  const list = renderToStaticMarkup(
    createElement(MemoList, { memos, onTogglePin() {}, onSelectMemo() {} }),
  );
  assert.ok(
    list.indexOf("Pre-SKALA 포트폴리오") <
      list.indexOf("주말에 해 보고 싶은 것"),
  );
  const detail = renderToStaticMarkup(
    createElement(MemoDetail, {
      memo: memos[0],
      onClose() {},
      onEdit() {},
      onDelete() {},
    }),
  );
  assert.match(detail, /role="dialog"/);
  assert.match(detail, /메모 수정/);
  assert.match(detail, /메모 삭제/);
  assert.match(detail, /주말에 해 보고 싶은 것/);
  assert.equal(requests.length, 0);
});

test("normal login and signup still use their API endpoints (mocked, no real network)", async () => {
  globalThis.fetch = async (...args) => {
    requests.push(args);
    return new Response(
      JSON.stringify({
        success: true,
        data: { accessToken: "test-response-token" },
      }),
      { status: 200 },
    );
  };
  const credentials = {
    email: "demo-qa@example.test",
    password: "test-only-password",
  };
  assert.equal(
    (await authApi.login(credentials)).accessToken,
    "test-response-token",
  );
  await authApi.signup(credentials);
  assert.equal(requests.length, 2);
  assert.equal(requests[0][0], "https://api.example.test/api/auth/login");
  assert.equal(requests[1][0], "https://api.example.test/api/auth/signup");
  for (const [, options] of requests) {
    assert.equal(options.method, "POST");
    assert.deepEqual(JSON.parse(options.body), credentials);
  }
});

test("a demo session can render /demo but never grants access to protected /memos", async () => {
  session.setItem(demoSession.DEMO_SESSION_STORAGE_KEY, "active");
  server.moduleGraph.invalidateAll();
  const Router = (await server.ssrLoadModule("/src/routes/AppRouter.tsx"))
    .default;
  const renderRoute = (path) =>
    renderToStaticMarkup(
      createElement(
        MemoryRouter,
        { initialEntries: [path] },
        createElement(Router),
      ),
    );
  assert.match(renderRoute("/demo"), /데모 메모를 불러오는 중/);
  assert.equal(renderRoute("/memos"), "");
  assert.match(renderRoute("/login"), /데모로 체험하기/);
  assert.match(renderRoute("/signup"), /비밀번호 확인/);
  assert.equal(local.getItem("auth-storage"), null);
  assert.equal(requests.length, 0);

  session.clear();
  server.moduleGraph.invalidateAll();
  const ExitedRouter = (await server.ssrLoadModule("/src/routes/AppRouter.tsx"))
    .default;
  assert.equal(
    renderToStaticMarkup(
      createElement(
        MemoryRouter,
        { initialEntries: ["/demo"] },
        createElement(ExitedRouter),
      ),
    ),
    "",
  );
});
