'use client';

import { useState, useEffect } from 'react';
import { firebaseFirestore } from '@/lib/firebase';
import { 
  collection, 
  query, 
  doc, 
  updateDoc, 
  onSnapshot,
  orderBy
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, User, Clock, Search, Lock, Unlock, Key } from 'lucide-react';
import { GlitchText } from '@/components/shared/GlitchText';
import { AccountLog } from '@/lib/types';

interface AdminUser {
  id: string;
  username?: string;
  email?: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userLogs, setUserLogs] = useState<AccountLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_KEY) {
      setIsAuthenticated(true);
      setAuthError(false);
      localStorage.setItem('admin_auth', 'true');
    } else {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 2000);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('admin_auth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // 1. Fetch all users (only if authenticated)
  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubscribe = onSnapshot(collection(firebaseFirestore, 'users'), (snapshot) => {
      const fetchedUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AdminUser[];
      setUsers(fetchedUsers);
    });
    return () => unsubscribe();
  }, [isAuthenticated]);

  // 2. Fetch logs for selected user
  useEffect(() => {
    if (!selectedUser || !isAuthenticated) {
      setUserLogs([]);
      return;
    }

    const q = query(
      collection(firebaseFirestore, `users/${selectedUser}/logs`),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()?.toISOString() || new Date().toISOString()
      })) as AccountLog[];
      setUserLogs(logs);
    });

    return () => unsubscribe();
  }, [selectedUser, isAuthenticated]);

  const handleVerifyLog = async (logId: string) => {
    if (!selectedUser) return;

    try {
      await updateDoc(doc(firebaseFirestore, `users/${selectedUser}/logs`, logId), {
        status: 'VERIFIED'
      });
      alert('[SYSTEM_OK] Log verified and committed.');
    } catch (err) {
      console.error(err);
      alert('[SYSTEM_ERROR] Verification failed.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-voidBlack flex items-center justify-center p-4 font-mono">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-voidBlack border-2 border-cyberLime/30 p-8 rounded-lg text-center"
        >
          <div className="w-16 h-16 bg-cyberLime/10 border-2 border-cyberLime rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={32} className="text-cyberLime" />
          </div>
          <h1 className="text-2xl font-bold text-white uppercase mb-2 tracking-widest">Access_Denied</h1>
          <p className="text-cyberLime/60 text-xs mb-8 uppercase">Administrative_Credentials_Required</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-cyberLime/40" size={16} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ENTER_ENCRYPTION_KEY"
                className={`w-full bg-voidBlack border-2 px-10 py-3 rounded outline-none transition-all text-sm text-center tracking-widest ${authError ? 'border-alertOrange text-alertOrange' : 'border-cyberLime/20 focus:border-cyberLime text-white'}`}
                autoFocus
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-cyberLime text-black font-bold py-3 uppercase text-xs tracking-[0.2em] hover:bg-cyberLime/80 transition-all shadow-[0_0_15px_rgba(57,255,20,0.2)]"
            >
              <GlitchText>Initiate_Override</GlitchText>
            </button>
          </form>
          
          {authError && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-alertOrange text-[10px] mt-4 uppercase tracking-widest"
            >
              Invalid_Credentials — Security_Alert_Triggered
            </motion.p>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-voidBlack text-white font-mono p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 border-b border-cyberLime/20 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyberLime/10 rounded-lg">
              <Shield className="text-cyberLime" size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-widest">Admin_Protocol_v1.0</h1>
              <p className="text-[10px] text-cyberLime/50 uppercase">Centralized_Challenge_Management</p>
            </div>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('admin_auth');
              setIsAuthenticated(false);
            }}
            className="text-[10px] text-alertOrange hover:text-white transition-colors flex items-center gap-2 border border-alertOrange/30 px-3 py-1 rounded"
          >
            <Unlock size={12} /> TERMINATE_SESSION
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* User List Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyberLime/40" size={16} />
              <input 
                type="text" 
                placeholder="SEARCH_USERS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-voidBlack border-2 border-cyberLime/20 px-10 py-3 rounded outline-none focus:border-cyberLime transition-all text-sm"
              />
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {users.filter(u => u.username?.toLowerCase().includes(searchTerm.toLowerCase())).map((u) => (
                <button
                  key={u.id}
                  onClick={() => setSelectedUser(u.id)}
                  className={`w-full text-left p-4 rounded border transition-all ${selectedUser === u.id ? 'bg-cyberLime/20 border-cyberLime shadow-[0_0_10px_rgba(57,255,20,0.2)]' : 'bg-cyberLime/5 border-cyberLime/10 hover:border-cyberLime/30'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-voidBlack rounded">
                      <User size={16} className="text-cyberLime" />
                    </div>
                    <div>
                      <p className="text-sm font-bold truncate">{u.username || 'Anonymous'}</p>
                      <p className="text-[10px] text-cyberLime/50 truncate">{u.email}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* User Logs Main Area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selectedUser ? (
                <motion.div
                  key={selectedUser}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold uppercase tracking-tight text-cyberLime">
                      Logs: {users.find(u => u.id === selectedUser)?.username}
                    </h2>
                    <span className="text-[10px] text-cyberLime/40">{userLogs.length} ENTRIES_DETECTED</span>
                  </div>

                  <div className="space-y-4">
                    {userLogs.map((log) => (
                      <div key={log.id} className={`bg-voidBlack/40 border-2 rounded-lg p-6 transition-colors ${log.status === 'VERIFIED' ? 'border-cyberLime/20' : 'border-alertOrange/40'}`}>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className={`text-[10px] block mb-1 uppercase tracking-widest ${log.status === 'VERIFIED' ? 'text-cyberLime/50' : 'text-alertOrange/50'}`}>
                              Source
                            </span>
                            <p className="font-bold">{log.source}</p>
                          </div>
                          <div className="text-right">
                            <span className={`text-[10px] block mb-1 uppercase tracking-widest ${log.status === 'VERIFIED' ? 'text-cyberLime/50' : 'text-alertOrange/50'}`}>
                              Amount
                            </span>
                            <p className={`font-bold text-lg ${log.status === 'VERIFIED' ? 'text-cyberLime' : 'text-alertOrange'}`}>${log.amount}</p>
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <span className={`text-[10px] block mb-1 uppercase tracking-widest ${log.status === 'VERIFIED' ? 'text-cyberLime/50' : 'text-alertOrange/50'}`}>
                            Description
                          </span>
                          <p className="text-sm text-gray-400 leading-relaxed border-l border-white/5 pl-4">{log.description}</p>
                        </div>

                        <div className="flex items-center justify-between border-t border-white/5 pt-4">
                          <div className="flex items-center gap-4 text-[10px]">
                            <div className="flex items-center gap-1">
                              <Clock size={12} className="text-white/20" />
                              <span className="text-white/20 uppercase">{new Date(log.timestamp).toLocaleDateString()}</span>
                            </div>
                            <div className={`px-2 py-0.5 rounded font-bold ${log.status === 'VERIFIED' ? 'bg-cyberLime/20 text-cyberLime' : 'bg-alertOrange/20 text-alertOrange animate-pulse'}`}>
                              {log.status}
                            </div>
                          </div>

                          {log.status === 'PENDING' && (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleVerifyLog(log.id)}
                                className="px-4 py-2 bg-cyberLime/10 hover:bg-cyberLime text-cyberLime hover:text-black border border-cyberLime transition-all rounded text-[10px] font-bold uppercase tracking-widest"
                              >
                                APPROVE_BROADCAST
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-32 text-center opacity-30">
                  <Search size={64} className="mb-6 text-cyberLime" />
                  <p className="text-lg uppercase tracking-widest font-bold">Select_A_Node_To_Audit</p>
                  <p className="text-xs mt-2">Awaiting target selection for manual verification protocol.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
