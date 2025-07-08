# Smart Clearance Pop-ups System

An AI-powered clearance management system for retail environments that shows personalized pop-ups with dynamic discounts based on inventory urgency and user behavior.

## 🎯 Features

- **Category-based Browsing**: Browse products by categories (Electronics, Clothing, Home & Garden, Fitness, Office)
- **Smart Clearance Popups**: AI-powered popups that show only true clearance items (high urgency or 40%+ discount)
- **Dynamic Discounts**: Personalized discounts based on user behavior and inventory urgency
- **Cart Integration**: Add items to cart directly from popups or product pages
- **User Control**: Disable/enable popup functionality
- **Session Management**: Prevents showing the same popup repeatedly
- **Responsive Design**: Mobile-friendly interface styled like major retail sites

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 19 with TypeScript and Vite
- **Styling**: Custom CSS with modern design principles
- **State Management**: React Context API
- **HTTP Client**: Axios for API communication
- **UI Components**: Lucide React icons, Framer Motion animations

### Backend (FastAPI + Python)
- **Framework**: FastAPI with automatic OpenAPI documentation
- **Data Models**: Pydantic for type validation
- **Business Logic**: Rule-based scoring system for clearance recommendations
- **CORS**: Configured for local development

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Python 3.8+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-popups
   ```

2. **Setup Frontend**
   ```bash
   # Install dependencies
   npm install
   
   # Start development server
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173`

3. **Setup Backend**
   ```bash
   # Navigate to backend directory
   cd backend
   
   # Create virtual environment (recommended)
   python -m venv venv
   
   # Activate virtual environment
   # On Windows:
   venv\\Scripts\\activate
   # On macOS/Linux:
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Start the server
   python main.py
   ```
   Backend will be available at `http://localhost:8000`

## 📁 Project Structure

```
ai-popups/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── README.md           # Backend documentation
├── src/
│   ├── components/
│   │   ├── ClearancePopup.tsx    # Popup component
│   │   ├── MockStore.tsx         # Store interface
│   │   └── AdminDashboard.tsx    # Analytics dashboard
│   ├── contexts/
│   │   ├── PopupContext.tsx      # Popup state management
│   │   └── CartContext.tsx       # Cart state management
│   ├── App.tsx             # Main application component
│   ├── App.css            # Global styles
│   └── main.tsx           # Application entry point
├── package.json            # Frontend dependencies
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## 🔧 Configuration

### Backend Configuration
- **CORS Origins**: Configure allowed origins in `backend/main.py`
- **Port**: Backend runs on port 8000 by default
- **Mock Data**: Clearance items are defined in `CLEARANCE_ITEMS` array

### Frontend Configuration
- **API Base URL**: Set in `src/contexts/PopupContext.tsx`
- **Development Port**: 5173 (configured in Vite)

## 🎮 Usage

1. **Browse Categories**: Click on category cards to view products
2. **Trigger Popups**: Popups automatically appear when browsing categories
3. **Manual Popup**: Use "Trigger Smart Popup" button
4. **Add to Cart**: Click "Add to Cart" on products or popups
5. **Disable Popups**: Use "Don't show popups again" for better UX

## 🧠 Business Logic

### Clearance Item Selection
- **High Urgency**: Items with urgency score ≥ 0.7
- **Significant Discount**: Items with ≥ 40% discount
- **Category Filtering**: Only shows items from current category
- **Session Tracking**: Prevents repetitive popups

### Dynamic Pricing
- **Base Discount**: Original item discount
- **Urgency Bonus**: Up to 15% additional discount
- **User Behavior Bonus**: Based on browsing/purchase history

## 🔍 API Endpoints

### Backend API (`http://localhost:8000`)
- `GET /` - Health check
- `POST /api/popup` - Get popup recommendations
- `GET /api/clearance-items` - Get all clearance items
- `GET /api/clearance-items/{id}` - Get specific item
- `POST /api/track-interaction` - Track user interactions
- `GET /api/analytics/summary` - Get analytics data

### API Documentation
Visit `http://localhost:8000/docs` for interactive API documentation.

## 🛠️ Development

### Frontend Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Backend Development
```bash
# Start with auto-reload
uvicorn main:app --reload --port 8000

# Run with specific host
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 📊 Key Metrics

- **Popup Visibility**: 20-50% increase expected
- **Conversion Rate**: 10%+ lift target
- **Waste Reduction**: Focus on sustainability messaging
- **User Experience**: Non-intrusive popup management

## 🔒 Security Notes

- CORS is configured for local development
- No authentication implemented (demo purposes)
- Session data stored in memory (not persistent)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational and demonstration purposes.

## 🐛 Troubleshooting

### Common Issues

1. **Frontend not connecting to backend**
   - Ensure backend is running on port 8000
   - Check CORS configuration in `backend/main.py`

2. **Popups not appearing**
   - Check browser console for errors
   - Verify popup is not disabled in UI
   - Check backend logs for filtering results

3. **Dependencies issues**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - For Python: recreate virtual environment

### Debug Mode
- Backend logs are printed to console
- Frontend debug info available in browser console
- Use browser dev tools to inspect network requests

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation at `/docs`
3. Examine browser console and backend logs
4. Check network requests in browser dev tools
