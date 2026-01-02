// ============= Auth Types =============
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  createdAt?: string;
}

// ============= Context Types =============
export type ContextType = 'temperature' | 'silentMode' | 'movement' | 'drivingMode' | 'watering' | 'luminosity';

export interface ContextPayload {
  [key: string]: any;
}

export interface ContextEvent {
  _id: string;
  userId: string;
  type: ContextType;
  payload: ContextPayload;
  explanation: string;
  createdAt: string;
}

export interface ContextState {
  [key: string]: ContextPayload & { explanation: string };
}

// ============= Temperature Context =============
export interface TemperaturePayload {
  outdoor: number;
  indoor: number;
  explanation: string;
}

// ============= Driving Mode Context =============
export interface DrivingModePayload {
  speed: number;
  drivingMode: boolean;
  explanation: string;
}

// ============= Silent Mode Context =============
export interface SilentModePayload {
  soundLevel: number;
  silentMode: boolean;
  explanation: string;
}

// ============= Movement Context =============
export interface MovementPayload {
  isMoving: boolean;
  activity: string;
  explanation: string;
}

// ============= Watering Context =============
export interface WateringPayload {
  soilMoisture: number;
  needsWatering: boolean;
  explanation: string;
}

// ============= Luminosity Context =============
export interface LuminosityPayload {
  lightLevel: number;
  brightness: string; // 'low' | 'medium' | 'high'
  explanation: string;
}

// ============= Override Types =============
export interface Override {
  [key: string]: boolean;
}

export interface SetOverrideRequest {
  context: ContextType;
  value: boolean;
}

// ============= API Response Types =============
export interface ContextEventResponse {
  success: boolean;
  events: ContextEvent[];
  total: number;
}

export interface SimulatorResponse {
  message: string;
  userId: string;
}

export interface StateResponse {
  success: boolean;
  state: ContextState;
}

export interface OverridesResponse {
  success: boolean;
  overrides: Override;
}

// ============= Socket.io Event Types =============
export interface ContextUpdateEvent {
  type: ContextType;
  payload: ContextPayload;
  ts: string;
}

// ============= UI Component Props =============
export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export interface ContextCardProps {
  type: ContextType;
  payload: ContextPayload;
  isOverridden: boolean;
  onToggleOverride: (type: ContextType) => void;
}

export interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}
