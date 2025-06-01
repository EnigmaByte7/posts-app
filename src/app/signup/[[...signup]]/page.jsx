import { SignUp } from '@clerk/nextjs'
import React from 'react'

export default function signup() {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <SignUp fallbackRedirectUrl='/onboard'/>
    </div>
  )
}
