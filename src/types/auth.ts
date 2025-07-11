export interface Profile {
  id: string;
  user_id: string;
  display_name?: string;
  email?: string;
  language: 'es' | 'en' | 'ca';
  email_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: any;
  session: any;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}