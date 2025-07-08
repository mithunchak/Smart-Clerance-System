import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, Package, Leaf, Settings } from 'lucide-react'
import { usePopup } from '../contexts/PopupContext'
import { useCart } from '../contexts/CartContext'

export function ClearancePopup() {
  const { popupData, isPopupVisible, hidePopup, disablePopups, trackInteraction } = usePopup()
  const { addToCart } = useCart()
  const [timeLeft, setTimeLeft] = useState(0)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    if (isPopupVisible && popupData?.timer_seconds) {
      setTimeLeft(popupData.timer_seconds)
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            hidePopup()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isPopupVisible, popupData?.timer_seconds, hidePopup])

  const handleClose = () => {
    hidePopup()
  }

  const handleDisablePopups = () => {
    disablePopups()
    hidePopup()
  }

  const handleAddToCart = (item: any, discount: number) => {
    // Add to cart
    addToCart({
      id: item.id,
      name: item.name,
      price: item.current_price,
      originalPrice: item.original_price,
      discount: discount,
      quantity: 1,
      image_url: item.image_url,
      category: item.category
    })
    
    trackInteraction('add_to_cart', { 
      item_id: item.id,
      discount_used: discount 
    })
    
    // Show success message
    alert(`Added ${item.name} to cart with ${discount}% discount!`)
    hidePopup()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!popupData?.show_popup || !popupData.items || popupData.items.length === 0) {
    console.log('Popup not showing because:', { 
      show_popup: popupData?.show_popup, 
      items: popupData?.items, 
      itemsLength: popupData?.items?.length 
    })
    return null
  }

  console.log('Rendering popup with data:', popupData)

  return (
    <AnimatePresence>
      {isPopupVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="popup-backdrop"
          onClick={handleClose}
        >
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="clearance-popup"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="popup-header">
              <div className="popup-header-content">
                <h3 className="popup-title">🔥 Limited Time Clearance!</h3>
                <button 
                  onClick={handleClose}
                  className="popup-close"
                  aria-label="Close popup"
                >
                  <X size={20} />
                </button>
              </div>
              {/* Timer */}
              <div className="popup-timer">
                <Clock size={16} />
                <span>Offer expires in {formatTime(timeLeft)}</span>
              </div>
            </div>
            {/* Content: Show single item */}
            <div className="popup-content">
              <div className="popup-multi-items">
                {popupData.items.map((item, idx) => (
                  <div className="popup-layout" key={item.id}>
                    {/* Product Image */}
                    <div className="popup-image">
                      <img 
                        src={item.image_url || '/placeholder.jpg'} 
                        alt={item.name}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/placeholder.jpg'
                        }}
                      />
                      <div className="discount-badge">
                        {popupData.discount_percentages ? popupData.discount_percentages[idx] : 0}% OFF
                      </div>
                    </div>
                    {/* Product Details */}
                    <div className="popup-details">
                      <h4 className="product-name">{item.name}</h4>
                      <p className="product-description">{item.description}</p>
                      {/* Price */}
                      <div className="price-section">
                        <span className="original-price">${item.original_price.toFixed(2)}</span>
                        <span className="current-price">${item.current_price.toFixed(2)}</span>
                      </div>
                      {/* Urgency Message */}
                      <div className="urgency-message">
                        <Package size={20} />
                        <span>{popupData.urgency_messages ? popupData.urgency_messages[idx] : ''}</span>
                      </div>
                      {/* Sustainability Message */}
                      <div className="sustainability-message">
                        <Leaf size={20} />
                        <span>{popupData.sustainability_messages ? popupData.sustainability_messages[idx] : ''}</span>
                      </div>
                      {/* Actions */}
                      <div className="popup-actions">
                        <button 
                          onClick={() => handleAddToCart(item, popupData.discount_percentages ? popupData.discount_percentages[idx] : 0)}
                          className="add-to-cart-btn"
                        >
                          Add to Cart - Save {popupData.discount_percentages ? popupData.discount_percentages[idx] : 0}%
                        </button>
                        <button 
                          onClick={handleClose}
                          className="maybe-later-btn"
                        >
                          Maybe Later
                        </button>
                      </div>
                      {/* Settings toggle */}
                      <div className="popup-settings">
                        <button 
                          onClick={() => setShowSettings(!showSettings)}
                          className="settings-toggle"
                          title="Popup Settings"
                        >
                          <Settings size={16} />
                        </button>
                        {showSettings && (
                          <div className="settings-dropdown">
                            <button 
                              onClick={handleDisablePopups}
                              className="disable-popups-btn"
                            >
                              Don't show popups again
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
