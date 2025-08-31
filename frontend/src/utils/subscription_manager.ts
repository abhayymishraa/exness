const url = "ws://localhost:8080";

export class Signalingmanager {
  private ws: WebSocket;
  private static instance: Signalingmanager;
  private bufferedMessage = [];
  private initalized: boolean = false;
  private callbacks: { [type: string]: Array<(...args: unknown[]) => void> } =
    {};

  private constructor() {
    this.ws = new WebSocket(url);
    this.bufferedMessage = [];
    this.init();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Signalingmanager();
    }
    return this.instance;
  }

  private init() {
    this.ws.onopen = () => {
      this.initalized = true;
      this.bufferedMessage.forEach((msg) => {
        this.ws.send(JSON.stringify(msg));
      });
      this.bufferedMessage = [];

      console.log("ws is started");
    };

    this.ws.onmessage = (msg) => {
      try {
        const raw = msg.data;

        console.log("WS received:", raw);

        const parsedmsg = JSON.parse(raw);
        const type = parsedmsg.symbol;

        if (this.callbacks[type]) {
          this.callbacks[type].forEach((callback) => {
            callback(parsedmsg);
          });
        }
      } catch (err) {
        console.warn("Received non-JSON message:", err);
      }
    };

    this.ws.onerror = (err) => {
      console.log("Error form the websockert", err);
    };

    this.ws.onclose = () => {
      setTimeout(() => {
        this.ws = new WebSocket(url);
        this.init();
      }, 20000);
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public subscribe(message: any) {
    const msgdesctructure = { ...message };
    if (!this.initalized) {
      this.bufferedMessage.push(msgdesctructure as never);
      return;
    }
    this.ws.send(JSON.stringify(msgdesctructure));
  }

  registerCallback(type: string, callback: (...args: unknown[]) => void) {
    this.callbacks[type] = this.callbacks[type] || [];
    this.callbacks[type].push(callback);
  }

  deregisterCallback(type: string) {
    if (this.callbacks[type]) {
      delete this.callbacks[type];
    }
  }
  deregisterCallbackNew(type: string, callback: (...args: unknown[]) => void) {
    if (this.callbacks[type]) {
      this.callbacks[type] = this.callbacks[type].filter(
        (cb) => cb !== callback
      );
      if (this.callbacks[type].length === 0) {
        delete this.callbacks[type];
      }
    }
  }
}
