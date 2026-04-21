// src/App.tsx
import React, { useState } from 'react';
import Login from './pages/LoginPage';
import Sensors from './components/Sensors';
import ProtectedRoute from './ProtectedRoute';
import { Sidebar } from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import SignUp from './components/SignUp';
import RoomPage from './pages/RoomPage';
import useSensors from './hooks/useSensors';
import CyberpunkLoading from './components/shared/CyberpunkLoading';

type Page = "dashboard" | "users" | "rooms";

const App: React.FC = () => {
  const [page, setPage] = useState<Page>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const { status, data } = useSensors({ room: "all" });
  return (
    <Routes>
      <Route path='/' element={
        <ProtectedRoute>
          {
            status !== "CONNECTED"
              ?
              <CyberpunkLoading status={status} />
              :
              <div style={{ display: "flex", minHeight: "100vh", background: "#060b14", fontFamily: "'JetBrains Mono', monospace" }}>
                <Sidebar activePage={page} onNavigate={setPage} collapsed={collapsed} onToggleCollapse={() => setCollapsed((c) => !c)} />
                {page === "dashboard" && <Sensors data={data} />}
                {page === "users" && <SignUp />}
                {page === "rooms" && <RoomPage />}
              </div>
          }

        </ProtectedRoute>
      } />

      <Route path='/login' element={<Login />} />
    </Routes>
  );
};

export default App;