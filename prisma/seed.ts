import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Define roles
  const roles = ['STUDENT', 'TEACHER', 'ADMIN'];

  // Create users
  const users = [];
  for (let i = 0; i < 10; i++) {
    // Hash the password
    const hashedPassword = await bcrypt.hash('password', 10);
    
    const user = await prisma.user.create({
      data: {
        name: `User ${i + 1}`,
        lastName: `LastName ${i + 1}`,
        email: `user${i + 1}@example.com`,
        password: hashedPassword,
        role: roles[i % 3],
        isActive: true,
        hasAdminRights: roles[i % 3] === 'ADMIN',
      },
    });
    users.push(user);
  }

  console.log('Seed data populated successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });