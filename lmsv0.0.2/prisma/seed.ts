import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

const DEFAULT_CREATOR_ID = 'user_admin123';

async function main() {
  const subjects = [
    { name: 'English', code: 'ENG' },
    { name: 'Filipino', code: 'FIL' },
    { name: 'Mathematics', code: 'MATH' },
    { name: 'Science', code: 'SCI' },
    { name: 'Araling Panlipunan', code: 'AP' },
    { name: 'Edukasyon sa Pagpapakatao', code: 'ESP' },
    { name: 'Music', code: 'MUS' },
    { name: 'Arts', code: 'ART' },
    { name: 'Physical Education', code: 'PE' },
    { name: 'Health', code: 'HEALTH' },
    { name: 'TLE (Exploratory)', code: 'TLE' },
    { name: 'TLE (ICT – Computer)', code: 'TLE-ICT' },
    { name: 'TLE (Home Economics)', code: 'TLE-HE' },
    { name: 'TLE (Agri-Fishery Arts)', code: 'TLE-AFA' },
    { name: 'TLE (Industrial Arts)', code: 'TLE-IA' },
  ];

  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { code: subject.code },
      update: { 
        name: subject.name,
        updatedAt: new Date()
      },
      create: {
        name: subject.name,
        code: subject.code,
        createdById: DEFAULT_CREATOR_ID,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    });
  }

  console.log('✅ Subjects seeded successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding subjects:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());