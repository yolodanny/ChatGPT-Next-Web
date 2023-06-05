import mongoose from "mongoose";
const { Schema, model, models } =  mongoose;
import { v4 as uuidv4 } from "uuid";


async function main() {
  await connectToDatabase()

  const VerifyCodeSchema = new Schema({
    code: {
      type: String,
      required: true,
      unique: true, // 唯一
    },
    createdAt: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
    source: {
      type: String,
      // required: true,
      default: "",
    },
    isUsed: {
      type: Boolean,
      required: false,
      default: false,
    },
    usedAt: {
      type: Date,
      // required: true,
      default: null,
    },
    validTo: {
      type: Date,
      default: null
    },
    remarks: {
      type: String,
      // required: true,
      default: "",
    },
  });

  const VerifyCode = model("verifyCode", VerifyCodeSchema)

  const codeList = [];
  const count = 100;
  const source = "qcfit";

  await connectToDatabase();

  for (let i = 0; i < count; i++) {
    codeList.push({
      code: uuidv4(), // 必须是唯一的字符串
      createdAt: new Date(), // 创建时间，默认为当前时间
      source, // 字符串，这里可以填入任何你需要的信息
      isUsed: false, // 布尔值，表示这个验证码是否已经被使用，默认为 false
      usedAt: null, // 日期，表示这个验证码被使用的时间，默认为 null
      validTo: null, // 有效期至
      remarks: "", // 字符串，这里可以填入任何你需要的信息
    });
  }

  try {
    await VerifyCode.insertMany(codeList);
    console.log('success')
  } catch (e) {
    console.log('error', e)
  }

}

async function connectToDatabase() {
  // if (global.mongodb) {
  //   return;
  // }

  try {
    mongoose.set("strictQuery", true);

    const mongoUrl = ''
    await mongoose.connect(mongoUrl, {
      bufferCommands: true,
      dbName: 'chat',
      maxPoolSize: 5,
      minPoolSize: 1,
      maxConnecting: 5,
    });
    console.log("mongo connected");
  } catch (error) {
    console.log("error->", error);
    console.log("error->", "mongo connect error");
  }
}

main()