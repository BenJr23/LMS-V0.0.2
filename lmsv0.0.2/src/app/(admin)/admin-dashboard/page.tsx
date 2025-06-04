'use client';

import { useEffect, useState } from 'react';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';

type Subject = {
  id: string;
  name: string;
  code: string;
  createdById: string;
  createdAt: string;
};

export default function AdminSubjectPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      const res = await fetch('/api/subjects');
      const data = await res.json();
      setSubjects(data);
    };

    fetchSubjects();
  }, []);

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(search.toLowerCase()) ||
    subject.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-xl font-semibold text-[#800000]">Add Subject</h3>

            <div className="space-y-3">
              <div>
                <label htmlFor="subjectName" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Name
                </label>
                <input
                  id="subjectName"
                  type="text"
                  placeholder="Enter subject name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#800000] text-gray-800 placeholder-gray-400 bg-white"
                />
              </div>
              <div>
                <label htmlFor="subjectCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Code
                </label>
                <input
                  id="subjectCode"
                  type="text"
                  placeholder="Enter subject code"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#800000] text-gray-800 placeholder-gray-400 bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const res = await fetch('/api/subjects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      name: newName,
                      code: newCode,
                    }),
                  });

                  if (res.ok) {
                    const newSubject = await res.json();
                    setSubjects(prev => [...prev, newSubject]);
                    setNewName('');
                    setNewCode('');
                    setIsModalOpen(false);
                  } else {
                    alert('Failed to add subject');
                  }
                }}
                disabled={!newName || !newCode}
                className="px-4 py-2 rounded bg-[#800000] text-white hover:bg-[#600000] disabled:opacity-50 transition-colors duration-200"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-[#800000] drop-shadow-sm">Subjects</h2>
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
              Add Subject
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Subject Name</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Code</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Created By</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Created At</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSubjects.map((subject) => (
                  <tr key={subject.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 text-gray-800 font-medium">{subject.name}</td>
                    <td className="px-6 py-4 text-gray-600">{subject.code}</td>
                    <td className="px-6 py-4 text-gray-600">{subject.createdById}</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(subject.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button className="p-2 text-gray-600 hover:text-[#800000] hover:bg-red-50 rounded-lg transition">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-[#800000] hover:bg-red-50 rounded-lg transition">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredSubjects.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center px-6 py-4 text-gray-500">
                      No subjects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  );
}
