// node server/scripts/test-compare.js
const bcrypt = require('bcrypt');

const plain = process.argv[2];    // pass password as arg
const hash = process.argv[3];     // pass hash as arg

if (!plain || !hash) {
  console.error('Usage: node test-compare.js <plainPassword> <hash>');
  process.exit(1);
}

bcrypt.compare(plain, hash).then(match => {
  console.log('match:', match);
  process.exit(match ? 0 : 2);
}).catch(err => {
  console.error('error:', err);
  process.exit(3);
});
