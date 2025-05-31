// app/teacher/teaching-sections/page.tsx
'use client';
import Image from 'next/image';
import { CalendarDays, Users } from 'lucide-react';

export default function TeachingSectionsPage() {
  const sections = [
    {
      code: 'CS101',
      title: 'Introduction to Computer Science',
      section: 'A',
      students: 32,
      schedule: 'Mon, Wed 10:00 AM - 11:30 AM',
      image: '/course1.jpg',
    },
    {
      code: 'CS101',
      title: 'Introduction to Computer Science',
      section: 'B',
      students: 28,
      schedule: 'Tue, Thu 1:00 PM - 2:30 PM',
      image: '/course1.jpg',
    },
    {
      code: 'CS301',
      title: 'Advanced Programming',
      section: 'A',
      students: 24,
      schedule: 'Wed, Fri 3:00 PM - 4:30 PM',
      image: '/course3.jpg',
    },
    {
      code: 'CS201',
      title: 'Data Structures',
      section: 'A',
      students: 30,
      schedule: 'Mon, Thu 2:00 PM - 3:30 PM',
      image: '/course4.jpg',
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-[#800000]">My Teaching Sections</h2>
      <p className="text-gray-600 mb-6">Welcome back! Here are your teaching assignments.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sections.map((section, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-40 w-full">
              <Image
                src={section.image}
                alt={section.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-4 space-y-2">
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="bg-pink-100 text-[#800000] px-2 py-0.5 rounded font-medium">{section.code}</span>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-medium">Section {section.section}</span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>

              <div className="flex items-center text-sm text-gray-700 gap-1">
                <Users className="w-4 h-4 text-[#800000]" />
                {section.students} Students
              </div>

              <div className="flex items-center text-sm text-gray-700 gap-1">
                <CalendarDays className="w-4 h-4 text-[#800000]" />
                {section.schedule}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}