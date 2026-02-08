import { useState, useRef, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function Invitation() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [noButtonSize, setNoButtonSize] = useState(100);
  const [yesButtonSize, setYesButtonSize] = useState(100);
  const [attempts, setAttempts] = useState(0);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  const handleYes = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ad8f2b21/response`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            answer: 'yes',
            message: '',
            timestamp: new Date().toISOString(),
          }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error submitting response:', errorText);
        throw new Error('Failed to submit response');
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNoHover = () => {
    setAttempts(prev => prev + 1);
    
    // Make Yes button bigger and No button smaller each time
    setYesButtonSize(prev => Math.min(prev + 20, 200));
    setNoButtonSize(prev => Math.max(prev - 10, 40));
    
    // Move No button to random position
    const maxX = window.innerWidth - 150;
    const maxY = window.innerHeight - 100;
    setNoButtonPosition({
      x: Math.random() * maxX,
      y: Math.random() * maxY,
    });
  };

  // No button can never actually be clicked - it always escapes!
  const handleNoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleNoHover();
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-red-200 to-pink-300 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center animate-[bounceIn_0.6s_ease-out]">
          <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-white">
            {/* Header */}
            <div className="mb-8">
              <Heart className="w-24 h-24 text-red-500 fill-red-500 mx-auto animate-[heartbeat_1s_ease-in-out_infinite] mb-6" />
              <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500 mb-4">
                Yay! It's a Date! 💕
              </h1>
              <p className="text-xl text-gray-700 font-semibold">
                I knew you'd say yes! Here are the details...
              </p>
            </div>

            {/* Date Details */}
            <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl p-8 mb-6 border-2 border-pink-200">
              <div className="space-y-6">
                {/* Time */}
                <div className="flex items-center justify-center gap-4">
                  <div className="text-5xl">⏰</div>
                  <div className="text-left">
                    <p className="text-sm text-gray-600 font-medium">Time</p>
                    <p className="text-3xl font-bold text-gray-800">1:00 PM</p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center justify-center gap-4">
                  <div className="text-5xl">📅</div>
                  <div className="text-left">
                    <p className="text-sm text-gray-600 font-medium">Date</p>
                    <p className="text-2xl font-bold text-gray-800">Valentine's Day</p>
                    <p className="text-lg text-gray-600">February 14th, 2026</p>
                  </div>
                </div>

                {/* Dress Code */}
                <div className="bg-white/80 rounded-xl p-6 border-2 border-pink-300">
                  <div className="text-4xl mb-3">👗✨</div>
                  <p className="text-lg font-bold text-gray-800 mb-2">Dress Code</p>
                  <p className="text-gray-700 text-base">
                    Dress well & look your best!
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    Something nice and comfortable
                  </p>
                </div>
              </div>
            </div>

            {/* Final Message */}
            <div className="text-center mb-4">
              <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500">
                Can't wait to see you! 💖
              </p>
            </div>

            {/* Additional note */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <p className="text-gray-700 text-sm">
                <span className="font-semibold">P.S.</span> If you need to reschedule or have any questions, just chat me! 💬
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-red-200 to-pink-300 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating hearts animation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-white fill-white opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${15 + Math.random() * 25}px`,
              height: `${15 + Math.random() * 25}px`,
              animation: `float ${4 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="text-center relative z-10 max-w-2xl">
        {/* Main Question */}
        <div className="mb-12 animate-[slideDown_0.6s_ease-out]">
          <div className="flex justify-center mb-6">
            <Heart className="w-20 h-20 md:w-24 md:h-24 text-red-600 fill-red-600 animate-[heartbeat_1.5s_ease-in-out_infinite]" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            Will you be my Valentine?
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium drop-shadow-md">
            💝 This Valentine's Day 💝
          </p>
        </div>

        {/* Buttons Container */}
        <div className="relative flex flex-col items-center gap-6">
          {/* Yes Button - grows bigger */}
          <button
            onClick={handleYes}
            disabled={isSubmitting}
            style={{
              width: `${yesButtonSize * 1.8}px`,
              height: `${yesButtonSize * 0.6}px`,
              fontSize: `${yesButtonSize * 0.2}px`,
            }}
            className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed z-20 border-4 border-white"
          >
            YES! 💕
          </button>

          {/* No Button - moves around and gets smaller */}
          <button
            ref={noButtonRef}
            onMouseEnter={handleNoHover}
            onTouchStart={handleNoHover}
            onMouseDown={handleNoClick}
            onClick={handleNoClick}
            disabled={isSubmitting}
            style={{
              position: attempts > 0 ? 'fixed' : 'relative',
              left: attempts > 0 ? `${noButtonPosition.x}px` : 'auto',
              top: attempts > 0 ? `${noButtonPosition.y}px` : 'auto',
              width: `${noButtonSize * 1.4}px`,
              height: `${noButtonSize * 0.5}px`,
              fontSize: `${noButtonSize * 0.18}px`,
            }}
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold rounded-full shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-10 border-2 border-white"
          >
            No 😢
          </button>
        </div>

        {/* Encouraging text that appears after attempts */}
        {attempts > 0 && (
          <div className="mt-8 animate-[fadeIn_0.5s_ease-in]">
            <p className="text-white text-xl font-semibold drop-shadow-md">
              {attempts === 1 && "Oops! The button moved! 🙈"}
              {attempts === 2 && "You can't say no to this! 🥺"}
              {attempts === 3 && "Just click YES already! 🥹"}
              {attempts === 4 && "The NO button doesn't work! 💝"}
              {attempts === 5 && "It's impossible to say no! 😄"}
              {attempts >= 6 && "You know you want to say yes! 💗"}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(10deg);
          }
        }
        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.1);
          }
          50% {
            transform: scale(1);
          }
          75% {
            transform: scale(1.15);
          }
        }
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes wiggle {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(10deg);
          }
          50% {
            transform: rotate(-10deg);
          }
          75% {
            transform: rotate(10deg);
          }
        }
      `}</style>
    </div>
  );
}