"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import { CartItem, Product } from "@/types";

// ─────────────────────────────────────────────────────────────
// STATE SHAPE
// ─────────────────────────────────────────────────────────────
interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

// ─────────────────────────────────────────────────────────────
// ACTIONS
// ─────────────────────────────────────────────────────────────
type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: string }          // product id
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "TOGGLE_CART" };

// ─────────────────────────────────────────────────────────────
// REDUCER
// ─────────────────────────────────────────────────────────────
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.product.id === action.payload.id
      );
      if (existing) {
        return {
          ...state,
          isOpen: true,
          items: state.items.map((i) =>
            i.product.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return {
        ...state,
        isOpen: true,
        items: [...state.items, { product: action.payload, quantity: 1 }],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.product.id !== action.payload),
      };

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (i) => i.product.id !== action.payload.id
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.payload.id
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    }

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "OPEN_CART":
      return { ...state, isOpen: true };

    case "CLOSE_CART":
      return { ...state, isOpen: false };

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };

    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────
interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  subtotal: number;
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// ─────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  });

  const addItem = useCallback(
    (product: Product) => dispatch({ type: "ADD_ITEM", payload: product }),
    []
  );
  const removeItem = useCallback(
    (id: string) => dispatch({ type: "REMOVE_ITEM", payload: id }),
    []
  );
  const updateQuantity = useCallback(
    (id: string, quantity: number) =>
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } }),
    []
  );
  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);
  const openCart = useCallback(() => dispatch({ type: "OPEN_CART" }), []);
  const closeCart = useCallback(() => dispatch({ type: "CLOSE_CART" }), []);
  const toggleCart = useCallback(() => dispatch({ type: "TOGGLE_CART" }), []);

  const totalItems = useMemo(
    () => state.items.reduce((acc, i) => acc + i.quantity, 0),
    [state.items]
  );

  const subtotal = useMemo(
    () =>
      state.items.reduce(
        (acc, i) =>
          acc + (i.product.discountPrice ?? i.product.price) * i.quantity,
        0
      ),
    [state.items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      isOpen: state.isOpen,
      totalItems,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
    }),
    [
      state.items,
      state.isOpen,
      totalItems,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ─────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
