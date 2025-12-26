import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...\n');

  // Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.emailToken.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.oAuthProvider.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Existing data cleaned\n');

  // Hash password for test users
  const hashedPassword = await bcrypt.hash('Password123!', 12);

  // Create Admin User
  console.log('👤 Creating admin user...');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@theoboilerplate.dev',
      password: hashedPassword,
      name: 'Admin User',
      role: UserRole.ADMIN,
      emailVerified: true,
    },
  });
  console.log(`✅ Admin created: ${admin.email} (password: Password123!)\n`);

  // Create Moderator User
  console.log('👤 Creating moderator user...');
  const moderator = await prisma.user.create({
    data: {
      email: 'moderator@theoboilerplate.dev',
      password: hashedPassword,
      name: 'Moderator User',
      role: UserRole.MODERATOR,
      emailVerified: true,
    },
  });
  console.log(
    `✅ Moderator created: ${moderator.email} (password: Password123!)\n`,
  );

  // Create Regular Users
  console.log('👤 Creating regular users...');
  const user1 = await prisma.user.create({
    data: {
      email: 'user@theoboilerplate.dev',
      password: hashedPassword,
      name: 'John Doe',
      role: UserRole.USER,
      emailVerified: true,
    },
  });
  console.log(`✅ User created: ${user1.email} (password: Password123!)`);

  const user2 = await prisma.user.create({
    data: {
      email: 'jane@theoboilerplate.dev',
      password: hashedPassword,
      name: 'Jane Smith',
      role: UserRole.USER,
      emailVerified: true,
    },
  });
  console.log(`✅ User created: ${user2.email} (password: Password123!)`);

  // Create unverified user (to test email verification)
  const unverifiedUser = await prisma.user.create({
    data: {
      email: 'unverified@theoboilerplate.dev',
      password: hashedPassword,
      name: 'Unverified User',
      role: UserRole.USER,
      emailVerified: false,
    },
  });
  console.log(
    `✅ Unverified user created: ${unverifiedUser.email} (password: Password123!)`,
  );

  // Create email verification token for unverified user
  await prisma.emailToken.create({
    data: {
      token: 'test-verification-token-123',
      type: 'EMAIL_VERIFICATION',
      userId: unverifiedUser.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  });
  console.log(
    `✅ Verification token created: test-verification-token-123\n`,
  );

  // Create OAuth user (simulating Google OAuth)
  console.log('👤 Creating OAuth user...');
  const oauthUser = await prisma.user.create({
    data: {
      email: 'oauth@theoboilerplate.dev',
      name: 'OAuth User',
      role: UserRole.USER,
      emailVerified: true,
      oauthProviders: {
        create: {
          provider: 'GOOGLE',
          providerId: 'google-test-id-123456',
        },
      },
    },
  });
  console.log(`✅ OAuth user created: ${oauthUser.email}\n`);

  // Summary
  console.log('═══════════════════════════════════════');
  console.log('✅ Database seeding completed!\n');
  console.log('📊 Summary:');
  console.log(`   - Total users: ${await prisma.user.count()}`);
  console.log(`   - Admins: ${await prisma.user.count({ where: { role: UserRole.ADMIN } })}`);
  console.log(
    `   - Moderators: ${await prisma.user.count({ where: { role: UserRole.MODERATOR } })}`,
  );
  console.log(`   - Regular users: ${await prisma.user.count({ where: { role: UserRole.USER } })}`);
  console.log(`   - Verified: ${await prisma.user.count({ where: { emailVerified: true } })}`);
  console.log(
    `   - Unverified: ${await prisma.user.count({ where: { emailVerified: false } })}\n`,
  );

  console.log('🔑 Test Credentials:');
  console.log('   Admin:      admin@theoboilerplate.dev / Password123!');
  console.log('   Moderator:  moderator@theoboilerplate.dev / Password123!');
  console.log('   User:       user@theoboilerplate.dev / Password123!');
  console.log('   User 2:     jane@theoboilerplate.dev / Password123!');
  console.log('   Unverified: unverified@theoboilerplate.dev / Password123!');
  console.log(
    '   OAuth:      oauth@theoboilerplate.dev (no password)\n',
  );

  console.log('🔗 Verification Token:');
  console.log('   test-verification-token-123\n');
  console.log('═══════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
