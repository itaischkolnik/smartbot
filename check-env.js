console.log('Checking environment variables...');

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
];

for (const varName of requiredVars) {
  const value = process.env[varName];
  console.log(`${varName}: ${value ? '✓ Set' : '✗ Missing'}`);
  if (value && varName.includes('KEY')) {
    console.log(`  Length: ${value.length} characters`);
  }
} 