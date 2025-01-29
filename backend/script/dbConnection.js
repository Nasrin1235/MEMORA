import mongoose from 'mongoose';

export const dbConnection = async () => {
  console.log('MONGODB_URI:', process.env.MONGODB_URI); 
  try {
    await mongoose.disconnect();
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed', error);
    process.exit(1); // Exit process with failure
  }
};