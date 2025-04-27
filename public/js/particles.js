// Particle animation for Neon Futuristic Theme
document.addEventListener('DOMContentLoaded', function() {
  const particlesContainer = document.querySelector('.particles-container');
  if (!particlesContainer) return;
  
  // Configuration
  const config = {
    particleCount: 100,
    minSize: 1,
    maxSize: 3,
    minDuration: 10000, // ms
    maxDuration: 30000, // ms
    minOpacity: 0.2,
    maxOpacity: 0.8
  };
  
  // Create particles
  for (let i = 0; i < config.particleCount; i++) {
    createParticle();
  }
  
  function createParticle() {
    const particle = document.createElement('div');
    
    // Random position
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    
    // Random size
    const size = config.minSize + Math.random() * (config.maxSize - config.minSize);
    
    // Random duration & opacity for the animation
    const duration = config.minDuration + Math.random() * (config.maxDuration - config.minDuration);
    const opacity = config.minOpacity + Math.random() * (config.maxOpacity - config.minOpacity);
    
    // Apply styles
    particle.classList.add('particle');
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.setProperty('--duration', `${duration}ms`);
    particle.style.setProperty('--opacity', opacity);
    
    // Add glow effect to some particles
    if (Math.random() > 0.7) {
      const colors = ['#00D4FF', '#39FF14', '#FF00FF', '#FFFF00', '#00FFFF'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
      particle.style.background = color;
    }
    
    // Add to container
    particlesContainer.appendChild(particle);
    
    // Animate movement with CSS transforms
    animateParticle(particle);
    
    // Remove and recreate particle after animation completes
    setTimeout(() => {
      particle.remove();
      createParticle();
    }, duration);
  }
  
  function animateParticle(particle) {
    // Random movement (subtle)
    const moveX = -10 + Math.random() * 20; // -10px to +10px
    const moveY = -10 + Math.random() * 20; // -10px to +10px
    
    // Apply the animation
    particle.animate(
      [
        { transform: 'translate(0, 0)' },
        { transform: `translate(${moveX}px, ${moveY}px)` }
      ],
      {
        duration: parseFloat(particle.style.getPropertyValue('--duration')),
        easing: 'ease-in-out',
        fill: 'forwards'
      }
    );
  }
}); 