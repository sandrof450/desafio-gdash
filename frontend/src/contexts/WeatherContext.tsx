import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getInsights } from "src/api/weather.insight.service";
import { getWeatherLogs } from "src/api/weather.log.service";
import type { WeatherInsight, WeatherLog } from "src/constants/weather/types";

interface WeatherContextType {
  logs: WeatherLog[];
  insights: WeatherInsight | null;
  weatherLoading: boolean;
  weatherError: string | null;

  //paginação
  currentPage: number;
  totalPages: number;
  totalLogs: number;
  limit: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;//Função para alterar a página atual

  //Função para forçar o recarregamento, se necessário
  refetchWeatherData: () => Promise<void>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => { 
  //Dados principais
  const [logs, setLogs] = useState<WeatherLog[]>([]);
  const [insights, setInsights] = useState<WeatherInsight | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  //Estados de paginação
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalLogs, setTotalLogs] = useState<number>(0);
  const [limit] = useState<number>(10);

  //Lógica de busca de dados
  const fetchData = useCallback(async () => {
    setWeatherLoading(true);
    setWeatherError(null);

    try {
      // ... (Mesma lógica de busca que estava no DashboardPage)
      const insightsResponse = await getInsights();
      setInsights(insightsResponse.data || insightsResponse);

      const logsResponse = await getWeatherLogs(currentPage, limit);  
      const logData = logsResponse.data || logsResponse;
      setLogs(logData.logs || []);
      setTotalLogs(logData.totalLogs || 0);
      setTotalPages(logData.totalPages || 0);

    } catch (err) {
        console.error("Erro ao buscar dados do Clima:", err);
        setWeatherError("Não foi possível carregar os dados do clima.");
    } finally {
        setWeatherLoading(false);
    }
  }, [currentPage, limit]); // Dispara a busca quando a página muda!

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // A função de refetch será a mesma fetchData
  const refetchWeatherData = fetchData;

  return (
    <WeatherContext.Provider value={{logs, insights, weatherLoading, weatherError, currentPage, totalPages, totalLogs, limit, setCurrentPage, refetchWeatherData}}>
      {children}
    </WeatherContext.Provider>
  )
}

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
};