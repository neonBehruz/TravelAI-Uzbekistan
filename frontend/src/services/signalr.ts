import * as signalR from '@microsoft/signalr';
import { LiveTouristSignal } from '../types';

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private listeners: ((signal: LiveTouristSignal) => void)[] = [];
  private alertListeners: ((alert: { title: string; message: string; type: string }) => void)[] = [];

  private simulationInterval: any = null;

  public startConnection() {
    if (this.connection) return;

    const isLocalhost = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    if (!isLocalhost) {
      // Standalone / Vercel: run lightweight live simulation immediately
      this.startSimulation();
      return;
    }

    const hubUrl = 'http://localhost:5050/hubs/safar';

    try {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          skipNegotiation: false,
          transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000])
        .configureLogging(signalR.LogLevel.None)
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
        .catch(() => {
          this.startSimulation();
        });
    } catch {
      this.startSimulation();
    }
  }

  private startSimulation() {
    if (this.simulationInterval) return;

    const sampleActions = [
      { action: 'Samarqand Registonida 360° virtual tur ko\'rilmoqda', city: 'Samarkand' },
      { action: 'Afrosiyob poyezdiga chipta jadvali yangilandi', city: 'Tashkent' },
      { action: 'Buxoro Minorai Kalon bo\'yicha yangi sayohat rejasi tuzildi', city: 'Bukhara' },
      { action: 'Xiva Ichan Qal\'a audio-gidi faollashtirildi', city: 'Khiva' },
      { action: 'Toshkent Chorsu bozorida milliy taomlar tavsiya qilindi', city: 'Tashkent' },
      { action: 'Konigil qog\'oz fabrikasi bo\'yicha marshrut hisoblandi', city: 'Samarkand' }
    ];

    let actionIdx = 0;
    const emit = () => {
      const item = sampleActions[actionIdx % sampleActions.length];
      actionIdx++;
      const sig: LiveTouristSignal = {
        activeTouristsCount: 380 + Math.floor(Math.random() * 35),
        city: item.city,
        action: item.action,
        timestamp: new Date().toLocaleTimeString()
      };
      this.listeners.forEach((cb) => cb(sig));
    };

    // Emit first event after 1.5s
    setTimeout(emit, 1500);
    this.simulationInterval = setInterval(emit, 18000);
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
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    if (this.connection) {
      this.connection.stop().catch(() => {});
      this.connection = null;
    }
  }
}

export const signalRService = new SignalRService();
