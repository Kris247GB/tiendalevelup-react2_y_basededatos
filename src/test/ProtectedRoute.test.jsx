import React from 'react';
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import '@testing-library/jest-dom';

// --- MOCKS DE SEGURIDAD ---
jest.mock('../api/api', () => ({ default: {} }), { virtual: true });
jest.mock('../services/AuthService', () => ({
  getPerfil: jest.fn(),
  logout: jest.fn()
}), { virtual: true }); 

// Ajusta la ruta de ProtectedRoute si es necesario (ej: ../components/page/ProtectedRoute)
import ProtectedRoute from "../components/ProtectedRoute"; 
import { AuthContext } from "../context/AuthContext";

describe("ProtectedRoute", () => {
  test("redirige a /login si no está autenticado", () => {
    render(
      <MemoryRouter initialEntries={["/perfil"]}>
        <AuthContext.Provider value={{ isAuthenticated: false, loadingUser: false, user: null }}>
          <Routes>
            <Route path="/login" element={<h1>Página Login</h1>} />
            <Route path="/perfil" element={
              <ProtectedRoute>
                <h1>Zona privada</h1>
              </ProtectedRoute>
            } />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Si redirige, NO debe mostrar el contenido privado
    expect(screen.queryByText(/zona privada/i)).not.toBeInTheDocument();
  });

  test("muestra contenido si está autenticado", () => {
    render(
      <MemoryRouter initialEntries={["/perfil"]}>
        <AuthContext.Provider value={{ isAuthenticated: true, loadingUser: false, user: { name: 'Test' } }}>
          <ProtectedRoute>
            <h1>Zona privada</h1>
          </ProtectedRoute>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/zona privada/i)).toBeInTheDocument();
  });

  test("muestra cargando cuando loadingUser está activo", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ loadingUser: true, isAuthenticated: false, user: null }}>
          <ProtectedRoute>
            <h1>Privado</h1>
          </ProtectedRoute>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });
});