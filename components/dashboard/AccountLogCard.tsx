'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Landmark, CheckCircle, Clock } from 'lucide-react';
import { AccountLog } from '@/lib/types';
import { COLORS } from '@/lib/constants';
import { lineByLineVariants, lineItemVariants } from '@/lib/animations';

interface AccountLogCardProps {
  log: AccountLog;
}

export function AccountLogCard({ log }: AccountLogCardProps) {
  const [isFlickering, setIsFlickering] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const scheduleFlicker = () => {
      const delay = Math.floor(Math.random() * (8000 - 4000 + 1)) + 4000;
      timeoutId = setTimeout(() => {
        setIsFlickering(true);
        setTimeout(() => setIsFlickering(false), 200);
        scheduleFlicker();
      }, delay);
    };

    scheduleFlicker();
    return () => clearTimeout(timeoutId);
  }, []);

  const isVerified = log.status === 'VERIFIED';
  const statusColor = isVerified ? COLORS.cyberLime : COLORS.alertOrange;
  const statusBorder = isVerified ? 'border-cyberLime/30' : 'border-alertOrange/40';
  const statusHover = isVerified ? 'hover:border-cyberLime/60' : 'hover:border-alertOrange/70';
  const StatusIcon = isVerified ? CheckCircle : Clock;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div 
      className={`glass border-2 ${statusBorder} ${statusHover} p-6 rounded-lg font-mono relative overflow-hidden transition-colors bg-voidBlack/40`}
      style={{ animation: isFlickering ? 'crtFlicker 0.2s ease-in-out' : 'none' }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={lineByLineVariants}
    >
      <div className="flex justify-between items-start mb-6">
        <motion.div variants={lineItemVariants}>
          <span className={`text-[10px] ${isVerified ? 'text-cyberLime/50' : 'text-alertOrange/50'} block mb-1 uppercase tracking-widest`}>
            {isVerified ? 'VERIFIED_SOURCE' : 'AWAITING_VERIFICATION'}
          </span>
          <h3 className="text-lg font-bold text-white tracking-tight">
            {log.source}
          </h3>
        </motion.div>
        <motion.div variants={lineItemVariants} className="text-right">
          <span className={`text-[10px] ${isVerified ? 'text-cyberLime/50' : 'text-alertOrange/50'} block mb-1 uppercase tracking-widest`}>TIMESTAMP</span>
          <span className={`text-xs ${isVerified ? 'text-cyberLime/80' : 'text-alertOrange/80'}`}>{formatDate(log.timestamp)}</span>
        </motion.div>
      </div>

      <motion.div variants={lineItemVariants} className="mb-6">
        <p className="text-sm text-gray-400 leading-relaxed border-l-2 border-white/5 pl-4 py-1">
          {log.description}
        </p>
      </motion.div>

      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <motion.div variants={lineItemVariants} className="flex items-center gap-2">
          <StatusIcon size={16} style={{ color: statusColor }} className={!isVerified ? 'animate-pulse' : ''} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: statusColor }}>
            {log.status}
          </span>
        </motion.div>
        
        <motion.div variants={lineItemVariants} className="flex items-center gap-2 text-white/20">
          <Landmark size={14} />
          <span className="text-[10px] uppercase tracking-widest">
            {isVerified ? 'SECURE_LEDGER' : 'PENDING_AUDIT'}
          </span>
        </motion.div>
      </div>

      {!isVerified && (
        <div className="absolute top-0 right-0 p-1">
          <div className="bg-alertOrange text-black text-[8px] px-2 font-bold uppercase tracking-tighter">
            Action_Required
          </div>
        </div>
      )}
    </motion.div>
  );
}
