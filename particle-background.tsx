import { useEffect, useRef, useState } from 'react';
import { useBitcoinPrice } from '@/hooks/use-bitcoin-price';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  type: 'bitcoin' | 'circuit' | 'dot';
  rotation: number;
  rotationSpeed: number;
  depth: number; // 0-1, where 0 is background, 1 is foreground
  parallaxSpeed: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [colorShift, setColorShift] = useState(0); // -1 to 1, negative for bearish, positive for bullish
  const { data: priceComparison } = useBitcoinPrice();

  // Track price changes for color harmonics
  useEffect(() => {
    if (priceComparison?.bestExchange) {
      const bestExchangeData = priceComparison.exchanges.find(e => e.isBestPrice);
      if (bestExchangeData) {
        const currentPrice = parseFloat(bestExchangeData.currentPrice.price);
        
        if (previousPrice !== null) {
          const priceChange = currentPrice - previousPrice;
          const changePercent = (priceChange / previousPrice) * 100;
          
          // Update color shift based on price movement
          setColorShift(prev => {
            const newShift = Math.max(-1, Math.min(1, changePercent * 10));
            return prev * 0.8 + newShift * 0.2; // Smooth transition
          });
        }
        
        setPreviousPrice(currentPrice);
      }
    }
  }, [priceComparison, previousPrice]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse tracking for parallax
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2, // -1 to 1
        y: (e.clientY / window.innerHeight - 0.5) * 2
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Initialize particles
    const initParticles = () => {
      const particles: Particle[] = [];
      const particleCount = Math.min(50, Math.floor(window.innerWidth / 30)); // Responsive particle count

      for (let i = 0; i < particleCount; i++) {
        const depth = Math.random();
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 8 + 4,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: (Math.random() * 0.3 + 0.1) * (depth * 0.5 + 0.5),
          type: Math.random() < 0.4 ? 'bitcoin' : Math.random() < 0.7 ? 'circuit' : 'dot',
          rotation: Math.random() * Math.PI * 2,
          depth: depth,
          parallaxSpeed: depth * 0.5 + 0.2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
        });
      }
      particlesRef.current = particles;
    };

    // Dynamic color calculation based on market sentiment
    const getBitcoinColor = () => {
      if (colorShift > 0) {
        // Bullish - warmer colors (orange to gold)
        const intensity = Math.min(colorShift, 1);
        return `hsl(${39 + intensity * 15}, 100%, ${71 + intensity * 10}%)`;
      } else if (colorShift < 0) {
        // Bearish - cooler colors (orange to blue)
        const intensity = Math.min(Math.abs(colorShift), 1);
        return `hsl(${39 - intensity * 45}, 100%, ${71 - intensity * 20}%)`;
      }
      return '#F7931A'; // Default Bitcoin orange
    };

    const getCircuitColor = () => {
      if (colorShift > 0) {
        // Bullish - warmer cyan to green
        const intensity = Math.min(colorShift, 1);
        return `hsl(${195 + intensity * 25}, 100%, ${50 + intensity * 15}%)`;
      } else if (colorShift < 0) {
        // Bearish - cooler cyan to blue
        const intensity = Math.min(Math.abs(colorShift), 1);
        return `hsl(${195 - intensity * 15}, 100%, ${50 - intensity * 10}%)`;
      }
      return '#00D4FF'; // Default cyan
    };

    // Draw Bitcoin symbol with dynamic colors and parallax
    const drawBitcoin = (ctx: CanvasRenderingContext2D, particle: Particle) => {
      const parallaxX = particle.x + (mouseRef.current.x * particle.parallaxSpeed * 20);
      const parallaxY = particle.y + (mouseRef.current.y * particle.parallaxSpeed * 20);
      
      ctx.save();
      ctx.translate(parallaxX, parallaxY);
      ctx.rotate(particle.rotation);
      ctx.globalAlpha = particle.opacity;
      ctx.strokeStyle = getBitcoinColor();
      ctx.lineWidth = particle.size / 8;
      ctx.beginPath();
      
      // Bitcoin B symbol simplified
      const radius = particle.size / 2;
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Inner B lines
      ctx.beginPath();
      ctx.moveTo(-radius * 0.3, -radius * 0.3);
      ctx.lineTo(radius * 0.2, -radius * 0.3);
      ctx.moveTo(-radius * 0.3, 0);
      ctx.lineTo(radius * 0.3, 0);
      ctx.moveTo(-radius * 0.3, radius * 0.3);
      ctx.lineTo(radius * 0.2, radius * 0.3);
      ctx.stroke();
      
      ctx.restore();
    };

    // Draw circuit pattern with parallax
    const drawCircuit = (ctx: CanvasRenderingContext2D, particle: Particle) => {
      const parallaxX = particle.x + (mouseRef.current.x * particle.parallaxSpeed * 15);
      const parallaxY = particle.y + (mouseRef.current.y * particle.parallaxSpeed * 15);
      
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      ctx.strokeStyle = getCircuitColor();
      ctx.lineWidth = 1;
      ctx.beginPath();
      
      // Circuit lines
      const halfSize = particle.size / 2;
      ctx.moveTo(parallaxX - halfSize, parallaxY);
      ctx.lineTo(parallaxX + halfSize, parallaxY);
      ctx.moveTo(parallaxX, parallaxY - halfSize);
      ctx.lineTo(parallaxX, parallaxY + halfSize);
      
      // Circuit nodes
      ctx.fillStyle = getCircuitColor();
      ctx.fillRect(parallaxX - 2, parallaxY - 2, 4, 4);
      ctx.fillRect(parallaxX - halfSize - 2, parallaxY - 2, 4, 4);
      ctx.fillRect(parallaxX + halfSize - 2, parallaxY - 2, 4, 4);
      
      ctx.stroke();
      ctx.restore();
    };

    // Draw simple dot with parallax
    const drawDot = (ctx: CanvasRenderingContext2D, particle: Particle) => {
      const parallaxX = particle.x + (mouseRef.current.x * particle.parallaxSpeed * 10);
      const parallaxY = particle.y + (mouseRef.current.y * particle.parallaxSpeed * 10);
      
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(parallaxX, parallaxY, particle.size / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.rotation += particle.rotationSpeed;

        // Wrap around screen
        if (particle.x > canvas.width + particle.size) particle.x = -particle.size;
        if (particle.x < -particle.size) particle.x = canvas.width + particle.size;
        if (particle.y > canvas.height + particle.size) particle.y = -particle.size;
        if (particle.y < -particle.size) particle.y = canvas.height + particle.size;

        // Draw particle based on type with depth-based rendering
        switch (particle.type) {
          case 'bitcoin':
            drawBitcoin(ctx, particle);
            break;
          case 'circuit':
            drawCircuit(ctx, particle);
            break;
          case 'dot':
            drawDot(ctx, particle);
            break;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: 'transparent',
      }}
    />
  );
}