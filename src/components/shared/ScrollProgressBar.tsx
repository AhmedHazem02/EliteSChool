'use client';

import { useScroll, useSpring, motion } from 'framer-motion';

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left"
        style={{
          scaleX,
          background: 'linear-gradient(90deg, #A8873A, #C9A84C, #D4B85C, #C9A84C)',
        }}
      />
      {/* Glow effect below the bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[6px] z-[59] origin-left blur-sm opacity-50"
        style={{
          scaleX,
          background: 'linear-gradient(90deg, #A8873A, #C9A84C, #D4B85C)',
        }}
      />
    </>
  );
}
