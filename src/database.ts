import mongoose from 'mongoose';

const mongoUri = 'mongodb+srv://mikhaileremin001:Dx12ee3YAB4SudqM@cluster0.xm5ul.mongodb.net/dbb?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri, {});
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;