import React, { useEffect, useRef } from 'react';
import { BackgroundPreset, BackgroundIntensity, CustomBackgroundConfig } from '../types';

interface BackgroundCanvasProps {
  preset: BackgroundPreset;
  intensity: BackgroundIntensity;
  reduceMotion: boolean;
  theme: 'dark' | 'light';
  customConfig?: CustomBackgroundConfig;
  isTestActive?: boolean;
}

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  twinkleSpeed: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
  color: string;
}

export const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({
  preset,
  intensity,
  reduceMotion,
  theme,
  customConfig,
  isTestActive = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle Count based on intensity and screen size
    const isMobile = width < 768;
    let particleCount = 180;
    if (intensity === 'low') particleCount = isMobile ? 60 : 100;
    else if (intensity === 'medium') particleCount = isMobile ? 120 : 200;
    else if (intensity === 'high') particleCount = isMobile ? 180 : 350;

    if (reduceMotion) {
      particleCount = Math.floor(particleCount * 0.4);
    }

    // Palette per preset
    const getStarColors = (p: BackgroundPreset, isDark: boolean): string[] => {
      if (!isDark) {
        return ['#6366f1', '#3b82f6', '#8b5cf6', '#0ea5e9'];
      }
      switch (p) {
        case 'neon_blue':
          return ['#38bdf8', '#0ea5e9', '#67e8f9', '#93c5fd', '#ffffff'];
        case 'purple_galaxy':
          return ['#c084fc', '#e879f9', '#a855f7', '#f472b6', '#ffffff'];
        case 'aurora':
          return ['#34d399', '#2dd4bf', '#38bdf8', '#818cf8', '#a7f3d0'];
        case 'ocean':
          return ['#06b6d4', '#0284c7', '#38bdf8', '#14b8a6', '#ffffff'];
        case 'sunset':
          return ['#fb923c', '#f43f5e', '#ec4899', '#fde047', '#ffffff'];
        case 'deep_space':
        case 'galaxy':
        case 'flying_stars':
        case 'glass_gradient':
        case 'minimal_dark':
        default:
          return ['#ffffff', '#e0e7ff', '#c7d2fe', '#a5b4fc', '#93c5fd'];
      }
    };

    const colors = getStarColors(preset, theme === 'dark');

    // Create Stars
    const stars: Star[] = [];
    for (let i = 0; i < particleCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * width,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
        baseAlpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: (Math.random() * 0.03 + 0.01) * (reduceMotion ? 0.2 : 1),
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Shooting stars system
    const shootingStars: ShootingStar[] = [];
    const maxShootingStars = intensity === 'high' ? 3 : intensity === 'medium' ? 2 : 1;
    let nextShootingStarTime = Date.now() + Math.random() * 3000 + 2000;

    const spawnShootingStar = () => {
      if (reduceMotion || isTestActive || preset === 'minimal_dark' || preset === 'minimal_light') return;
      if (shootingStars.filter(s => s.active).length >= maxShootingStars) return;

      shootingStars.push({
        x: Math.random() * (width * 0.8),
        y: Math.random() * (height * 0.4),
        length: Math.random() * 80 + 70,
        speed: (Math.random() * 8 + 12) * (intensity === 'high' ? 1.2 : 1),
        angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
        opacity: 1,
        active: true,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    };

    // Speed multiplier (slowed during tests for zero distraction!)
    const speedMult = reduceMotion ? 0 : isTestActive ? 0.15 : intensity === 'high' ? 1.4 : intensity === 'medium' ? 1.0 : 0.6;

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Render preset ambient gradient / grid
      if (preset === 'galaxy' || preset === 'purple_galaxy') {
        const radGrad = ctx.createRadialGradient(
          width * 0.5, height * 0.4, 10,
          width * 0.5, height * 0.4, Math.max(width, height) * 0.7
        );
        if (theme === 'dark') {
          radGrad.addColorStop(0, 'rgba(88, 28, 135, 0.22)');
          radGrad.addColorStop(0.4, 'rgba(49, 46, 129, 0.15)');
          radGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
        }
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, width, height);
      } else if (preset === 'aurora') {
        const waveY = height * 0.35 + Math.sin(time * 0.5) * 50;
        const grad = ctx.createRadialGradient(width * 0.4, waveY, 50, width * 0.5, waveY, width * 0.7);
        grad.addColorStop(0, 'rgba(16, 185, 129, 0.18)');
        grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.12)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else if (preset === 'neon_blue') {
        const grad = ctx.createRadialGradient(width * 0.7, height * 0.3, 40, width * 0.7, height * 0.3, width * 0.6);
        grad.addColorStop(0, 'rgba(14, 165, 233, 0.2)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else if (preset === 'ocean') {
        const grad = ctx.createLinearGradient(0, height, 0, 0);
        grad.addColorStop(0, 'rgba(14, 116, 144, 0.25)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else if (preset === 'sunset') {
        const grad = ctx.createLinearGradient(0, height, 0, height * 0.3);
        grad.addColorStop(0, 'rgba(225, 29, 72, 0.18)');
        grad.addColorStop(0.6, 'rgba(234, 88, 12, 0.1)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw and animate stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Flying warp motion or gentle drift
        if (preset === 'flying_stars') {
          s.z -= 1.8 * speedMult;
          if (s.z <= 0) {
            s.z = width;
            s.x = (Math.random() - 0.5) * width * 2;
            s.y = (Math.random() - 0.5) * height * 2;
          }
          const k = 128.0 / s.z;
          const px = s.x * k + width / 2;
          const py = s.y * k + height / 2;

          if (px >= 0 && px < width && py >= 0 && py < height) {
            const size = Math.max(0.5, (1 - s.z / width) * 2.5);
            const alpha = Math.min(1, (1 - s.z / width) * 1.2);
            ctx.fillStyle = s.color;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          // Standard ambient starfield with twinkling
          s.alpha = s.baseAlpha + Math.sin(time * 3 + i) * 0.25;
          if (!reduceMotion) {
            s.y -= 0.15 * speedMult;
            if (s.y < 0) s.y = height;
          }

          ctx.fillStyle = s.color;
          ctx.globalAlpha = Math.max(0.1, Math.min(1, s.alpha));
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();

          // Subtle glow for larger stars
          if (s.size > 1.5 && (intensity === 'high' || intensity === 'medium')) {
            ctx.fillStyle = s.color;
            ctx.globalAlpha = s.alpha * 0.25;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size * 2.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Shooting stars logic
      if (!reduceMotion && !isTestActive && Date.now() > nextShootingStarTime) {
        spawnShootingStar();
        const interval = intensity === 'high' ? 4000 : intensity === 'medium' ? 7000 : 12000;
        nextShootingStarTime = Date.now() + Math.random() * interval + 2000;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        if (!star.active) continue;

        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        star.opacity -= 0.015;

        if (star.opacity <= 0 || star.x > width + 100 || star.y > height + 100) {
          star.active = false;
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = star.x - Math.cos(star.angle) * star.length;
        const tailY = star.y - Math.sin(star.angle) * star.length;

        const starGrad = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
        starGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        starGrad.addColorStop(0.7, star.color);
        starGrad.addColorStop(1, '#ffffff');

        ctx.strokeStyle = starGrad;
        ctx.lineWidth = 1.8;
        ctx.globalAlpha = Math.max(0, star.opacity);
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(star.x, star.y);
        ctx.stroke();

        // Head spark
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(star.x, star.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [preset, intensity, reduceMotion, theme, isTestActive]);

  // CSS style for container based on preset & theme
  const getContainerBgStyle = (): React.CSSProperties => {
    if (preset === 'custom' && customConfig?.imageUrl) {
      return {
        backgroundImage: `url(${customConfig.imageUrl})`,
        backgroundSize: `${customConfig.zoom || 100}%`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: `brightness(${customConfig.brightness}%) blur(${customConfig.blur}px)`,
        opacity: (customConfig.opacity ?? 90) / 100,
      };
    }

    if (theme === 'light') {
      switch (preset) {
        case 'minimal_light':
          return { background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' };
        case 'aurora':
          return { background: 'linear-gradient(135deg, #ecfdf5 0%, #e0f2fe 50%, #f5f3ff 100%)' };
        case 'ocean':
          return { background: 'linear-gradient(135deg, #ecfeff 0%, #e0f2fe 100%)' };
        case 'sunset':
          return { background: 'linear-gradient(135deg, #fff7ed 0%, #fdf2f8 50%, #f5f3ff 100%)' };
        case 'neon_blue':
          return { background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)' };
        case 'purple_galaxy':
          return { background: 'linear-gradient(135deg, #faf5ff 0%, #fdf2f8 100%)' };
        default:
          return { background: 'linear-gradient(135deg, #f8fafc 0%, #ede9fe 50%, #f1f5f9 100%)' };
      }
    }

    // Dark mode backgrounds
    switch (preset) {
      case 'minimal_dark':
        return { background: '#090d16' };
      case 'deep_space':
        return { background: 'radial-gradient(ellipse at 50% 30%, #0c1024 0%, #030712 100%)' };
      case 'purple_galaxy':
        return { background: 'radial-gradient(circle at 50% 20%, #1e1136 0%, #090514 100%)' };
      case 'aurora':
        return { background: 'linear-gradient(160deg, #061c1e 0%, #041421 50%, #090d16 100%)' };
      case 'neon_blue':
        return { background: 'radial-gradient(circle at 70% 30%, #071f38 0%, #030816 100%)' };
      case 'ocean':
        return { background: 'linear-gradient(180deg, #041824 0%, #020b12 100%)' };
      case 'sunset':
        return { background: 'radial-gradient(ellipse at 50% 80%, #260c1e 0%, #090514 100%)' };
      case 'glass_gradient':
        return { background: 'linear-gradient(135deg, #0b1120 0%, #15102a 50%, #080d1a 100%)' };
      case 'galaxy':
      case 'flying_stars':
      default:
        return { background: 'radial-gradient(ellipse at top, #0f172a 0%, #090d16 60%, #020617 100%)' };
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-700">
      {/* Background color / custom photo layer */}
      <div 
        className="absolute inset-0 transition-all duration-700" 
        style={getContainerBgStyle()}
      />

      {/* Subtle geometric grid overlay for high-tech EdTech presence */}
      {theme === 'dark' && (preset === 'galaxy' || preset === 'neon_blue' || preset === 'glass_gradient') && (
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      )}

      {/* Dynamic Starfield Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full"
      />
    </div>
  );
};
