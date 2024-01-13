// Responsible for memorising definied desk heights (so user can go to remembered height)

import { Logger, Config, MemoryRepository, Emitter, HeightService } from './your-import-paths'; // Zaimportuj odpowiednie zależności

class MemoryService {
  private logger: Logger;
  private memoryRepository: MemoryRepository;
  private config: Config;
  private emitter: Emitter;
  private heightService: HeightService;

  constructor({ logger, config, memoryRepository, emitter, heightService }: {
    logger: Logger,
    config: Config,
    memoryRepository: MemoryRepository,
    emitter: Emitter,
    heightService: HeightService
  }) {
    this.logger = logger;
    this.memoryRepository = memoryRepository;
    this.config = config;
    this.emitter = emitter;
    this.heightService = heightService;
  }

  start(): void {
    this.emitter.on('memory:get', this.getMemory.bind(this));
    this.emitter.on('memory:go', this.goMemory.bind(this));
    this.emitter.on('memory:save', this.saveMemory.bind(this));
  }

  async getMemory(button: number): Promise<void> {
    this.logger.info(`MemoryService: requested for remembered height for button no.${button}`);
    let memory = await this.memoryRepository.getMemory(button);
    const height = memory ? memory.height : undefined;
    this.logger.info(`MemoryService: sharing remembered height for button no.${button}: ${height}`);
    this.emitter.emit('memory:got', { button, height });
  }

  async saveMemory(button: number): Promise<void> {
    let height = this.heightService.getHeight();

    if (!height) {
      this.logger.error(`MemoryService: could not get cached height, not saving memory for button no.${button}`);
      return;
    }

    this.logger.info(`MemoryService: saving current desk height (${height}mm) for memory button no.${button}`);
    await this.memoryRepository.upsertMemory(button, height);
    this.emitter.emit('memory:saved', { button, height });
  }

  async goMemory(button: number): Promise<void> {
    // Get the memory
    let memory = await this.memoryRepository.getMemory(button);
    if (!memory || !memory.height) {
      this.logger.error(`MemoryService: could not get memorized height for button no.${button}`);
      return;
    }
    this.logger.info(`MemoryService: going to height ${memory.height}mm saved under button no.${button}`);
  }
}

export default MemoryService;
