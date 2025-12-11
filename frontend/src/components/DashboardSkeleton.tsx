// src/components/DashboardSkeleton.tsx
import React from 'react';

const DashboardSkeleton: React.FC = () => {
  // O componente imita o layout da sua DashboardPage
  return (
    <div className="p-8 space-y-8 animate-pulse">
      {/* 1. Kpi Cards (Imita os 3 cards do topo) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-gray-200 h-32 rounded-lg shadow-md"></div>
        ))}
      </div>

      {/* 2. Painel de Insights (Imita a área de análise de negócio) */}
      <div className="bg-gray-200 h-40 rounded-lg shadow-md"></div>

      {/* 3. Área do Gráfico */}
      <div className="bg-gray-200 h-72 rounded-lg shadow-md"></div>

      {/* 4. Área da Tabela de Logs */}
      <div className="bg-gray-200 h-96 rounded-lg shadow-xl"></div>
    </div>
  );
};

export default DashboardSkeleton;