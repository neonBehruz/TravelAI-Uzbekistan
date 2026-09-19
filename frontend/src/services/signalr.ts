import * as signalR from '@microsoft/signalr';
import { LiveTouristSignal } from '../types';

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private listeners: ((signal: LiveTouristSignal) => void)[] = [];
  private alertListeners: ((alert: { title: string; message: string; type: string }) => void)[] = [];

  public startConnection() {
    if (this.connection) return;

    const hubUrl = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.hostname === 'localhost')
      ? 'http://localhost:5050/hubs/safar'
      : '/hubs/safar';

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    this.connection.on('ConnectedConfirmation', (data: { connectionId: string; serverTime: string }) => {
      console.log('⚡ SignalR handshake confirmed by backend:', data);
    });

    this.connection.on('LiveStatsUpdate', (signal: LiveTouristSignal) => {
      this.listeners.forEach((cb) => cb(signal));
    });

    this.connection.on('SystemAlert', (alert: { title: string; message: string; type: string }) => {
      this.alertListeners.forEach((cb) => cb(alert));
    });

    this.connection
      .start()
      .then(() => console.log('⚡ Connected to Safar AI SignalR Real-time Hub'))
      .catch((err) => console.warn('SignalR initial connect failed, retrying in background...', err));
  }

  public onLiveStats(callback: (signal: LiveTouristSignal) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  public onSystemAlert(callback: (alert: { title: string; message: string; type: string }) => void) {
    this.alertListeners.push(callback);
    return () => {
      this.alertListeners = this.alertListeners.filter((cb) => cb !== callback);
    };
  }

  public stopConnection() {
    if (this.connection) {
      this.connection.stop();
      this.connection = null;
    }
  }
}

export const signalRService = new SignalRService();
