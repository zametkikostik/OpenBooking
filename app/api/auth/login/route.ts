import { NextRequest, NextResponse } from 'next/server';

// Mock users for development
const mockUsers = [
  { email: 'admin@openbooking.com', password: 'Admin123!', role: 'admin', fullName: 'Admin User' },
  { email: 'host@openbooking.com', password: 'Host123!', role: 'host', fullName: 'Host User' },
  { email: 'client@openbooking.com', password: 'Client123!', role: 'client', fullName: 'Client User' },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email и пароль обязательны' },
        { status: 400 }
      );
    }

    // Find user
    const user = mockUsers.find(u => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json(
        { message: 'Неверный email или пароль' },
        { status: 401 }
      );
    }

    // In production, create JWT session with Supabase Auth
    const response = NextResponse.json({
      success: true,
      user: {
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });

    // Set mock session cookie
    response.cookies.set('user_session', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}
