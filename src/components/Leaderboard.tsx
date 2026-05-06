import { motion } from 'motion/react';
import { Trophy, ArrowLeft, Medal } from 'lucide-react';
import { LeaderboardEntry } from '../types';
import { TOTAL_GOETHE_A2_COUNT } from '../data/vocabulary';
import { cn } from '../lib/utils';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  onBack: () => void;
}

export default function Leaderboard({ entries, onBack }: LeaderboardProps) {
  const sortedEntries = [...entries].sort((a, b) => b.xp - a.xp);

  const getCoverage = (xp: number) => {
    // Estimating coverage based on XP for mock users
    // If it's the current user, we could pass the actual stats, but XP is a good proxy for now
    const learned = Math.floor(xp / 20); // Assumption: 20 XP per card
    return Math.min(100, Math.round((learned / TOTAL_GOETHE_A2_COUNT) * 100));
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto min-h-screen bg-slate-50 relative overflow-hidden transition-colors duration-300">
      {/* Header */}
      <div className="p-6 pb-2 relative z-10">
        <button onClick={onBack} className="flex items-center text-indigo-600 font-bold mb-6 hover:translate-x-[-4px] transition-transform">
          <ArrowLeft size={20} className="mr-1" />
          Back home
        </button>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">FRIENDS<br/>RANKING</h2>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Season 1: Master of Goethe</p>
      </div>

      {/* Podium (Top 3) */}
      <div className="px-6 py-8 flex items-end justify-center space-x-2 relative z-10">
        {/* 2nd Place */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-xl font-bold mb-2 overflow-hidden">
             {sortedEntries[1]?.avatar || '🥈'}
          </div>
          <div className="w-20 h-24 bg-white/50 border-t-2 border-slate-200 rounded-t-3xl flex flex-col items-center pt-2">
            <span className="text-[10px] font-black text-slate-400">#2</span>
            <span className="text-xs font-bold text-slate-700 truncate w-16 text-center">{sortedEntries[1]?.name}</span>
          </div>
        </div>

        {/* 1st Place */}
        <div className="flex flex-col items-center">
          <Medal size={24} className="text-yellow-500 mb-1 fill-yellow-400 drop-shadow-lg" />
          <div className="w-20 h-20 rounded-2xl bg-yellow-400 border-4 border-yellow-200 shadow-xl flex items-center justify-center text-2xl font-bold mb-2 scale-110 relative overflow-hidden">
             {sortedEntries[0]?.avatar || '👑'}
          </div>
          <div className="w-24 h-32 bg-indigo-600 rounded-t-3xl flex flex-col items-center pt-4 text-white shadow-lg">
            <span className="text-xs font-black text-indigo-300">WINNER</span>
            <span className="text-sm font-black truncate w-20 text-center">{sortedEntries[0]?.name}</span>
            <span className="text-xs font-bold mt-1 text-indigo-200">{getCoverage(sortedEntries[0]?.xp)}% Covered</span>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 border-2 border-white shadow-sm flex items-center justify-center text-xl font-bold mb-2 overflow-hidden">
             {sortedEntries[2]?.avatar || '🥉'}
          </div>
          <div className="w-18 h-20 bg-white/30 border-t-2 border-slate-200 rounded-t-3xl flex flex-col items-center pt-2">
            <span className="text-[10px] font-black text-slate-400">#3</span>
            <span className="text-xs font-bold text-slate-700 truncate w-14 text-center">{sortedEntries[2]?.name}</span>
          </div>
        </div>
      </div>

      {/* Full List */}
      <div className="flex-1 bg-white rounded-t-[3rem] shadow-2xl p-6 pt-10 relative z-10 border-t border-slate-100">
        <div className="space-y-4">
          {sortedEntries.slice(3).map((player, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={player.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-3xl border-2 transition-all",
                player.isCurrentUser ? "bg-indigo-50 border-indigo-200" : "bg-white border-transparent hover:border-slate-100"
              )}
            >
              <div className="flex items-center space-x-4">
                <span className="w-6 text-sm font-black text-slate-300">0{idx + 4}</span>
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                  {player.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{player.name} {player.isCurrentUser && "(Me)"}</h4>
                  <div className="flex items-center space-x-2">
                    <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-400 transition-all duration-1000" 
                        style={{ width: `${getCoverage(player.xp)}%` }} 
                      />
                    </div>
                    <span className="text-[10px] font-black text-indigo-400">{getCoverage(player.xp)}%</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="block font-black text-indigo-600">{player.xp}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">XP</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative Blob */}
      <div className="absolute -top-10 -right-20 w-80 h-80 bg-indigo-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute top-1/2 -left-20 w-60 h-60 bg-pink-50 rounded-full blur-3xl opacity-30" />
    </div>
  );
}
