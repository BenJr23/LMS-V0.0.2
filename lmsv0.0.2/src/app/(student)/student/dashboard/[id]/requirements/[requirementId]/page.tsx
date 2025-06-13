'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Calendar, MessageSquare, HelpCircle, Users } from 'lucide-react';
import { getRequirementDetails } from '@/app/_actions/requirement';
import toast from 'react-hot-toast';

interface Requirement {
  id: string;
  requirementNumber: number;
  title: string | null;
  content: string | null;
  scoreBase: number;
  deadline: Date;
  type: string;
  submissionStatus: 'GRADED' | 'SUBMITTED' | 'NOT_SUBMITTED';
  submission: {
    id: string;
    title: string | null;
    content: string | null;
    filePath: string | null;
    graded: boolean;
    score: number | null;
    feedback: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

export default function RequirementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequirement = async () => {
      try {
        const response = await getRequirementDetails(params.requirementId as string);
        
        if (response.success && response.data) {
          setRequirement(response.data);
        } else {
          toast.error(response.error || 'Failed to load requirement details');
        }
      } catch (error) {
        console.error('Failed to fetch requirement:', error);
        toast.error('Failed to load requirement details');
      } finally {
        setLoading(false);
      }
    };

    fetchRequirement();
  }, [params.requirementId]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#800000]"></div>
      </div>
    );
  }

  if (!requirement) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Requirement not found</h2>
        <p className="text-gray-600 mt-2">The requested requirement could not be found.</p>
      </div>
    );
  }

  const getRequirementIcon = () => {
    switch (requirement.type) {
      case 'Forum':
        return <MessageSquare className="w-6 h-6 text-blue-500" />;
      case 'Quiz':
        return <HelpCircle className="w-6 h-6 text-purple-500" />;
      case 'Assignment':
        return <FileText className="w-6 h-6 text-orange-500" />;
      case 'Activity':
        return <Users className="w-6 h-6 text-green-500" />;
      default:
        return <FileText className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div className="p-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-[#800000] hover:text-[#a52a2a] transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Requirements
      </button>

      {/* Requirement Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="bg-pink-100 p-3 rounded-lg">
            {getRequirementIcon()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-md text-sm font-medium bg-pink-100 text-[#800000]">
                {requirement.type}# {requirement.requirementNumber}
              </span>
              <span className="text-sm text-gray-500">
                {requirement.scoreBase} points
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {requirement.title || 'Untitled Requirement'}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              Due: {new Date(requirement.deadline).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Requirement Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
        <div className="prose max-w-none">
          {requirement.content || 'No description provided.'}
        </div>
      </div>

      {/* Submission Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Submission</h2>
        {requirement.submission ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Submitted on {new Date(requirement.submission.createdAt).toLocaleString()}
              </span>
              {requirement.submission.graded && (
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                  Score: {requirement.submission.score}/{requirement.scoreBase}
                </span>
              )}
            </div>
            {requirement.submission.feedback && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Feedback</h3>
                <p className="text-sm text-gray-600">{requirement.submission.feedback}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven&apos;t submitted anything yet.</p>
            <button
              onClick={() => {
                // TODO: Implement submission functionality
                toast.success('Submission functionality coming soon!');
              }}
              className="px-4 py-2 bg-[#800000] text-white rounded-md hover:bg-[#a52a2a] transition-colors"
            >
              Submit Work
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 