import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flashcard as FlashcardType } from '../types';
import Flashcard from './Flashcard';
import { X, Trophy, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudyViewProps {
  cards: FlashcardType[];
  onFinish: (result: { xp: number; correctCount: number }) => void;
  onClose: () => void;
}

export default function StudyView({ cards, onFinish, onClose }: StudyViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  // Take a slice of 10 cards for a session
  const sessionCards = useMemo(() => {
    return [...cards].sort(() => Math.random() - 0.5).slice(0, 5);
  }, [cards]);

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      setCorrectCount(prev => prev + 1);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899']
      });
    }

    if (currentIndex < sessionCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowSummary(true);
    }
  };

  const xpEarned = correctCount * 20;

  if (showSummary) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-8 animate-in zoom-in duration-500 bg-white">
        <div className="relative">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center text-amber-500 relative z-10"
          >
            <Trophy size={64} className="fill-amber-400" />
          </motion.div>
          <motion.div 
             animate={{ scale: [1, 1.2, 1] }}
             transition={{ repeat: Infinity, duration: 2 }}
             className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl" 
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-4xl font-black text-gray-900">QUEST COMPLETE!</h2>
          <p className="text-gray-500 font-bold">You're getting so much better at German!</p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          <div className="bg-indigo-50 p-6 rounded-3xl border-2 border-indigo-100">
            <div className="text-3xl font-black text-indigo-600">{xpEarned}</div>
            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">XP Earned</div>
          </div>
          <div className="bg-emerald-50 p-6 rounded-3xl border-2 border-emerald-100">
            <div className="text-3xl font-black text-emerald-600">{correctCount}/{sessionCards.length}</div>
            <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Correct</div>
          </div>
        </div>

        <button 
          onClick={() => onFinish({ xp: xpEarned, correctCount })}
          className="w-full max-w-sm bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
        >
          CONTINUE
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto p-4 space-y-8 bg-white transition-colors duration-300">
      {/* HUD Backdrop */}
      <div className="flex items-center justify-between">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
          <X size={24} />
        </button>
        
        {/* Progress Bar */}
        <div className="flex-1 mx-4 h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-100">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / sessionCards.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
          />
        </div>

        <div className="flex items-center space-x-1 font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-xs">
          <span>{currentIndex + 1}</span>
          <span className="text-indigo-300">/</span>
          <span>{sessionCards.length}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="w-full flex justify-center"
          >
            <Flashcard 
              card={sessionCards[currentIndex]} 
              onAnswer={handleAnswer} 
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="h-20 flex justify-center items-center text-gray-400">
        <p className="text-sm font-bold animate-pulse uppercase tracking-widest">Mastering Vocabulary...</p>
      </div>
    </div>
  );
}
