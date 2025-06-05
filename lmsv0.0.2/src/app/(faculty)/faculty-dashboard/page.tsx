// app/teacher/teaching-sections/page.tsx
'use client';
import Image from 'next/image';
import { Users, Plus, Upload } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { getSubjects } from '@/app/_actions/subject';
import { createSubjectInstance } from '@/app/_actions/subjectInstance';

export default function TeachingSectionsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [subjects, setSubjects] = useState<Array<{ id: string; name: string; code: string }>>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    teacherName: '',
    subjectId: '',
    grade: '',
    section: '',
    enrollment: 1, // Default to active
    icon: '',
  });
  const [subjectSearch, setSubjectSearch] = useState('');
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);

  const sectionOptions = ['A', 'B', 'C']; // Placeholder, no table yet

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const subjectsData = await getSubjects();
        setSubjects(subjectsData);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
      }
    };
    fetchSubjects();
  }, []);

  const sections = [
    {
      code: 'CS101',
      title: 'Introduction to Computer Science',
      section: 'A',
      students: 32,
      image: '/course1.jpg',
    },
    {
      code: 'CS101',
      title: 'Introduction to Computer Science',
      section: 'B',
      students: 28,
      image: '/course1.jpg',
    },
    {
      code: 'CS301',
      title: 'Advanced Programming',
      section: 'A',
      students: 24,
      image: '/course3.jpg',
    },
    {
      code: 'CS201',
      title: 'Data Structures',
      section: 'A',
      students: 30,
      image: '/course4.jpg',
    },
  ];

  const filteredSections = sections.filter((section) =>
    section.title.toLowerCase().includes(search.toLowerCase()) ||
    section.code.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(subjectSearch.toLowerCase()) ||
    subject.code.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  const handleGradeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || ['7', '8', '9', '10'].includes(value)) {
      setForm(prev => ({ ...prev, grade: value }));
    }
  };

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append('file', file);

      // Send the file to your API endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      // Update the form with the new icon path
      setForm(prev => ({ ...prev, icon: data.path }));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image');
    }
  };

  const resetForm = () => {
    setForm({
      teacherName: '',
      subjectId: '',
      grade: '',
      section: '',
      enrollment: 1,
      icon: '',
    });
    setSubjectSearch('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="p-6">
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 space-y-4">
            <h3 className="text-xl font-semibold text-[#800000]">Add Subject Instance</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Teacher Name</label>
                <input
                  type="text"
                  placeholder="Enter teacher name"
                  value={form.teacherName}
                  onChange={(e) => setForm({ ...form, teacherName: e.target.value })}
                  className="w-full border rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#800000] text-gray-800 placeholder-gray-400 bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search subject..."
                    value={subjectSearch}
                    onChange={(e) => {
                      setSubjectSearch(e.target.value);
                      setShowSubjectDropdown(true);
                    }}
                    onFocus={() => setShowSubjectDropdown(true)}
                    className="w-full border rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#800000] text-gray-800 placeholder-gray-400 bg-white"
                  />
                  {showSubjectDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredSubjects.map((subject) => (
                        <div
                          key={subject.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-800"
                          onClick={() => {
                            setForm(prev => ({ ...prev, subjectId: subject.id }));
                            setSubjectSearch(`${subject.name} - ${subject.code}`);
                            setShowSubjectDropdown(false);
                          }}
                        >
                          {subject.name} - {subject.code}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Grade</label>
                <input
                  type="text"
                  placeholder="Enter grade (7-10)"
                  value={form.grade}
                  onChange={handleGradeChange}
                  className="w-full border rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#800000] text-gray-800 placeholder-gray-400 bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Section</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Select section"
                    value={form.section}
                    onChange={(e) => setForm({ ...form, section: e.target.value })}
                    onFocus={() => setShowSectionDropdown(true)}
                    className="w-full border rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#800000] text-gray-800 placeholder-gray-400 bg-white"
                  />
                  {showSectionDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                      {sectionOptions.map((section) => (
                        <div
                          key={section}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-800"
                          onClick={() => {
                            setForm(prev => ({ ...prev, section }));
                            setShowSectionDropdown(false);
                          }}
                        >
                          {section}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Enrollment Status</label>
                <select
                  value={form.enrollment}
                  onChange={(e) => setForm({ ...form, enrollment: parseInt(e.target.value) })}
                  className="w-full border rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#800000] text-gray-800 bg-white"
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Icon</label>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleIconUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors duration-200 text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Icon
                    </button>
                  </div>
                  <div className="h-32 w-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                    {form.icon ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={form.icon}
                          alt="Section icon"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">No icon selected</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={async () => {
                  try {
                    if (!form.subjectId) {
                      alert('Please select a subject');
                      return;
                    }
                    if (!form.teacherName || !form.grade || !form.section) {
                      alert('Please fill in all required fields');
                      return;
                    }

                    await createSubjectInstance(form);
                    alert('Subject instance created!');
                    handleCloseModal(); // ✅ only once
                  } catch (error) {
                    console.error(error);
                    alert('Failed to create section');
                  }
                }}
                className="px-4 py-2 rounded bg-[#800000] text-white hover:bg-[#600000] transition-colors duration-200"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#800000]">My Teaching Sections</h2>
          <p className="text-gray-600">Welcome back! Here are your teaching assignments.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <input
            type="text"
            placeholder="Search by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#800000] text-sm shadow-sm bg-white text-gray-800 placeholder-gray-400"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#800000] text-white rounded-lg hover:bg-[#600000] transition-colors duration-200 shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add Section
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSections.map((section, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] transform"
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
            </div>
          </div>
        ))}
        {filteredSections.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No sections found.
          </div>
        )}
      </div>
    </div>
  );
}