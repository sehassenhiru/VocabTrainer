import { motion } from 'motion/react';
import { ArrowLeft, Search, BookOpen, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { GOETHE_A2_VOCAB } from '../data/vocabulary';
import { cn } from '../lib/utils';

interface VocabularyListProps {
  onBack: () => void;
}

export default function VocabularyList({ onBack }: VocabularyListProps) {
  const [search, setSearch] = useState('');
  
  const filteredWords = GOETHE_A2_VOCAB.filter(card => 
    card.word.toLowerCase().includes(search.toLowerCase()) ||
    card.definition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full max-w-md mx-auto min-h-screen bg-white relative">
      {/* Header */}
      <div className="p-6 pb-4 bg-white sticky top-0 z-20 border-b border-slate-100">
        <button onClick={onBack} className="flex items-center text-indigo-600 font-bold mb-4 hover:translate-x-[-4px] transition-transform">
          <ArrowLeft size={20} className="mr-1" />
          Lobby
        </button>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">WORD BANK</h2>
          <div className="bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            <span className="text-xs font-black text-indigo-600">{GOETHE_A2_VOCAB.length} WORDS</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search vocab..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-3 font-bold text-slate-900 focus:border-indigo-500 transition-colors outline-none"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 p-4 space-y-3">
        {filteredWords.length > 0 ? (
          filteredWords.map((card, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.05, 1) }}
              key={card.id}
              className="group p-4 bg-white rounded-3xl border-2 border-slate-50 hover:border-indigo-100 transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                    {card.word}
                  </h4>
                  <p className="text-sm font-bold text-slate-500 italic">
                    {card.definition}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">
                      {card.category}
                    </span>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                      card.difficulty === 'easy' ? "bg-emerald-50 text-emerald-600" :
                      card.difficulty === 'medium' ? "bg-amber-50 text-amber-600" :
                      "bg-rose-50 text-rose-600"
                    )}>
                      {card.difficulty}
                    </span>
                  </div>
                </div>
                <BookOpen size={20} className="text-slate-200 group-hover:text-indigo-200 transition-colors" />
              </div>
              <div className="mt-3 pt-3 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-xs text-slate-400 font-medium">"{card.example}"</p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <Search size={32} />
            </div>
            <div>
              <p className="font-black text-slate-900">No words found</p>
              <p className="text-sm text-slate-400 font-bold">Try a different search term</p>
            </div>
          </div>
        )}
      </div>

      {/* Decorative Blob */}
      <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
    </div>
  );
}
