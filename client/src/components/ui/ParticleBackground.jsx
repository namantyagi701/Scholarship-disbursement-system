import React, { useEffect, useRef } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    // Colorful palette similar to the screenshot
    const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#9C27B0', '#FF9800', '#0F1729', '#B8860B'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor(isInitial = false) {
        this.reset(isInitial);
      }
      
      reset(isInitial = false) {
        this.angle = Math.random() * Math.PI * 2;
        // Start near center, but if initializing, spread them out
        this.radius = isInitial 
          ? Math.random() * (Math.max(canvas.width, canvas.height) / 1.5) 
          : Math.random() * 20; 
          
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.size = Math.random() * 2.5 + 1.5;
        this.length = Math.random() * 12 + 6;
        
        // Swirl and expand speed
        this.angularSpeed = (Math.random() - 0.5) * 0.005;
        this.radialSpeed = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.6 + 0.2;
      }

      update() {
        this.angle += this.angularSpeed;
        this.radius += this.radialSpeed;
        
        this.x = canvas.width / 2 + Math.cos(this.angle) * this.radius;
        this.y = canvas.height / 2 + Math.sin(this.angle) * this.radius;
        
        // Reset if out of bounds
        if (
          this.x < -50 || 
          this.x > canvas.width + 50 || 
          this.y < -50 || 
          this.y > canvas.height + 50
        ) {
          this.reset(false);
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Orient the dash along its path slightly skewed for a vortex feel
        ctx.rotate(this.angle + Math.PI / 4);
        
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineWidth = this.size;
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = this.opacity;
        
        ctx.moveTo(0, 0);
        ctx.lineTo(this.length, 0);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Initialize 250 particles
    for (let i = 0; i < 250; i++) {
      particles.push(new Particle(true));
    }

    const animate = () => {
      // Clean clear for the light theme to avoid dark trails
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.9 }}
    />
  );
};

export default ParticleBackground;
