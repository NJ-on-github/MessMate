// server/scripts/test-dns.js
const dns = require('dns');

const hostname = 'aws-1-ap-south-1.pooler.supabase.com';

console.log('Testing DNS resolution for:', hostname);

dns.lookup(hostname, (err, address, family) => {
  if (err) {
    console.error('❌ DNS resolution failed:', err.message);
    return;
  }
  console.log('✅ DNS resolved successfully:');
  console.log('  Address:', address);
  console.log('  Family:', family);
});

// Also try with explicit IPv4
dns.lookup(hostname, { family: 4 }, (err, address) => {
  if (err) {
    console.error('❌ IPv4 DNS resolution failed:', err.message);
    return;
  }
  console.log('✅ IPv4 resolved:', address);
});