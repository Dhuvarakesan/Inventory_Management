import bcrypt from 'bcryptjs';
import { Document, model, Schema, Types } from 'mongoose';

// 1. Define the interface for the User document
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(enteredPassword: string): Promise<boolean>;
  safeData: IUserSafeData; // Virtual property for returning user data without password
}

// 2. Interface for the safe data we return (excluding password)
interface IUserSafeData {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// 3. Define the User schema with Mongoose
const userSchema: Schema<IUser> = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters long'],
    maxlength: [50, 'Name must not exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    index: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// 4. Pre-save hook to hash password before saving
userSchema.pre<IUser>('save', async function(next) {
  const user = this;

  // Only hash the password if it's new or being modified
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// 5. Instance method to compare entered password with hashed password
userSchema.methods.comparePassword = async function(this: IUser, enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 6. Virtual property to return user data without password
userSchema.virtual('safeData').get(function(this: IUser): IUserSafeData {
  return {
    _id: (this._id as Types.ObjectId).toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    isActive: this.isActive,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
});

// 7. Create and export the User model
const User = model<IUser>('User', userSchema);
export default User;
