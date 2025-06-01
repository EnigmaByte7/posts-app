import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import prisma from '../lib/prisma'
import { clerkClient} from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/posts(.*)', ])
const isSignUpRoute = createRouteMatcher(['/signup'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect()
  // else if(isSignUpRoute(req)){
  //   const {userId } =await auth();
  //   console.log(userId)
  //   const client = await clerkClient()
  //   const user = await client.users.getUser(userId) //wrapper of clerkclient
  //   if(userId){
  //     const result = await prisma.user.findMany({
  //       where:{
  //         id: userId
  //       }
  //     })
  //     console.log(result);
      

  //     if(!result && user){
  //        const res = await prisma.user.create({
  //         data:{
  //           id: userId,
  //           name: user.firstName + " " + user.lastName,
  //           email: user.emailAddresses
  //         }
  //        })

  //        console.log(res)
  //     }
  //   }

  //   return NextResponse.next()
  // }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}