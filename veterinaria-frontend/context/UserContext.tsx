'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Usuario = {
  nombre: string;
  correo: string;
};

type UserContextType = {
  usuario: Usuario | null;
  setUsuario: (user: Usuario | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  return (
    <UserContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser debe usarse dentro de <UserProvider>');
  return context;
}