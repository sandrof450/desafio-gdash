import { Line } from "react-chartjs-2";

import type { WeatherLog } from "src/constants/weather/types";
import { useWeather } from "src/contexts/WeatherContext";

// --- LÓGICA DE PREPARAÇÃO DE DADOS PARA O GRÁFICO ---
const getChartData = (logs: WeatherLog[]) => {
  // Ordena os logs para que o gráfico seja exibido cronologicamente
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return {
    // Eixo X: Usando um formato simples de Hora para o gráfico
    labels: sortedLogs.map((log) =>
      new Date(log.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    ),
    datasets: [
      {
        label: "Temperatura (°C)",
        data: sortedLogs.map((log) => log.temperature),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };
};



const TemperatureChart = () => { 
  const {logs } = useWeather();
  return (
    <div className="bg-white p-8 rounded-lg shadow-xl mb-10">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        Histórico de Temperatura
      </h2>
      {logs.length > 0 ? (
        <Line data={getChartData(logs)} />
      ) : (
        <p className="text-gray-500">
          Aguardando dados históricos (logs) para exibir o gráfico.
        </p>
      )}
    </div>
  )
}

export default TemperatureChart;