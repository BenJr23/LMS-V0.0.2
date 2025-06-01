import Image from 'next/image';
import Link from 'next/link';

export default function DashboardPage() {
  const courses = [
    {
      code: 'CS101',
      title: 'Introduction to Computer Science',
      professor: 'Dr. Alan Turing',
      schedule: 'Mon, Wed 10:00 AM - 11:30 AM',
      progress: 65,
      image: '/course1.jpg',
    },
    {
      code: 'MATH201',
      title: 'Calculus I',
      professor: 'Dr. Katherine Johnson',
      schedule: 'Tue, Thu 1:00 PM - 2:30 PM',
      progress: 42,
      image: '/course2.jpg',
    },
    {
      code: 'HIST101',
      title: 'World History',
      professor: 'Prof. Howard Zinn',
      schedule: 'Wed, Fri 3:00 PM - 4:30 PM',
      progress: 78,
      image: '/course3.jpg',
    },
    {
      code: 'PSYC101',
      title: 'Introduction to Psychology',
      professor: '—',
      schedule: '—',
      progress: 30,
      image: '/course4.jpg',
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#800000]">My Courses</h2>
      <p className="text-gray-600 mb-6">Welcome back! Here are your enrolled courses.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <Link
            key={index}
            href={`/student-dashboard/${course.code.toLowerCase()}`}
            className="block"
          >
            <div className="bg-white shadow rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg">
              <div className="relative h-40 w-full">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="bg-pink-100 text-[#800000] px-2 py-0.5 rounded font-medium">
                    {course.code}
                  </span>
                  <span className="text-sm text-yellow-600 font-medium">{course.progress}% Complete</span>
                </div>

                <h3 className="text-lg font-semibold text-gray-800">{course.title}</h3>
                <p className="text-gray-700 text-sm mb-2">{course.professor}</p>

                <div className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10m-9 4h6m2 6H7a2 2 0 01-2-2V7a2 2 0 012-2h1m8 0h1a2 2 0 012 2v11a2 2 0 01-2 2z" />
                  </svg>
                  {course.schedule}
                </div>

                <div className="h-2 w-full bg-gray-200 rounded mt-2">
                  <div
                    className="h-full bg-[#800000] rounded"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
