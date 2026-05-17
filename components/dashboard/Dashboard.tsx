'use client';

import { useState } from 'react';
import { AccountLog } from '@/lib/types';
import { AddLogButton } from './AddLogButton';
import { AccountLogCard } from './AccountLogCard';
import { AuditLogModal } from './AuditLogModal';
import { BalanceBar } from './BalanceBar';
import { UserRanking } from './UserRanking';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAccountLogs } from '@/lib/hooks/useAccountLogs';
import Link from 'next/link';

export function Dashboard() {
  const { user } = useAuth();
  const { logs, rankings, isLoading, addLog } = useAccountLogs();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddLog = async (logData: Partial<AccountLog>) => {
    setIsSubmitting(true);
    try {
      await addLog(logData);
    } catch (error) {
      console.error('Failed to commit log:', error);
      alert('SYSTEM_ERROR: Data broadcast failed. Integrity compromised.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentBalance = logs.reduce((acc, log) => acc + log.amount, 0);
  const isPending = logs.some(log => log.status === 'PENDING');

  const CHALLENGE_START_DATE = new Date('2026-05-11T00:00:00');
  const isChallengeStarted = new Date() >= CHALLENGE_START_DATE;


  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto my-32 text-center font-mono">
        <div className="inline-block animate-spin mb-4 text-cyberLime">⟳</div>
        <p className="text-cyberLime text-xs tracking-widest">SYNCHRONIZING_WITH_LEDGER...</p>
      </div>
    );
  }

  return (
    <section id="dashboard" className="w-full max-w-7xl mx-auto my-32 relative px-6">
      <BalanceBar current={currentBalance} target={1000} isPending={isPending} />

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Log Area */}
        <div className="flex-1">
          <div className="mb-12 text-left relative">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-block"
            >
              <span className="text-cyberLime/50 font-mono text-[10px] tracking-[0.5em] uppercase block mb-2">
                Live_Operational_Ledger
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white neon-glow uppercase tracking-tighter mb-4">
                Audit Trail
              </h2>
            </motion.div>
          </div>

          <AddLogButton 
            onAdd={() => setIsModalOpen(true)} 
            isDisabled={!isChallengeStarted}
          />


          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 mt-12">
            <AnimatePresence mode="popLayout">
              {logs.map((log) => (
                <motion.div 
                  key={log.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <AccountLogCard log={log} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {logs.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-cyberLime/10 rounded-lg">
              <p className="text-cyberLime/30 font-mono text-sm tracking-widest uppercase">
                No verified logs detected in current cycle.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar / Rankings */}
        <div className="lg:w-80">
          <div className="sticky top-32 space-y-8">
            <UserRanking 
              currentUserBalance={currentBalance} 
              currentUsername={user?.username || 'You'} 
              rankings={rankings} 
            />
            
            <div className="p-6 border border-cyberLime/10 bg-cyberLime/5 rounded-lg font-mono">
              <span className="text-[10px] text-cyberLime/40 block mb-2 uppercase">System_Uptime</span>
              <div className="text-white text-sm font-bold">99.998%</div>
              <div className="mt-4 text-[9px] text-cyberLime/30 leading-relaxed uppercase">
                All transactions are encrypted and mirrored across three secure nodes.
              </div>
            </div>

            {/* Hackathon Agenda Generator Link Card */}
            <div className="p-6 border border-pink-500/20 bg-pink-500/5 rounded-lg font-mono relative overflow-hidden group hover:border-blue-400/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-500/10 to-blue-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
              <span className="text-[10px] text-pink-500 font-bold block mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
                Active_Tool_Suite
              </span>
              <div className="text-white text-xs font-bold mb-1 uppercase tracking-tight">Agenda Generator</div>
              <p className="text-[9px] text-slate-400 leading-relaxed uppercase mb-4">
                Generate, preview, and print premium agendas in high-visibility light pastel style.
              </p>
              <Link
                href="/agenda"
                className="w-full py-2 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 rounded text-center text-white text-[10px] font-bold uppercase tracking-widest block transition-all hover:shadow-md hover:shadow-pink-500/10 cursor-pointer"
              >
                Launch Builder 🚀
              </Link>
            </div>
          </div>
        </div>
      </div>

      <AuditLogModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddLog} 
      />

      {isSubmitting && (
        <div className="fixed inset-0 z-[200] bg-voidBlack/60 backdrop-blur-sm flex flex-col items-center justify-center font-mono">
          <div className="w-12 h-12 border-2 border-cyberLime border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-cyberLime text-xs tracking-[0.4em] uppercase animate-pulse">Broadcasting_Data...</p>
        </div>
      )}
    </section>
  );
}
