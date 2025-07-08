import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react'
import { useCart } from '../contexts/CartContext'

export function Cart() {
  const { 
    cartItems, 
    cartCount, 
    totalPrice, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    isCartOpen,
    toggleCart 
  } = useCart()

  const formatPrice = (price: number) => `$${price.toFixed(2)}`

  return (
    <>
      {/* Cart Toggle Button */}
      <button 
        onClick={toggleCart}
        className="cart-toggle-btn"
        aria-label="Toggle cart"
      >
        <ShoppingCart size={20} />
        {cartCount > 0 && (
          <span className="cart-badge">{cartCount}</span>
        )}
      </button>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="cart-backdrop"
              onClick={toggleCart}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="cart-sidebar"
            >
              <div className="cart-header">
                <h3>Shopping Cart ({cartCount})</h3>
                <button onClick={toggleCart} className="cart-close-btn" aria-label="Close cart">
                  <X size={20} />
                </button>
              </div>

              <div className="cart-content">
                {cartItems.length === 0 ? (
                  <div className="empty-cart">
                    <ShoppingCart size={48} />
                    <p>Your cart is empty</p>
                    <p className="empty-cart-subtitle">Add some items to get started!</p>
                  </div>
                ) : (
                  <>
                    <div className="cart-items">
                      {cartItems.map(item => (
                        <div key={item.id} className="cart-item">
                          <div className="cart-item-image">
                            <img 
                              src={item.image_url || '/placeholder.jpg'} 
                              alt={item.name}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = '/placeholder.jpg'
                              }}
                            />
                          </div>
                          
                          <div className="cart-item-details">
                            <h4 className="cart-item-name">{item.name}</h4>
                            <p className="cart-item-category">{item.category}</p>
                            
                            <div className="cart-item-price">
                              {item.discount > 0 && (
                                <span className="cart-original-price">
                                  {formatPrice(item.originalPrice)}
                                </span>
                              )}
                              <span className="cart-current-price">
                                {formatPrice(item.price)}
                              </span>
                              {item.discount > 0 && (
                                <span className="cart-discount">
                                  {item.discount}% OFF
                                </span>
                              )}
                            </div>
                            
                            <div className="cart-item-controls">
                              <div className="quantity-controls">
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="quantity-btn"
                                  disabled={item.quantity <= 1}
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="quantity-display">{item.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="quantity-btn"
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                              
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className="remove-btn"
                                aria-label="Remove item"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="cart-footer">
                      <div className="cart-total">
                        <div className="total-row">
                          <span>Total: {formatPrice(totalPrice)}</span>
                        </div>
                        <div className="savings-row">
                          <span>
                            You saved: {formatPrice(
                              cartItems.reduce((total, item) => 
                                total + ((item.originalPrice - item.price) * item.quantity), 0
                              )
                            )}
                          </span>
                        </div>
                      </div>
                      
                      <div className="cart-actions">
                        <button 
                          onClick={clearCart}
                          className="clear-cart-btn"
                        >
                          Clear Cart
                        </button>
                        <button 
                          onClick={() => alert('Checkout functionality coming soon!')}
                          className="checkout-btn"
                        >
                          Checkout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
