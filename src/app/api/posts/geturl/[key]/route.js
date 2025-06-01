import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../../../../../../lib/aws/s3";


export async function GET(request, {params}) {
  const {key} = await params
  const command = new GetObjectCommand({ Bucket: process.env.AWS_S3_BUCKET, Key: key });
  const src = await getSignedUrl(s3, command, { expiresIn: 3600 });
  console.log('src ', src);
  
  return NextResponse.json({ src });
}