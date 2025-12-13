import React, { createContext, useState, useContext } from "react";
import { login as authLoginService } from "../api/auth.login.service";
import { register as authRegisterService } from "../api/auth.register.service";
import { useNavigate } from "react-router-dom";
import type {
  ApiRegisterRequest,
  ApiLoginRequest,
} from "src/constants/auth/types";

const ACCESS_TOKEN_KEY = "jwt_access_token";
const REFRESH_TOKEN_KEY = "jwt_refresh_token";

interface authResponse {
  success: boolean;
  message: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  loading: boolean;
  inputRegister: ApiRegisterRequest;
  login: (data: ApiLoginRequest) => Promise<authResponse>;
  insertRegister: (data: ApiRegisterRequest) => Promise<authResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [inputRegister, setInputRegister] = useState<ApiRegisterRequest>({
    userName: "",
    userEmail: "",
    userSenha: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    accessToken === null ? false : true
  );

  let errorMessage = "";
  let successMessage = "";

  const navigate = useNavigate();

  //const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  //Função register
  const insertRegister = async (data: ApiRegisterRequest) => {
    setLoading(true);

    try {
      await authRegisterService(data);

      setInputRegister(() => ({ ...data }));

      successMessage = "Cadastro realizado com sucesso! Faça login.";
      return { success: true, message: successMessage };
    } catch (error) {
      //Extrai a mensagem bruta e detalhada do backend
      const detailedMessage =
        (error as any).response?.data?.message ||
        (error as Error).message ||
        "Erro de conexão desconhecido.";

      //Define a mensagem padrão, amigável para o usuário.
      let userFacingMessage =
        "Falha na operação. Por favor, verifique os dados e tente novamente.";

      //LOGA a mensagem técnica SEMPRE (para o console)
      console.error("Erro Técnico do Backend:", detailedMessage);

      //Lógica de Filtragem: Verifica se o erro é específico e já TRATADO:

      // Erro de Negócio (Mensagem tratada que PODE ser mostrada)
      if (
        detailedMessage.includes("E-mail já verificado") ||
        detailedMessage.includes("e-mail já existe")
      ) {
        // Se o backend enviar uma mensagem clara para o usuário, use-a.
        userFacingMessage = detailedMessage;
      }

      //Retorna o resultado para o Toast usar APENAS a mensagem amigável/tratada.
      return { success: false, message: userFacingMessage };
    } finally {
      setLoading(false);
    }
  };

  //Função de login
  const login = async (data: ApiLoginRequest) => {
    setLoading(true);

    try {
      const response = await authLoginService(data);
      const tokenData = response;

      if (
        !tokenData ||
        !("accessToken" in tokenData) ||
        !("refreshToken" in tokenData)
      ) {
        console.error(
          "Login falhou ou tokens não foram retornados.",
          tokenData
        );
        throw new Error("Falha na autenticação. Por favor, tente novamente.");
      }

      const { accessToken, refreshToken } = tokenData;

      setAccessToken(accessToken);
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

      setIsAuthenticated(true);

      successMessage = "Login realizado com sucesso!";
      return { success: true, message: successMessage };
    } catch (error) {
      errorMessage =
        (error as any).response?.data?.message ||
        (error as Error).message ||
        "Credenciais inválidas ou falha de conexão.";

      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  //Função de logout
  const logout = async () => {
    setAccessToken(null);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

    setIsAuthenticated(false);
    //Redireciona para tela de login após logout
    navigate("/login");
  };

  console.log("AuthContext - isAuthenticated:", isAuthenticated);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!accessToken,
        accessToken,
        loading,
        inputRegister,
        login,
        insertRegister,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
