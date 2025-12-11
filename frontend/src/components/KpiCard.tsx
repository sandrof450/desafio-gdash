import { useWeather } from "src/contexts/WeatherContext";

const KpiCards = () => { 
  const { insights } = useWeather();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {/* Card: Temperatura Média */}
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between border-l-4 border-blue-500">
        <div>
          <p className="text-gray-500 text-sm">
            Temperatura Média Período
          </p>
          <p className="text-3xl font-bold text-blue-700">
            {insights?.averageTemperature.toFixed(1)} °C
          </p>
        </div>
        <span className="text-5xl text-blue-400">🌡️</span>
      </div>

      {/* Card: Vento Máx. Registrado */}
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between border-l-4 border-gray-500">
        <div>
          <p className="text-gray-500 text-sm">Vento Máx. Registrado</p>
          <p className="text-3xl font-bold text-gray-800">
            {insights?.maxWindSpeed.toFixed(1)} m/s
          </p>
        </div>
        <span className="text-5xl text-gray-400">💨</span>
      </div>

      {/* Card: Total de Registros Analisados */}
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between border-l-4 border-green-500">
        <div>
          <p className="text-gray-500 text-sm">
            Total de Registros Analisados
          </p>
          <p className="text-3xl font-bold text-green-700">
            {insights?.totalRecordsAnalyzed}
          </p>
        </div>
        <span className="text-5xl text-green-400">📊</span>
      </div>
    </div>
  )
}

export default KpiCards;