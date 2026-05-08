'use client';

import { useState } from 'react';
import { FirebaseRegistrationForm } from './FirebaseRegistrationForm';
import { MagneticButton } from '@/components/shared/MagneticButton';
import { useAuth } from '@/lib/hooks/useAuth';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';

export function EntryTerminal() {
  const { user, isLoading: authLoading, error: authError, logout } = useAuth();
  const { isLoading: formLoading, error: formError } = useFirebaseAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  const handleRegisterSuccess = (username: string) => {
    setSuccessMessage(`[OK] Registration committed for ${username}.`);
  };

  const handleRegisterError = () => {
    setSuccessMessage(null);
  };

  const handleSwitchAccount = async () => {
    try {
      await logout();
      setShowLogin(true);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const isLoading = authLoading || formLoading;

  if (isLoading) {
    return (
      <section id="entry-terminal" className="w-full max-w-2xl mx-auto px-6 py-12">
        <div className="bg-voidBlack border-2 border-solid border-cyberLime/30 font-mono p-8">
          <div className="text-cyberLime text-sm mb-6">
            <p className="opacity-50">$ ./register_challenge.sh</p>
            <p className="text-cyberLime/40 mt-2">Initializing registration protocol...</p>
          </div>
          <div className="flex items-center gap-3 text-cyberLime">
            <div className="animate-spin">⟳</div>
            <span>Loading authentication system...</span>
          </div>
        </div>
      </section>
    );
  }

  if (user && !showLogin) {
    return (
      <section id="entry-terminal" className="w-full max-w-2xl mx-auto px-6 py-12">
        <div className="bg-voidBlack border-2 border-solid border-cyberLime/30 font-mono p-8">
          <div className="text-cyberLime text-sm mb-6">
            <p className="opacity-50">$ ./register_challenge.sh</p>
            <p className="text-cyberLime/40 mt-2">User authenticated</p>
          </div>
          <div className="text-cyberLime font-bold text-xl mt-8">
            [OK] Session active: {user.email}
          </div>
          <div className="mt-10">
            <MagneticButton
              onClick={handleSwitchAccount}
              className="text-cyberLime/60 hover:text-alertOrange transition-colors uppercase tracking-widest text-xs"
            >
              &gt; Switch Account
            </MagneticButton>
          </div>
        </div>
      </section>
    );
  }

  if (showLogin) {
    return (
      <section id="entry-terminal" className="w-full max-w-2xl mx-auto px-6 py-12">
        <div className="bg-voidBlack border-2 border-solid border-cyberLime/30 font-mono">
          <div className="bg-cyberLime/5 border-b-2 border-cyberLime/30 px-6 py-4 flex items-center gap-2">
            <div className="flex gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-alertOrange/60"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-cyberLime/60"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-cyberLime/20"></div>
            </div>
            <span className="ml-4 text-cyberLime/60 text-[10px] tracking-widest uppercase">login.sh</span>
          </div>
          <div className="p-8">
            <div className="text-cyberLime text-sm mb-6">
              <p className="opacity-50">$ ./login.sh</p>
              <p className="text-cyberLime/40 mt-2">Initializing login protocol...</p>
            </div>
            <div className="text-alertOrange font-bold mt-8">
              [SYSTEM_ERROR] Login module not yet deployed.
            </div>
            <div className="mt-10">
              <MagneticButton
                onClick={() => setShowLogin(false)}
                className="text-cyberLime/60 hover:text-cyberLime transition-colors uppercase tracking-widest text-xs"
              >
                &lt; Return to Signup
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="entry-terminal" className="w-full max-w-2xl mx-auto px-6 py-12">
      <div className="bg-voidBlack border-2 border-solid border-cyberLime/30 font-mono">
        <div className="bg-cyberLime/5 border-b-2 border-cyberLime/30 px-6 py-4 flex items-center gap-2">
          <div className="flex gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-alertOrange/60"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-cyberLime/60"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-cyberLime/20"></div>
          </div>
          <span className="ml-4 text-cyberLime/60 text-[10px] tracking-widest uppercase">system_entry.sh</span>
        </div>

        {successMessage ? (
          <div className="p-8">
            <div className="text-cyberLime text-sm mb-6">
              <p className="opacity-50">$ ./register_challenge.sh</p>
              <p className="text-cyberLime/40 mt-2">Processing registration...</p>
            </div>
            <div className="text-cyberLime font-bold text-xl mt-8">
              {successMessage}
            </div>
          </div>
        ) : (
          <div className="p-8">
            <FirebaseRegistrationForm
              onRegisterSuccess={handleRegisterSuccess}
              onRegisterError={handleRegisterError}
            />
          </div>
        )}

        {/* Error message display */}
        {(formError || authError) && (
          <div className="text-alertOrange text-sm mt-4 px-8 pb-8">
            {formError || authError}
          </div>
        )}
      </div>
    </section>
  );
}
