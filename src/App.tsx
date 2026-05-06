/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import Lobby from './components/Lobby';
import StudyView from './components/StudyView';
import Leaderboard from './components/Leaderboard';
import VocabularyList from './components/VocabularyList';
import { GOETHE_A2_VOCAB } from './data/vocabulary';
import { UserStats, LeaderboardEntry } from './types';
import { AnimatePresence, motion } from 'motion/react';
import { User, Sparkles, Moon, Sun, Heart } from 'lucide-react';

const STORAGE_KEY = 'flashquest_stats';
const PROFILE_KEY = 'flashquest_profile';

const INITIAL_STATS: UserStats = {
  xp: 0,
  streak: 1,
  lastStudyDate: null,
  cardsLearned: 0,
  totalTime: 0
};

const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', name: 'Lukas', avatar: '🦊', xp: 2450, rank: 1 },
  { id: '2', name: 'Emma', avatar: '🐱', xp: 2100, rank: 2 },
  { id: '3', name: 'Maximilian', avatar: '🐼', xp: 1850, rank: 3 },
  { id: '4', name: 'Sophie', avatar: '🐰', xp: 1400, rank: 4 },
  { id: '6', name: 'Hanna', avatar: '🐨', xp: 950, rank: 6 },
];

type View = 'lobby' | 'study' | 'leaderboard' | 'onboarding' | 'vocabulary';

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="w-24 h-24 rounded-3xl bg-indigo-600 flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-indigo-200 mb-8">
          VT
        </div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-black text-slate-900 tracking-tight text-center"
        >
          Master Goethe A2 Vocabulary
        </motion.h1>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: 100 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="h-1 bg-indigo-100 rounded-full mt-4 overflow-hidden"
        >
          <motion.div 
            animate={{ x: [-100, 100] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-1/2 h-full bg-indigo-600 rounded-full"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<View>('lobby');
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [playerName, setPlayerName] = useState<string>('');
  const [playerAvatar, setPlayerAvatar] = useState<string>('🐯');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedStats = localStorage.getItem(STORAGE_KEY);
    const savedProfile = localStorage.getItem(PROFILE_KEY);

    if (savedStats) setStats(JSON.parse(savedStats));
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setPlayerName(profile.name);
      setPlayerAvatar(profile.avatar);
    } else {
      setView('onboarding');
    }

    // Simulate loading for 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const saveStats = (newStats: UserStats) => {
    setStats(newStats);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
  };

  const handleFinishSession = (result: { xp: number; correctCount: number }) => {
    const today = new Date().toLocaleDateString();
    const isNewDay = stats.lastStudyDate !== today;
    
    const updatedStats: UserStats = {
      ...stats,
      xp: stats.xp + result.xp,
      cardsLearned: stats.cardsLearned + result.correctCount,
      streak: isNewDay ? stats.streak + 1 : stats.streak,
      lastStudyDate: today,
    };
    
    saveStats(updatedStats);
    setView('lobby');
  };

  const handleProfileSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ name: playerName, avatar: playerAvatar }));
    setView('lobby');
  };

  const leaderboardWithPlayer = [
    ...INITIAL_LEADERBOARD,
    { id: 'me', name: playerName || 'You', avatar: playerAvatar, xp: stats.xp, rank: 5, isCurrentUser: true }
  ].sort((a, b) => b.xp - a.xp);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (view === 'onboarding') {
    return (
      <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-6 transition-colors duration-300">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl text-center"
        >
          <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl">
            {playerAvatar}
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Create Profile</h1>
          <p className="text-slate-500 font-medium mb-8">Join the VocabTrainer league!</p>
          
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Your Name</label>
              <input 
                type="text" 
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter nickname..."
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-indigo-500 transition-colors outline-none"
                autoFocus
              />
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {['🐯', '🦊', '🐱', '🐼', '🐨', '🦁', '🐸', '🦄'].map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setPlayerAvatar(emoji)}
                  className={`text-2xl p-2 rounded-xl transition-all border ${playerAvatar === emoji ? 'bg-indigo-600 border-transparent scale-110 shadow-lg' : 'bg-slate-50 border-slate-100 opacity-60'}`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <button 
              type="submit"
              disabled={!playerName.trim()}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:bg-slate-300"
            >
              LET'S GO!
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <AnimatePresence mode="wait">
        {view === 'lobby' && (
          <motion.div
            key="lobby"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Lobby 
              stats={stats} 
              onStart={() => setView('study')}
              onViewLeaderboard={() => setView('leaderboard')}
              onViewDeck={() => setView('vocabulary')}
            />
          </motion.div>
        )}

        {view === 'study' && (
          <motion.div
            key="study"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-white z-50 overflow-y-auto"
          >
            <StudyView 
              cards={GOETHE_A2_VOCAB} 
              onFinish={handleFinishSession}
              onClose={() => setView('lobby')}
            />
          </motion.div>
        )}

        {view === 'leaderboard' && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed inset-0 bg-slate-50 z-50 overflow-y-auto"
          >
            <Leaderboard 
              entries={leaderboardWithPlayer}
              onBack={() => setView('lobby')}
            />
          </motion.div>
        )}

        {view === 'vocabulary' && (
          <motion.div
            key="vocabulary"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed inset-0 bg-white z-50 overflow-y-auto"
          >
            <VocabularyList 
              onBack={() => setView('lobby')}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="w-full py-10 flex flex-col items-center justify-center space-y-2 opacity-40">
        <p className="text-xs font-black tracking-widest uppercase text-slate-400">Made with ❤️ by Sehas</p>
        <p className="text-[10px] font-bold text-slate-300">© 2026 VocabTrainer Elite</p>
      </footer>
    </div>
  );
}
