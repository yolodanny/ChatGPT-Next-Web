//@ts-ignore
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../services/mongo";
import { VerifyCode } from "../../models/verify-code";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  await connectToDatabase();
  try {
    const matchedCode = await VerifyCode.findOne({ code }).exec();

    console.log("matched code is", matchedCode);
    if (matchedCode) {
      return NextResponse.json({
        valid: true,
        code: matchedCode.code,
      });
    }

    return NextResponse.json({ valid: false, error: "code error" });
  } catch (e) {
    console.log("[error is] ", e);
    return NextResponse.json({ valid: false, error: "server error" });
  }
}

export async function POST(request: Request) {
  const { code } = await request.json();
  await connectToDatabase();
  try {
    const matchedCode = await VerifyCode.findOne({ code }).exec();

    if (matchedCode) {
      if (!matchedCode.remarks) {
        return NextResponse.json({
          valid: false,
          error: "该激活码未分配",
        });
      }

      if (!matchedCode.isUsed) {
        matchedCode.isUsed = true;
        matchedCode.usedAt = new Date();
        const validTo = new Date();
        validTo.setDate(validTo.getDate() + 31);
        matchedCode.validTo = validTo;
        await matchedCode.save();
      }

      return NextResponse.json({
        valid: true,
        code: matchedCode.code,
      });
    }

    return NextResponse.json({ valid: false, error: "激活码错误" });
  } catch (e) {
    console.log("[error is] ", e);
    return NextResponse.json({ valid: false, error: "服务异常,请重试" });
  }
}

export async function PUT(request: Request) {
  try {
    const { code, remarks } = await request.json();
    await connectToDatabase();
    // await VerifyCode.insertMany(codeList);
    const matchedCode = await VerifyCode.findOne({ code }).exec();

    if (matchedCode) {
      if (matchedCode.remarks) {
        return NextResponse.json({ msg: "无法重复分配" }, { status: 500 });
      }
      matchedCode.remarks = remarks;
      await matchedCode.save();

      return NextResponse.json({ msg: "操作成功" }, { status: 200 });
    }

    return NextResponse.json(
      { msg: "操作失败,没找到对应的激活码" },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json({ msg: "操作失败" }, { status: 500 });
  }
}
