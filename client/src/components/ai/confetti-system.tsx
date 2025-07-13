import { useEffect, useRef } from 'react';

interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  startVelocity?: number;
  decay?: number;
  gravity?: number;
  colors?: string[];
  shapes?: ('circle' | 'square' | 'triangle')[];
  duration?: number;
}

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  shape: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  gravity: number;
  decay: number;
  alpha: number;
}

export const useConfetti = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<ConfettiParticle[]>([]);

  const createParticle = (x: number, y: number, options: ConfettiOptions): ConfettiParticle => {
    const colors = options.colors || ['#FF6B35', '#8B5CF6', '#F59E0B', '#10B981', '#EC4899', '#06B6D4'];
    const shapes = options.shapes || ['circle', 'square', 'triangle'];
    const spread = options.spread || 50;
    const startVelocity = options.startVelocity || 45;
    
    const angle = (Math.random() - 0.5) * (spread * Math.PI / 180);
    const velocity = startVelocity * (0.5 + Math.random() * 0.5);
    
    return {
      x,
      y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      gravity: options.gravity || 0.3,
      decay: options.decay || 0.94,
      alpha: 1
    };
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: ConfettiParticle) => {
    ctx.save();
    ctx.globalAlpha = particle.alpha;
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation * Math.PI / 180);
    ctx.fillStyle = particle.color;

    switch (particle.shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'square':
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(0, -particle.size / 2);
        ctx.lineTo(-particle.size / 2, particle.size / 2);
        ctx.lineTo(particle.size / 2, particle.size / 2);
        ctx.closePath();
        ctx.fill();
        break;
    }
    ctx.restore();
  };

  const updateParticle = (particle: ConfettiParticle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += particle.gravity;
    particle.vx *= particle.decay;
    particle.vy *= particle.decay;
    particle.rotation += particle.rotationSpeed;
    particle.alpha -= 0.01;
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current = particlesRef.current.filter(particle => {
      updateParticle(particle);
      drawParticle(ctx, particle);
      return particle.alpha > 0 && particle.y < canvas.height + 100;
    });

    if (particlesRef.current.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  const fire = (x: number, y: number, options: ConfettiOptions = {}) => {
    const particleCount = options.particleCount || 50;
    const duration = options.duration || 3000;
    
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(createParticle(x, y, options));
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animate();

    // Auto-stop after duration
    setTimeout(() => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      particlesRef.current = [];
    }, duration);
  };

  const stopAll = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    particlesRef.current = [];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return { canvasRef, fire, stopAll };
};

export const ConfettiCanvas = () => {
  const { canvasRef } = useConfetti();
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ zIndex: 9999 }}
    />
  );
};