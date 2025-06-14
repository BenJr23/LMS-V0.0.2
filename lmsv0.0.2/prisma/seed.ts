import { PrismaClient } from '@/generated/prisma';

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

  try {
    console.log('📝 Creating subjects...');
    const result = await prisma.subject.createMany({
      data: subjects.map(subject => ({
        name: subject.name,
        code: subject.code,
        createdById: DEFAULT_CREATOR_ID,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    });

    console.log(`✅ Successfully created ${result.count} subjects`);
  } catch (error) {
    console.error('❌ Error seeding subjects:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error in main process:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());