'use client';

import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Clock } from 'lucide-react';
import { Milestone } from '@/lib/types';
import { COLORS } from '@/lib/constants';
import { lineByLineVariants, lineItemVariants } from '@/lib/animations';

interface MilestoneCardProps {
  milestone: Milestone;
}

export function MilestoneCard({ milestone }: MilestoneCardProps) {
  const [isFlickering, setIsFlickering] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const scheduleFlicker = () => {
      const delay = Math.floor(Math.random() * (8000 - 4000 + 1)) + 4000;
      timeoutId = setTimeout(() => {
        setIsFlickering(true);
        setTimeout(() => setIsFlickering(false), 200); // 200ms flicker duration
        scheduleFlicker();
      }, delay);
    };

    scheduleFlicker();

    return () => clearTimeout(timeoutId);
  }, []);

  const isVerified = milestone.status === 'VERIFIED';
  const statusColor = isVerified ? COLORS.cyberLime : COLORS.alertOrange;
  const StatusIcon = isVerified ? CheckCircle : Clock;

  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.div 
      className="glass border-4 border-[#39FF14] p-6 rounded-lg font-mono relative overflow-hidden"
      style={{ animation: isFlickering ? 'crtFlicker 0.2s ease-in-out' : 'none' }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={lineByLineVariants}
    >
      {/* Goal Title */}
      <motion.h3 
        className="text-xl font-bold text-white mb-4 uppercase tracking-wide"
        variants={lineItemVariants}
      >
        {milestone.title}
      </motion.h3>

      {/* Target Date */}
      <motion.div 
        className="flex items-center gap-2 mb-4 text-[#39FF14]"
        variants={lineItemVariants}
      >
        <Calendar size={20} aria-hidden="true" />
        <span className="text-sm">
          Target: {formatDate(milestone.targetDate)}
        </span>
      </motion.div>

      {/* Status Badge */}
      <motion.div 
        className="flex items-center gap-2"
        variants={lineItemVariants}
      >
        <StatusIcon 
          size={20} 
          style={{ color: statusColor }}
          aria-hidden="true"
        />
        <span
          className="text-sm font-bold uppercase tracking-wider"
          style={{ color: statusColor }}
        >
          {milestone.status}
        </span>
      </motion.div>
    </motion.div>
  );
}
