'use client'
import { SignIn, SignOutButton } from '@clerk/nextjs'
import { useState } from 'react'

export default function HomePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const createTestUser = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/users', { method: 'GET' })
      const data = await res.json()
      setUser(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-8">
      {/* <button
        onClick={createTestUser}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? 'Creating…' : 'Create Test User'}
      </button> */}

      <div className='text-center text-bold text-3xl  '>
        posts app testing...
      </div>
    </main>
  )
}
