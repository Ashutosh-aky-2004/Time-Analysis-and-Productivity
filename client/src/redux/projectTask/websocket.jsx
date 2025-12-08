import { io } from 'socket.io-client';
import { store } from '../store';
import { setSocketConnected, realTimeTaskUpdate } from './taskSlice';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }
  
  connect() {
    if (this.socket?.connected) return;
    
    this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    // Connection events
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      store.dispatch(setSocketConnected(true));
    });
    
    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.isConnected = false;
      store.dispatch(setSocketConnected(false));
    });
    
    // Subscribe to project room
    this.socket.on('connect', () => {
      const projectId = store.getState().tasks.currentProjectId;
      if (projectId) {
        this.joinProjectRoom(projectId);
      }
    });
    
    // Real-time events from server
    this.socket.on('task:created', (data) => {
      store.dispatch(realTimeTaskUpdate({ type: 'task:created', data }));
    });
    
    this.socket.on('task:updated', (data) => {
      store.dispatch(realTimeTaskUpdate({ type: 'task:updated', data }));
    });
    
    this.socket.on('task:deleted', (data) => {
      store.dispatch(realTimeTaskUpdate({ type: 'task:deleted', data }));
    });
    
    this.socket.on('subtask:added', (data) => {
      store.dispatch(realTimeTaskUpdate({ type: 'subtask:added', data }));
    });
    
    this.socket.on('subtask:updated', (data) => {
      store.dispatch(realTimeTaskUpdate({ type: 'subtask:updated', data }));
    });
    
    this.socket.on('comment:added', (data) => {
      store.dispatch(realTimeTaskUpdate({ type: 'comment:added', data }));
    });
    
    this.socket.on('reply:added', (data) => {
      store.dispatch(realTimeTaskUpdate({ type: 'reply:added', data }));
    });
    
    this.socket.on('reaction:added', (data) => {
      store.dispatch(realTimeTaskUpdate({ type: 'reaction:added', data }));
    });
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      store.dispatch(setSocketConnected(false));
    }
  }
  
  joinProjectRoom(projectId) {
    if (this.socket?.connected) {
      this.socket.emit('join:project', projectId);
    }
  }
  
  leaveProjectRoom(projectId) {
    if (this.socket?.connected) {
      this.socket.emit('leave:project', projectId);
    }
  }
  
  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }
  
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }
  
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export const websocketService = new WebSocketService();