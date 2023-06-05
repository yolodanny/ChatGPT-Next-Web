//@ts-ignore
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../services/mongo";
import { VerifyCode } from "../../models/verify-code";

const ITEMS_PER_PAGE = 15;

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const searchPage = searchParams.get("page");
    const page = searchPage ? parseInt(searchPage) : 1;

    const total_count = await VerifyCode.countDocuments({});
    const codes = await VerifyCode.find({})
      .skip((page - 1) * ITEMS_PER_PAGE) // 跳过前面的页数
      .limit(ITEMS_PER_PAGE); // 限制每页的数据数量

    return NextResponse.json({
      total_count,
      total_pages: Math.floor(total_count / ITEMS_PER_PAGE),
      page,
      codes,
    });
  } catch (e) {
    return NextResponse.json({ error: "server error" });
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
