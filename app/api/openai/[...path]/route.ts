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

  const accessCode = getAccessCode(req);

  const fetchOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: accessCode,
    }),
    cache: "no-store",
  };

  const res = await fetch(`${process.env.HOST_URL}/api/verify`, fetchOptions);
  const resJson = await res.json();
  console.log(resJson);

  if (!resJson.valid) {
    return NextResponse.json(
      { error: resJson.error },
      {
        status: 401,
      },
    );
  }

  // const authResult = auth(req);
  // if (authResult.error) {
  //   return NextResponse.json(authResult, {
  //     status: 401,
  //   });
  // }

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
