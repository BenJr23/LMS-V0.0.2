'use client';

import { useState, useEffect, use } from 'react';
import { CalendarDays, Bell, FileText, ClipboardList, File, FileText as FileTextIcon, UserCircle2 } from 'lucide-react';
import { getSubjectInstance } from '@/app/_actions/subjectInstance';
import toast from 'react-hot-toast';

interface SubjectInstance {
  id: string;
  teacherName: string;
  grade: string;
  section: string;
  enrollment: number;
  icon: string;
  enrolmentCode: number;
  subject: {
    id: string;
    name: string;
    code: string;
  };
}

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [activeTab, setActiveTab] = useState('announcements');
  const [subjectInstance, setSubjectInstance] = useState<SubjectInstance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjectInstance = async () => {
      try {
        const data = await getSubjectInstance(resolvedParams.id);
        setSubjectInstance(data);
      } catch (error) {
        console.error('Failed to fetch subject instance:', error);
        toast.error('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectInstance();
  }, [resolvedParams.id]);

  const tabs = [
    { id: 'announcements', label: 'Announcements', icon: <Bell className="w-4 h-4 mr-1" /> },
    { id: 'files', label: 'Files', icon: <FileText className="w-4 h-4 mr-1" /> },
    { id: 'requirements', label: 'Requirements', icon: <ClipboardList className="w-4 h-4 mr-1" /> },
  ];

  const announcements = [
    {
      title: 'Welcome to ' + subjectInstance?.subject.code,
      author: subjectInstance?.teacherName,
      timeAgo: 'Just now',
      content: `Welcome to ${subjectInstance?.subject.name}! This course will cover the fundamentals of the subject.`
    }
  ];

  const files = [
    {
      module: 'Module 1: Introduction',
      items: [
        { name: 'Course Syllabus.pdf', size: '1.2 MB' },
        { name: 'Introduction.pptx', size: '3.5 MB' }
      ]
    },
    {
      module: 'Module 2: Basic Concepts',
      items: []
    }
  ];

  const requirements = [
    { type: 'Forum', title: 'Discussion: Course Introduction', due: 'Sep 9, 2023 7:59 AM', status: 'Not Started', points: '25 pts' },
    { type: 'Quiz', title: 'Quiz #1: Basic Concepts', due: 'Sep 11, 2023 7:59 AM', status: 'Not Started', points: '50 pts' },
    { type: 'Assignment', title: 'Assignment #1: Fundamentals', due: 'Sep 16, 2023 7:59 AM', status: 'Not Submitted', points: '100 pts' }
  ];

  // Group requirements by type
  const groupedRequirements = requirements.reduce((acc, req) => {
    const key = req.type.toUpperCase() + 'S';
    if (!acc[key]) acc[key] = [];
    acc[key].push(req);
    return acc;
  }, {} as Record<string, typeof requirements>);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#800000]"></div>
      </div>
    );
  }

  if (!subjectInstance) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Course not found</h2>
        <p className="text-gray-600 mt-2">The requested course could not be found.</p>
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
          {announcements.map((item, i) => (
            <div key={i} className="bg-white rounded-lg p-5 shadow flex gap-4 border-l-4 border-[#800000]/80">
              <div className="flex flex-col items-center pt-1">
                <Bell className="text-[#800000] w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-[#800000] text-lg">{item.title}</h4>
                <p className="text-xs text-gray-500 mb-1">{item.author} • {item.timeAgo}</p>
                <p className="mt-1 text-gray-800 text-sm">{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Files Tab */}
      {activeTab === 'files' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#800000] mb-2 flex items-center gap-2">
            <FileTextIcon className="w-5 h-5" /> Course Files
          </h3>
          {files.map((mod, i) => (
            <div key={i} className="bg-white rounded-lg p-4 shadow border border-pink-100">
              <h4 className="font-medium text-gray-900 mb-2">{mod.module}</h4>
              {mod.items.length === 0 ? (
                <div className="text-gray-400 italic text-sm">No files available for this module.</div>
              ) : (
                <ul className="mt-2 space-y-2">
                  {mod.items.map((file, idx) => (
                    <li key={idx} className="flex items-center justify-between text-sm text-gray-700 border-b pb-1 last:border-b-0">
                      <span className="flex items-center gap-2">
                        {file.name.endsWith('.pdf') ? <FileText className="w-4 h-4 text-red-500" /> : file.name.endsWith('.pptx') ? <FileText className="w-4 h-4 text-orange-500" /> : <File className="w-4 h-4 text-gray-400" />}
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-500">{file.size}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Requirements Tab */}
      {activeTab === 'requirements' && (
        <div>
          {Object.entries(groupedRequirements).map(([section, items]) => (
            <div key={section} className="mb-6">
              <h4 className="text-md font-bold text-[#800000] mb-2 uppercase tracking-wide">{section}</h4>
              <div className="bg-white rounded-lg shadow overflow-x-auto border border-pink-100">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b bg-pink-50">
                      <th className="p-3">Title</th>
                      <th className="p-3">Due Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Points</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((req, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="p-3 whitespace-normal break-words max-w-xs text-gray-800">{req.title}</td>
                        <td className="p-3 text-gray-800">{req.due}</td>
                        <td className="p-3 text-gray-800">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold
                            ${req.status === 'Not Started' ? 'bg-yellow-100 text-yellow-800' : req.status === 'Not Submitted' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="p-3 text-gray-800">{req.points}</td>
                        <td className="p-3">
                          <button className="px-3 py-1 rounded bg-[#800000] text-white text-xs font-semibold shadow hover:bg-[#a52a2a] transition">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}