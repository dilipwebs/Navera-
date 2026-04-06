/* ============================================
   NAVERA VOGUE – FULL 3D ANIMATION ENGINE
   ============================================ */

'use strict';

// ─── CUSTOM CURSOR ───────────────────────────────────────────────
(function initCursor() {
  document.addEventListener('mousemove', e => {
    document.documentElement.style.setProperty('--cx', e.clientX + 'px');
    document.documentElement.style.setProperty('--cy', e.clientY + 'px');
  });
})();

// ─── LOADER ──────────────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    initParticles();
    initRevealObserver();
    initHeroParallax();
    initNavScroll();
    init3DTilt();
    initGICardFlip();
  }, 2200);
});

// ─── NAVBAR SCROLL ───────────────────────────────────────────────
function initNavScroll() {
  const nav = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  hamburger?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('open');
  });

  // Close mobile menu on link click
  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

// ─── PARTICLES CANVAS ────────────────────────────────────────────
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }, { passive: true });

  const particles = [];
  const COUNT = 80;

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.6 ? '#C8A96E' : '#F5F0E8';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  // Draw connecting lines
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#C8A96E';
          ctx.globalAlpha = (1 - dist / 120) * 0.06;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
}

// ─── SCROLL REVEAL ───────────────────────────────────────────────
function initRevealObserver() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

// ─── HERO PARALLAX ───────────────────────────────────────────────
function initHeroParallax() {
  const hero = document.querySelector('.hero-section');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const content = hero.querySelector('.hero-content');
    const video = hero.querySelector('.hero-bg-video video');
    const floatImgs = hero.querySelectorAll('[data-parallax]');

    if (content) content.style.transform = `translateY(${y * 0.2}px)`;
    if (video) video.style.transform = `scale(1.05) translateY(${y * 0.1}px)`;

    floatImgs.forEach(el => {
      const factor = parseFloat(el.dataset.parallax) || 0.2;
      el.style.transform = `translateY(${y * factor}px)`;
    });
  }, { passive: true });
}

// ─── 3D TILT ON CARDS ────────────────────────────────────────────
function init3DTilt() {
  const cards = document.querySelectorAll('.event-card, .designer-card, .gi-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
      card.style.transition = 'none';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'all 0.5s cubic-bezier(0.25,0.46,0.45,0.94)';
    });
  });
}

// ─── GI CARD 3D FLIP ─────────────────────────────────────────────
function initGICardFlip() {
  // GI cards use CSS hover, but also support touch
  const giCards = document.querySelectorAll('.gi-card');
  giCards.forEach(card => {
    card.addEventListener('touchstart', () => {
      card.classList.toggle('flipped');
    }, { passive: true });

    card.addEventListener('touchstart', () => {
      const inner = card.querySelector('.gi-card-inner');
      inner.style.transform = inner.style.transform === 'rotateY(180deg)' ? '' : 'rotateY(180deg)';
    }, { passive: true });
  });
}

// ─── SMOOTH SECTION TRANSITIONS (3D Skew on scroll) ──────────────
(function initScrollEffects() {
  let lastY = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const diff = currentY - lastY;
        const skew = Math.min(Math.max(diff * 0.03, -3), 3);

        document.querySelectorAll('.gi-card-inner').forEach(el => {
          el.style.transition = 'transform 0.5s ease';
        });

        lastY = currentY;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// ─── STAGGERED ANIMATION ENTRY ────────────────────────────────────
(function initStaggerCards() {
  const giCards = document.querySelectorAll('.gi-card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        giCards.forEach((card, i) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, i * 120);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });

  const container = document.querySelector('.gi-cards');
  if (container) {
    giCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(50px) scale(0.95)';
      card.style.transition = 'all 0.7s cubic-bezier(0.25,0.46,0.45,0.94)';
    });
    observer.observe(container);
  }
})();

// ─── CITY PINS 3D HOVER ──────────────────────────────────────────
(function initCityPins() {
  document.querySelectorAll('.city-pin').forEach((pin, i) => {
    // Stagger entry
    setTimeout(() => {
      pin.style.opacity = '1';
      pin.style.transform = 'translateY(0)';
    }, 300 + i * 150);

    pin.style.opacity = '0';
    pin.style.transform = 'translateY(20px)';
    pin.style.transition = 'all 0.6s ease';

    pin.addEventListener('mouseenter', () => {
      pin.style.transform = 'translateY(-8px) scale(1.05)';
    });
    pin.addEventListener('mouseleave', () => {
      pin.style.transform = 'translateY(0) scale(1)';
    });
  });
})();

// ─── SPINNING TEXT RING (decorative) ─────────────────────────────
(function initSpinningText() {
  const sections = document.querySelectorAll('section');
  sections.forEach(sec => {
    sec.style.position = sec.style.position || 'relative';
  });
})();

// ─── COUNTER ANIMATION ───────────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.textContent);
      if (isNaN(target)) return;
      let start = 0;
      const step = target / 60;
      const interval = setInterval(() => {
        start += step;
        if (start >= target) { el.textContent = target + '+'; clearInterval(interval); }
        else el.textContent = Math.floor(start) + '+';
      }, 16);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
})();

// ─── NEWSLETTER FORM ─────────────────────────────────────────────
document.getElementById('newsletter-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  const input = document.getElementById('email-input');
  btn.textContent = '✦ Subscribed!';
  btn.style.background = 'linear-gradient(135deg, #2d6a2d, #3a8a3a)';
  input.value = '';
  setTimeout(() => {
    btn.textContent = 'Subscribe';
    btn.style.background = '';
  }, 3000);
});

// ─── 3D FLOATING ORBS (CSS-in-JS) ───────────────────────────────
(function createOrbs() {
  const orbData = [
    { size: 300, top: '10%', left: '5%', color: 'rgba(200,169,110,0.03)', duration: '12s' },
    { size: 200, top: '60%', right: '8%', color: 'rgba(139,26,26,0.05)', duration: '16s' },
    { size: 400, top: '40%', left: '50%', color: 'rgba(200,169,110,0.02)', duration: '20s' },
  ];

  const style = document.createElement('style');
  let css = '';
  orbData.forEach((orb, i) => {
    css += `
      .orb-${i} {
        position: fixed;
        width: ${orb.size}px;
        height: ${orb.size}px;
        border-radius: 50%;
        background: radial-gradient(circle, ${orb.color}, transparent 70%);
        pointer-events: none;
        z-index: 0;
        top: ${orb.top || 'auto'};
        left: ${orb.left || 'auto'};
        right: ${orb.right || 'auto'};
        animation: orbFloat${i} ${orb.duration} ease-in-out infinite alternate;
        filter: blur(40px);
      }
      @keyframes orbFloat${i} {
        from { transform: translate(0, 0) scale(1); }
        to   { transform: translate(${(Math.random()-0.5)*40}px, ${(Math.random()-0.5)*40}px) scale(1.1); }
      }
    `;
  });
  style.textContent = css;
  document.head.appendChild(style);

  orbData.forEach((_, i) => {
    const orb = document.createElement('div');
    orb.className = `orb-${i}`;
    document.body.appendChild(orb);
  });
})();

// ─── HERO TEXT SPLIT ANIMATION (letter-by-letter) ─────────────────
(function initTextSplit() {
  const heroTitle = document.querySelector('.hero-title');
  if (!heroTitle) return;

  // Already animated via CSS, just ensure AOS
  heroTitle.style.animationDelay = '0.3s';
})();

// ─── SECTION REVEAL WITH 3D ──────────────────────────────────────
(function initSection3D() {
  const sections = document.querySelectorAll('section');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) rotateX(0deg)';
      }
    });
  }, { threshold: 0.05 });

  sections.forEach(s => {
    s.style.opacity = '0';
    s.style.transform = 'translateY(30px) rotateX(2deg)';
    s.style.transition = 'opacity 0.9s ease, transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)';
    s.style.transformOrigin = 'top center';
    s.style.perspectiveOrigin = 'top center';
    obs.observe(s);
  });
})();

// ─── MOUSE PARALLAX ON FOUNDERS SECTION ──────────────────────────
(function initMouseParallax() {
  const frames = document.querySelectorAll('.founder-img-frame');
  if (!frames.length) return;

  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    frames.forEach((frame, i) => {
      const factor = i === 0 ? 1 : -1;
      frame.style.transform = `translate(${x * factor * 0.4}px, ${y * factor * 0.4}px)`;
      frame.style.transition = 'transform 0.4s ease';
    });
  }, { passive: true });
})();

// ─── GOLD SHIMMER ON HEADINGS ─────────────────────────────────────
(function initGoldShimmer() {
  const style = document.createElement('style');
  style.textContent = `
    .section-title em {
      background: linear-gradient(
        90deg,
        #C8A96E 0%, #E8D5A3 25%, #C8A96E 50%, #8B6E3C 75%, #C8A96E 100%
      );
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 4s linear infinite;
    }
    @keyframes shimmer {
      0% { background-position: 0% center; }
      100% { background-position: 200% center; }
    }
    .hero-title em {
      background: linear-gradient(
        90deg,
        #C8A96E 0%, #E8D5A3 30%, #C8A96E 60%, #8B1A1A 80%, #C8A96E 100%
      );
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 5s linear infinite;
    }
  `;
  document.head.appendChild(style);
})();

console.log('✦ Navera Vogue — Heritage Meets Future ✦');
