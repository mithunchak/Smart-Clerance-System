import { useState } from 'react'
import { PopupProvider } from './contexts/PopupContext'
import { CartProvider } from './contexts/CartContext'
import { ClearancePopup } from './components/ClearancePopup'
import { MockStore } from './components/MockStore'
import { AdminDashboard } from './components/AdminDashboard'
import { Navigation } from './components/Navigation'
import { Cart } from './components/Cart'
import './App.css'

type Page = 'store' | 'dashboard'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('store')

  return (
    <CartProvider>
      <PopupProvider>
        <div className="app">
          <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
          
          <main className="main-content">
            {currentPage === 'store' ? (
              <MockStore />
            ) : (
              <AdminDashboard />
            )}
          </main>
          
          <ClearancePopup />
          <Cart />
        </div>
      </PopupProvider>
    </CartProvider>
  )
}

export default App
