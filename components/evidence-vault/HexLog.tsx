'use client';

import { useEffect, useRef, useState } from 'react';

interface HexLogProps {
  isActive: boolean;
}

export function HexLog({ isActive }: HexLogProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const hex = Array.from({ length: 8 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('').toUpperCase();
      
      const prefix = Math.random() > 0.5 ? '0x' : '>>';
      setLogs((prev) => [...prev.slice(-49), `${prefix} ${hex}`]);
    }, 100);

    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div 
      ref={scrollRef}
      className="h-32 w-full bg-black/80 border-2 border-[#39FF14]/30 rounded p-2 overflow-y-auto font-mono text-[10px] text-[#39FF14] scrollbar-hide"
    >
      {logs.map((log, i) => (
        <div key={i} className="opacity-70">{log}</div>
      ))}
      {logs.length === 0 && <div className="opacity-30 italic">WAITING FOR UPLOAD...</div>}
    </div>
  );
}
