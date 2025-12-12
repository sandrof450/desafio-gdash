import { useAuth } from "../contexts/AuthContext";
import DashboardHeader from "../components/DashboardHeader";

// Importações do Chart.js

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import KpiCards from "@/components/KpiCard";
import InsightsPanel from "@/components/InsightsPanel";
import TemperatureChart from "@/components/TemperatureChart";
import LogsTable from "@/components/LogsTable";
import Footer from "@/components/Footer";
import ButtonLogout from "@/components/ButtonLogout";

// Importação da função utilitária (Remova esta linha se for usar apenas métodos nativos de Date)
//import { formatDate } from '../utils/formatUtils';
import { useWeather } from "../contexts/WeatherContext";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import React from "react";
import { useMetrics } from "src/contexts/WeatherMetricsContext";

// Registrar os elementos necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// --- COMPONENTE PRINCIPAL ---
const DashboardPage: React.FC = () => {
  const { logout } = useAuth();

  const { logsLoading, logsError, setCurrentPage, currentPage } = useWeather();

  const { metricsLoading, metricsError } = useMetrics();

  const initialLoading = (logsLoading && currentPage === 1) || metricsLoading;
  const error = logsError || metricsError;

  //CLÁUSULA DE GUARDA: Renderiza o Skeleton se estiver carregando
  if (initialLoading) {
    setCurrentPage(1);
    return <DashboardSkeleton />;
  }

  // CLÁUSULA DE GUARDA: Renderiza o erro se houver falha
  if (error) {
    return (
      <div className="p-10 text-center text-xl text-red-600">
        Não foi possível carregar o Dashboard: {error}
      </div>
    );
  }

  // Função auxiliar para determinar as classes dinâmicas de risco
  const getRiskClasses = (risco: string | undefined | null) => {
    switch (risco) {
      case "Alto":
        return "bg-red-500";
      case "Médio":
        return "bg-yellow-500";
      case "Baixo":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex-1">
        <div className="container mx-auto p-4 md:p-8">
          {/* CABEÇALHO */}
          <DashboardHeader />

          {/* KPIs - MÉTRICAS CHAVE */}
          <KpiCards />

          {/* PAINEL DE INSIGHTS DA IA & RISCO */}
          <InsightsPanel getRiskClasses={getRiskClasses} />

          {/* GRÁFICO DE HISTÓRICO */}
          <TemperatureChart />

          {/* TABELA DE LOGS BRUTOS */}
          <LogsTable />

          {/* RODAPÉ */}
          <Footer />

          {/* Botão de Logout Fixo */}
          <ButtonLogout onLogout={logout} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
