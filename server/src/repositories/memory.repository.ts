import { Config, Errors } from './your-import-paths'; // Zaimportuj odpowiednie zależności
import { MemoryModel } from './models/memory.model'; // Upewnij się, że zaimportowałeś model MemoryModel z odpowiedniej ścieżki
import { inNumberInRange } from '../helpers'; // Upewnij się, że zaimportowałeś funkcję inNumberInRange z odpowiedniej ścieżki

class MemoryRepository {
  private config: Config;
  private errors: Errors;

  constructor({ config, errors }: { config: Config, errors: Errors }) {
    this.config = config;
    this.errors = errors;
  }

  async upsertMemory(button: number, height: number): Promise<void> {
    if (!inNumberInRange(button, ...this.config.desk.memoryButtonsRange))
      throw new this.errors.InvalidParameterError(`Button must be between ${this.config.desk.buttonsRange[0]} and ${this.config.desk.buttonsRange[1]}`);

    if (!inNumberInRange(height, ...this.config.desk.heightRange))
      throw new this.errors.InvalidParameterError(`Height must be between ${this.config.desk.heightRange[0]} and ${this.config.desk.heightRange[1]}`);

    await MemoryModel.updateOne({ button }, { height }, { upsert: true });
  }

  // Get memory by button from memory model
  async getMemory(button: number): Promise<any> {
    return await MemoryModel.findOne({ button });
  }

  // Remove memory by button from memory model
  async removeMemory(button: number): Promise<void> {
    await MemoryModel.findOne({ button }).remove();
  }

  // Get all memory from memory model
  async getAllMemories(): Promise<any[]> {
    return await MemoryModel.find({});
  }
}

export default MemoryRepository;
