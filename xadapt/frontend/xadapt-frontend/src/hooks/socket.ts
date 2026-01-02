import { useEffect, useState } from 'react';
import { socketService } from '../services/socket';
import type { ContextUpdateEvent } from '../types';

export const useSocketConnect = (token: string | null) => {
  useEffect(() => {
    if (token) {
      socketService.connect(token);
      return () => {
        socketService.disconnect();
      };
    }
  }, [token]);
};

export const useSocketEvent = <T,>(event: string, callback: (data: T) => void) => {
  useEffect(() => {
    return socketService.on(event, callback);
  }, [event, callback]);
};

export const useContextUpdate = (callback: (event: ContextUpdateEvent) => void) => {
  useSocketEvent('contextUpdate', callback);
};

export const useSocketConnected = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const unsubscribeConnected = socketService.on('connected', () => setConnected(true));
    const unsubscribeDisconnected = socketService.on('disconnected', () => setConnected(false));

    if (socketService.isConnected()) {
      setConnected(true);
    }

    return () => {
      unsubscribeConnected();
      unsubscribeDisconnected();
    };
  }, []);

  return connected;
};
