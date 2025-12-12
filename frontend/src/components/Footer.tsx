import { useMetrics } from "src/contexts/WeatherMetricsContext";


const Footer = () => {
  const { metrics } = useMetrics();
  return (
    <footer className="text-center text-gray-500 text-sm mt-10">
      <p>Dados de clima fornecidos por OpenWeatherMap.</p>
      <p>
        Coleta de dados finalizada em:{" "}
        {metrics?.data_coleta_fim
          ? new Date(metrics.data_coleta_fim).toLocaleString()
          : "Data indisponível"}
      </p>
    </footer>
  );
};

export default Footer;
