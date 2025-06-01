import prisma from "../prisma";
import {currentUser, auth} from '@clerk/nextjs/server'
import { redirect } from "next/navigation";

export default async function onboard() {
    const {userId} = await auth();
    if(!userId) redirect('/signup')
    else{
        const user = await currentUser();
        const res = await prisma.users.findUnique({
            where:{
                id: userId
            }
        })

        if(!res){
            const neww = await prisma.users.create({
                data:{
                    name: user.firstName + " " + user.lastName,
                    email: user.emailAddresses,
                    id: userId   
                }
            })

            console.log(neww)
            redirect('/posts')
        }

        else{
            redirect('/posts')
        }
    }
}