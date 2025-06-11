import { prisma } from '../src/lib/prisma';

// Replace this with your actual Clerk user ID
const DEFAULT_CREATOR_ID = process.env.CLERK_USER_ID || 'user_admin123';

async function main() {
  try {
    // Clear existing data
    console.log('🧹 Cleaning up existing subjects...');
    
    // Disable foreign key checks temporarily
    await prisma.$executeRaw`SET session_replication_role = 'replica'`;
    
    // Clear subjects table
    await prisma.$executeRaw`DELETE FROM "Subject"`;
    console.log('✅ Subjects cleared');
    
    // Re-enable foreign key checks
    await prisma.$executeRaw`SET session_replication_role = 'origin'`;

    const subjects = [
      // 📘 Core Academic Subjects
      { name: 'English', code: 'ENG' },
      { name: 'Filipino', code: 'FIL' },
      { name: 'Mathematics', code: 'MATH' },
      { name: 'Science', code: 'SCI' },
      { name: 'Araling Panlipunan', code: 'AP' },
      { name: 'Edukasyon sa Pagpapakatao', code: 'ESP' },

      // 🎨 MAPEH Component Subjects
      { name: 'Music', code: 'MUS' },
      { name: 'Arts', code: 'ART' },
      { name: 'Physical Education', code: 'PE' },
      { name: 'Health', code: 'HEALTH' },

      // 🛠️ TLE Subjects
      { name: 'TLE (Exploratory)', code: 'TLE' },
      { name: 'TLE (ICT – Computer)', code: 'TLE-ICT' },
      { name: 'TLE (Home Economics)', code: 'TLE-HE' },
      { name: 'TLE (Agri-Fishery Arts)', code: 'TLE-AFA' },
      { name: 'TLE (Industrial Arts)', code: 'TLE-IA' },
    ];

    // Create subjects
    console.log('📚 Creating subjects...');
    for (const subject of subjects) {
      await prisma.subject.create({
        data: {
          name: subject.name,
          code: subject.code,
          createdById: DEFAULT_CREATOR_ID,
        },
      });
    }
    console.log('✅ Subjects created successfully');
    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  });
