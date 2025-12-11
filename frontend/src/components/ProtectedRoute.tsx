// src/components/ProtectedRoute.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute: React.FC = () => {
  // Obtém o estado de autenticação (isAuthenticated)
  const { isAuthenticated, loading } = useAuth(); 
  
  // Mostra uma tela de carregamento enquanto verifica o token inicial
  if (loading) {
    // Pode ser substituido por um spinner ou tela de carregamento completa
    return <div>Carregando autenticação...</div>; 
  }

  // Se o usuário ESTIVER autenticado, renderiza a rota filha
  if (isAuthenticated) {
    // <Outlet /> renderiza o componente da rota aninhada (e.g., DashboardPage)
    return <Outlet />;
  }

  // Se NÃO estiver autenticado, redireciona para a página de login
  // `replace` garante que o histórico do navegador seja limpo
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;