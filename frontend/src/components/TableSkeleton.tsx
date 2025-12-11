// src/components/TableSkeleton.tsx

import React from 'react';

// Renderiza uma linha de "placeholder" que pulsa
const SkeletonRow: React.FC = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </td>
  </tr>
);

interface TableSkeletonProps {
  count?: number; // Número de linhas a renderizar (padrão 10)
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ count = 10 }) => {
  return (
    // Usa uma estrutura de tabela para garantir que o layout bata
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        {/* Inclua o cabeçalho real da tabela para manter a largura */}
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora da Coleta</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperatura (°C)</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {/* Renderiza o número de linhas de skeleton */}
        {Array.from({ length: count }).map((_, index) => (
          <SkeletonRow key={index} />
        ))}
        {/* Linha de paginação fake ou apenas vazia */}
        <tr>
           <td colSpan={3} className="h-10"></td>
        </tr>
      </tbody>
    </table>
  );
};