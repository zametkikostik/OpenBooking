import { createServerClient } from './server';

export async function getSession() {
  try {
    const supabase = createServerClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error('Error getting session:', error);
      return null;
    }

    return session;
  } catch (error) {
    console.error('Exception getting session:', error);
    return null;
  }
}

export async function getUser() {
  try {
    const supabase = createServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error('Error getting user:', error);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Exception getting user:', error);
    return null;
  }
}

export async function getProfile() {
  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error getting profile:', error);
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Exception getting profile:', error);
    return null;
  }
}

export async function getUserRole() {
  const profile = await getProfile();
  return profile?.role ?? null;
}
