# XAdapt Frontend - Documentation

## 🎯 Project Overview

XAdapt is a **context-aware adaptive system** that simulates real-world mobile device contexts. The frontend provides a beautiful, modern interface for users to:
- Authenticate and manage their account
- Start/stop context simulators
- View real-time context changes (temperature, driving mode, movement, etc.)
- Browse historical context events with filtering
- Monitor system status with live updates

## 🏗️ Architecture

### Directory Structure
```
src/
├── components/
│   └── common/
│       ├── Button.tsx        # Reusable button component
│       ├── Card.tsx          # Reusable card component
│       └── Input.tsx         # Reusable input component
├── hooks/
│   ├── queries.ts            # React Query hooks for API calls
│   └── socket.ts             # Socket.io connection hooks
├── pages/
│   ├── auth/
│   │   ├── Login.tsx         # Login page
│   │   └── Register.tsx      # Registration page
│   ├── Dashboard.tsx         # Main dashboard with context cards
│   └── Events.tsx            # Event history viewer
├── services/
│   ├── api.ts                # API client with all endpoints
│   └── socket.ts             # Socket.io service
├── store/
│   └── index.ts              # Zustand global state management
├── types/
│   └── index.ts              # TypeScript interfaces and types
├── App.tsx                   # Main app with routing
├── main.tsx                  # Entry point
└── index.css                 # Tailwind CSS directives
```

### Technology Stack
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite 5** - Build tool and dev server
- **Tailwind CSS 3** - Styling with @tailwindcss/postcss
- **React Router 6** - Client-side routing
- **React Query 5** - Server state management
- **Zustand 4** - Client state management
- **Framer Motion 10** - Animations
- **Socket.io Client 4** - Real-time communication
- **Lucide React** - Icon library

## 📱 Pages

### 1. **Login Page** (`/login`)
- Email and password authentication
- Form validation with error messages
- Link to registration page
- Beautiful gradient background with Framer Motion animations

### 2. **Register Page** (`/register`)
- Email, password, and confirm password fields
- Client-side validation
- Password strength requirements (6+ characters)
- Link to login page

### 3. **Dashboard** (`/dashboard`)
- **Simulation Control Card**: Start/Stop simulators with real-time status
- **Context Cards Grid**: 6 context types displayed with live data
  - **Temperature**: Indoor/outdoor temperature with status indicator
  - **Driving Mode**: Speed and DND status
  - **Movement**: Activity status (moving/stationary)
  - **Silent Mode**: Noise level and status
  - **Watering**: Soil moisture percentage
  - **Luminosity**: Light level in lux with brightness level
- **Real-time Updates**: Socket.io connection updates all cards live
- **Header**: User email, simulation status, logout button

### 4. **Events Page** (`/events`)
- Filter events by context type
- Chronological list of all context events
- Event details with payload display
- Color-coded by context type
- Responsive grid layout

## 🔌 State Management

### Zustand Stores (`src/store/index.ts`)

#### `useAuthStore`
- `user`: Current user object
- `token`: JWT authentication token
- `isLoading`: Loading state
- Methods: `setUser()`, `setToken()`, `logout()`

#### `useContextStore`
- `state`: Current context state from all simulators
- `overrides`: Manual override flags
- `isSimulating`: Simulation status
- Methods: `setState()`, `updateContext()`, `setOverrides()`, `toggleOverride()`, `setSimulating()`

#### `useUIStore`
- `sidebarOpen`: Sidebar visibility
- `theme`: Light/dark mode
- `activeTab`: Current active tab
- Methods: `setSidebarOpen()`, `setTheme()`, `setActiveTab()`

## 🌐 API Integration

### API Client (`src/services/api.ts`)
```typescript
// Authentication
- login(email, password)
- register(email, password, confirmPassword)

// Simulators
- startSimulation()
- stopSimulation()

// Context Data
- getContextState()
- getContextHistory(limit, type)

// Events
- getEvents(limit, type)

// Overrides
- getOverrides()
- setOverride(context, value)

// Manual Control
- setManualContext(type, payload)
```

### React Query Hooks (`src/hooks/queries.ts`)
- `useLogin()` - Login mutation
- `useRegister()` - Register mutation
- `useStartSimulation()` - Start simulator mutation
- `useStopSimulation()` - Stop simulator mutation
- `useContextState()` - Get current context state (auto-refetch)
- `useContextHistory()` - Get context history
- `useEvents()` - Get events with filtering
- `useOverrides()` - Get override settings
- `useSetOverride()` - Set override mutation
- `useSetManualContext()` - Manual context control

## 📡 Real-time Socket.io

### Socket Service (`src/services/socket.ts`)
- Connects with JWT token from query params
- Automatic reconnection with exponential backoff
- Event listeners for:
  - `connected`: Socket connection established
  - `disconnected`: Socket connection lost
  - `contextUpdate`: New context event received
  - `error`: Socket errors

### Socket Hooks (`src/hooks/socket.ts`)
- `useSocketConnect(token)` - Establish socket connection
- `useSocketEvent(event, callback)` - Listen to specific socket events
- `useContextUpdate(callback)` - Specialized hook for context updates
- `useSocketConnected()` - Get connection status

## 🎨 Components

### Reusable Components (`src/components/common/`)

#### Button
```tsx
<Button
  variant="primary" | "secondary" | "danger" | "success"
  size="sm" | "md" | "lg"
  loading={boolean}
  type="button" | "submit" | "reset"
  onClick={handler}
>
  Content
</Button>
```

#### Card
```tsx
<Card title="Title" subtitle="Subtitle" className="custom">
  Content
</Card>
```

#### Input
```tsx
<Input
  label="Label"
  type="email"
  placeholder="..."
  error="Error message"
  onChange={handler}
/>
```

## 🎯 Context Types

Each context has:
- **Type**: Unique identifier (temperature, drivingMode, etc.)
- **Payload**: Dynamic data object
- **Explanation**: Human-readable description of the event
- **Timestamp**: When the event occurred

### Temperature Context
```typescript
{
  outdoor: number,      // Celsius
  indoor: number,       // Celsius
  explanation: string
}
```

### Driving Mode Context
```typescript
{
  speed: number,           // km/h
  drivingMode: boolean,    // true if speed > 30
  explanation: string
}
```

### Similar structures for: SilentMode, Movement, Watering, Luminosity

## 🔐 Authentication Flow

1. User visits `/login` or `/register`
2. Credentials submitted to backend
3. Backend returns JWT token
4. Token stored in localStorage and Zustand store
5. All API requests include token in Authorization header
6. Socket.io connection uses token in query params
7. Protected routes redirect to login if no token

## 🚀 Running the Frontend

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm build

# Preview production build
npm preview

# Lint code
npm run lint
```

## 📦 Environment Variables

Create `.env` file in frontend root:
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## ✨ Features

- ✅ **Real-time Updates**: Socket.io for instant context changes
- ✅ **Beautiful UI**: Modern design with Tailwind CSS
- ✅ **Animations**: Smooth transitions with Framer Motion
- ✅ **Type Safety**: Full TypeScript coverage
- ✅ **State Management**: Zustand for global state
- ✅ **Data Fetching**: React Query for server state
- ✅ **Responsive**: Mobile-first design
- ✅ **Error Handling**: Comprehensive error messages
- ✅ **Protected Routes**: Authentication guards
- ✅ **Form Validation**: Client-side validation

## 🔄 Data Flow

```
User Input
    ↓
Component State (Zustand)
    ↓
API/Mutation (React Query)
    ↓
Backend/Database
    ↓
Socket.io Event
    ↓
Component Update
    ↓
UI Render
```

## 📊 Context Cards

Each context card displays:
- **Icon**: Visual identifier
- **Title**: Context type name
- **Status Badge**: Current state indicator
- **Main Value**: Primary measurement (temp, speed, etc.)
- **Explanation**: Description of what's happening
- **Details**: Additional metadata

## 🎯 Future Enhancements

- [ ] Manual context override controls in dashboard
- [ ] Dark/Light theme toggle
- [ ] Advanced event filtering and search
- [ ] Event export (CSV/JSON)
- [ ] Simulator settings/configuration
- [ ] Multi-user dashboard
- [ ] Performance metrics and analytics
- [ ] Device-specific context presets

---

**Frontend Ready!** 🎉 
Visit `http://localhost:5173/` to see the app in action.
Make sure the backend is running on `http://localhost:5000/` for full functionality.
