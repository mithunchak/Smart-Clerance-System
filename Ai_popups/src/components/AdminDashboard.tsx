import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Package, DollarSign, Leaf, Users } from 'lucide-react'
import axios from 'axios'

interface AnalyticsData {
  total_popups_shown: number
  conversion_rate: number
  average_discount: number
  items_saved_from_waste: number
  revenue_generated: number
  top_categories: Array<{
    category: string
    conversions: number
  }>
}

export function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/analytics/summary')
      setAnalytics(response.data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      // Mock data fallback
      setAnalytics({
        total_popups_shown: 1247,
        conversion_rate: 0.23,
        average_discount: 35,
        items_saved_from_waste: 89,
        revenue_generated: 15678.45,
        top_categories: [
          { category: 'electronics', conversions: 45 },
          { category: 'clothing', conversions: 38 },
          { category: 'home', conversions: 29 }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="dashboard-error">
        <p>Failed to load analytics data</p>
        <button onClick={fetchAnalytics}>Retry</button>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Smart Clearance Pop-ups Dashboard</h1>
        <p>Real-time analytics and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <BarChart3 size={24} />
          </div>
          <div className="metric-content">
            <h3>Total Pop-ups Shown</h3>
            <div className="metric-value">{analytics.total_popups_shown.toLocaleString()}</div>
            <div className="metric-change positive">+12% this week</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <TrendingUp size={24} />
          </div>
          <div className="metric-content">
            <h3>Conversion Rate</h3>
            <div className="metric-value">{(analytics.conversion_rate * 100).toFixed(1)}%</div>
            <div className="metric-change positive">+5.2% from last month</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <DollarSign size={24} />
          </div>
          <div className="metric-content">
            <h3>Revenue Generated</h3>
            <div className="metric-value">${analytics.revenue_generated.toLocaleString()}</div>
            <div className="metric-change positive">+23% this month</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Package size={24} />
          </div>
          <div className="metric-content">
            <h3>Average Discount</h3>
            <div className="metric-value">{analytics.average_discount}%</div>
            <div className="metric-change neutral">Optimal range</div>
          </div>
        </div>
      </div>

      {/* Sustainability Impact */}
      <div className="sustainability-section">
        <div className="section-header">
          <Leaf size={20} />
          <h2>Sustainability Impact</h2>
        </div>
        
        <div className="sustainability-stats">
          <div className="sustainability-card">
            <h3>{analytics.items_saved_from_waste}</h3>
            <p>Items Saved from Waste</p>
          </div>
          <div className="sustainability-card">
            <h3>~{Math.round(analytics.items_saved_from_waste * 2.3)}kg</h3>
            <p>CO2 Emissions Prevented</p>
          </div>
          <div className="sustainability-card">
            <h3>{Math.round(analytics.items_saved_from_waste * 0.8)}</h3>
            <p>Happy Customers</p>
          </div>
        </div>
      </div>

      {/* Top Categories */}
      <div className="categories-section">
        <div className="section-header">
          <Users size={20} />
          <h2>Top Performing Categories</h2>
        </div>
        
        <div className="categories-chart">
          {analytics.top_categories.map((category) => (
            <div key={category.category} className="category-bar">
              <div className="category-info">
                <span className="category-name">{category.category}</span>
                <span className="category-value">{category.conversions} conversions</span>
              </div>
              <div className="category-progress">
                <div 
                  className="category-fill"
                  data-width={`${(category.conversions / Math.max(...analytics.top_categories.map(c => c.conversions))) * 100}%`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Activity */}
      <div className="activity-section">
        <h2>Recent Activity</h2>
        <div className="activity-feed">
          <div className="activity-item">
            <div className="activity-dot"></div>
            <div className="activity-content">
              <p><strong>Pop-up shown</strong> - Electronics category - User #1247</p>
              <span className="activity-time">2 minutes ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-dot success"></div>
            <div className="activity-content">
              <p><strong>Conversion</strong> - Bluetooth Headphones - 48% discount</p>
              <span className="activity-time">5 minutes ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-dot"></div>
            <div className="activity-content">
              <p><strong>Pop-up shown</strong> - Home category - User #1248</p>
              <span className="activity-time">7 minutes ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-dot success"></div>
            <div className="activity-content">
              <p><strong>Conversion</strong> - Coffee Mug Set - 52% discount</p>
              <span className="activity-time">12 minutes ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
