# 🚀 XAdapt - Complete System Setup & Run Commands

## Terminal 1: Backend Setup & Run

```bash
# Navigate to backend
cd c:\Users\ASUS X515 I5\Desktop\xadapt\backend

# Ensure .env exists with:
# MONGODB_URI=mongodb://localhost:27017/xadapt
# JWT_SECRET=your-secret-key-here
# PORT=5000

# Install dependencies (if not already done)
npm install

# Start backend server (with auto-reload via nodemon)
npm test

# Expected output:
# Server listening on 5000
# MongoDB connected
```

## Terminal 2: Frontend Setup & Run

```bash
# Navigate to frontend
cd c:\Users\ASUS X515 I5\Desktop\xadapt\frontend\xadapt-frontend

# Frontend is already configured with:
# - All dependencies installed
# - Tailwind CSS configured
# - Environment variables in .env

# Start dev server
npm run dev

# Expected output:
# VITE v5.4.21 ready in XXX ms
# Local: http://localhost:5173/
```

## Terminal 3: MongoDB (if running locally)

```bash
# Windows - MongoDB should be running as a service
# Or start manually:
mongod

# Expected output:
# MongoDB listening on 27017
```

## 📱 Access the Application

Once both servers are running:

1. **Open Browser**: http://localhost:5173
2. **Create Account**: 
   - Email: test@example.com
   - Password: password123
3. **Start Simulation**: Click "Start Simulation" button
4. **Watch Dashboard**: Real-time context updates
5. **View Events**: Click "Events" to see history

## ✅ System Checklist

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:5173
- [ ] MongoDB connected and running
- [ ] Browser opens to http://localhost:5173
- [ ] Can create account
- [ ] Can start/stop simulation
- [ ] Dashboard shows context cards
- [ ] Real-time updates working
- [ ] Events page shows history

## 🔧 Troubleshooting Quick Fixes

### Backend won't start
```bash
# Check port 5000 is free
netstat -ano | findstr :5000

# If occupied, kill the process or change PORT in .env
```

### Frontend build fails
```bash
# Clear node_modules and reinstall
cd frontend/xadapt-frontend
rm -Force -Recurse node_modules
npm install
npm run dev
```

### Socket.io connection fails
```bash
# Check:
# 1. Backend is running on port 5000
# 2. CORS is enabled (it is by default in server.js)
# 3. VITE_SOCKET_URL in .env is http://localhost:5000
```

### MongoDB connection fails
```bash
# Check MongoDB is running
mongod

# Verify connection string in backend .env:
# MONGODB_URI=mongodb://localhost:27017/xadapt
```

## 📊 Live Data Flow

When simulation is running:

```
Backend Simulators (every 8-30 seconds)
    ↓
Creates ContextEvent in MongoDB
    ↓
Emits via Socket.io
    ↓
Frontend receives via WebSocket
    ↓
Updates Zustand store
    ↓
React re-renders dashboard cards
    ↓
Smooth Framer Motion animation
    ↓
You see real-time data! 🎉
```

## 🎯 Testing the Full System

### Test 1: Authentication
1. Go to http://localhost:5173
2. Click "Create Account"
3. Enter email and password
4. Should redirect to dashboard
5. Verify token stored in localStorage

### Test 2: Dashboard
1. Should see 6 context cards
2. Cards show "No data yet" initially
3. Click "Start Simulation"
4. Watch data fill in within seconds
5. See animated updates

### Test 3: Real-time Updates
1. Open dashboard and events on two tabs
2. Start simulation
3. Refresh events page
4. Should see new events appearing
5. Cards update without page refresh

### Test 4: Event Filtering
1. Go to Events page
2. Click different context type filters
3. Event list should filter in real-time
4. Try filtering by "Temperature" only

### Test 5: Stop & Restart
1. Click "Stop Simulation"
2. No new events should appear
3. Click "Start Simulation" again
4. Events should resume appearing

## 🎬 Demo Scenario

Perfect sequence to demonstrate the system:

1. **Start both servers**
   ```bash
   # Terminal 1: Backend
   npm test
   
   # Terminal 2: Frontend
   npm run dev
   ```

2. **Open browser** → http://localhost:5173

3. **Register account** (any email/password)

4. **View dashboard** → Shows all 6 context cards

5. **Start simulation** → Cards populate with data

6. **Watch in real-time** → Data updates every 8-30 seconds

7. **Switch to events** → See chronological event list

8. **Filter events** → Select "Temperature" filter

9. **Stop simulation** → Events stop generating

10. **Logout** → Redirects to login page

## 🎯 What You'll See

### Dashboard Cards (Real-time)
- Temperature card: Shows outdoor temp, indoor temp, explanation
- Driving mode: Shows speed, DND status
- Movement: Shows activity
- Silent mode: Shows noise level
- Watering: Shows soil moisture %
- Luminosity: Shows light level

### Each card has:
- Icon (color-coded)
- Title
- Main value (animated when updating)
- Explanation text
- Status indicator or detail

### Status bar shows:
- User email
- Live indicator (pulses when data updates)
- "Simulating" or "Idle" status

## 📈 Performance Metrics

Expected performance:
- Page load: < 1 second
- Real-time update latency: < 100ms
- Socket reconnection: < 5 seconds
- API response time: < 200ms

## 🔐 Security Features

Implemented:
- ✅ JWT token-based auth
- ✅ Secure password validation
- ✅ Protected routes
- ✅ Token stored securely
- ✅ Automatic logout on token loss

## 🎨 Visual Features

- ✅ Dark theme (modern, easy on eyes)
- ✅ Color-coded context types
- ✅ Smooth animations and transitions
- ✅ Responsive design (mobile-friendly)
- ✅ Clear visual hierarchy
- ✅ Icons for quick recognition

## 📊 Data Persistence

- Backend: MongoDB stores all events
- Frontend: LocalStorage for auth token
- Real-time: Socket.io for live updates
- Caching: React Query handles smart refetches

## 🚀 Ready to Go!

Everything is configured and ready. Just run:

```bash
# Terminal 1
cd backend && npm test

# Terminal 2
cd frontend/xadapt-frontend && npm run dev

# Then open:
# http://localhost:5173
```

Enjoy your XAdapt system! 🎉
