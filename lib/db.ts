import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_PATH = path.join(process.cwd(), 'data', 'users.json');
const PLANS_PATH = path.join(process.cwd(), 'data', 'plans.json');

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  profileUrl: string;
  bio?: string;
  links?: { name: string; url: string }[];
  templateId?: number;
  subscriptionPlan: string;
  subscriptionEndDate?: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

function ensureFileExists(filePath: string, defaultContent: string = '[]') {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, defaultContent);
  } else {
    const content = fs.readFileSync(filePath, 'utf-8');
    if (content.trim() === '') {
      fs.writeFileSync(filePath, defaultContent);
    }
  }
}

export function getAllUsers(): User[] {
  ensureFileExists(DB_PATH);
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

export function findUserByEmail(email: string): User | undefined {
  const users = getAllUsers();
  return users.find(user => user.email === email);
}

export function findUserByUsername(username: string): User | undefined {
  const users = getAllUsers();
  return users.find(user => user.username.toLowerCase() === username.toLowerCase());
}

export function createUser(userData: Omit<User, 'id'>): User {
  const users = getAllUsers();
  const newUser = { ...userData, id: Date.now().toString() };
  users.push(newUser);
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
  return newUser;
}

export function updateUser(userId: string, updates: Partial<User>): User | null {
  const users = getAllUsers();
  const userIndex = users.findIndex(user => user.id === userId);
  if (userIndex === -1) return null;
  
  users[userIndex] = { ...users[userIndex], ...updates };
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
  return users[userIndex];
}

export function getPlans(): Plan[] {
  ensureFileExists(PLANS_PATH);
  const data = fs.readFileSync(PLANS_PATH, 'utf-8');
  return JSON.parse(data);
}

export function createPlan(planData: Omit<Plan, 'id'>): Plan {
  const plans = getPlans();
  const newPlan = { ...planData, id: Date.now().toString() };
  plans.push(newPlan);
  fs.writeFileSync(PLANS_PATH, JSON.stringify(plans, null, 2));
  return newPlan;
}

export function savePlans(plans: Plan[]): void {
  fs.writeFileSync(PLANS_PATH, JSON.stringify(plans, null, 2));
}

export function saveUsers(users: User[]): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}

export function updateUserSubscription(userId: string, planId: string, endDate: string): User | null {
  return updateUser(userId, { subscriptionPlan: planId, subscriptionEndDate: endDate });
}