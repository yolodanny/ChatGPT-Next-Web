import mongoose from "mongoose";

/**
 * 连接 MongoDB 数据库
 */
export async function connectToDatabase(): Promise<void> {
  if (global.mongodb) {
    return;
  }

  global.mongodb = "connecting";
  try {
    mongoose.set("strictQuery", true);

    global.mongodb = await mongoose.connect(process.env.MONGODB_URI as string, {
      bufferCommands: true,
      dbName: process.env.MONGODB_NAME,
      maxPoolSize: 5,
      minPoolSize: 1,
      maxConnecting: 5,
    });
    console.log("mongo connected");
  } catch (error) {
    console.log("error->", error);
    console.log("error->", "mongo connect error");
    global.mongodb = null;
  }
}

export * from "../models/verify-code";
