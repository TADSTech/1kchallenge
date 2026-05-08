'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Check, ArrowRight, ArrowLeft, ExternalLink } from 'lucide-react';
import { MagneticButton } from '@/components/shared/MagneticButton';
import { GlitchText } from '@/components/shared/GlitchText';
import { AccountLog } from '@/lib/types';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (log: Partial<AccountLog>) => void;
}

export function AuditLogModal({ isOpen, onClose, onAdd }: AuditLogModalProps) {
  const [step, setStep] = useState(1);
  const [source, setSource] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = () => {
    const logData = {
      source,
      description,
      amount: parseFloat(amount) || 0,
    };
    onAdd(logData);
    resetAndClose();
  };

  const resetAndClose = () => {
    setStep(1);
    setSource('');
    setDescription('');
    setAmount('');
    onClose();
  };

  if (!isOpen) return null;

  const isStep1Valid = source.trim() !== '' && description.trim() !== '' && amount.trim() !== '';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-voidBlack/90 backdrop-blur-md"
        onClick={resetAndClose}
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-xl bg-voidBlack border-2 border-cyberLime/30 rounded-lg overflow-hidden font-mono"
      >
        {/* Modal Header */}
        <div className="bg-cyberLime/5 border-b-2 border-cyberLime/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-cyberLime animate-pulse" />
            <span className="text-cyberLime text-xs tracking-[0.3em] uppercase">Initialize_Audit_Protocol</span>
          </div>
          <button onClick={resetAndClose} className="text-cyberLime/50 hover:text-cyberLime transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 pt-6 flex gap-2">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`h-1 flex-1 transition-all duration-500 ${s <= step ? 'bg-cyberLime shadow-[0_0_10px_#39FF14]' : 'bg-cyberLime/10'}`}
            />
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-cyberLime/60 text-[10px] uppercase mb-2 tracking-widest">Source of Funds</label>
                  <input 
                    type="text" 
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="e.g. Consulting Contract, Asset Sale"
                    className="w-full bg-voidBlack border-2 border-cyberLime/20 focus:border-cyberLime px-4 py-3 text-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-cyberLime/60 text-[10px] uppercase mb-2 tracking-widest">Transaction Amount ($)</label>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-voidBlack border-2 border-cyberLime/20 focus:border-cyberLime px-4 py-3 text-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-cyberLime/60 text-[10px] uppercase mb-2 tracking-widest">Description</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Details of the work performed..."
                    rows={3}
                    className="w-full bg-voidBlack border-2 border-cyberLime/20 focus:border-cyberLime px-4 py-3 text-white outline-none transition-all resize-none"
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6 text-center"
              >
                <div className="bg-cyberLime/5 border-2 border-dashed border-cyberLime/30 rounded-lg p-10 flex flex-col items-center justify-center">
                  <MessageSquare size={48} className="text-cyberLime mb-4" />
                  <h3 className="text-lg font-bold text-white uppercase mb-2">Manual Verification Required</h3>
                  <p className="text-cyberLime/60 text-xs mb-6">
                    Due to protocol security, please send your bank balance screenshot to the Admin via WhatsApp for verification.
                  </p>
                  
                  <a 
                    href="https://wa.me/2348083696903?text=I%20am%20verifying%20my%20audit%20log%20for%20the%201K%20Challenge." 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-cyberLime text-black px-6 py-2 rounded font-bold text-xs hover:bg-cyberLime/80 transition-colors"
                  >
                    Contact Admin on WhatsApp <ExternalLink size={14} />
                  </a>
                </div>
                <p className="text-[10px] text-cyberLime/40 uppercase">
                  Verify with ID: <span className="text-white">WAITING_FOR_BROADCAST</span>
                </p>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="text-center py-6"
              >
                <div className="w-20 h-20 bg-cyberLime/10 border-2 border-cyberLime rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={40} className="text-cyberLime" />
                </div>
                <h3 className="text-xl font-bold text-white uppercase mb-2">Ready for Broadcast</h3>
                <p className="text-cyberLime/60 text-xs mb-8 max-w-xs mx-auto">
                  Your audit log will be permanently committed to the ledger once you confirm. Verification will follow via WhatsApp.
                </p>
                <div className="bg-cyberLime/5 border border-cyberLime/20 p-4 rounded text-left space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-cyberLime/40 uppercase">Amount:</span>
                    <span className="text-cyberLime font-bold">${amount}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-cyberLime/40 uppercase">Source:</span>
                    <span className="text-white truncate max-w-[200px]">{source}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal Footer */}
        <div className="bg-cyberLime/5 border-t-2 border-cyberLime/30 px-8 py-6 flex justify-between">
          {step > 1 ? (
            <button onClick={handleBack} className="flex items-center gap-2 text-cyberLime/60 hover:text-cyberLime transition-colors text-xs uppercase tracking-widest">
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <div />
          )}
          
          <MagneticButton 
            radius={30} 
            maxShift={5} 
            onClick={step === 3 ? handleSubmit : handleNext}
            disabled={step === 1 && !isStep1Valid}
          >
            <div className={`
              px-8 py-3 uppercase text-xs font-bold transition-all flex items-center gap-2
              ${(step === 1 && !isStep1Valid)
                ? 'bg-cyberLime/10 text-cyberLime/30 cursor-not-allowed border-2 border-cyberLime/10' 
                : 'bg-cyberLime text-black shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_25px_rgba(57,255,20,0.5)]'
              }
            `}>
              <GlitchText>{step === 3 ? 'Confirm Broadcast' : 'Next Stage'}</GlitchText>
              {step < 3 && <ArrowRight size={16} />}
            </div>
          </MagneticButton>
        </div>
      </motion.div>
    </div>
  );
}
