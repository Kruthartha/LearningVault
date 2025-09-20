import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import 'dotenv/config';
import readline from 'readline';

// Helper to ask for input
const askQuestion = (query, hidden = false) => {
  return new Promise((resolve) => {
    if (!hidden) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      rl.question(query, (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    } else {
      // Hidden input (sudo-style: nothing is shown)
      process.stdout.write(query);
      process.stdin.resume();
      process.stdin.setRawMode(true);

      let value = '';

      const onData = (char) => {
        char = char.toString();

        if (char === '\n' || char === '\r' || char === '\u0004') {
          process.stdout.write('\n');
          process.stdin.setRawMode(false);
          process.stdin.removeListener('data', onData);
          resolve(value);
        } else if (char === '\u0003') {
          process.exit();
        } else {
          value += char;
        }
      };

      process.stdin.on('data', onData);
    }
  });
};

const createAdmin = async () => {
  const fullName = await askQuestion('Enter admin full name: ');
  const email = await askQuestion('Enter admin email: ');
  const password = await askQuestion('Enter admin password: ', true);
  const confirmPassword = await askQuestion('Confirm admin password: ', true);

  if (password !== confirmPassword) {
    console.error('❌ Error: Passwords do not match.');
    process.exit(1);
  }

  const [firstName, ...rest] = fullName.trim().split(' ');
  const lastName = rest.join(' ') || '';

  console.log(`\n⏳ Creating admin user for: ${email}`);

  // Check if user exists
  const userExist = await pool.query("SELECT * FROM studio_users WHERE email=$1", [email]);
  if (userExist.rows.length > 0) {
    console.error('❌ Error: An admin with this email already exists.');
    process.exit(1);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Insert into DB
  const result = await pool.query(
    `INSERT INTO studio_users 
    (first_name, last_name, email, password, role, is_active) 
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, email, role, first_name, last_name`,
    [firstName, lastName, email, hashedPassword, 'Super Admin', true]
  );

  const newUser = result.rows[0];
  console.log('✅ Success! Admin user created:');
  console.log({
    id: newUser.id,
    name: `${newUser.first_name} ${newUser.last_name}`.trim(),
    email: newUser.email,
    role: newUser.role,
  });
};

const deleteAdmin = async () => {
  const email = await askQuestion('Enter admin email to delete: ');
  console.log(`\n⏳ Deleting admin user for: ${email}`);

  const result = await pool.query(
    "DELETE FROM studio_users WHERE email=$1 RETURNING id, email, first_name, last_name, role",
    [email]
  );

  if (result.rows.length === 0) {
    console.error('❌ No admin found with this email.');
  } else {
    const deletedUser = result.rows[0];
    console.log('✅ Success! Admin user deleted:');
    console.log({
      id: deletedUser.id,
      name: `${deletedUser.first_name} ${deletedUser.last_name}`.trim(),
      email: deletedUser.email,
      role: deletedUser.role,
    });
  }
};

const main = async () => {
  try {
    const action = await askQuestion('Do you want to (c)reate or (d)elete an admin? [c/d]: ');
    if (action.toLowerCase() === 'c') {
      await createAdmin();
    } else if (action.toLowerCase() === 'd') {
      await deleteAdmin();
    } else {
      console.error('❌ Invalid choice. Use "c" or "d".');
    }
  } catch (err) {
    console.error('🔥 An error occurred:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
    process.stdin.pause();
    process.exit(0); // clean exit
  }
};

main();