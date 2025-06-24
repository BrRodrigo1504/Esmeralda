import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Contexto do carrinho
const CartContext = createContext();

// Tipos de ações do carrinho
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Reducer do carrinho
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const existingItem = state.items.find(item => 
        item.id === action.payload.id && 
        item.customization === action.payload.customization
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id && item.customization === action.payload.customization
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };
    }

    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => 
          !(item.id === action.payload.id && item.customization === action.payload.customization)
        )
      };

    case CART_ACTIONS.UPDATE_QUANTITY:
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => 
            !(item.id === action.payload.id && item.customization === action.payload.customization)
          )
        };
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id && item.customization === action.payload.customization
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: []
      };

    case CART_ACTIONS.LOAD_CART:
      return {
        ...state,
        items: action.payload
      };

    default:
      return state;
  }
};

// Estado inicial do carrinho
const initialState = {
  items: [],
  isOpen: false
};

// Provider do carrinho
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Carregar carrinho do localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('esmeralda-cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cartData });
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
      }
    }
  }, []);

  // Salvar carrinho no localStorage
  useEffect(() => {
    localStorage.setItem('esmeralda-cart', JSON.stringify(state.items));
  }, [state.items]);

  // Funções do carrinho
  const addToCart = (product, customization = '') => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { ...product, customization }
    });
  };

  const removeFromCart = (productId, customization = '') => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { id: productId, customization }
    });
  };

  const updateQuantity = (productId, quantity, customization = '') => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { id: productId, quantity, customization }
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  // Calcular totais
  const getCartTotal = () => {
    return state.items.reduce((total, item) => {
      const price = parseFloat(item.price.replace('A partir de €', '').replace(',', '.'));
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Hook para usar o carrinho
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};

export default CartContext;

