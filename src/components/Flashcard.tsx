import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flashcard as FlashcardType } from '../types';
import { RotateCcw, ThumbsUp, ThumbsDown, Info, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface FlashcardProps {
  card: FlashcardType;
  onAnswer: (correct: boolean) => void;
}

export default function Flashcard({ card, onAnswer }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="perspective-1000 w-full max-w-sm h-[450px] relative cursor-pointer group" onClick={() => setFlipped(!flipped)}>
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        className="w-full h-full relative"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Side */}
        <div 
          className={cn(
            "absolute inset-0 backface-hidden bg-white rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center shadow-xl border-4 transition-all",
            "border-indigo-100 group-hover:border-indigo-200"
          )}
        >
          <div className="absolute top-6 right-6">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider">
              {card.category}
            </span>
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">{card.word}</h2>
          <div className="flex items-center text-gray-400 font-medium text-sm">
            <RotateCcw size={14} className="mr-1" />
            Tap to reveal
          </div>
        </div>

        {/* Back Side */}
        <div 
          className={cn(
            "absolute inset-0 backface-hidden bg-indigo-600 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center shadow-xl border-4 border-indigo-400 rotate-y-180"
          )}
        >
          <div className="w-full text-left space-y-6">
            <div>
              <div className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-1 flex items-center">
                <Sparkles size={12} className="mr-1" />
                English Meaning
              </div>
              <p className="text-white text-2xl font-bold leading-tight">{card.definition}</p>
            </div>
            
            <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
              <div className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center">
                <Info size={12} className="mr-1" />
                Usage Example
              </div>
              <p className="text-indigo-50 text-lg font-medium italic leading-snug">"{card.example}"</p>
            </div>
          </div>
          
          <div className="mt-8 flex space-x-4 w-full">
            <button 
              onClick={(e) => { e.stopPropagation(); onAnswer(false); }}
              className="flex-1 bg-red-100/20 hover:bg-red-500 text-white rounded-2xl p-4 transition-all flex flex-col items-center group/btn"
            >
              <ThumbsDown size={24} className="mb-1" />
              <span className="text-[10px] font-black uppercase tracking-tighter opacity-0 group-hover/btn:opacity-100 transition-opacity">Skip</span>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onAnswer(true); }}
              className="flex-1 bg-emerald-100/20 hover:bg-emerald-500 text-white rounded-2xl p-4 transition-all flex flex-col items-center group/btn"
            >
              <ThumbsUp size={24} className="mb-1" />
              <span className="text-[10px] font-black uppercase tracking-tighter opacity-0 group-hover/btn:opacity-100 transition-opacity">Got it!</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
