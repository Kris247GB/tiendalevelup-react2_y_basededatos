import React from 'react';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// --- Mock completo de useNavigate ---
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// --- Mocks de API ---
jest.mock('../api/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(() => Promise.resolve({ data: { token: 'fake-jwt-token' } })),
    get: jest.fn(() => Promise.resolve({ data: { nombre: 'Gamer', rol: 'USER', email: 'user@test.com' } }))
  }
}));

// --- Mock servicio AuthService ---
jest.mock('../services/AuthService', () => ({
  login: jest.fn(() => Promise.resolve({ token: 'fake-jwt-token' })),
  getPerfil: jest.fn(),
  logout: jest.fn(),
}));

import Login from "../components/page/Login";
import { AuthContext } from "../context/AuthContext";

// Suprimir errores de console en tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn((...args) => {
    if (args[0]?.message?.includes?.('Not implemented') || args[0]?.includes?.('Not implemented')) {
      return;
    }
    originalError.call(console, ...args);
  });
});

afterAll(() => {
  console.error = originalError;
});

describe("Login Component", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  test("llama a AuthService.login con los datos correctos y muestra mensaje de éxito", async () => {
    const { login: mockLoginService } = require('../services/AuthService');

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Rellenar formulario
    fireEvent.change(screen.getByPlaceholderText(/tu@email.com/i), {
      target: { value: "user@test.com" },
    });

    fireEvent.change(screen.getByPlaceholderText(/Tu contraseña/i), {
      target: { value: "123456" },
    });

    // Enviar formulario
    fireEvent.click(screen.getByRole("button", { name: /Iniciar Sesión/i }));

    // Verificar que AuthService.login fue llamado con los datos correctos
    await waitFor(() => {
      expect(mockLoginService).toHaveBeenCalledTimes(1);
      expect(mockLoginService).toHaveBeenCalledWith("user@test.com", "123456");
    });

    // Verificar que se muestra el mensaje de éxito
    await waitFor(() => {
      expect(screen.getByText(/¡Inicio de sesión exitoso! Redirigiendo.../i)).toBeInTheDocument();
    });

    // Verificar que navigate fue llamado
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/perfil', { replace: true });
    }, { timeout: 1000 });
  });
});
