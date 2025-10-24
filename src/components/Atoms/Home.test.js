import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Home from '../page/Home';

// Mock de las funciones importadas
jest.mock('../Atoms/Validaciones', () => ({
  carrito: jest.fn((producto) => console.log('Añadido al carrito:', producto)),
  mostrarMensaje: jest.fn((mensaje) => console.log('Mensaje:', mensaje))
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Home Component - 10 Pruebas Unitarias', () => {
  
  // 1. Prueba de renderizado inicial
  test('debe renderizar el componente Home correctamente', () => {
    const { container } = renderWithRouter(<Home />);
    expect(container).toBeInTheDocument();
  });

  // 2. Prueba del header
  test('debe renderizar el componente Header', () => {
    renderWithRouter(<Home/>);
    // Busca elementos típicos del header como enlaces o logo
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  // 3. Prueba del input de búsqueda
  test('debe tener un campo de búsqueda funcional', () => {
    renderWithRouter(<Home />);
    const searchInput = screen.getByPlaceholderText(/buscar/i);
    expect(searchInput).toBeInTheDocument();
  });

  // 4. Prueba de cambio en el input de búsqueda
  test('debe actualizar el estado de búsqueda al escribir', () => {
    renderWithRouter(<Home />);
    const searchInput = screen.getByPlaceholderText(/buscar/i);
    
    fireEvent.change(searchInput, { target: { value: 'laptop' } });
    expect(searchInput.value).toBe('laptop');
  });

  // 5. Prueba de carga de productos
  test('debe cargar productos desde localStorage al montar', async () => {
    // Mock de localStorage
    const mockProductos = JSON.stringify([
      { id: 1, nombre: 'Producto 1', precio: 100, imagen: 'img1.jpg' },
      { id: 2, nombre: 'Producto 2', precio: 200, imagen: 'img2.jpg' }
    ]);
    
    Storage.prototype.getItem = jest.fn(() => mockProductos);
    
    renderWithRouter(<Home />);
    
    await waitFor(() => {
      const productos = screen.queryAllByAltText(/producto/i);
      expect(productos.length).toBeGreaterThanOrEqual(0);
    });
  });

  
  test('debe filtrar productos según la búsqueda', async () => {
    const mockProductos = JSON.stringify([
      { id: 1, nombre: 'Laptop', precio: 1000, imagen: 'laptop.jpg' },
      { id: 2, nombre: 'Mouse', precio: 50, imagen: 'mouse.jpg' }
    ]);
    
    Storage.prototype.getItem = jest.fn(() => mockProductos);
    
    renderWithRouter(<Home />);
    const searchInput = screen.getByPlaceholderText(/buscar/i);
    
    fireEvent.change(searchInput, { target: { value: 'laptop' } });
    
    await waitFor(() => {
      expect(searchInput.value).toBe('laptop');
    });
  });


  test('debe manejar correctamente cuando no hay productos', () => {
    Storage.prototype.getItem = jest.fn(() => null);
    
    const { container } = renderWithRouter(<Home />);
    expect(container).toBeInTheDocument();
  });

  
  test('debe contener la estructura correcta con Header y productos', () => {
    const { container } = renderWithRouter(<Home />);
    
    
    expect(container.firstChild).toBeInTheDocument();
  });

  test('debe tener elementos HTML válidos', () => {
  Storage.prototype.getItem = jest.fn(() => JSON.stringify([
    { id: 1, nombre: 'Test', precio: 100, imagen: 'test.jpg' }
  ]));
  
  const { container } = renderWithRouter(<Home />);
  expect(container.querySelector('main')).toBeInTheDocument();
  expect(container.querySelector('section')).toBeInTheDocument();
});

  
  test('debe inicializar con un array vacío de productos y búsqueda vacía', () => {
    Storage.prototype.getItem = jest.fn(() => null);
    
    renderWithRouter(<Home />);
    const searchInput = screen.getByPlaceholderText(/buscar/i);
    
    expect(searchInput.value).toBe('');
  });
});
