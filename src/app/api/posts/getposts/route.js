import { NextResponse, NextRequest } from "next/server";
import prisma from "../../../../../lib/prisma"
import {auth} from '@clerk/nextjs/server'

export async function GET(request){
    const {userId} =await  auth()
    console.log('userid', userId);
    
    try{
        const data = await prisma.post.findMany({
            include:{
                author:true,
                reaction: true,
            }
        });

        const newdata = data.map(post => {
            const reaction = post.reaction.find(t=> t.userId === userId)
            console.log(reaction);
            
            return {
                ...post,
                myreaction: reaction ? reaction.reaction : null
            }
        })
        console.log(newdata);
        return NextResponse.json(newdata);
    }
    catch(e){
        console.log('error', e);
        return NextResponse.json({'error': 'bad server'})
    }
}