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
import { useAuth } from "./AuthContext";

interface WeatherContextType {
  logs: WeatherLog[];
  logsLoading: boolean;
  logsError: string | null;

  currentPage: number;
  totalPages: number;
  totalLogs: number;
  limit: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  refetchLogs: () => Promise<void>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = searchParams.get("page");
  const initialPage = pageParam ? parseInt(pageParam) : 1;

  const [logs, setLogs] = useState<WeatherLog[]>([]);
  const [logsLoading, setLogsLoading] = useState<boolean>(false);
  const [logsError, setLogsError] = useState<string | null>(null);

  const [currentPage, setCurrentPageState] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalLogs, setTotalLogs] = useState<number>(0);
  const [limit] = useState<number>(10);

  const setCurrentPage = (page: number | ((prevState: number) => number)) => {
    let nextPage = typeof page === "function" ? page(currentPage) : page;
    if (nextPage < 1) nextPage = 1;

    setCurrentPageState(nextPage);
    setSearchParams({ page: nextPage.toString() }, { replace: true });
  };

  const { isAuthenticated } = useAuth();

  // ---------------------------------------------------
  // BUSCA DOS LOGS — agora com verificação de token
  // ---------------------------------------------------
  const fetchLogs = useCallback(async () => {
    const token = localStorage.getItem("jwt_access_token");

    // Se não houver token, não faz a requisição
    if (!token) {
      setLogsLoading(false);
      return;
    }

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
  }, [currentPage, limit]);

  // ---------------------------------------------------
  // EXECUTAR APENAS SE HOUVER TOKEN
  // ---------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("jwt_access_token");

    if (!token) {
      return;
    }

    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    if (isAuthenticated)
      fetchLogs();
  }, [isAuthenticated, fetchLogs])

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
  if (!context) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
};