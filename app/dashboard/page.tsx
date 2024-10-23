"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import TemplateSelector from '@/components/TemplateSelector';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/profile/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          throw new Error('Failed to fetch user profile');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast({
          title: "Error",
          description: "No se pudo cargar el perfil del usuario. Por favor, inicia sesión de nuevo.",
          variant: "destructive",
        });
        router.push('/login');
      }
    };

    fetchUserProfile();
  }, []);

  const handleTemplateSelect = async (template) => {
    try {
      const response = await fetch(`/api/profile/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: template.id }),
      });
      if (response.ok) {
        toast({
          title: "Plantilla actualizada",
          description: "La plantilla de tu perfil ha sido actualizada exitosamente.",
        });
      } else {
        throw new Error('Failed to update template');
      }
    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la plantilla. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Panel de Control</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tu Perfil</CardTitle>
            <CardDescription>Gestiona tu información personal y URL única</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-2">Nombre: {user.username}</p>
            <p className="mb-4">URL del perfil: /{user.profileUrl}</p>
            <Link href="/dashboard/editar-perfil">
              <Button>Editar Perfil</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Plantillas</CardTitle>
            <CardDescription>Personaliza la apariencia de tu perfil</CardDescription>
          </CardHeader>
          <CardContent>
            <TemplateSelector onSelect={handleTemplateSelect} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Código QR</CardTitle>
            <CardDescription>Genera un código QR para compartir tu perfil</CardDescription>
          </CardHeader>
          <CardContent>
            <QRCodeGenerator profileUrl={user.profileUrl} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Suscripción</CardTitle>
            <CardDescription>Gestiona tu plan de suscripción</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/suscripcion">
              <Button>Ver Planes</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}