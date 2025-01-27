import mongoose from 'mongoose';


const memoriesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    memorie: {
      type: String,
      required: true,
    },
    visitedLocation: {
      type: [String], 
      default: [], 
    },
    isFavorite: {
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


export const Memories = mongoose.model("Memories", memoriesSchema);


















