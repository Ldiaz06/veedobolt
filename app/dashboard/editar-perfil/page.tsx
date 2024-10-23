"use client"

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useRouter } from 'next/navigation';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  bio: z.string().max(500, {
    message: "La biografía no puede exceder los 500 caracteres.",
  }),
  profileUrl: z.string().min(3, {
    message: "La URL del perfil debe tener al menos 3 caracteres.",
  }),
  links: z.array(z.object({
    name: z.string().min(1, "El nombre del enlace es requerido"),
    url: z.string().url("Debe ser una URL válida"),
  })),
});

function SortableLink({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

export default function EditarPerfil() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bio: "",
      profileUrl: "",
      links: [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "links",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/profile/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          form.reset({
            name: data.user.name || "",
            bio: data.user.bio || "",
            profileUrl: data.user.profileUrl || "",
            links: data.user.links || [],
          });
        } else {
          setError('Failed to fetch user profile');
        }
      } catch (err) {
        setError('An error occurred while fetching the profile');
      }
    };

    fetchUserProfile();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch(`/api/profile/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError('Ocurrió un error al actualizar el perfil. Por favor, intenta de nuevo.');
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((item) => item.id === active.id);
      const newIndex = fields.findIndex((item) => item.id === over.id);
      move(oldIndex, newIndex);
    }
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Editar Perfil</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Biografía</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormDescription>
                  Escribe una breve descripción sobre ti (máximo 500 caracteres).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="profileUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL del Perfil</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Esta será la URL única de tu perfil público.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <h3 className="text-lg font-semibold mb-2">Enlaces</h3>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={fields.map(field => field.id)}
                strategy={verticalListSortingStrategy}
              >
                {fields.map((field, index) => (
                  <SortableLink key={field.id} id={field.id}>
                    <div className="flex items-center space-x-2 mb-2">
                      <Input
                        {...form.register(`links.${index}.name`)}
                        placeholder="Nombre del enlace"
                      />
                      <Input
                        {...form.register(`links.${index}.url`)}
                        placeholder="URL"
                      />
                      <Button type="button" variant="destructive" onClick={() => remove(index)}>
                        Eliminar
                      </Button>
                    </div>
                  </SortableLink>
                ))}
              </SortableContext>
            </DndContext>
            <Button
              type="button"
              onClick={() => append({ name: '', url: '' })}
              className="mt-2"
            >
              Agregar Enlace
            </Button>
          </div>
          <Button type="submit">Guardar Cambios</Button>
        </form>
      </Form>
    </div>
  );
}