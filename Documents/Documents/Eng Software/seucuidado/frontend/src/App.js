import { useEffect, useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import HomePage from "@/pages/HomePage";
import ProfessionalsPage from "@/pages/ProfessionalsPage";
import ProfessionalProfile from "@/pages/ProfessionalProfile";
import Dashboard from "@/pages/Dashboard";
import ChatPage from "@/pages/ChatPage";
import { Toaster } from "@/components/ui/sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  withCredentials: true
});

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    initData();
  }, []);

  const checkAuth = async () => {
    const hash = window.location.hash;
    if (hash && hash.includes("session_id=")) {
      const sessionId = hash.split("session_id=")[1].split("&")[0];
      try {
        const response = await api.post("/auth/session", { session_id: sessionId });
        setUser(response.data.user);
        window.location.hash = "";
        window.location.href = "/dashboard";
      } catch (error) {
        console.error("Error creating session:", error);
      }
    } else {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
      } catch (error) {
        console.log("Not authenticated");
      }
    }
    setLoading(false);
  };

  const initData = async () => {
    try {
      await api.post("/init-data");
    } catch (error) {
      console.log("Data initialization error:", error);
    }
  };

  const handleLogout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-emerald-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sky-400"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/professionals" element={<ProfessionalsPage user={user} />} />
          <Route path="/professional/:id" element={<ProfessionalProfile user={user} />} />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/chat/:otherUserId" 
            element={user ? <ChatPage user={user} /> : <Navigate to="/" />} 
          />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;