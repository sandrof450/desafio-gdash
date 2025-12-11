export interface WeatherLog {
  // O ID do MongoDB
  logId: string; 

  // Dados coletados e salvos:
  temperature: number; 
  humidity: number;    
  windSpeed: number;
  description: string;
  userId: string;
  
  // Data de criação do registro
  createdAt: string; // Tipo ISO 8601 string para datas
}

export interface WeatherInsight {
  _id: string;

  // Parâmetros de identificação/agregração (ajuste conforme a lógica)
  cityId: number;
  cityName: string;

  insight: string;
  risco_negocio: 'Alto' | 'Médio' | 'Baixo' | 'Não Avaliado';

  data_coleta_fim: string;
  
  // Métricas de agregação
  averageTemperature: number;
  maxWindSpeed: number;
  totalRecordsAnalyzed: number; 
  
  // Período de análise
  analysisDate: string; 
}