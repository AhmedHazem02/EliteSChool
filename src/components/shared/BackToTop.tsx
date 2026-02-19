'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useSmoothScroll } from '@/components/shared/SmoothScroll';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const smoothScroll = useSmoothScroll();

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    if (smoothScroll) {
      // Use the SmoothScroll lerp for consistent feel
      smoothScroll.scrollTo(0);
    } else {
      // Fallback (touch devices / no SmoothScroll)
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-20 end-4 md:bottom-8 md:end-8 z-50 w-12 h-12 rounded-full bg-navy text-gold border border-gold/30 flex items-center justify-center shadow-gold hover:shadow-gold-glow hover:bg-navy-light transition-all duration-500 hover:scale-110 hover:border-gold/60 group"
        >
          <ArrowUp className="w-5 h-5 group-hover:animate-bounce-subtle transition-transform" />
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-full border border-gold/20 animate-ping opacity-20" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
