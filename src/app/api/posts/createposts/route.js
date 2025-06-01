import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma"
import {v2 as cloudinary} from 'cloudinary'
import { s3 } from "../../../../../lib/aws/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";


export async function POST(NextRequest){
    try{
        const data = await NextRequest.formData()
        const file = data.get('file')
        const title = data.get('title')
        const content = data.get('content')
        const userId = data.get('userId')
        const corelation_id = data.get('corelation_id')
        console.log('file', data)
        
        const buffer = (await file.arrayBuffer())
        const base64 = buffer.toString('base64')
        const dataUri = `data:${file.type};base64,${base64}`


        const Body = (await file.arrayBuffer())
        const command = new PutObjectCommand({
            Bucket:'sample-bucket',
            Body:Body,
            Key: `${file.name}`,
            ContentType: 'image/jpeg',
            ContentDisposition: 'inline',
        })

        const resp = await s3.send(command)
        //console.log(res);

        const uri = await fetch(`http://localhost:3000/api/posts/geturl/${file.name}`,{
            method:'GET'
        })
        const url = await uri.json()

        //not using cloudinary anymore...
        // cloudinary.config({ 
        //     cloud_name: 'dqcqijw3c', 
        //     api_key: process.env.CLOUDINARY_API_KEY, 
        //     api_secret: process.env.CLOUDINARY_API_SECRET,
        // });

        // const res = await cloudinary.uploader.upload(dataUri,
        //     {
        //         resource_type:'image',
        //         public_id:'test',
        //         overwrite:true
        //     }
        // )

        // const imgurl =res
        console.log(url);

        const body = {
            topic:'pending_posts',
            key:userId,
            message:{
                content,
                title,
                url, corelation_id,
                userId, createdAt: new Date().toISOString(),
            }
        }
        
        /* powst messaage config -> 
            topic, key: userId
            message : {
                content, title, imageurl, corelation_id
            }
        */
        const pushpost = await fetch('http://localhost:3000/api/kafka/produce',{
            method:'POST',
            body:JSON.stringify(body),
        })
        console.log(pushpost);
        

        return NextResponse.json({src: url})
    }
    catch(e){
        console.log('something bad happened : (',e)
        return NextResponse.json({'error' : 'bad server'})
    }
}






        //const media = "https://preview.redd.it/zdl24zlh2x2f1.jpeg?width=640&crop=smart&auto=webp&s=ed7569d97969214cd93bab634afa7d24e7c206c7"
        // const post = await prisma.post.create({
        //     data:{
        //         title,
        //         content, 
        //         authorId: userId,
        //         media : imgurl.secure_url,
        //         createdAt: new Date().toISOString()
        //     }
        // })