import { prettyObject } from "@/app/utils/format";
import { NextRequest, NextResponse } from "next/server";
import { auth, getAccessCode } from "../../auth";
import { requestOpenai } from "../../common";

import { connectToDatabase } from "../../../services/mongo";

async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  console.log("[OpenAI Route] params ", params);

  const fetchOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  };
  const accessCode = getAccessCode(req);

  console.log("accessCode accessCode", accessCode);
  const res = await fetch(
    `http://localhost:3000/api/verify?code=${accessCode}`,
    fetchOptions,
  );
  const resJson = await res.json();
  console.log(resJson);

  if (!resJson.valid) {
    return NextResponse.json(
      { error: "密码错误" },
      {
        status: 401,
      },
    );
  }

  const authResult = auth(req);
  if (authResult.error) {
    return NextResponse.json(authResult, {
      status: 401,
    });
  }

  try {
    return await requestOpenai(req);
  } catch (e) {
    console.error("[OpenAI] ", e);
    return NextResponse.json(prettyObject(e));
  }
}

export const GET = handle;
export const POST = handle;

export const runtime = "edge";
