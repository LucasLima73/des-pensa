import React, { createContext, useContext, useState, ReactNode } from "react";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

type User = {
  email: string;
  name: String;
  // Adicione outros campos do usuário, se necessário
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth();

  const login = async (email: string, password: string) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const { user } = response;
      if (user) {
        const displayName = user.displayName || ""; 
        console.log(displayName);
        setUser({ email: user.email || "", name: displayName });
      }
    } catch (error) {
      throw new Error("Erro ao fazer login");
    }
  };
  

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      throw new Error("Erro ao fazer logout");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
