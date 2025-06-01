import { SignIn } from '@clerk/nextjs'
import React from 'react'

export default function signin() {
  return (    
  <div className='flex flex-col items-center justify-center h-screen'>
        <SignIn />
  </div>
  )
}
