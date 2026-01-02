import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import type { LoginRequest, RegisterRequest } from '../types';

// ============= Auth Hooks =============
export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => apiClient.login(data),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => apiClient.register(data),
  });
};

// ============= Simulator Hooks =============
export const useStartSimulation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.startSimulation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contextState'] });
    },
  });
};

export const useStopSimulation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.stopSimulation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contextState'] });
    },
  });
};

// ============= Context Hooks =============
export const useContextState = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['contextState'],
    queryFn: () => apiClient.getContextState(),
    enabled,
    refetchInterval: 5000,
    staleTime: 1000,
  });
};

export const useContextHistory = (limit: number = 50, type?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['contextHistory', limit, type],
    queryFn: () => apiClient.getContextHistory(limit, type),
    enabled,
    refetchInterval: 10000,
  });
};

// ============= Event Hooks =============
export const useEvents = (limit: number = 50, type?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['events', limit, type],
    queryFn: () => apiClient.getEvents(limit, type),
    enabled,
    refetchInterval: 10000,
  });
};

// ============= Override Hooks =============
export const useOverrides = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['overrides'],
    queryFn: () => apiClient.getOverrides(),
    enabled,
    refetchInterval: 5000,
    staleTime: 1000,
  });
};

export const useSetOverride = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ context, value }: { context: string; value: any }) =>
      apiClient.setOverride(context, value),
    onSuccess: () => {
      // Immediately refetch both queries
      queryClient.invalidateQueries({ queryKey: ['overrides'] });
      queryClient.invalidateQueries({ queryKey: ['contextState'] });
      // Force refetch immediately
      queryClient.refetchQueries({ queryKey: ['contextState'] });
      queryClient.refetchQueries({ queryKey: ['overrides'] });
    },
  });
};

// ============= Manual Hooks =============
export const useSetManualContext = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ type, payload }: { type: string; payload: any }) =>
      apiClient.setManualContext(type, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contextState'] });
      queryClient.invalidateQueries({ queryKey: ['contextHistory'] });
    },
  });
};

// ============= Automation Rules Hooks =============
export const useAutomationRules = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['automationRules'],
    queryFn: () => apiClient.get('/automation'),
    enabled,
    refetchInterval: 30000,
  });
};

export const useCreateRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rule: any) => apiClient.post('/automation', rule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automationRules'] });
    },
  });
};

export const useUpdateRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.put(`/automation/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automationRules'] });
    },
  });
};

export const useDeleteRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/automation/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automationRules'] });
    },
  });
};

// ============= Devices Hooks =============
export const useDevices = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['devices'],
    queryFn: () => apiClient.get('/devices'),
    enabled,
    refetchInterval: 30000,
  });
};

export const useCreateDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (device: any) => apiClient.post('/devices', device),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
  });
};

export const useDeleteDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/devices/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
  });
};

// ============= Thresholds Hooks =============
export const useContextThresholds = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['thresholds'],
    queryFn: () => apiClient.get('/thresholds'),
    enabled,
  });
};

export const useUpdateThreshold = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ context, data }: { context: string; data: any }) =>
      apiClient.put(`/thresholds/${context}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thresholds'] });
    },
  });
};

// ============= Export Hooks =============
export const useExportEvents = () => {
  return useMutation({
    mutationFn: async (format: 'csv' | 'json') => {
      const endpoint = format === 'csv' ? '/api/export/csv' : '/api/export/json';
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `context-events.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    },
  });
};

// ============= Simulation Scenes Hooks =============
export const useSimulationScenes = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['simulationScenes'],
    queryFn: () => apiClient.get('/scenes'),
    enabled,
  });
};

export const usePresetScenes = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['presetScenes'],
    queryFn: () => apiClient.get('/scenes/presets'),
    enabled,
  });
};

export const useCreateScene = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (scene: any) => apiClient.post('/scenes', scene),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulationScenes'] });
    },
  });
};

export const useDeleteScene = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/scenes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulationScenes'] });
    },
  });
};
