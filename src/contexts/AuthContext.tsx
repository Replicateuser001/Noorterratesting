import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '../lib/supabase'

interface User {
  username: string
  displayName: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, email: string, displayName: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          username: session.user.user_metadata.username,
          displayName: session.user.user_metadata.display_name,
          email: session.user.email || ''
        })
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          username: session.user.user_metadata.username,
          displayName: session.user.user_metadata.display_name,
          email: session.user.email || ''
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      // Find user by username to get their email
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('username', username)
        .single()

      if (userError || !userData) {
        console.error('User not found:', userError)
        return false
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password,
      })

      if (error) throw error
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const register = async (username: string, email: string, displayName: string, password: string) => {
    try {
      // First check if username already exists
      const { data: existingUser } = await supabase
        .from('user_profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        console.error('Username already exists');
        return false;
      }

      // Create auth user
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            display_name: displayName
          }
        }
      });

      if (signUpError || !user) {
        console.error('Sign up error:', signUpError);
        return false;
      }

      // Wait a bit to ensure auth user is created
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: user.id,
            username,
            email,
            display_name: displayName
          }
        ]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Try to delete the auth user if profile creation fails
        await supabase.auth.admin.deleteUser(user.id);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        register, 
        logout, 
        isAuthenticated: !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}