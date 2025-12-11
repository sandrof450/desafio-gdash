import api from "./protectedApi";

export const getWeatherLogs = async (page: number, limit: number) => {
  try {
    const response = await api.get("/weather/logs", { 
      params: {
        page,
        limit,
      },
    });
    console.log("Serviço Logs: Resposta bruta da API", response.data);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar os logs de clima.', error as Error);
  }
}