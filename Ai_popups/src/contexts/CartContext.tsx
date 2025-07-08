import { createContext, useContext, useState, type ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  originalPrice: number
  discount: number
  quantity: number
  image_url?: string
  category: string
}

interface CartContextType {
  cartItems: CartItem[]
  cartCount: number
  totalPrice: number
  addToCart: (item: CartItem) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  isCartOpen: boolean
  toggleCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)

  const addToCart = (newItem: CartItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === newItem.id)
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prevItems, { ...newItem, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      toggleCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
