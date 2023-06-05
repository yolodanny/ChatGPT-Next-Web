import { Schema, model, models } from "mongoose";

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
    default: null,
  },
  remarks: {
    type: String,
    // required: true,
    default: "",
  },
});

export const VerifyCode =
  models["verifyCode"] || model("verifyCode", VerifyCodeSchema);
