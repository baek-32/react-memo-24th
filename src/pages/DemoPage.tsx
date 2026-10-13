import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import App from "../App";
import CommonModal from "../components/CommonModal";
import { useDemoMemoStore } from "../stores/useDemoMemoStore";
import { useDemoSessionStore } from "../stores/useDemoSessionStore";

function DemoPage() {
  const navigate = useNavigate();
  const isActive = useDemoSessionStore((state) => state.isActive);
  const endDemo = useDemoSessionStore((state) => state.endDemo);
  const isReady = useDemoMemoStore((state) => state.isReady);
  const error = useDemoMemoStore((state) => state.error);
  const initialize = useDemoMemoStore((state) => state.initialize);

  useEffect(() => {
    if (isActive) initialize();
  }, [isActive, initialize]);

  const handleExit = () => {
    endDemo();
    navigate("/login", { replace: true });
  };

  if (!isActive) return <Navigate to="/login" replace />;

  if (error) {
    return (
      <CommonModal
        title="데모를 불러오지 못했습니다"
        message={error}
        confirmText="로그인으로 돌아가기"
        onConfirm={handleExit}
      />
    );
  }

  if (!isReady) {
    return (
      <main
        className="flex min-h-screen items-center justify-center bg-blue-01 font-sans text-gray-04"
        role="status"
      >
        데모 메모를 불러오는 중...
      </main>
    );
  }

  return <App memoStore={useDemoMemoStore} onExitDemo={handleExit} />;
}

export default DemoPage;
