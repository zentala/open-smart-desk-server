import { Logger, Emitter } from './your-import-paths'; // Zaimportuj odpowiednie zależności

class HeightService {
  private height: number | null = null;
  private emitter: Emitter;
  private logger: Logger;

  constructor({ emitter, logger }: { emitter: Emitter, logger: Logger }) {
    this.emitter = emitter;
    this.logger = logger;
  }

  async start(): Promise<void> {
    this.emitter.on('laser', (height: number) => {
      this.logger.info(`HeightService: Saving new height in cache: ${height}`);
      this.setHeight(height);
      console.log(this.height);
    });

    this.emitter.on('height:get', () => {
      console.log(this.height);
      this.logger.info(`HeightService: Sending cached height to the client: ${this.height}`);
      this.emitter.emit('height:got', this.height);
      return this.height;
    });
  }

  getHeight(): number | null {
    console.log(this.height);
    return this.height;
  }

  setHeight(height: number): void {
    console.log(this.height);
    this.height = height;
    console.log(this.height);
  }
}

export default HeightService;
