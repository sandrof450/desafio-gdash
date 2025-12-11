import api from "./protectedApi";



const getInsights = async () => { 
  try {
    const response = await api.get("/weather/insights");
    console.log("Serviço Insights: Resposta bruta da API", response);
    return response.data;
  }catch (error) {
    throw new Error('Erro ao buscar os insights de clima.', error as Error);
  }
}

export { getInsights };