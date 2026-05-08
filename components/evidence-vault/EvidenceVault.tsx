'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, AlertTriangle, ShieldCheck, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { validateMimeType } from '@/lib/validation';
import { VaultState } from '@/lib/types';
import { HexLog } from './HexLog';
import { ProgressBar } from './ProgressBar';
import { MagneticButton } from '@/components/shared/MagneticButton';
import { GlitchText } from '@/components/shared/GlitchText';

export function EvidenceVault() {
  const [vaultState, setVaultState] = useState<VaultState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (vaultState === 'idle') {
      setVaultState('drag-over');
    }
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    if (vaultState === 'drag-over') {
      setVaultState('idle');
    }
  };

  const processFile = (file: File) => {
    if (validateMimeType(file.type)) {
      setVaultState('verifying');
      setErrorMessage(null);
    } else {
      setVaultState('error');
      setErrorMessage(`UNAUTHORIZED FORMAT: ${file.type}`);
      setTimeout(() => setVaultState('idle'), 2000);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    } else {
      setVaultState('idle');
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleVerificationComplete = () => {
    setVaultState('success');
  };

  const borderStyles = {
    idle: 'border-dashed border-[#FF5F1F] animate-[pulse_1s_infinite]',
    'drag-over': 'border-solid border-[#39FF14] bg-[#39FF14]/5',
    verifying: 'border-solid border-[#39FF14]/50',
    success: 'border-solid border-[#39FF14] shadow-[0_0_20px_#39FF14]',
    error: 'border-solid border-[#FF5F1F] shadow-[0_0_20px_#FF5F1F]',
  };

  return (
    <section id="evidence-vault" className="w-full max-w-4xl mx-auto my-32 px-4">
      <div className="glass border-4 border-[#39FF14] p-8 rounded-lg relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-[#FF5F1F] text-black px-4 py-1 font-bold skew-x-[-12deg] flex items-center gap-2">
            <AlertTriangle size={18} />
            TOP SECRET
          </div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-[0.2em]">Evidence Vault</h2>
        </div>

        <div 
          className={`relative min-h-[300px] rounded-lg border-4 transition-all duration-300 flex flex-col items-center justify-center p-6 ${borderStyles[vaultState]}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <AnimatePresence mode="wait">
            {vaultState === 'idle' || vaultState === 'drag-over' ? (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <Upload size={48} className={`mx-auto mb-4 ${vaultState === 'drag-over' ? 'text-[#39FF14]' : 'text-[#FF5F1F]'}`} />
                <p className="text-lg font-bold mb-2">DROP PROOF TO ENCRYPT</p>
                <p className="text-sm opacity-50 mb-6">ACCEPTED: PNG, JPEG, WEBP</p>
                
                <MagneticButton radius={40} maxShift={10} onClick={triggerFileInput} aria-label="Browse Files">
                  <div className="border-2 border-[#39FF14] bg-black text-[#39FF14] px-6 py-2 uppercase text-xs font-bold glass hover:bg-[#39FF14]/10 transition-colors">
                    <GlitchText>Browse Files</GlitchText>
                  </div>
                </MagneticButton>
              </motion.div>
            ) : vaultState === 'verifying' ? (
              <motion.div 
                key="verifying"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-md space-y-6"
              >
                <div className="text-center font-bold text-[#39FF14] animate-pulse">
                  VERIFYING DATA INTEGRITY...
                </div>
                <ProgressBar duration={3} onComplete={handleVerificationComplete} />
                <HexLog isActive={true} />
              </motion.div>
            ) : vaultState === 'success' ? (
              <motion.div 
                key="success"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center text-[#39FF14]"
              >
                <ShieldCheck size={64} className="mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">[OK] PROOF COMMITTED</h3>
                <p className="font-mono text-sm">TRANSACTION BROADCASTED TO VAULT</p>
              </motion.div>
            ) : (
              <motion.div 
                key="error"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: [0, -10, 10, -10, 10, 0], opacity: 1 }}
                className="text-center text-[#FF5F1F]"
              >
                <XCircle size={64} className="mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">ACCESS DENIED</h3>
                <p className="font-mono text-sm">{errorMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileInputChange}
          aria-label="Upload evidence file"
        />
      </div>
    </section>
  );
}
