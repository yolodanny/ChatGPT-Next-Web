//@ts-ignore
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../services/mongo";
import { VerifyCode } from "../../models/verify-code";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  await connectToDatabase();
  console.log("VerifyCode is", VerifyCode);
  try {
    console.log("code is", code);
    const matchedCode = await VerifyCode.findOne({ code }).exec();
    console.log("matchedCode is", matchedCode);
    if (matchedCode) {
      return NextResponse.json({
        valid: true,
        code: matchedCode.length,
      });
    }

    return NextResponse.json({ valid: false, error: "code error" });
  } catch (e) {
    console.log("[error is] ", e);
    return NextResponse.json({ valid: false, error: "server error" });
  }
}

export async function POST(request: Request) {
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
      remarks: "", // 字符串，这里可以填入任何你需要的信息
    });
  }

  try {
    await VerifyCode.insertMany(codeList);
    return NextResponse.json({ error: false, insertCount: codeList.length });
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}
