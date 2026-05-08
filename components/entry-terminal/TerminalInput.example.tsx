'use client';

import { useState } from 'react';
import { TerminalInput } from './TerminalInput';

/**
 * Example usage of the TerminalInput component
 * 
 * This component demonstrates:
 * - Terminal prompt prefix (> _)
 * - Default 4px solid border
 * - Neon green (#39FF14) box-shadow glow on focus
 * - Glow removal on blur
 * - Label and error message display
 */
export default function TerminalInputExample() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleUsernameBlur = () => {
    if (!username.trim()) {
      setUsernameError('Username is required');
    } else {
      setUsernameError('');
    }
  };

  const handleEmailBlur = () => {
    if (!email.trim()) {
      setEmailError('Email is required');
    } else if (!email.includes('@')) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  return (
    <div className="min-h-screen bg-voidBlack p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-cyberLime font-mono text-2xl mb-8">
          TerminalInput Component Examples
        </h1>

        {/* Basic input */}
        <div>
          <h2 className="text-cyberLime font-mono text-lg mb-4">Basic Input</h2>
          <TerminalInput 
            placeholder="Enter your username"
          />
        </div>

        {/* Input with label */}
        <div>
          <h2 className="text-cyberLime font-mono text-lg mb-4">Input with Label</h2>
          <TerminalInput 
            id="username"
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={handleUsernameBlur}
            error={usernameError}
          />
        </div>

        {/* Email input with validation */}
        <div>
          <h2 className="text-cyberLime font-mono text-lg mb-4">Email Input with Validation</h2>
          <TerminalInput 
            id="email"
            label="Email Address"
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleEmailBlur}
            error={emailError}
          />
        </div>

        {/* Disabled input */}
        <div>
          <h2 className="text-cyberLime font-mono text-lg mb-4">Disabled Input</h2>
          <TerminalInput 
            label="Disabled Field"
            placeholder="This field is disabled"
            disabled
          />
        </div>

        {/* Instructions */}
        <div className="mt-12 p-6 border-4 border-cyberLime bg-voidBlack">
          <h3 className="text-cyberLime font-mono text-lg mb-4">Usage Instructions</h3>
          <ul className="text-cyberLime font-mono text-sm space-y-2 list-disc list-inside">
            <li>Click on any input field to see the neon green glow animation</li>
            <li>The glow appears on focus and disappears on blur</li>
            <li>Each input has a terminal prompt prefix (&gt; _)</li>
            <li>Error messages appear in alert orange below the field</li>
            <li>All inputs have a 4px solid border by default</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
