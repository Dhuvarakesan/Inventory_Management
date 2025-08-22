import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  userid: string;
  username: string;
  action: string;
  description: string;
  productId?: string;
  productName?: string;
  previousStock: number;
  newStock: number;
  reason?: string;
  timestamp: Date;
}

const TransactionSchema: Schema = new Schema({
  userid: { type: String, required: true },
  username: { type: String, required: true },
  action: { type: String, required: true },
  description: { type: String, required: true },
  productId: { type: String },
  productName: { type: String },
  previousStock: { type: Number, required: true },
  newStock: { type: Number, required: true },
  reason: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
