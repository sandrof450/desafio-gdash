import React from "react";
import { useWeather } from "src/contexts/WeatherContext";
import { TableSkeleton } from "./TableSkeleton";

interface LogsTableProps {
  handlePrevPage: () => void;
  handleNextPage: () => void;
}

const LogsTable: React.FC<LogsTableProps> = (props: LogsTableProps) => {
  const {
    currentPage,
    totalPages,
    totalLogs,
    logs,
    weatherLoading: loading,
  } = useWeather();

  // Condição para exibir a animação
  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-xl mb-10">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Logs Brutos (Detalhamento)
        </h2>
        <TableSkeleton count={10} /> {/* RENDERIZA O SHIMMER AQUI */}
      </div>
    );
  }

  // Condição para exibir 'Nenhum Registro' (opcional)
  if (!loading && logs.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-xl mb-10 text-center py-10 text-gray-500">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Logs Brutos (Detalhamento)
        </h2>
        <p>Nenhum registro de clima encontrado.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl mb-10">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">
        Logs Brutos (Detalhamento)
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 relative">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hora da Coleta
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Temperatura (°C)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => (
              // Substituí log.id por log.logId (ou ajuste para o campo real do MongoDB/Mongoose)
              <tr key={log.logId || log.createdAt}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-left text-gray-900">
                  {new Date(log.createdAt).toLocaleTimeString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-left text-blue-600 font-medium">
                  {log.temperature.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-left text-gray-700">
                  {log.description}
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={3}>
                <div className="flex justify-center items-center mt-6 space-x-4">
                  <button
                    onClick={props.handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
                  >
                    &larr; Anterior
                  </button>

                  <span className="text-gray-600 font-semibold mx-4">
                    Página {currentPage} de {totalPages} ({totalLogs}
                    registros)
                  </span>

                  <button
                    onClick={props.handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
                  >
                    Próxima &rarr;
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogsTable;
