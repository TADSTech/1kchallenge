'use client';

import { motion } from 'framer-motion';

export function Navbar() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      className="fixed top-0 left-0 right-0 w-full glass border-b-4 border-[#39FF14] z-50"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-center gap-4 md:gap-8">
          <a
            href="#entry-terminal"
            onClick={(e) => handleNavClick(e, 'entry-terminal')}
            className="font-mono text-[#39FF14] hover:text-white transition-colors duration-200 uppercase tracking-wider text-[10px] md:text-sm font-bold min-h-[44px] flex items-center"
          >
            Entry Terminal
          </a>
          <a
            href="#dashboard"
            onClick={(e) => handleNavClick(e, 'dashboard')}
            className="font-mono text-[#39FF14] hover:text-white transition-colors duration-200 uppercase tracking-wider text-[10px] md:text-sm font-bold min-h-[44px] flex items-center"
          >
            Dashboard
          </a>
          <a
            href="#evidence-vault"
            onClick={(e) => handleNavClick(e, 'evidence-vault')}
            className="font-mono text-[#39FF14] hover:text-white transition-colors duration-200 uppercase tracking-wider text-[10px] md:text-sm font-bold min-h-[44px] flex items-center"
          >
            Evidence Vault
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
