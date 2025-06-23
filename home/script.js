// Simplified Particle System with minimal mouse interference
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.isMouseMoving = false;
        this.mouseTimeout = null;
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        
        // Minimal mouse tracking - only when mouse stops moving
        window.addEventListener('mousemove', this.handleMouseMove.bind(this), { passive: true });
    }
    
    handleMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        this.isMouseMoving = true;
        
        // Stop mouse effects after mouse stops for 100ms
        clearTimeout(this.mouseTimeout);
        this.mouseTimeout = setTimeout(() => {
            this.isMouseMoving = false;
        }, 100);
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        this.particles = [];
        // Reduce particle count significantly
        const particleCount = Math.min(50, Math.floor((this.canvas.width * this.canvas.height) / 20000));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                size: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.3 + 0.1
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update particles with minimal processing
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Simple boundary bounce
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Very minimal mouse interaction - only when mouse is still
            if (!this.isMouseMoving) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = dx * dx + dy * dy;
                
                if (distance < 3600) { // 60px radius
                    particle.x -= dx * 0.001;
                    particle.y -= dy * 0.001;
                }
            }
        });
        
        // Draw connections with reduced complexity
        this.particles.forEach((particle, i) => {
            if (i % 2 === 0) { // Only check every other particle for connections
                this.particles.slice(i + 2).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 80) {
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 * (1 - distance / 80)})`;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.moveTo(particle.x, particle.y);
                        this.ctx.lineTo(otherParticle.x, otherParticle.y);
                        this.ctx.stroke();
                    }
                });
            }
        });
        
        // Draw particles with purple theme
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(139, 92, 246, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Simplified Custom Cursor with minimal interference
class CustomCursor {
    constructor() {
        this.dot = document.querySelector('[data-cursor-dot]');
        this.outline = document.querySelector('[data-cursor-outline]');
        
        if (!this.dot || !this.outline) return;
        
        this.delay = 12; // Increased delay for smoother movement
        this._x = 0;
        this._y = 0;
        this.endX = window.innerWidth / 2;
        this.endY = window.innerHeight / 2;
        this.cursorVisible = true;
        
        this.init();
    }
    
    init() {
        // Simple mouse tracking without interference
        document.addEventListener('mousemove', (e) => {
            this.endX = e.pageX;
            this.endY = e.pageY;
            this.dot.style.top = this.endY + 'px';
            this.dot.style.left = this.endX + 'px';
        }, { passive: true });
        
        document.addEventListener('mouseenter', () => {
            this.dot.style.opacity = 1;
            this.outline.style.opacity = 1;
        });
        
        document.addEventListener('mouseleave', () => {
            this.dot.style.opacity = 0;
            this.outline.style.opacity = 0;
        });
        
        this.animateOutline();
    }
    
    animateOutline() {
        this._x += (this.endX - this._x) / this.delay;
        this._y += (this.endY - this._y) / this.delay;
        this.outline.style.top = this._y + 'px';
        this.outline.style.left = this._x + 'px';
        
        requestAnimationFrame(this.animateOutline.bind(this));
    }
}

// Terminal Typing Effect - No changes needed
class TerminalTyper {
    constructor() {
        this.commands = [
            'aigentz deploy --agents="multi-agent" --enterprise',
            'aigentz scale --autonomous=true --instances=1000',
            'aigentz monitor --agentic-workflows --real-time',
            'aigentz optimize --decision-engines --learning=adaptive'
        ];
        this.currentCommand = 0;
        this.currentChar = 0;
        this.isTyping = true;
        this.element = document.getElementById('typing-text');
        
        if (this.element) {
            this.type();
        }
    }
    
    type() {
        if (this.isTyping) {
            if (this.currentChar < this.commands[this.currentCommand].length) {
                this.element.textContent += this.commands[this.currentCommand].charAt(this.currentChar);
                this.currentChar++;
                setTimeout(() => this.type(), 100);
            } else {
                this.isTyping = false;
                setTimeout(() => this.erase(), 2000);
            }
        }
    }
    
    erase() {
        if (this.currentChar > 0) {
            this.element.textContent = this.commands[this.currentCommand].substring(0, this.currentChar - 1);
            this.currentChar--;
            setTimeout(() => this.erase(), 50);
        } else {
            this.isTyping = true;
            this.currentCommand = (this.currentCommand + 1) % this.commands.length;
            setTimeout(() => this.type(), 500);
        }
    }
}

// Counter Animation - Simplified
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.counter');
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            { threshold: 0.7 }
        );
        
        this.counters.forEach(counter => this.observer.observe(counter));
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.animateCounter(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    }
    
    animateCounter(element) {
        const target = parseFloat(element.dataset.target);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = this.formatNumber(target);
                clearInterval(timer);
            } else {
                element.textContent = this.formatNumber(current);
            }
        }, 16);
    }
    
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1);
        } else if (num >= 1000) {
            return (num / 1000).toFixed(0);
        } else {
            return num.toFixed(1);
        }
    }
}

// Tab System - No changes needed
class TabSystem {
    constructor() {
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.tabPanels = document.querySelectorAll('.tab-panel');
        
        this.tabButtons.forEach(button => {
            button.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
    }
    
    switchTab(activeTab) {
        this.tabButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.tab === activeTab);
        });
        
        this.tabPanels.forEach(panel => {
            panel.classList.toggle('active', panel.dataset.panel === activeTab);
        });
    }
}

// Smooth Scroll - No changes needed
class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.links.forEach(link => {
            link.addEventListener('click', (e) => this.handleClick(e));
        });
    }
    
    handleClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// Simplified Scroll Animations
class ScrollAnimations {
    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );
        
        this.animateElements = document.querySelectorAll('.feature-card, .tech-item, .solution-feature');
        this.animateElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            this.observer.observe(element);
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// Simplified Navbar Controller
class NavbarController {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.lastScrollTop = 0;
        
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    }
    
    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            this.navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            this.navbar.style.backdropFilter = 'blur(20px)';
        } else {
            this.navbar.style.background = 'rgba(10, 10, 10, 0.9)';
            this.navbar.style.backdropFilter = 'blur(20px)';
        }
        
        if (scrollTop > this.lastScrollTop && scrollTop > 200) {
            this.navbar.style.transform = 'translateY(-100%)';
        } else {
            this.navbar.style.transform = 'translateY(0)';
        }
        
        this.lastScrollTop = scrollTop;
    }
}

// Simplified Button Effects
class ButtonEffects {
    constructor() {
        this.buttons = document.querySelectorAll('.btn');
        this.buttons.forEach(button => {
            // Only add click effects, no hover interference
            button.addEventListener('click', (e) => this.createClickEffect(e));
        });
    }
    
    createClickEffect(e) {
        const button = e.currentTarget;
        
        // Simple scale effect
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
        
        // Simple ripple
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
}

// Architecture Diagram Animation - Simplified
class ArchitectureDiagram {
    constructor() {
        this.nodes = document.querySelectorAll('.node');
        this.activeIndex = 0;
        
        if (this.nodes.length > 0) {
            this.animate();
        }
    }
    
    animate() {
        this.nodes.forEach((node, index) => {
            node.classList.toggle('active', index === this.activeIndex);
        });
        
        this.activeIndex = (this.activeIndex + 1) % this.nodes.length;
        setTimeout(() => this.animate(), 800); // Slower animation
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particle system
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        window.particleSystem = new ParticleSystem(canvas);
    }
    
    // Initialize custom cursor (only on desktop)
    if (window.innerWidth > 768 && !('ontouchstart' in window)) {
        new CustomCursor();
    }
    
    // Initialize other components
    new TerminalTyper();
    new CounterAnimation();
    new TabSystem();
    new SmoothScroll();
    new ScrollAnimations();
    new NavbarController();
    new ButtonEffects();
    new ArchitectureDiagram();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        /* Optimize hover transitions */
        .btn, .feature-card, .solution-card, .tech-item {
            will-change: transform;
            backface-visibility: hidden;
        }
        
        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
            .particles-container {
                display: none;
            }
            
            .cursor-dot, .cursor-outline {
                display: none;
            }
            
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Mobile menu toggle
    const mobileMenu = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    console.log('🚀 AIGentz agentic platform initialized with optimized animations!');
});