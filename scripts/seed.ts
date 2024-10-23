import { createUser, createPlan, savePlans, saveUsers } from '../lib/db';
import { hashPassword } from '../lib/auth';

async function seed() {
  // Create plans
  const freePlan = createPlan({
    name: 'Free',
    price: 0,
    features: ['1 plantilla básica', 'Hasta 5 enlaces'],
  });

  const proPlan = createPlan({
    name: 'Pro',
    price: 9.99,
    features: ['Todas las plantillas', 'Enlaces ilimitados', 'Analíticas básicas'],
  });

  savePlans([freePlan, proPlan]);

  // Create users
  const password = await hashPassword('password123');

  const user1 = createUser({
    username: 'usuario1',
    email: 'usuario1@example.com',
    password,
    profileUrl: 'usuario1',
    bio: 'Soy el usuario de prueba 1',
    links: [
      { name: 'GitHub', url: 'https://github.com/usuario1' },
      { name: 'LinkedIn', url: 'https://linkedin.com/in/usuario1' },
    ],
    templateId: 1,
    subscriptionPlan: freePlan.id,
  });

  const user2 = createUser({
    username: 'usuario2',
    email: 'usuario2@example.com',
    password,
    profileUrl: 'usuario2',
    bio: 'Soy el usuario de prueba 2',
    links: [
      { name: 'Twitter', url: 'https://twitter.com/usuario2' },
      { name: 'Portfolio', url: 'https://usuario2.com' },
    ],
    templateId: 2,
    subscriptionPlan: proPlan.id,
  });

  saveUsers([user1, user2]);

  console.log('Datos de prueba creados exitosamente');
}

seed().catch(console.error);