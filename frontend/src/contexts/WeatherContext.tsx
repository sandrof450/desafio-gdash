import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";
import { getWeatherLogs } from "src/api/weather.log.service";
import type { WeatherLog } from "src/constants/weather/types";

interface WeatherContextType {
  logs: WeatherLog[];
  logsLoading: boolean;
  logsError: string | null;

  //paginação
  currentPage: number;
  totalPages: number;
  totalLogs: number;
  limit: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>; //Função para alterar a página atual

  //Função para forçar o recarregamento, se necessário
  refetchLogs: () => Promise<void>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = searchParams.get("page");
  const initialPage = pageParam ? parseInt(pageParam) : 1;

  //Dados principais
  const [logs, setLogs] = useState<WeatherLog[]>([]);
  const [logsLoading, setLogsLoading] = useState<boolean>(true);
  const [logsError, setLogsError] = useState<string | null>(null);

  //Estados de paginação
  const [currentPage, setCurrentPageState] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalLogs, setTotalLogs] = useState<number>(0);
  const [limit] = useState<number>(10);

  const setCurrentPage = (page: number | ((prevState: number) => number)) => {
    let nextPage;
    if (typeof page === "function") {
      nextPage = page(currentPage);
    } else {
      nextPage = page;
    }
    if (nextPage < 1) nextPage = 1;

    setCurrentPageState(nextPage);
    setSearchParams({ page: nextPage.toString() }, { replace: true });
  };

  const fetchLogs = useCallback(async () => {
    setLogsLoading(true);
    setLogsError(null);

    try {

      const logsResponse = await getWeatherLogs(currentPage, limit);
      const logData = logsResponse.data || logsResponse;
      setLogs(logData.logs || []);
      setTotalLogs(logData.totalLogs || 0);
      setTotalPages(logData.totalPages || 0);
    } catch (err) {
      console.error("Erro ao buscar dados do Clima:", err);
      setLogsError("Não foi possível carregar os dados do clima.");
    } finally {
      setLogsLoading(false);
    }
  }, [currentPage, limit]); // Dispara a busca quando a página muda!

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // A função de refetch será a mesma fetchData

  const refetchLogs = fetchLogs;

  return (
    <WeatherContext.Provider
      value={{
        logs,
        logsLoading,
        logsError,
        currentPage,
        totalPages,
        totalLogs,
        limit,
        setCurrentPage,
        refetchLogs,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
};