
#!/usr/bin/env node

// Environment Variables Checker for SportX Platform
const requiredVars = [
  'DATABASE_URL',
  'VITE_SUPABASE_URL', 
  'VITE_SUPABASE_ANON_KEY'
];

const optionalVars = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'SESSION_SECRET',
  'JWT_SECRET',
  'NODE_ENV',
  'PORT',
  'HOST'
];

console.log('🔍 Checking Environment Variables...\n');

let hasErrors = false;

// Check required variables
console.log('📋 Required Variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: Set`);
  } else {
    console.log(`❌ ${varName}: Missing`);
    hasErrors = true;
  }
});

console.log('\n📋 Optional Variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: Set`);
  } else {
    console.log(`⚠️  ${varName}: Not set (using default)`);
  }
});

if (hasErrors) {
  console.log('\n❌ Some required environment variables are missing!');
  console.log('Please set them in Replit Secrets or your .env file');
  process.exit(1);
} else {
  console.log('\n✅ All required environment variables are set!');
}

// Display current configuration
console.log('\n📊 Current Configuration:');
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Port: ${process.env.PORT || '5000'}`);
console.log(`Host: ${process.env.HOST || '0.0.0.0'}`);
