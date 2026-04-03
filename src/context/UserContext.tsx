import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface User {
  id: number;
  username: string | null;
  email: string;
  name: string | null;
  picture: string | null;
  avatar: number;
  theme: number;
  homeLocation: string | null;
  isAdmin: boolean;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        console.log('[UserContext] /api/auth/me response:', data)
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(() => { })
      .finally(() => { setIsLoading(false) });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );


}
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("contextError!")
  }
  return ctx;
}