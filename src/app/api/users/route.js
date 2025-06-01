import { NextResponse, NextRequest } from "next/server"
import prisma from "../../../../lib/prisma"

// export async function GET() {
//     console.log(Date.now().toLocaleString) 
//     console.log('GET request received') 
//   const user = await prisma.user.create({
//     data: {
//       name:  'John Doe',
//       email: 'john.doe@example.com'
//     }
//   })
//   return Response.json(user)
// }

export async function GET(){
  const data = prisma.post.findMany()
  console.log('POST request received', data)
  return Next.status(200).send({data: data});
}