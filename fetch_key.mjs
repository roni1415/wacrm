import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

let supabaseUrl = '';
let supabaseKey = '';

envContent.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    supabaseUrl = line.split('=')[1].trim();
  }
  if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
    supabaseKey = line.split('=')[1].trim();
  }
});

async function main() {
  const url = `${supabaseUrl}/rest/v1/licenses?select=*,customers!inner(*)&customers.status=eq.suspended&limit=1`;
  
  const response = await fetch(url, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();

  if (data && data.length > 0) {
    const key = data[0].license_key;
    console.log("FOUND_KEY:", key);
    
    // Append to .env.local safely
    fs.appendFileSync(envPath, `\nNEXT_PUBLIC_LICENSE_KEY=${key}\n`);
    console.log("Added to .env.local!");
  } else {
    console.log('NO_SUSPENDED_LICENSE_FOUND');
  }
}

main();
