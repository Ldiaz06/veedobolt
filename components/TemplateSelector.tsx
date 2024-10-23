"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import Professional from './templates/Professional';
import Creative from './templates/Creative';
import Minimalist from './templates/Minimalist';

const templates = [
  { id: 1, name: 'Profesional', component: Professional },
  { id: 2, name: 'Creativo', component: Creative },
  { id: 3, name: 'Minimalista', component: Minimalist },
];

export default function TemplateSelector({ onSelect, initialTemplateId, userData }) {
  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplateId);
  const [customization, setCustomization] = useState({
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    fontFamily: 'Arial',
  });

  const handleSelect = async (template) => {
    try {
      const response = await fetch('/api/profile/update-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: template.id, customization }),
      });

      if (response.ok) {
        setSelectedTemplate(template.id);
        onSelect(template, customization);
        toast({
          title: "Plantilla actualizada",
          description: `Has seleccionado la plantilla ${template.name}.`,
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

  const handleCustomizationChange = (e) => {
    setCustomization({ ...customization, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => {
          const TemplateComponent = template.component;
          return (
            <Card key={template.id} className={selectedTemplate === template.id ? 'border-blue-500' : ''}>
              <CardHeader>
                <CardTitle>{template.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60 overflow-hidden">
                  <TemplateComponent
                    name={userData.name}
                    bio={userData.bio}
                    links={userData.links}
                    customization={customization}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleSelect(template)}>
                  {selectedTemplate === template.id ? 'Seleccionado' : 'Seleccionar'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Personalización</CardTitle>
          <CardDescription>Ajusta los colores y la fuente de tu plantilla</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="primaryColor">Color primario</Label>
            <Input
              id="primaryColor"
              name="primaryColor"
              type="color"
              value={customization.primaryColor}
              onChange={handleCustomizationChange}
            />
          </div>
          <div>
            <Label htmlFor="secondaryColor">Color secundario</Label>
            <Input
              id="secondaryColor"
              name="secondaryColor"
              type="color"
              value={customization.secondaryColor}
              onChange={handleCustomizationChange}
            />
          </div>
          <div>
            <Label htmlFor="fontFamily">Fuente</Label>
            <select
              id="fontFamily"
              name="fontFamily"
              value={customization.fontFamily}
              onChange={handleCustomizationChange}
              className="w-full p-2 border rounded"
            >
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier">Courier</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}