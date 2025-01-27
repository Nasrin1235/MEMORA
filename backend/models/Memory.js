import mongoose from 'mongoose';


const memorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    memory: {
      type: String,
      required: true,
    },
    visitedLocation: {
      type: [String], 
      default: [], 
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
    },
    createdOn: {
      type: Date,
      default: Date.now,
    },
    imageUrl: {
      type: String,
      required: false, 
    },
    visitedDate: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true, 
  }
);


export const Memory = mongoose.model("Memory", memorySchema);









