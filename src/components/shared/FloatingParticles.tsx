'use client';

import { useEffect, useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface FloatingParticlesProps {
  count?: number;
  color?: string;
  className?: string;
  maxSize?: number;
  minSize?: number;
  speed?: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  opacitySpeed: number;
}

/**
 * Lightweight canvas-based floating particles.
 * Creates ambient gold particles for a luxury feel.
 */
export default function FloatingParticles({
  count = 30,
  color = 'rgba(201, 168, 76, 1)',
  className,
  maxSize = 3,
  minSize = 1,
  speed = 0.3,
}: FloatingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check for reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Initialize particles
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * (maxSize - minSize) + minSize,
      speedX: (Math.random() - 0.5) * speed,
      speedY: (Math.random() - 0.5) * speed - 0.1, // Slight upward drift
      opacity: Math.random() * 0.5 + 0.1,
      opacitySpeed: (Math.random() - 0.5) * 0.005,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        // Update position
        p.x += p.speedX;
        p.y += p.speedY;

        // Update opacity (pulsing)
        p.opacity += p.opacitySpeed;
        if (p.opacity <= 0.05 || p.opacity >= 0.6) {
          p.opacitySpeed *= -1;
        }

        // Wrap around
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        // Draw particle with glow
        ctx.save();
        ctx.globalAlpha = p.opacity;

        // Glow
        ctx.shadowBlur = p.size * 4;
        ctx.shadowColor = color;

        // Dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [count, color, maxSize, minSize, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 pointer-events-none', className)}
      aria-hidden="true"
    />
  );
}
