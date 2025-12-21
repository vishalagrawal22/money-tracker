#!/usr/bin/env node

/**
 * Helper script to extract Firebase credentials from service account JSON
 * and generate .env entries
 * 
 * Usage: node scripts/setup-firebase-env.js path/to/service-account-key.json
 */

const fs = require('fs');
const path = require('path');

if (process.argv.length < 3) {
  console.error('Usage: node scripts/setup-firebase-env.js <path-to-service-account-key.json>');
  process.exit(1);
}

const jsonPath = process.argv[2];

if (!fs.existsSync(jsonPath)) {
  console.error(`Error: File not found: ${jsonPath}`);
  process.exit(1);
}

try {
  const jsonContent = fs.readFileSync(jsonPath, 'utf8');
  const credentials = JSON.parse(jsonContent);

  // Encode private key to base64
  const privateKeyBase64 = Buffer.from(credentials.private_key).toString('base64');

  // Generate .env entries
  const envEntries = `
# Firebase Configuration (generated from ${path.basename(jsonPath)})
FIREBASE_PROJECT_ID=${credentials.project_id}
FIREBASE_PRIVATE_KEY_ID=${credentials.private_key_id}
FIREBASE_PRIVATE_KEY=${privateKeyBase64}
FIREBASE_CLIENT_EMAIL=${credentials.client_email}
FIREBASE_CLIENT_ID=${credentials.client_id}
FIREBASE_CLIENT_X509_CERT_URL=${credentials.client_x509_cert_url}
`;

  console.log('\n📋 Copy these lines to your .env file:\n');
  console.log(envEntries);
  console.log('\n✅ Done! Remember to:\n');
  console.log('   1. Add these values to your .env file');
  console.log('   2. Never commit your .env file or service account JSON to git');
  console.log('   3. Keep your service account key secure\n');

} catch (error) {
  console.error('Error processing JSON file:', error.message);
  process.exit(1);
}

