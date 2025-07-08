import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import axios from 'axios'

// Types
export interface UserProfile {
  user_id: string
  browsing_history: string[]
  purchase_history: string[]
  preferences: Record<string, any>
}

export interface ClearanceItem {
  id: string
  name: string
  original_price: number
  current_price: number
  category: string
  stock_count: number
  days_until_removal: number
  urgency_score: number
  image_url?: string
  description?: string
}

export interface PopupData {
  show_popup: boolean
  items?: ClearanceItem[]
  discount_percentages?: number[]
  urgency_messages?: string[]
  sustainability_messages?: string[]
  timer_seconds: number
}

interface PopupContextType {
  popupData: PopupData | null
  userProfile: UserProfile
  isPopupVisible: boolean
  popupsDisabled: boolean
  showPopup: (category?: string) => void
  hidePopup: () => void
  disablePopups: () => void
  enablePopups: () => void
  updateUserProfile: (updates: Partial<UserProfile>) => void
  trackInteraction: (action: string, data?: any) => void
}

const PopupContext = createContext<PopupContextType | undefined>(undefined)

// Default user profile
const defaultUserProfile: UserProfile = {
  user_id: 'user_' + Math.random().toString(36).substr(2, 9),
  browsing_history: ['electronics', 'clothing'],
  purchase_history: ['home'],
  preferences: {}
}

const API_BASE = 'http://localhost:8000'

export function PopupProvider({ children }: { children: ReactNode }) {
  const [popupData, setPopupData] = useState<PopupData | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile)
  const [isPopupVisible, setIsPopupVisible] = useState(false)
  const [popupsDisabled, setPopupsDisabled] = useState(false)
  const [shownPopupsThisSession, setShownPopupsThisSession] = useState<Set<string>>(new Set())

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }))
  }

  const disablePopups = () => {
    setPopupsDisabled(true)
    setIsPopupVisible(false)
    // Track this interaction
    trackInteraction('popups_disabled', { user_id: userProfile.user_id })
  }

  const enablePopups = () => {
    setPopupsDisabled(false)
    // Track this interaction
    trackInteraction('popups_enabled', { user_id: userProfile.user_id })
  }

  const trackInteraction = async (action: string, data?: any) => {
    try {
      await axios.post(`${API_BASE}/api/track-interaction`, {
        user_id: userProfile.user_id,
        action,
        timestamp: new Date().toISOString(),
        data
      })
    } catch (error) {
      console.error('Failed to track interaction:', error)
    }
  }

  const fetchPopupRecommendation = async (currentPage: string = 'home', targetCategory?: string) => {
    try {
      // Don't show popups if disabled
      if (popupsDisabled) {
        console.log('Popups are disabled by user')
        return
      }

      console.log('Fetching popup recommendation for user:', userProfile)
      console.log('Target category:', targetCategory)
      const response = await axios.post(`${API_BASE}/api/popup`, {
        user_profile: userProfile,
        current_page: currentPage,
        target_category: targetCategory,
        session_data: { shown_popups: Array.from(shownPopupsThisSession) }
      })
      const popupResponse: PopupData = response.data
      console.log('Popup response received:', popupResponse)
      
      if (popupResponse.show_popup && popupResponse.items && popupResponse.items.length > 0) {
        // Check if we've already shown this specific item in this session
        const itemId = popupResponse.items[0].id
        if (shownPopupsThisSession.has(itemId)) {
          console.log('Already shown this popup in this session:', itemId)
          return
        }
        
        // Add to shown popups set
        setShownPopupsThisSession(prev => new Set([...prev, itemId]))
        
        setPopupData(popupResponse)
        setIsPopupVisible(true)
        console.log('Popup should be visible now')
        
        // Track all shown items
        popupResponse.items.forEach((item) => trackInteraction('popup_shown', { item_id: item.id }))
      } else {
        console.log('Backend decided not to show popup')
      }
    } catch (error) {
      console.error('Failed to fetch popup recommendation:', error)
    }
  }

  const showPopup = (category?: string) => {
    if (!popupsDisabled) {
      fetchPopupRecommendation('home', category)
    }
  }

  const hidePopup = () => {
    setIsPopupVisible(false)
    if (popupData?.items && popupData.items.length > 0) {
      popupData.items.forEach((item) => trackInteraction('popup_closed', { item_id: item.id }))
    }
  }

  // Auto-trigger popup based on user behavior
  useEffect(() => {
    if (popupsDisabled) return

    const intervals: NodeJS.Timeout[] = [];
    
    // Random popup trigger (simulating user browsing)
    const randomTrigger = setInterval(() => {
      if (!isPopupVisible && !popupsDisabled && Math.random() < 0.6) { // 60% chance every 15 seconds
        console.log('Auto-triggering popup...')
        showPopup()
      }
    }, 15000) // Every 15 seconds (reduced frequency)
    
    intervals.push(randomTrigger)

    return () => {
      intervals.forEach(interval => clearInterval(interval))
    }
  }, [isPopupVisible, userProfile, popupsDisabled])

  const contextValue: PopupContextType = {
    popupData,
    userProfile,
    isPopupVisible,
    popupsDisabled,
    showPopup,
    hidePopup,
    disablePopups,
    enablePopups,
    updateUserProfile,
    trackInteraction
  }

  return (
    <PopupContext.Provider value={contextValue}>
      {children}
    </PopupContext.Provider>
  )
}

export function usePopup() {
  const context = useContext(PopupContext)
  if (context === undefined) {
    throw new Error('usePopup must be used within a PopupProvider')
  }
  return context
}
