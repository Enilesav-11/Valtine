import { useState, useEffect } from 'react';
import { Heart, Clock, MessageSquare, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Response {
  key: string;
  value: {
    answer: 'yes' | 'no' | 'maybe';
    message: string;
    timestamp: string;
  };
}

export function Admin() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ad8f2b21/responses`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error fetching responses:', errorText);
        throw new Error('Failed to fetch responses');
      }

      const data = await res.json();
      setResponses(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAnswerColor = (answer: string) => {
    switch (answer) {
      case 'yes':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'no':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'maybe':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getAnswerEmoji = (answer: string) => {
    switch (answer) {
      case 'yes':
        return '💕';
      case 'no':
        return '💔';
      case 'maybe':
        return '🤔';
      default:
        return '💌';
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const stats = {
    yes: responses.filter(r => r.value.answer === 'yes').length,
    no: responses.filter(r => r.value.answer === 'no').length,
    maybe: responses.filter(r => r.value.answer === 'maybe').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Invitation
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            <h1 className="text-4xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-gray-600">View all Valentine's Day responses</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
            <div className="text-4xl mb-2">💕</div>
            <div className="text-3xl font-bold text-green-700">{stats.yes}</div>
            <div className="text-green-600 font-medium">Yes</div>
          </div>
          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 text-center">
            <div className="text-4xl mb-2">🤔</div>
            <div className="text-3xl font-bold text-purple-700">{stats.maybe}</div>
            <div className="text-purple-600 font-medium">Maybe</div>
          </div>
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
            <div className="text-4xl mb-2">💔</div>
            <div className="text-3xl font-bold text-red-700">{stats.no}</div>
            <div className="text-red-600 font-medium">No</div>
          </div>
        </div>

        {/* Total Responses */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Total Responses: {responses.length}
          </h2>
        </div>

        {/* Responses List */}
        {loading ? (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-pink-400 fill-pink-400 animate-pulse mx-auto mb-4" />
            <p className="text-gray-600">Loading responses...</p>
          </div>
        ) : responses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <Heart className="w-16 h-16 text-gray-300 fill-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No responses yet</p>
            <p className="text-gray-400">Share your invitation to get responses!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {responses.map((response, index) => (
              <div
                key={response.key}
                className="bg-white rounded-xl shadow-lg p-6 border-2 border-pink-100 hover:border-pink-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getAnswerEmoji(response.value.answer)}</span>
                    <span
                      className={`px-4 py-2 rounded-full font-bold text-sm border-2 ${getAnswerColor(
                        response.value.answer
                      )}`}
                    >
                      {response.value.answer.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Clock className="w-4 h-4" />
                    {formatDate(response.value.timestamp)}
                  </div>
                </div>

                {response.value.message && (
                  <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-pink-400">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-5 h-5 text-pink-500 mt-0.5" />
                      <div>
                        <p className="text-gray-700 italic">
                          "{response.value.message}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
