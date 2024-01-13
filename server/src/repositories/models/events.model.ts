import { Schema, Model, Document, model } from 'mongoose';

interface Event extends Document {
  type: string;
  date: number;
}

const eventSchema: Schema<Event> = new Schema<Event>(
  {
    type: { type: String, required: true },
    date: { type: Number, required: true },
  },
  {
    versionKey: false,
  }
);

const EventModel: Model<Event> = model<Event>('Event', eventSchema);

export { EventModel, eventSchema };
