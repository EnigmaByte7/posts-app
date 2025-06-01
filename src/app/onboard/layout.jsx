import { Spinner } from '@chakra-ui/react'
import prisma from "../../../lib/prisma";
import {currentUser, auth} from '@clerk/nextjs/server'
import { redirect } from "next/navigation";

export default async function RootLayout({children}) {
    const {userId} = await auth();
    if(!userId) redirect('/signup')
    else{
        const user = await currentUser();
        console.log(user);
        
        const res = await prisma.user.findUnique({
            where:{
                id: userId
            }
        })

        if(!res){
            const neww = await prisma.user.create({
                data:{
                    name: user.firstName + " " + user.lastName,
                    email: user.emailAddresses[0].emailAddress,
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
    
  return (
    <>
    {children}    
    </>
  )
}
