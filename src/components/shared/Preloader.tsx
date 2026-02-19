'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for page to fully load, with a minimum display time for the animation
    const minTime = new Promise((r) => setTimeout(r, 2000));
    const loaded = new Promise<void>((r) => {
      if (document.readyState === 'complete') return r();
      window.addEventListener('load', () => r(), { once: true });
    });

    Promise.all([minTime, loaded]).then(() => setLoading(false));
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy"
        >
          {/* Background shimmer sweep */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          {/* Decorative orbiting rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              className="absolute w-48 h-48 rounded-full border border-gold/20"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute w-64 h-64 rounded-full border border-gold/10"
              initial={{ scale: 0.6, opacity: 0, rotate: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: 360 }}
              transition={{
                scale: { duration: 1, delay: 0.3 },
                opacity: { duration: 1, delay: 0.3 },
                rotate: { duration: 10, repeat: Infinity, ease: 'linear' },
              }}
            />
            {/* Orbiting gold dot */}
            <motion.div
              className="absolute w-64 h-64"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-gold rounded-full shadow-[0_0_12px_rgba(201,168,76,0.8)]" />
            </motion.div>
          </div>

          <div className="relative flex flex-col items-center gap-6">
            {/* School Logo with golden glow */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.7, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Ambient gold glow behind logo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-40 h-40 rounded-full"
                  style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%)' }}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
              <Image
                src="/images/logo.png"
                alt="Elite Schools"
                width={200}
                height={120}
                className="relative z-10 object-contain h-[80px] w-auto drop-shadow-[0_0_20px_rgba(201,168,76,0.4)]"
                priority
              />
            </motion.div>

            {/* Animated gold divider */}
            <motion.div
              className="h-px bg-gradient-to-r from-transparent via-gold to-transparent w-40"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 0.7 }}
            />

            {/* School name */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <p className="text-gold/60 text-xs tracking-[0.3em] uppercase font-medium">
                Shaping Future Leaders
              </p>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              className="w-32 h-[2px] bg-white/10 rounded-full overflow-hidden mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-gold-dark via-gold to-gold-light rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
