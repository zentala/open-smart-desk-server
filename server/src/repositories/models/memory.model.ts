import { Schema, Model, Document, model } from 'mongoose';

interface Memory extends Document {
  button: number;
  height: number;
}

const memorySchema: Schema<Memory> = new Schema<Memory>(
  {
    button: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  {
    versionKey: false,
  }
);

const MemoryModel: Model<Memory> = model<Memory>('Memory', memorySchema);

export { MemoryModel, memorySchema };
