// src/api/api.ts (Versão 2.0 com Refresh Token)
import axios from 'axios';

const API_URL = 'https://backend-6ue3.onrender.com/'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Chaves de armazenamento
const JWT_ACCESS_SECRET = 'jwt_access_token';
const JWT_REFRESH_SECRET = 'jwt_refresh_token'; // Nova chave para o refresh token

// Variáveis de controle para o fluxo de refresh
let isRefreshing = false;
let failedQueue: { resolve: (value: any) => void; reject: (reason?: any) => void; }[] = [];

// Função que adiciona a requisição à fila
const subscribeTokenRefresh = (cb: { resolve: (value: any) => void; reject: (reason?: any) => void; }) => {
    failedQueue.push(cb);
};

// Função que tenta processar todas as requisições na fila
const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            // Repete a requisição com o novo token
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// ----------------------------------------------------
// INTERCEPTOR DE REQUISIÇÃO (Injetar o Access Token)
// ----------------------------------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(JWT_ACCESS_SECRET);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// ----------------------------------------------------
// INTERCEPTOR DE RESPOSTA (Tratar Erro 401 e Renovar)
// ----------------------------------------------------
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // 1. Verifica se é erro 401 e se a requisição não está marcada como 'retry'
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            
            // Marca a requisição como 'retry' para não entrar em loop infinito
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem(JWT_REFRESH_SECRET);
            
            // Se não houver Refresh Token, o usuário deve ser deslogado imediatamente
            if (!refreshToken) {
                // Força o logout e redireciona (aqui é o ponto final, Refresh Token expirado ou nulo)
                localStorage.removeItem(JWT_ACCESS_SECRET);
                window.location.href = '/login';
                return Promise.reject(error);
            }

            // Se o refresh já estiver em andamento, enfileira a requisição original
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    subscribeTokenRefresh({ resolve, reject });
                }).then(token => {
                    // Repete a requisição original com o novo token
                    originalRequest.headers.Authorization = 'Bearer ' + token;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            // Inicia o processo de renovação
            isRefreshing = true;

            return new Promise(async (resolve, reject) => {
                try {
                    // 2. Chama o endpoint de refresh do seu NestJS
                    const refreshResponse = await axios.post(`${API_URL}auth/refresh`, {
                        refreshToken: refreshToken,
                    });

                    // ⚠️ ATENÇÃO: Ajuste para a estrutura da sua resposta
                    // Sua resposta: { success: true, accessToken: 'novo_token' }
                    const newAccessToken = refreshResponse.data.accessToken;

                    // 3. Salva o novo Access Token
                    localStorage.setItem(JWT_ACCESS_SECRET, newAccessToken);

                    // 4. Reprocessa as requisições em espera
                    processQueue(null, newAccessToken);
                    
                    // 5. Atualiza o cabeçalho da requisição original e a executa novamente
                    originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;
                    resolve(api(originalRequest));

                } catch (refreshError) {
                    // Se o refresh falhar (provavelmente refresh token expirado ou inválido)
                    processQueue(refreshError);
                    
                    // Força o logout e redireciona
                    localStorage.removeItem(JWT_ACCESS_SECRET);
                    localStorage.removeItem(JWT_REFRESH_SECRET);
                    window.location.href = '/login'; 

                    reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            });
        }
        
        // Para outros erros (ex: 400, 500), lança o erro
        return Promise.reject(error);
    }
);

export default api;