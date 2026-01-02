# XAdapt - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 20.10.0+ (currently v20.10.0)
- MongoDB running locally or via connection string in `.env`

### Backend Setup

1. **Navigate to backend**
   ```bash
   cd backend
   ```

2. **Create `.env` file** with:
   ```
   MONGODB_URI=mongodb://localhost:27017/xadapt
   JWT_SECRET=your-secret-key-here
   PORT=5000
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start backend server**
   ```bash
   npm test  # Uses nodemon for auto-reload
   ```
   Backend runs on: **http://localhost:5000**

### Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd frontend/xadapt-frontend
   ```

2. **Install dependencies** (already done, but if needed)
   ```bash
   npm install
   ```

3. **Start dev server**
   ```bash
   npm run dev
   ```
   Frontend runs on: **http://localhost:5173**

## 📋 Features Overview

### Login/Register
- Create account with email and password
- Simple form validation
- Try any email/password combo

### Dashboard
- **Simulation Control**: Start/Stop context simulators
- **Real-time Context Cards**: 
  - 🌡️ Temperature (indoor/outdoor)
  - 🚗 Driving Mode (speed + DND)
  - 📍 Movement (activity status)
  - 🔇 Silent Mode (noise level)
  - 💧 Watering (soil moisture)
  - ☀️ Luminosity (light level)
- **Live Updates**: WebSocket connection for instant data

### Event History
- View all context events in chronological order
- Filter by context type
- See detailed event information
- Watch as new events arrive in real-time

## 🔧 Architecture

### Backend
- **Express.js** server with Socket.io
- **MongoDB** with Mongoose models
- **6 Simulators** generating context data
- **REST API** for management
- **WebSocket** for real-time updates
- **JWT** authentication

### Frontend
- **React + TypeScript** with Vite
- **Zustand** for state management
- **React Query** for server state
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Socket.io Client** for real-time updates
- **React Router** for navigation

## 🎯 Project Structure

```
xadapt/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── simulators/      # 6 context simulators
│   ├── utils/           # Helper functions
│   ├── server.js        # Main server
│   └── package.json
│
└── frontend/
    └── xadapt-frontend/
        ├── src/
        │   ├── components/       # React components
        │   ├── hooks/            # Custom React hooks
        │   ├── pages/            # Page components
        │   ├── services/         # API & Socket clients
        │   ├── store/            # Zustand stores
        │   ├── types/            # TypeScript types
        │   └── App.tsx           # Main app
        └── package.json
```

## 🔌 API Endpoints

### Auth
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register user

### Simulator
- `POST /api/simulator/start` - Start all simulators
- `POST /api/simulator/stop` - Stop all simulators

### Context
- `GET /api/context/state` - Get current context state
- `GET /api/context/history` - Get context history
- `GET /api/context/overrides` - Get override settings
- `POST /api/context/overrides` - Set override

### Events
- `GET /api/events` - Get events with optional filter

### Manual
- `POST /api/manual/:type` - Manually set context

## 📡 Real-time Updates

The frontend connects via WebSocket when:
1. User logs in (token is set)
2. Socket authenticates with JWT token
3. User joins room: `user_${userId}`
4. Receives `contextUpdate` events in real-time

## 🎨 UI/UX Highlights

- **Dark Theme**: Modern dark interface with blue accents
- **Gradient Effects**: Beautiful gradient backgrounds
- **Smooth Animations**: Framer Motion transitions
- **Responsive Design**: Works on all device sizes
- **Real-time Status**: Live indicator shows when data updates
- **Context Cards**: Color-coded by type for quick recognition
- **Clear Navigation**: Easy routing between pages

## ⚙️ Configuration

### Frontend Environment (`.env`)
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Backend Environment (`.env`)
```
MONGODB_URI=mongodb://localhost:27017/xadapt
JWT_SECRET=your-secret-key
PORT=5000
```

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env`

### "Port 5000 already in use"
- Change PORT in backend `.env`
- Or kill process: `lsof -ti:5000 | xargs kill -9`

### "Socket connection failed"
- Ensure backend is running
- Check `VITE_SOCKET_URL` in frontend `.env`
- Verify CORS is enabled (should be in server.js)

### "Login not working"
- Check backend logs for errors
- Verify MongoDB connection
- Check JWT_SECRET is set in backend

## 📚 Documentation Files

- `FRONTEND_DOCS.md` - Detailed frontend documentation
- Backend has inline comments explaining simulators

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [React Query Docs](https://tanstack.com/query/latest)
- [Socket.io Docs](https://socket.io/docs/)

## ✅ Testing the System

1. **Start Backend**
   ```bash
   cd backend
   npm test
   ```

2. **Start Frontend**
   ```bash
   cd frontend/xadapt-frontend
   npm run dev
   ```

3. **Open Browser**
   - Go to http://localhost:5173

4. **Create Account**
   - Use any email/password
   - Click "Create Account"

5. **Start Simulation**
   - Click "Start Simulation" on dashboard
   - Watch context cards update in real-time

6. **View Events**
   - Click "Events" tab
   - See all generated context events

## 🎉 You're Ready!

The frontend is now fully built and ready to connect to your backend. Enjoy!
