'use client';

import { useState, useEffect } from 'react';
import { Bell, FileText, ClipboardList, File, FileText as FileTextIcon, UserCircle2, MessageSquare, HelpCircle, Users, Eye, MoreVertical, Calendar } from 'lucide-react';
import { getSubjectInstance } from '@/app/_actions/subjectInstance';
import { getRequirements } from '@/app/_actions/requirement';
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
  const [loading, setLoading] = useState(true);
  const [requirements, setRequirements] = useState<Requirement[]>([]);

  const fetchData = async () => {
    try {
      const [instanceResponse, requirementsResponse] = await Promise.all([
        getSubjectInstance(params.id),
        getRequirements(params.id)
      ]);

      if (instanceResponse.success && instanceResponse.data) {
        setSubjectInstance(instanceResponse.data);
      } else {
        toast.error(instanceResponse.error || 'Failed to load course details');
        setSubjectInstance(null);
      }

      if (requirementsResponse.success && requirementsResponse.data) {
        setRequirements(requirementsResponse.data);
      } else {
        toast.error(requirementsResponse.error || 'Failed to load requirements');
        setRequirements([]);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load course details');
      setRequirements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

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

  // Group requirements by type
  const groupedRequirements = requirements.reduce((acc, req) => {
    const key = req.type.toUpperCase() + 'S';
    if (!acc[key]) acc[key] = [];
    acc[key].push(req);
    return acc;
  }, {} as Record<string, Requirement[]>);

  // Add this constant at the top level of your component
  const REQUIREMENT_TYPES = [
    { key: 'FORUMS', label: 'FORUMS', icon: <MessageSquare className="w-5 h-5" /> },
    { key: 'QUIZZES', label: 'QUIZZES', icon: <HelpCircle className="w-5 h-5" /> },
    { key: 'ASSIGNMENTS', label: 'ASSIGNMENTS', icon: <FileText className="w-5 h-5" /> },
    { key: 'ACTIVITIES', label: 'ACTIVITIES', icon: <Users className="w-5 h-5" /> }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
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
          <span className="bg-pink-200 text-[#800000] px-3 py-1 rounded font-bold text-sm tracking-widest shadow-sm mb-1">{subjectInstance?.subject.code}</span>
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-1 leading-tight">{subjectInstance?.subject.name}</h2>
          <div className="flex flex-wrap items-center gap-4 text-base text-gray-700 mt-1">
            <span className="flex items-center gap-1"><UserCircle2 className="w-5 h-5 text-[#800000]" /> {subjectInstance?.teacherName}</span>
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
          <h3 className="text-lg font-bold text-[#800000] mb-2 flex items-center gap-2"><Bell className="w-5 h-5" /> Announcements</h3>
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
          <h3 className="text-lg font-bold text-[#800000] mb-2 flex items-center gap-2"><FileTextIcon className="w-5 h-5" /> Course Files</h3>
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
                      {items.map((req, i) => (
                        <tr key={i} className="hover:bg-pink-50/50 transition-colors duration-150">
                          <td className="p-4 text-gray-800 font-medium">
                            <div className="flex items-center gap-2">
                              {REQUIREMENT_TYPES.find(t => t.key === req.type.toUpperCase())?.icon}
                              <span className="line-clamp-2">{req.title}</span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {req.deadline.toLocaleDateString()}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                              ${req.scoreBase === 0 ? 'bg-yellow-100 text-yellow-800' : 
                                req.scoreBase === 1 ? 'bg-green-100 text-green-700' : 
                                'bg-red-100 text-red-700'}`}>
                              {req.scoreBase === 0 ? 'Not Started' : req.scoreBase === 1 ? 'Completed' : 'Not Completed'}
                            </span>
                          </td>
                          <td className="p-4 text-gray-600 font-medium">{req.scoreBase === 0 ? '0' : req.scoreBase === 1 ? '100' : '0'}</td>
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
        </div>
      )}
    </div>
  );
}