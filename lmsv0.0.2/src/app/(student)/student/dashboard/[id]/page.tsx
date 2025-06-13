'use client';

import { useState, useEffect } from 'react';
import { CalendarDays, Bell, FileText, ClipboardList, FileText as FileTextIcon, UserCircle2, MessageSquare, HelpCircle, Users, Eye, MoreVertical, Calendar } from 'lucide-react';
import { getSubjectInstance } from '@/app/_actions/subjectInstance';
import { getRequirements } from '@/app/_actions/requirement';
import { toast } from 'react-hot-toast';

interface SubjectInstance {
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
}

interface Requirement {
  id: string;
  requirementNumber: number;
  title: string | null;
  content: string | null;
  scoreBase: number;
  deadline: Date;
  type: string;
  subjectInstanceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('announcements');
  const [subjectInstance, setSubjectInstance] = useState<SubjectInstance | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: 'announcements', label: 'Announcements', icon: <Bell className="w-4 h-4 mr-1" /> },
    { id: 'files', label: 'Files', icon: <FileText className="w-4 h-4 mr-1" /> },
    { id: 'requirements', label: 'Requirements', icon: <ClipboardList className="w-4 h-4 mr-1" /> },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [instanceData, requirementsData] = await Promise.all([
          getSubjectInstance(params.id),
          getRequirements(params.id)
        ]);

        if (instanceData) {
          setSubjectInstance(instanceData);
        }

        if (requirementsData.success && requirementsData.data) {
          setRequirements(requirementsData.data);
        } else {
          setRequirements([]);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Failed to load course details');
        setError('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  // Group requirements by type
  const groupedRequirements = requirements.reduce((acc, req) => {
    const key = req.type.toUpperCase() + 'S';
    if (!acc[key]) acc[key] = [];
    acc[key].push(req);
    return acc;
  }, {} as Record<string, Requirement[]>);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#800000]"></div>
      </div>
    );
  }

  if (error || !subjectInstance) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error || 'Course not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-0 md:p-6">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-pink-100 via-white to-pink-50 rounded-lg shadow-md mb-6 overflow-hidden flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-8 p-6 border border-pink-200">
        <div className="flex-shrink-0 flex flex-col items-center md:items-start">
          <div className="bg-[#800000]/10 rounded-full p-3 mb-2">
            <UserCircle2 className="text-[#800000] w-12 h-12" />
          </div>
          <span className="bg-pink-200 text-[#800000] px-3 py-1 rounded font-bold text-sm tracking-widest shadow-sm mb-1">
            {subjectInstance.subject.code}
          </span>
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-1 leading-tight">
            {subjectInstance.subject.name}
          </h2>
          <div className="flex flex-wrap items-center gap-4 text-base text-gray-700 mt-1">
            <span className="flex items-center gap-1">
              <UserCircle2 className="w-5 h-5 text-[#800000]" />
              {subjectInstance.teacherName}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays className="w-5 h-5 text-[#800000]" />
              Grade {subjectInstance.grade} - Section {subjectInstance.section}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex gap-6 text-base font-semibold text-gray-700 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 border-b-2 transition-all duration-150 rounded-t-md focus:outline-none
              ${activeTab === tab.id
                ? 'border-[#800000] text-[#800000] bg-pink-50 shadow-sm'
                : 'border-transparent hover:text-[#800000] hover:bg-pink-100'}
            `}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Announcements Tab */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#800000] mb-2 flex items-center gap-2">
            <Bell className="w-5 h-5" /> Announcements
          </h3>
          <div className="bg-white rounded-lg p-5 shadow flex gap-4 border-l-4 border-[#800000]/80">
            <div className="flex flex-col items-center pt-1">
              <Bell className="text-[#800000] w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-[#800000] text-lg">
                Welcome to {subjectInstance.subject.code}
              </h4>
              <p className="text-xs text-gray-500 mb-1">
                {subjectInstance.teacherName} • Just now
              </p>
              <p className="mt-1 text-gray-800 text-sm">
                Welcome to {subjectInstance.subject.name}! This course will cover the fundamentals of the subject.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Files Tab */}
      {activeTab === 'files' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#800000] mb-2 flex items-center gap-2">
            <FileTextIcon className="w-5 h-5" /> Course Files
          </h3>
          <div className="bg-white rounded-lg p-4 shadow border border-pink-100">
            <h4 className="font-medium text-gray-900 mb-2">Module 1: Introduction</h4>
            <div className="text-gray-400 italic text-sm">No files available for this module.</div>
          </div>
        </div>
      )}

      {/* Requirements Tab */}
      {activeTab === 'requirements' && (
        <div>
          {Object.entries(groupedRequirements).map(([section, items]) => (
            <div key={section} className="mb-8">
              <h4 className="text-lg font-bold text-[#800000] mb-3 uppercase tracking-wide flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                {section}
              </h4>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-pink-100">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-pink-50 border-b border-pink-100">
                        <th className="p-4 text-left font-semibold text-[#800000] w-[35%]">Title</th>
                        <th className="p-4 text-left font-semibold text-[#800000] w-[20%]">Due Date</th>
                        <th className="p-4 text-left font-semibold text-[#800000] w-[15%]">Status</th>
                        <th className="p-4 text-left font-semibold text-[#800000] w-[10%]">Points</th>
                        <th className="p-4 text-left font-semibold text-[#800000] w-[20%]">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-pink-50">
                      {items.map((req) => (
                        <tr key={req.id} className="hover:bg-pink-50/50 transition-colors duration-150">
                          <td className="p-4 text-gray-800 font-medium">
                            <div className="flex items-center gap-2">
                              {req.type === 'Forum' && <MessageSquare className="w-4 h-4 text-blue-500" />}
                              {req.type === 'Quiz' && <HelpCircle className="w-4 h-4 text-purple-500" />}
                              {req.type === 'Assignment' && <FileTextIcon className="w-4 h-4 text-orange-500" />}
                              {req.type === 'Activity' && <Users className="w-4 h-4 text-green-500" />}
                              <span className="line-clamp-2">{req.title}</span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {new Date(req.deadline).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true
                              })}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Not Started
                            </span>
                          </td>
                          <td className="p-4 text-gray-600 font-medium">{req.scoreBase} pts</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button className="px-3 py-1.5 rounded-md bg-[#800000] text-white text-xs font-semibold shadow-sm hover:bg-[#a52a2a] transition-colors duration-200 flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5" />
                                View
                              </button>
                              <button className="p-1.5 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
          {Object.keys(groupedRequirements).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No requirements available for this course yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}