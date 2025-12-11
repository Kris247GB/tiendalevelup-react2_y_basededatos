import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Home from '../components/page/Home'; // Verifica que la ruta sea correcta

// --- MOCKS ---

// 1. Mock de los Átomos (Carrito y Mensajes)
jest.mock('../components/Atoms/Validaciones', () => ({
  carrito: jest.fn(),
  mostrarMensaje: jest.fn()
}));

// 2. MOCK MAESTRO DE LA API (CORREGIDO)
const mockProductosData = [
  { id: 1, nombre: 'Laptop Gamer', precio: 1000, imagen: 'laptop.jpg', categoria: 'Tecnología' },
  { id: 2, nombre: 'Mouse Óptico', precio: 50, imagen: 'mouse.jpg', categoria: 'Accesorios' }
];

const mockCategoriasData = ['Tecnología', 'Accesorios', 'Ropa']; // Lista simple de textos

jest.mock('../api/api', () => ({
  __esModule: true,
  default: {
    // Aquí está la magia: miramos la URL para saber qué devolver
    get: jest.fn((url) => {
      if (url && url.includes('categoria')) {
        // Si la URL pide categorías, devolvemos textos simples
        return Promise.resolve({ data: mockCategoriasData });
      }
      // Por defecto devolvemos productos
      return Promise.resolve({ data: mockProductosData });
    }),
    post: jest.fn(() => Promise.resolve({ data: {} })),
  }
}), { virtual: true });


// Helper para Router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Home Component - Pruebas Unitarias', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.getItem = jest.fn(() => null);
  });

  // 1. Renderizado
  test('debe renderizar el componente Home y sus secciones', async () => {
    const { container } = renderWithRouter(<Home />);
    expect(container).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/Bienvenido/i)).toBeInTheDocument());
  });

  // 2. Input de búsqueda
  test('debe permitir escribir en el buscador', async () => {
    renderWithRouter(<Home />);
    // Esperamos a que cargue algo para asegurar que la app está lista
    await waitFor(() => screen.getByText('Laptop Gamer')); 
    
    const searchInput = screen.getByPlaceholderText(/buscar/i);
    fireEvent.change(searchInput, { target: { value: 'test' } });
    expect(searchInput.value).toBe('test');
  });

  // 3. Carga de Productos
  test('debe mostrar los productos traídos desde la API', async () => {
    renderWithRouter(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('Laptop Gamer')).toBeInTheDocument();
      expect(screen.getByText('Mouse Óptico')).toBeInTheDocument();
    });
  });

  // 4. Filtrado
  test('debe filtrar productos visualmente', async () => {
    renderWithRouter(<Home />);
    
    // 1. Esperar a que carguen los productos
    await waitFor(() => expect(screen.getByText('Laptop Gamer')).toBeInTheDocument());

    // 2. Buscar "Mouse"
    const searchInput = screen.getByPlaceholderText(/buscar/i);
    fireEvent.change(searchInput, { target: { value: 'Mouse' } });
    
    // 3. Verificar filtro
    await waitFor(() => {
      expect(screen.getByText('Mouse Óptico')).toBeInTheDocument();
      expect(screen.queryByText('Laptop Gamer')).not.toBeInTheDocument();
    });
  });
});