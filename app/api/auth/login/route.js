import { NextResponse } from 'next/server'
import { getUserByEmail } from '../../../../lib/db'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    
    const user = await getUserByEmail(email.toLowerCase())

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
