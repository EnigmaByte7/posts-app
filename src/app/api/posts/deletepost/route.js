import prisma from "../../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(NextRequest){
    const {corelation_id} = await NextRequest.json()
    const res = await prisma.post.delete({
        where:{
            corelation_id: corelation_id
        }
    })

    console.log(res)
    return NextResponse.json('ok')
}