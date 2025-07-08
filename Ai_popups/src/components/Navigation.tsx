import { Store, BarChart3 } from 'lucide-react'

interface NavigationProps {
  currentPage: 'store' | 'dashboard'
  onPageChange: (page: 'store' | 'dashboard') => void
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h2>Smart Clearance System</h2>
      </div>
      
      <div className="nav-links">
        <button
          className={`nav-link ${currentPage === 'store' ? 'active' : ''}`}
          onClick={() => onPageChange('store')}
        >
          <Store size={18} />
          Store Demo
        </button>
        
        <button
          className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
          onClick={() => onPageChange('dashboard')}
        >
          <BarChart3 size={18} />
          Analytics Dashboard
        </button>
      </div>
    </nav>
  )
}
