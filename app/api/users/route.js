import { NextResponse } from 'next/server'
import { getUsers, getUserById } from '../../../lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (userId) {
      
      const user = await getUserById(userId)

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

    
      const { password: _, ...userWithoutPassword } = user
      return NextResponse.json({ user: userWithoutPassword })
    }

    
    const users = await getUsers()

    
    const usersWithoutPasswords = users.map(({ password, ...user }) => user)

    return NextResponse.json({ users: usersWithoutPasswords })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
