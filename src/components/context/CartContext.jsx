import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const initialState = {
  items: [],
  total: 0,
  itemCount: 0
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.codigo === action.payload.codigo);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.codigo === action.payload.codigo
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          ...state,
          items: updatedItems,
          total: state.total + action.payload.precio,
          itemCount: state.itemCount + 1
        };
      } else {
        const newItem = {
          ...action.payload,
          quantity: 1
        };
        return {
          ...state,
          items: [...state.items, newItem],
          total: state.total + action.payload.precio,
          itemCount: state.itemCount + 1
        };
      }

    case 'REMOVE_FROM_CART':
      const itemToRemove = state.items.find(item => item.codigo === action.payload);
      return {
        ...state,
        items: state.items.filter(item => item.codigo !== action.payload),
        total: state.total - (itemToRemove.precio * itemToRemove.quantity),
        itemCount: state.itemCount - itemToRemove.quantity
      };

    case 'UPDATE_QUANTITY':
      const { codigo, quantity } = action.payload;
      const itemToUpdate = state.items.find(item => item.codigo === codigo);
      
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.codigo !== codigo),
          total: state.total - (itemToUpdate.precio * itemToUpdate.quantity),
          itemCount: state.itemCount - itemToUpdate.quantity
        };
      }
      
      const quantityDiff = quantity - itemToUpdate.quantity;
      const updatedItems = state.items.map(item =>
        item.codigo === codigo ? { ...item, quantity } : item
      );
      
      return {
        ...state,
        items: updatedItems,
        total: state.total + (itemToUpdate.precio * quantityDiff),
        itemCount: state.itemCount + quantityDiff
      };

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (productCodigo) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productCodigo });
  };

  const updateQuantity = (productCodigo, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { codigo: productCodigo, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const value = {
    items: state.items,
    total: state.total,
    itemCount: state.itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};