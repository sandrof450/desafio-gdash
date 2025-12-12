import type React from "react";
import { useMetrics } from "src/contexts/WeatherMetricsContext";

interface InsightPanelProps {
  getRiskClasses: (riskLevel?: string) => string;
}

const InsightsPanel: React.FC<InsightPanelProps> = (props: InsightPanelProps) => { 
  const { metrics } = useMetrics();

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl mb-10 border-t-8 border-purple-600">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">
        Análise de Negócios (IA)
      </h2>
      <p className="text-gray-700 leading-relaxed text-lg mb-6">
        {metrics?.insight}
      </p>

      {/* Risco Dinâmico */}
      <div
        className={`inline-flex items-center text-white text-lg font-semibold px-4 py-2 rounded-full shadow-md ${props.getRiskClasses(
          metrics?.risco_negocio
        )}`}
      >
        {metrics?.risco_negocio === "Alto" && (
          <span className="mr-2">🛑</span>
        )}
        {metrics?.risco_negocio === "Médio" && (
          <span className="mr-2">⚠️</span>
        )}
        {metrics?.risco_negocio === "Baixo" && (
          <span className="mr-2">✅</span>
        )}
        {metrics?.risco_negocio === "Não Avaliado" && (
          <span className="mr-2">⚪</span>
        )}
        Risco: {metrics?.risco_negocio}
      </div>
    </div>
  )
}

export default InsightsPanel;