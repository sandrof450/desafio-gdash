import { useWeather } from "src/contexts/WeatherContext";


const DashboardHeader = () => {
  const { insights } = useWeather();
  
  return (
    <header className="text-center mb-10">
      <h1 className="text-4xl font-bold text-blue-700 mb-2">
        Dashboard de Clima & Insights - Florianópolis
      </h1>
      <p className="text-gray-600 text-lg">
        Última Análise:{" "}
        {insights?.analysisDate
          ? new Date(insights.analysisDate).toLocaleString()
          : "Data indisponível"}
      </p>
    </header>
  )
}

export default DashboardHeader