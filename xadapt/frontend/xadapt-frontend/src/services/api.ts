import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ContextEventResponse,
  SimulatorResponse,
  StateResponse,
  OverridesResponse,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class APIClient {
  private token: string | null = localStorage.getItem('token');

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
    };
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // ============= Auth Endpoints =============
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });
    this.setToken(response.token);
    return response;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(response.token);
    return response;
  }

  // ============= Simulator Endpoints =============
  async startSimulation(): Promise<SimulatorResponse> {
    return this.request<SimulatorResponse>('/simulator/start', {
      method: 'POST',
    });
  }

  async stopSimulation(): Promise<SimulatorResponse> {
    return this.request<SimulatorResponse>('/simulator/stop', {
      method: 'POST',
    });
  }

  // ============= Context Endpoints =============
  async getContextState(): Promise<StateResponse> {
    return this.request<StateResponse>('/context/state');
  }

  async getContextHistory(
    limit: number = 50,
    type?: string
  ): Promise<ContextEventResponse> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (type) params.append('type', type);
    return this.request<ContextEventResponse>(
      `/context/history?${params.toString()}`
    );
  }

  // ============= Event Endpoints =============
  async getEvents(
    limit: number = 50,
    type?: string
  ): Promise<ContextEventResponse> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (type) params.append('type', type);
    return this.request<ContextEventResponse>(`/events?${params.toString()}`);
  }

  // ============= Override Endpoints =============
  async getOverrides(): Promise<OverridesResponse> {
    return this.request<OverridesResponse>('/context/overrides');
  }

  async setOverride(context: string, value: any): Promise<any> {
    return this.request(`/context/overrides`, {
      method: 'POST',
      body: JSON.stringify({ context, value }),
    });
  }

  // ============= Manual Endpoints =============
  async setManualContext(type: string, payload: any): Promise<any> {
    return this.request(`/manual/${type}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // ============= Generic CRUD Endpoints =============
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new APIClient();
