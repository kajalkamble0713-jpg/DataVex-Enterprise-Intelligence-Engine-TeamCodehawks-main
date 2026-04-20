import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create default admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@datavex.com' },
    update: {},
    create: {
      email: 'admin@datavex.com',
      name: 'Admin',
      passwordHash: adminPassword,
      role: 'admin',
      isActive: true,
    },
  });

  console.log('✅ Admin user created:', admin.email);
  console.log('📧 Email: admin@datavex.com');
  console.log('🔑 Password: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
