import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  category: string;
  quantity: number;
  minCountLevel: number;
  status: 'Active' | 'Inactive' | 'Low Stock';
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    minCountLevel: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Low Stock'],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', ProductSchema);
