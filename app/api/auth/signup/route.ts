import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json();

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { message: 'Все поля обязательны' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Пароль должен быть не менее 8 символов' },
        { status: 400 }
      );
    }

    // In production, create user with Supabase Auth
    // For now, return success
    const response = NextResponse.json({
      success: true,
      message: 'Аккаунт создан. Теперь войдите.',
      user: {
        email,
        fullName,
        role: 'client' as const,
      },
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}
