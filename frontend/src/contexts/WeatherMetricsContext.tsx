import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getInsights } from "src/api/weather.insight.service";
import type { WeatherInsight } from "src/constants/weather/types";

export interface MetricsContextType {
  metrics: WeatherInsight | null;
  metricsLoading: boolean;
  metricsError: string | null;
  fetchMetrics: () => void; // Função para recarregar os KPIs
}

const MetricsContext = createContext<MetricsContextType | undefined>(undefined);

export const MetricsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [metrics, setMetrics] = useState<WeatherInsight | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  // Função que busca os dados resumidos (KPIs, Insights)
  const fetchMetrics = useCallback(async () => {
    setMetricsLoading(true);
    setMetricsError(null);
    try {
      // A resposta deve incluir averageTemperature e totalRecords.
      const response = await getInsights();

      // O endpoint de insights/métricas pode retornar um objeto WeatherMetrics
      // Exemplo: { averageTemperature: 25.5, totalRecords: 150 }
      const metricsData: WeatherInsight = response.data || response;

      setMetrics(metricsData);
    } catch (err) {
      console.error("Erro ao carregar métricas:", err);
      setMetricsError("Falha ao carregar as métricas do servidor.");
    } finally {
      setMetricsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    // Adicionar um intervalo de recarga automática aqui, se as métricas forem importantes.
    // Exemplo: setInterval(fetchMetrics, 300000); // Recarrega a cada 5 minutos
  }, [fetchMetrics]);

  return (
    <MetricsContext.Provider
      value={{ metrics, metricsLoading, metricsError, fetchMetrics }}
    >
      {children}
    </MetricsContext.Provider>
  );
};

export const useMetrics = () => {
  const context = useContext(MetricsContext);
  if (context === undefined) {
    throw new Error("useMetrics deve ser usado dentro de um MetricsProvider");
  }
  return context;
};
