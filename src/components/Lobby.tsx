import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Trophy, BookOpen, Flame, Star, Settings } from 'lucide-react';
import { UserStats } from '../types';
import { TOTAL_GOETHE_A2_COUNT } from '../data/vocabulary';
import { cn } from '../lib/utils';

interface LobbyProps {
  stats: UserStats;
  onStart: () => void;
  onViewLeaderboard: () => void;
  onViewDeck: () => void;
}

export default function Lobby({ stats, onStart, onViewLeaderboard, onViewDeck }: LobbyProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const EXAM_DATE = new Date('2026-05-15T09:00:00');
      const diff = EXAM_DATE.getTime() - now.getTime();
      
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          mins: Math.floor((diff / 1000 / 60) % 60)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const coveragePercent = Math.min(100, Math.round((stats.cardsLearned / TOTAL_GOETHE_A2_COUNT) * 100));

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-6 space-y-8 animate-in fade-in transition-all duration-500">
      {/* Header Profile Section */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
            VT
          </div>
          <div>
            <h2 className="font-bold text-gray-900 border-b-2 border-transparent">VocabTrainer</h2>
            <div className="flex items-center text-amber-500 font-bold text-sm">
              <Flame size={14} className="mr-1 fill-amber-500" />
              {stats.streak} Day Streak
            </div>
          </div>
        </div>
      </div>

      {/* Exam Countdown Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full bg-slate-900 rounded-3xl p-4 flex items-center justify-between border-2 border-slate-800 shadow-xl"
      >
        <div className="flex items-center space-x-3">
          <div className="bg-red-500/10 p-2 rounded-xl text-red-500">
            <Flame size={24} className="animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Exam Countdown</div>
            <div className="text-xl font-black text-white leading-none">May 15th</div>
          </div>
        </div>
        <div className="flex space-x-2">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-white leading-none">{timeLeft.days}</span>
            <span className="text-[8px] font-bold text-slate-500 uppercase">Days</span>
          </div>
          <span className="text-slate-700 font-black pt-1">:</span>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-white leading-none">{timeLeft.hours}</span>
            <span className="text-[8px] font-bold text-slate-500 uppercase">Hrs</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center space-y-1"
        >
          <div className="text-2xl font-black text-indigo-600 tracking-tight">{stats.xp}</div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Total XP</div>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center space-y-1"
        >
          <div className="text-2xl font-black text-purple-600 tracking-tight">{coveragePercent}%</div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Coverage</div>
        </motion.div>
      </div>

      {/* Main Action Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden"
      >
        <div className="relative z-10">
          <h3 className="text-3xl font-black mb-2 leading-tight">Get back to<br />studying!</h3>
          <p className="text-indigo-100 text-sm font-medium mb-6 opacity-90">Master Goethe A2 Vocabulary today!</p>
          <button 
            onClick={onStart}
            className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black text-xl shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center"
          >
            <Play size={24} className="mr-2 fill-indigo-600" />
            START QUEST
          </button>
        </div>
        
        {/* Abstract Shapes */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/20 rounded-full -ml-8 -mb-8 blur-xl" />
      </motion.div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <button 
          onClick={onViewLeaderboard}
          className="flex flex-col items-center justify-center p-6 bg-amber-50 border-2 border-amber-100 rounded-3xl text-amber-700 hover:bg-amber-100 transition-colors group"
        >
          <Trophy size={32} className="mb-2 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-sm">Leaderboard</span>
        </button>
        <button 
          onClick={onViewDeck}
          className="flex flex-col items-center justify-center p-6 bg-pink-50 border-2 border-pink-100 rounded-3xl text-pink-700 hover:bg-pink-100 transition-colors group"
        >
          <BookOpen size={32} className="mb-2 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-sm">Word Bank</span>
        </button>
      </div>

      {/* Achievements or Tips */}
      <div className="w-full bg-slate-50 p-4 rounded-2xl flex items-center space-x-4 border border-transparent">
        <div className="bg-yellow-100 p-2 rounded-xl text-yellow-600">
          <Star size={20} className="fill-yellow-500" />
        </div>
        <p className="text-sm font-medium text-slate-600 leading-snug">
          Tip: Study 10 cards a day to maintain your streak!
        </p>
      </div>
    </div>
  );
}
