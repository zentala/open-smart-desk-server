import { EventEmitter } from 'events';

class Emitter extends EventEmitter {
  constructor() {
    super();
  }
}

export default new Emitter();