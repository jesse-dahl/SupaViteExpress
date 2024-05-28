import React from "react"
import { supabaseClient } from "@supavitebridgeexpress-drizzle/supabase-client";
import { type User, type Session, type AuthTokenResponsePassword, AuthError, AuthResponse } from "@supabase/supabase-js";

type ContextProps = {
	user: User | null;
	session: Session | null;
  isAuthed: boolean;
  signup: (email: string, password: string) => Promise<AuthResponse>;
  login: (email: string, password: string) => Promise<AuthTokenResponsePassword>;
  logout: () => Promise<{error: AuthError | null}>
};

const AuthContext = React.createContext<ContextProps>({} as ContextProps)

export const useAuth = () => React.useContext(AuthContext);

const signup = async (email: string, password: string) => await supabaseClient.auth.signUp({ email, password })
const login = async (email: string, password: string) => await supabaseClient.auth.signInWithPassword({ email, password });
const logout = async () => await supabaseClient.auth.signOut()

interface AuthProviderProps {
  children: React.ReactNode
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [session,setSession] = React.useState<Session | null>(null)
  const [isAuthed, setIsAuthed] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    // Once the user refreshes the page after logging in, it will ask the user to log in again. 
    // When the page reloads, the context gets reset, and the user state is not retained. 
    // The next 9 lines fix this issue without having to save the user or session in localStorage or a cookie
    setLoading(true);
    const getUser = async () => {
      const { data } = await supabaseClient.auth.getUser();
      const { user: currentUser } = data;
      setUser(currentUser ?? null);
      setIsAuthed(currentUser ? true : false)
      setLoading(false);
    };
    getUser();

    const { data } = supabaseClient.auth.onAuthStateChange((event, session: Session | null) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null)
        setIsAuthed(false)
      }
      if (event === 'SIGNED_IN') {
        setSession(session)
        setUser(session?.user ?? null)
        setIsAuthed(true)
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, isAuthed, signup, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };