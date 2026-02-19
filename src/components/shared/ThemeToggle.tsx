'use client';

import { useTheme } from '@/components/shared/ThemeProvider';
import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-gold/30 text-white hover:border-gold hover:text-gold transition-all duration-200 overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'dark' ? (
          <motion.span
            key="sun"
            initial={{ y: 12, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -12, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Sun size={16} />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ y: 12, opacity: 0, rotate: 90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -12, opacity: 0, rotate: -90 }}
            transition={{ duration: 0.2 }}
          >
            <Moon size={16} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
