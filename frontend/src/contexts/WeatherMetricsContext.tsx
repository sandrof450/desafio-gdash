import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getInsights } from "src/api/weather.insight.service";
import type { WeatherInsight } from "src/constants/weather/types";
import { useAuth } from "./AuthContext";

export interface MetricsContextType {
  metrics: WeatherInsight | null;
  metricsLoading: boolean;
  metricsError: string | null;
  fetchMetrics: () => void;
}

const MetricsContext = createContext<MetricsContextType | undefined>(undefined);

export const MetricsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [metrics, setMetrics] = useState<WeatherInsight | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  const {isAuthenticated} = useAuth();

  // ---------------------------------------------------
  // Função para buscar KPIs
  // Só roda se o token existir
  // ---------------------------------------------------
  const fetchMetrics = useCallback(async () => {
    const token = localStorage.getItem("jwt_access_token");

    if (!token) {
      return;
    }

    setMetricsLoading(true);
    setMetricsError(null);

    try {
      const response = await getInsights();
      const metricsData: WeatherInsight = response.data || response;
      setMetrics(metricsData);
    } catch (err) {
      console.error("Erro ao carregar métricas:", err);
      setMetricsError("Falha ao carregar as métricas do servidor.");
    } finally {
      setMetricsLoading(false);
    }
  }, []);

  // ---------------------------------------------------
  // Efeito que roda somente se houver token
  // ---------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("jwt_access_token");

    if (!token) {
      setMetricsLoading(false); // Evita spinner infinito na tela de login
      return;
    }

    fetchMetrics();
  }, [fetchMetrics]);

  useEffect(() => {
    if (isAuthenticated)
      fetchMetrics();
  }, [isAuthenticated, fetchMetrics])

  return (
    <MetricsContext.Provider
      value={{ metrics, metricsLoading, metricsError, fetchMetrics }}
    >
      {children}
    </MetricsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMetrics = () => {
  const context = useContext(MetricsContext);
  if (context === undefined) {
    throw new Error("useMetrics deve ser usado dentro de um MetricsProvider");
  }
  return context;
};
