import { Config, Errors } from './your-import-paths'; // Zaimportuj odpowiednie zależności
import { EventModel } from './models/events.model'; // Upewnij się, że zaimportowałeś model EventModel z odpowiedniej ścieżki

class EventRepository {
  private config: Config;
  private errors: Errors;

  constructor({ config, errors }: { config: Config, errors: Errors }) {
    this.config = config;
    this.errors = errors;
  }

  async saveEvent(type: string, date: Date): Promise<any> {
    if (!this.isEventTypeValid(type)) {
      throw new this.errors.InternalServerError(`Unable to save event, event type "${type}" is not valid.`);
    }
    try {
      const newRecord = new EventModel({ type, date });
      try {
        return await newRecord.save();
      } catch (error) {
        return new this.errors.InternalServerError(error.message);
      }
    } catch (error) {
      throw new this.errors.InternalServerError(error.message);
    }
  }

  async getLastPresenceEvent(): Promise<any> {
    // Implementuj logikę do pobierania ostatniego wydarzenia
  }

  private isEventTypeValid(type: string): boolean {
    const allowedTypes = ['absent', 'present', 'unknown', 'standing', 'sitting', 'on', 'off'];
    return allowedTypes.includes(type);
  }
}

export default EventRepository;
