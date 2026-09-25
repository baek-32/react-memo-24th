import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import AppRouter from "./routes/AppRouter";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("React를 연결할 root 요소를 찾을 수 없습니다.");
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </StrictMode>,
);
