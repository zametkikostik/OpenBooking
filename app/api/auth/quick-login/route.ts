import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Mock authentication
    const mockUsers = [
      { email: 'admin@openbooking.com', password: 'Admin123!', role: 'admin', fullName: 'Admin User' },
      { email: 'host@openbooking.com', password: 'Host123!', role: 'host', fullName: 'Host User' },
      { email: 'client@openbooking.com', password: 'Client123!', role: 'client', fullName: 'Client User' },
    ];

    const user = mockUsers.find(u => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.redirect(new URL('/auth/login?error=invalid', request.url));
    }

    const response = NextResponse.redirect(new URL('/dashboard/admin', request.url));

    // Set session cookie
    response.cookies.set('user_session', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Quick login error:', error);
    return NextResponse.redirect(new URL('/auth/login?error=server', request.url));
  }
}
