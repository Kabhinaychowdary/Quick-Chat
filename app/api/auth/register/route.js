import { NextResponse } from 'next/server'
import { getUserByEmail, createUser } from '../../../../lib/db'

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

  
    const existingUser = await getUserByEmail(email.toLowerCase())

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    
    const newUser = {
      id: `user_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password,
      avatar: null,
      status: 'online',
      friends: [],
      createdAt: new Date().toISOString(),
      lastSeen: new Date().toISOString()
    }

    const createdUser = await createUser(newUser)

    
    const { password: _, ...userWithoutPassword } = createdUser

    return NextResponse.json({
      message: 'Registration successful',
      user: userWithoutPassword
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
