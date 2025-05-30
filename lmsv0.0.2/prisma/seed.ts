import { PrismaClient } from '../src/generated/prisma'; // ✅ match your custom output path

const prisma = new PrismaClient();

async function main() {
  await prisma.student.create({
    data: {
      lrn: '123456789012',
      firstName: 'Joshua',
      lastName: 'Cuerdo',
      middleName: 'Bernard',
      email: 'joshua.cuerdo@student.lms.edu',
      passwordHash: '$2b$10$7vIS1YBylm3xLOXj3mdHiuj7TEQn6mNaUKHjf/nFYQ03nPg5k6YI6', // "Cuerdo--lms023"
      gradeLevel: 'Grade 11',
      section: 'St. Francis',
      gender: 'Male',
      dateOfBirth: new Date('2007-03-25'),
      status: 'Active',
    },
  });

  console.log('✅ Seeded student account!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });