import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables.");
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(`${process.env.MONGODB_URI}/quickcart`, opts).then((mongoose) => {
      console.log("MongoDB connected successfully!");
      return mongoose;
    }).catch((err) => {
      console.error("MongoDB connection error:", err);

      throw err; // Ensure the error is properly propagated
    });
  }


  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
