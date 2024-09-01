import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  token: {type: String, required: false},
  accountId: { type: String, required: true },
  expires_in: { type: Number, required: true }
});

const User = mongoose.model('User', userSchema);

export default User;