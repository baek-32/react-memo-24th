import { create } from "zustand";

export const DEMO_SESSION_STORAGE_KEY = "react-memo-demo-session-v1";

function hasDemoSession(): boolean {
  try {
    return sessionStorage.getItem(DEMO_SESSION_STORAGE_KEY) === "active";
  } catch {
    return false;
  }
}

interface DemoSessionStore {
  isActive: boolean;
  startDemo: () => void;
  endDemo: () => void;
}

// A tab-local demo session is never an authentication token or a server permission.
export const useDemoSessionStore = create<DemoSessionStore>((set) => ({
  isActive: hasDemoSession(),
  startDemo: () => {
    try {
      sessionStorage.setItem(DEMO_SESSION_STORAGE_KEY, "active");
    } catch {
      throw new Error(
        "데모를 시작하려면 브라우저의 저장소 사용을 허용해주세요.",
      );
    }
    set({ isActive: true });
  },
  endDemo: () => {
    sessionStorage.removeItem(DEMO_SESSION_STORAGE_KEY);
    set({ isActive: false });
  },
}));
