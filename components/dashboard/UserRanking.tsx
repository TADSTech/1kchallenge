'use client';

import { motion } from 'framer-motion';
import { Trophy, Users, Zap } from 'lucide-react';
import { firebaseAuth } from '@/lib/firebase';

interface RankUser {
  id: string;
  username: string;
  balance: number;
  isCurrentUser?: boolean;
}

export function UserRanking({ 
  currentUserBalance = 0, 
  currentUsername = 'You',
  rankings = []
}: { 
  currentUserBalance?: number; 
  currentUsername?: string;
  rankings?: RankUser[];
}) {
  // Merge current user into rankings for display
  const allRankings = [...rankings];
  
  // If current user is not in the rankings list, add them
  const currentUserId = firebaseAuth.currentUser?.uid;
  if (currentUserId && !allRankings.find(r => r.id === currentUserId)) {
    allRankings.push({ 
      id: currentUserId, 
      username: currentUsername, 
      balance: currentUserBalance, 
      isCurrentUser: true 
    });
  }

  const sortedRankings = allRankings.sort((a, b) => b.balance - a.balance);

  return (
    <div className="w-full max-w-md bg-voidBlack border-2 border-cyberLime/20 rounded-lg overflow-hidden font-mono">
      <div className="bg-cyberLime/5 border-b border-cyberLime/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-cyberLime">
          <Trophy size={18} />
          <span className="text-xs font-bold uppercase tracking-[0.2em]">Global_Ranking</span>
        </div>
        <div className="flex items-center gap-2 text-cyberLime/40 text-[10px] uppercase">
          <Users size={14} />
          <span>{allRankings.length} Active Nodes</span>
        </div>
      </div>

      <div className="p-4 space-y-2">
        {sortedRankings.map((user, index) => (
          <motion.div 
            key={user.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-3 rounded transition-colors ${user.isCurrentUser ? 'bg-cyberLime/20 border border-cyberLime shadow-[0_0_10px_rgba(57,255,20,0.1)]' : 'hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-4">
              <span className={`text-xs font-bold w-4 ${index < 3 ? 'text-cyberLime' : 'text-cyberLime/40'}`}>
                {index + 1}
              </span>
              <div className="flex flex-col">
                <span className={`text-sm font-bold ${user.isCurrentUser ? 'text-white' : 'text-cyberLime/80'}`}>
                  {user.username}
                </span>
                {user.isCurrentUser && (
                  <span className="text-[8px] text-cyberLime animate-pulse uppercase">Active_Session_Node</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-white font-bold">
              <span className="text-xs tracking-tighter">${user.balance.toLocaleString()}</span>
              {index === 0 && <Zap size={12} className="text-cyberLime fill-cyberLime" />}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-cyberLime/5 px-6 py-3 border-t border-cyberLime/20">
        <p className="text-[8px] text-cyberLime/40 uppercase tracking-[0.2em] text-center">
          Live_Data_Stream — Refreshing_Protocol_Active
        </p>
      </div>
    </div>
  );
}
