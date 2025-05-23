import mongoose from 'mongoose';

export const dbConnection = async () => {

  try {
    await mongoose.disconnect();
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected successfully');
  } catch (error) {
    console.log(error, "Error connecting to");
    process.exit(1); 
    // Exit process with failure
  }
};