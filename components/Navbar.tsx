"use client"

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { useEffect, useState } from 'react';
import { useToast } from "@/components/ui/use-toast"

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const response = await fetch('/api/auth/check');
      setIsLoggedIn(response.ok);
    };
    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        setIsLoggedIn(false);
        toast({
          title: "Sesión cerrada",
          description: "Has cerrado sesión exitosamente.",
        });
        router.push('/');
      } else {
        throw new Error('Failed to logout');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <span className="text-xl font-bold">Perfiles Personalizables</span>
        </Link>
        <div>
          {isLoggedIn ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" className="mr-2">Dashboard</Button>
              </Link>
              <Button onClick={handleLogout}>Cerrar Sesión</Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="mr-2">Iniciar Sesión</Button>
              </Link>
              <Link href="/registro">
                <Button>Registrarse</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}