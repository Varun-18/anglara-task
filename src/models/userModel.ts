import mongoose, { Schema } from 'mongoose';

import { UserInterface } from 'types';

const userSchema: Schema<UserInterface> = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin'],
    required: true,
    default: 'user',
  },
  isVerified: { type: Boolean, default: false },
});

export const User = mongoose.model<UserInterface>('User', userSchema);
