'use client';

import { useState, useEffect, use } from 'react';
import { Bell, FileText, ClipboardList, File, FileText as FileTextIcon, UserCircle2, Settings, MessageSquare, HelpCircle, Users, Eye, MoreVertical, Calendar, Plus } from 'lucide-react';
import { getSubjectInstance, updateSubjectInstance } from '@/app/_actions/subjectInstance';
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    teacherName: '',
    grade: '',
    section: '',
    enrollment: 1
  });

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
    { type: 'Assignment', title: 'Assignment #1: Fundamentals', due: 'Sep 16, 2023 7:59 AM', status: 'Not Submitted', points: '100 pts' },
    { type: 'Activity', title: 'Group Project: Course Concepts', due: 'Sep 20, 2023 7:59 AM', status: 'Not Started', points: '150 pts' }
  ];

  // Group requirements by type
  const groupedRequirements = requirements.reduce((acc, req) => {
    const key = req.type.toUpperCase() + 'S';
    if (!acc[key]) acc[key] = [];
    acc[key].push(req);
    return acc;
  }, {} as Record<string, typeof requirements>);

  const handleOpenEditModal = () => {
    if (subjectInstance) {
      setEditForm({
        teacherName: subjectInstance.teacherName,
        grade: subjectInstance.grade,
        section: subjectInstance.section,
        enrollment: subjectInstance.enrollment
      });
      setIsEditModalOpen(true);
    }
  };

  const handleSaveEdit = async () => {
    try {
      if (!subjectInstance) return;

      const updatedInstance = await updateSubjectInstance(subjectInstance.id, editForm);
      setSubjectInstance(updatedInstance);
      setIsEditModalOpen(false);
      toast.success('Subject instance updated successfully');
    } catch (error) {
      console.error('Failed to update subject instance:', error);
      toast.error('Failed to update subject instance');
    }
  };

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
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1 leading-tight">
                {subjectInstance.subject.name}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-base text-gray-700 mt-1">
                <span className="flex items-center gap-1">
                  <UserCircle2 className="w-5 h-5 text-[#800000]" /> 
                  {subjectInstance.teacherName}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-5 h-5 text-[#800000]" /> 
                  Grade {subjectInstance.grade} - Section {subjectInstance.section}
                </span>
              </div>
            </div>
            <button
              onClick={handleOpenEditModal}
              className="p-2 hover:bg-pink-100 rounded-full transition-colors duration-200"
            >
              <Settings className="w-5 h-5 text-[#800000]" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-semibold text-[#800000] mb-4">Edit Subject Instance</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teacher Name</label>
                <input
                  type="text"
                  value={editForm.teacherName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, teacherName: e.target.value }))}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#800000] text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                <select
                  value={editForm.grade}
                  onChange={(e) => setEditForm(prev => ({ ...prev, grade: e.target.value }))}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#800000] text-gray-800 bg-white"
                >
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                <select
                  value={editForm.section}
                  onChange={(e) => setEditForm(prev => ({ ...prev, section: e.target.value }))}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#800000] text-gray-800 bg-white"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Status</label>
                <select
                  value={editForm.enrollment}
                  onChange={(e) => setEditForm(prev => ({ ...prev, enrollment: parseInt(e.target.value) }))}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#800000] text-gray-800 bg-white"
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded bg-[#800000] text-white hover:bg-[#600000] transition-colors duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

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
            <div key={section} className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <h4 className="text-lg font-bold text-[#800000] uppercase tracking-wide flex items-center gap-2">
                  <ClipboardList className="w-5 h-5" />
                  {section}
                </h4>
                <button className="p-1.5 rounded-md bg-[#800000] text-white hover:bg-[#a52a2a] transition-colors duration-200 shadow-sm">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
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
                              {req.type === 'Forum' && <MessageSquare className="w-4 h-4 text-blue-500" />}
                              {req.type === 'Quiz' && <HelpCircle className="w-4 h-4 text-purple-500" />}
                              {req.type === 'Assignment' && <FileText className="w-4 h-4 text-orange-500" />}
                              {req.type === 'Activity' && <Users className="w-4 h-4 text-green-500" />}
                              <span className="line-clamp-2">{req.title}</span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {req.due}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                              ${req.status === 'Not Started' ? 'bg-yellow-100 text-yellow-800' : 
                                req.status === 'Not Submitted' ? 'bg-red-100 text-red-700' : 
                                'bg-green-100 text-green-700'}`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="p-4 text-gray-600 font-medium">{req.points}</td>
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