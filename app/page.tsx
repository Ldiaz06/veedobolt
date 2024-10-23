import Link from 'next/link';
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Bienvenido a <span className="text-blue-600">Perfiles Personalizables</span>
        </h1>
        <p className="mt-3 text-2xl">
          Crea tu perfil único y compártelo con el mundo
        </p>
        <div className="flex mt-6">
          <Link href="/registro">
            <Button className="mr-4">Registrarse</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline">Iniciar Sesión</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}