const url = "ws://localhost:8080";

export class Signalingmanager {
  private ws: WebSocket;
  private static instance: Signalingmanager;
  private bufferedMessage = [];
  private initalized: boolean = false;
  private callbacks: { [symbol: string]: Array<(...args: unknown[]) => void> } =
    {};
  private subCount: Record<string, number> = {};

  private constructor() {
    this.ws = new WebSocket(url);
    this.bufferedMessage = [];
    this.init();
  }

  private send(msg: any) {
    if (!this.initalized) {
      this.bufferedMessage.push(msg);
      return;
    }
    this.ws.send(JSON.stringify(msg));
  }

  /** Public API: start watching a symbol with a callback. Returns an unwatch fn. */
  public watch(
    symbol: string,
    callback: (...args: unknown[]) => void,
  ): () => void {
    // register callback
    this.callbacks[symbol] = this.callbacks[symbol] || [];
    this.callbacks[symbol].push(callback);

    // ref-counted subscribe
    const prev = this.subCount[symbol] ?? 0;
    this.subCount[symbol] = prev + 1;
    if (prev === 0) {
      this.send({ type: "SUBSCRIBE", symbol });
    }

    // return unwatch function
    return () => {
      // remove callback
      const list = this.callbacks[symbol] || [];
      this.callbacks[symbol] = list.filter((cb) => cb !== callback);
      if (this.callbacks[symbol].length === 0) {
        delete this.callbacks[symbol];
      }

      // ref-counted unsubscribe
      const cur = this.subCount[symbol] ?? 0;
      if (cur <= 1) {
        delete this.subCount[symbol];
        this.send({ type: "UNSUBSCRIBE", symbol });
      } else {
        this.subCount[symbol] = cur - 1;
      }
    };
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

      Object.keys(this.subCount).forEach((sym) => {
        if (this.subCount[sym] > 0) {
          this.ws.send(JSON.stringify({ type: "SUBSCRIBE", symbol: sym }));
        }
      });
      this.bufferedMessage.forEach((msg) => {
        this.ws.send(JSON.stringify(msg));
      });
      this.bufferedMessage = [];

      console.log("ws is started");
    };

    this.ws.onmessage = (msg) => {
      try {
        const raw = msg.data;

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

  registerCallback(type: string, callback: (...args: unknown[]) => void) {
    if (!this.callbacks[type]) {
      this.callbacks[type] = [];
    }
    this.callbacks[type].push(callback);
  }

  deregisterCallback(type: string) {
    if (this.callbacks[type]) {
      delete this.callbacks[type];
    }
  }

  public subscribe(message: any) {
    this.send(message);
  }

  deregisterCallbackNew(type: string, callback: (...args: unknown[]) => void) {
    if (this.callbacks[type]) {
      this.callbacks[type] = this.callbacks[type].filter(
        (cb) => cb !== callback,
      );
      if (this.callbacks[type].length === 0) {
        delete this.callbacks[type];
      }
    }
  }
}
