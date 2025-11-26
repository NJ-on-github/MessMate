// server/utils/auth.js
const bcrypt = require('bcrypt');
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

export default async function progressiveRehashIfNeeded(userRow, plainPassword, pool) {
  try {
    if (!userRow || !userRow.password_hash) return;
    const m = userRow.password_hash.match(/^\$2[aby]\$(\d{2})\$/);
    if (!m) return;
    const currentCost = parseInt(m[1], 10);
    if (currentCost < SALT_ROUNDS) {
      const newHash = await bcrypt.hash(plainPassword, SALT_ROUNDS);
      await pool.query('UPDATE users SET password_hash = $1 WHERE user_id = $2', [newHash, userRow.user_id]);
    }
  } catch (err) {
    console.error('progressiveRehashIfNeeded error:', err);
  }
}