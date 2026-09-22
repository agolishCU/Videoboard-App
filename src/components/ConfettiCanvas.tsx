import React, { useEffect, useRef } from 'react';

interface ConfettiCanvasProps {
  isActive: boolean;
  onComplete: () => void;
}

export const ConfettiCanvas: React.FC<ConfettiCanvasProps> = ({ isActive, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#c3f400', '#ff5708', '#00daf3', '#ffffff', '#ff2d75', '#ffd700'];
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      vRot: number;
      alpha: number;
    }[] = [];

    for (let i = 0; i < 180; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() * 400 - 200),
        y: canvas.height * 0.4 + (Math.random() * 200 - 100),
        vx: (Math.random() - 0.5) * 22,
        vy: (Math.random() - 0.7) * 20,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        alpha: 1,
      });
    }

    let frame = 0;
    let animId: number;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let aliveCount = 0;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.45; // gravity
        p.rotation += p.vRot;
        if (frame > 70) {
          p.alpha -= 0.015;
        }

        if (p.alpha > 0 && p.y < canvas.height + 50) {
          aliveCount++;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      });

      if (aliveCount > 0 && frame < 160) {
        animId = requestAnimationFrame(render);
      } else {
        onComplete();
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {/* Visual Strobe Flash */}
      <div className="absolute inset-0 bg-white/30 animate-pulse pointer-events-none"></div>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
    </div>
  );
};
