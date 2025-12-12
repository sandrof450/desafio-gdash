import "./App.css";
import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import { Toaster } from "@/components/ui/sonner";
import { WeatherProvider } from "./contexts/WeatherContext";
import { MetricsProvider } from "./contexts/WeatherMetricsContext";

// src/App.tsx (Exemplo da Estrutura de Rotas)

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <MetricsProvider>
        <WeatherProvider>
          <Routes>
            {/*-------------------ROTAS PUBLICAS-------------------------------*/}
            {/* Rota Raiz (Redireciona para login por enquanto) */}
            {/* <Route path="/" element={<LoginPage />} />  */}

            {/* Rota Pública: Login */}
            <Route path="/login" element={<LoginPage />} />

            {/* Rota Pública: register */}
            <Route path="/register" element={<RegisterPage />} />

            {/*-------------------ROTAS PROTEGIDAS-------------------------------*/}
            <Route element={<ProtectedRoute />}>
              {/* Se autenticado, o Dashboard é renderizado no <Outlet /> */}
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* Rota Raiz (Redireciona para o Dashboard se logado, ou Login se não logado) */}
              <Route path="/" element={<DashboardPage />} />
            </Route>

          </Routes>
        </WeatherProvider>
      </MetricsProvider>
      <Toaster position="top-center" richColors></Toaster>
    </div>
  );
}
