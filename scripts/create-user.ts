import dotenv from 'dotenv';
import path from 'path';
import readline from 'readline';
import { customAuthModuleController } from '../src/features/Auth/CustomAuthModule';

// Load .env from the root directory relative to the script
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query: string) => new Promise<string>((resolve) => rl.question(query, resolve));

async function main() {
  console.log('--- Stackd User Creator (Real Infra) ---');
  
  // Debug check (hidden values)
  const url = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  
  console.log('Environment Check:');
  console.log(' - URL loaded:', url ? '✅' : '❌');
  console.log(' - Service Role Key loaded:', key ? '✅' : '❌');
  console.log('---------------------------------------');
  
  const username = await question('Username: ');
  const password = await question('Password: ');

  if (!username || !password) {
    console.error('Error: Username and password are required.');
    process.exit(1);
  }

  try {
    const result = await customAuthModuleController.createUser(username, password);
    console.log('User created successfully via UseCase!');
    console.log('User Details:', result);
  } catch (error: any) {
    console.error('Error creating user:', error.message);
  } finally {
    rl.close();
  }
}

main().catch(console.error);
