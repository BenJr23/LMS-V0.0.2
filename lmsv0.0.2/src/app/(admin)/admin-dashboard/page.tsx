'use client';

import { useState } from 'react';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';

const SUBJECTS = [
  { name: 'Mathematics', year: 'Year 9', department: 'STEM', teacher: 'Dr. Johnson' },
  { name: 'Physics', year: 'Year 10', department: 'STEM', teacher: 'Mrs. Smith' },
  { name: 'English Literature', year: 'Year 11', department: 'Humanities', teacher: 'Mr. Davis' },
  { name: 'World History', year: 'Year 9', department: 'Humanities', teacher: 'Ms. Wilson' },
  { name: 'Chemistry', year: 'Year 12', department: 'STEM', teacher: 'Dr. Brown' },
  { name: 'Biology', year: 'Year 10', department: 'STEM', teacher: 'Mr. Thomas' },
  { name: 'Art', year: 'Year 11', department: 'Arts', teacher: 'Mrs. Garcia' },
  { name: 'Physical Education', year: 'Year 12', department: 'Health', teacher: 'Coach Miller' }
];

const YEARS = ['All Years', 'Year 9', 'Year 10', 'Year 11', 'Year 12'];

export default function AdminSubjectPage() {
  const [filterYear, setFilterYear] = useState('All Years');
  const [search, setSearch] = useState('');

  const filteredSubjects = SUBJECTS.filter((subject) => {
    return (
      (filterYear === 'All Years' || subject.year === filterYear) &&
      subject.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#800000] mb-4 md:mb-0 drop-shadow-sm">Subjects</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search subjects..."
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#800000] shadow-sm transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#800000] shadow-sm transition text-gray-800 bg-white"
          >
            {YEARS.map((year) => (
              <option key={year} value={year} className="text-gray-800 bg-white">{year}</option>
            ))}
          </select>

          <button className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-2 rounded-lg flex items-center gap-1 shadow-md hover:from-blue-700 hover:to-blue-500 transition font-semibold">
            <Plus size={16} /> Add Subject
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="bg-white/90 rounded-xl shadow-lg border border-gray-200 p-2">
          <table className="min-w-full bg-transparent">
            <thead className="bg-gray-100 text-sm text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Subject Name</th>
                <th className="px-4 py-2 text-left">Year</th>
                <th className="px-4 py-2 text-left">Department</th>
                <th className="px-4 py-2 text-left">Teacher</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((subject, idx) => (
                <tr
                  key={idx}
                  className="border-t border-gray-200 hover:bg-blue-50/60 transition"
                >
                  <td className="px-4 py-2 text-gray-800">{subject.name}</td>
                  <td className="px-4 py-2 text-gray-700">{subject.year}</td>
                  <td className="px-4 py-2 text-gray-700">{subject.department}</td>
                  <td className="px-4 py-2 text-gray-700">{subject.teacher}</td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button className="hover:bg-blue-100 p-1 rounded transition"><Eye className="text-blue-600 w-4 h-4" /></button>
                    <button className="hover:bg-orange-100 p-1 rounded transition"><Edit className="text-orange-500 w-4 h-4" /></button>
                    <button className="hover:bg-red-100 p-1 rounded transition"><Trash2 className="text-red-600 w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
