import React from "react";
// Datos de productos
import { getAllProducts, formatPriceCLP } from '../../data/store';
export const products = getAllProducts();

// Categorías disponibles
export const categories = [
  { value: 'todas', label: 'Todas las categorías' },
  { value: 'juegos-mesa', label: 'Juegos de Mesa' },
  { value: 'accesorios', label: 'Accesorios' },
  { value: 'consolas', label: 'Consolas' },
  { value: 'computadores', label: 'Computadores Gamers' },
  { value: 'sillas', label: 'Sillas Gamers' },
  { value: 'mouse', label: 'Mouse' },
  { value: 'mousepad', label: 'Mousepad' },
  { value: 'poleras', label: 'Poleras Personalizadas' },
  { value: 'polerones', label: 'Polerones Gamers' }
];

// Rangos de precio
export const priceRanges = [
  { value: 'todos', label: 'Todos los precios' },
  { value: 'bajo', label: 'Menos de $50.000' },
  { value: 'medio', label: '$50.000 - $200.000' },
  { value: 'alto', label: 'Más de $200.000' }
];

// Función para formatear precios
export const formatPrice = (price) => formatPriceCLP(price);

// Función para filtrar productos
export const filterProducts = (products, filters) => {
  const { searchTerm, category, priceRange } = filters;
  
  return products.filter(product => {
    // Filtro por búsqueda
    const matchesSearch = !searchTerm || 
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por categoría
    const matchesCategory = category === 'todas' || product.categoria === category;
    
    // Filtro por precio
    let matchesPrice = true;
    if (priceRange === 'bajo') matchesPrice = product.precio < 50000;
    if (priceRange === 'medio') matchesPrice = product.precio >= 50000 && product.precio <= 200000;
    if (priceRange === 'alto') matchesPrice = product.precio > 200000;
    
    return matchesSearch && matchesCategory && matchesPrice;
  });
};