'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getEnrolledSubjects } from '@/app/_actions/enrolment';
import { getImageUrl } from '@/app/_actions/uploadIcon';
import { Users, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EnrolledSubject {
  id: string;
  subjectInstance: {
    id: string;
    teacherName: string;
    grade: string;
    section: string;
    enrollment: number;
    icon: string;
    subject: {
      id: string;
      name: string;
      code: string;
    };
  };
  createdAt: Date;
}

export default function DashboardPage() {
  const router = useRouter();
  const [enrolledSubjects, setEnrolledSubjects] = useState<EnrolledSubject[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrolledSubjects = async () => {
    try {
      const result = await getEnrolledSubjects();
      if (result.success && result.data) {
        setEnrolledSubjects(result.data as EnrolledSubject[]);
      } else {
        setError(result.error || 'Failed to fetch enrolled subjects');
      }
    } catch (error) {
      console.error('Failed to fetch enrolled subjects:', error);
      setError('An error occurred while fetching enrolled subjects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledSubjects();
  }, []);

  // Update image URLs when instances change
  useEffect(() => {
    const updateImageUrls = async () => {
      setIsImageLoading(true);
      try {
        const newUrls: Record<string, string> = {};
        for (const enrollment of enrolledSubjects) {
          if (enrollment.subjectInstance.icon && !imageUrls[enrollment.subjectInstance.icon]) {
            try {
              const url = await getImageUrl(enrollment.subjectInstance.icon);
              if (url) {
                newUrls[enrollment.subjectInstance.icon] = url;
              }
            } catch (error) {
              console.error(`Failed to load image for ${enrollment.subjectInstance.subject.name}:`, error);
            }
          }
        }
        if (Object.keys(newUrls).length > 0) {
          setImageUrls(prev => ({ ...prev, ...newUrls }));
        }
      } catch (error) {
        console.error('Failed to update image URLs:', error);
      } finally {
        setIsImageLoading(false);
      }
    };

    updateImageUrls();
  }, [enrolledSubjects, imageUrls]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#800000]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Enrolled Courses Section */}
      <section>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#800000]">My Courses</h2>
            <p className="text-gray-600">View and manage your enrolled courses.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {enrolledSubjects.map((enrollment) => {
            const instance = enrollment.subjectInstance;
            if (!instance || !instance.subject) return null;
            
            return (
              <div
                key={enrollment.id}
                onClick={() => router.push(`/student/dashboard/${instance.id}`)}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] transform cursor-pointer"
              >
                <div className="relative h-40 w-full">
                  {isImageLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#800000]"></div>
                    </div>
                  ) : (
                    <Image
                      src={imageUrls[instance.icon] || '/course1.jpg'}
                      alt={instance.subject.name || 'Subject'}
                      fill
                      className="object-cover"
                      unoptimized
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/course1.jpg';
                      }}
                    />
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="bg-pink-100 text-[#800000] px-2 py-0.5 rounded font-medium">
                      {instance.subject.code || 'No Code'}
                    </span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-medium">
                      Section {instance.section || 'N/A'}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900">
                    {instance.subject.name || 'Unnamed Subject'}
                  </h3>
                  <p className="text-sm text-gray-600">Grade {instance.grade || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Teacher: {instance.teacherName || 'Unassigned'}</p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-700 gap-1">
                      <Users className="w-4 h-4 text-[#800000]" />
                      {instance.enrollment === 1 ? 'Active' : 'Inactive'}
                    </div>
                    <div className="flex items-center text-gray-700 gap-1">
                      <Clock className="w-4 h-4 text-[#800000]" />
                      Enrolled {new Date(enrollment.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Course Progress</span>
                      <span>0%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#800000] h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {enrolledSubjects.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              You haven&apos;t enrolled in any courses yet. Visit the Subjects page to enroll in courses.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
