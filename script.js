/* ============================================================
   PORTFOLIO WEBSITE - SCRIPT.JS
   All interactions, animations, and logic
   ============================================================ */

'use strict';

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

function resetPageScroll() {
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);
  requestAnimationFrame(() => {
    root.style.scrollBehavior = previousScrollBehavior;
  });
}

resetPageScroll();
window.addEventListener('pageshow', resetPageScroll);

/* ============================================================
   1. CINEMATIC INTRO ANIMATION
   ============================================================ */
(function initIntro() {
  const overlay  = document.getElementById('introOverlay');
  const barFill  = document.getElementById('introBarFill');
  const pctEl    = document.getElementById('introPct');
  const canvas   = document.getElementById('introParticles');

  // Respect prefers-reduced-motion
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!overlay) return;

  document.body.classList.add('loading');

  /* --- Intro Particles --- */
  if (canvas && !reduced) {
    const ctx = canvas.getContext('2d');
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const pts = [];
    for (let i = 0; i < 70; i++) pts.push({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.6 + 0.15),
      r: Math.random() * 2 + 0.5,
      a: Math.random() * 0.55 + 0.1,
      c: Math.random() > 0.5 ? '108,99,255' : '255,101,132',
    });
    let running = true;
    function drawPts() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = H + 5; p.x = Math.random() * W; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${p.a})`;
        ctx.fill();
      });
      requestAnimationFrame(drawPts);
    }
    drawPts();
    window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });
    // Stop particles when intro exits
    overlay.addEventListener('transitionend', () => { running = false; }, { once: true });
  }

  /* --- Progress counter --- */
  let pct = 0;
  // Total duration ~2.2s (starts at 1.4s after animations begin)
  const TOTAL_MS = reduced ? 100 : 2200;
  const START_DELAY = reduced ? 0 : 1400;
  const TICK = 40;
  const increment = 100 / (TOTAL_MS / TICK);

  function dismissIntro() {
    overlay.classList.add('exit');
    document.body.classList.remove('loading');
    overlay.addEventListener('transitionend', () => {
      overlay.style.display = 'none';
      initParticles();
      animateCounters();
    }, { once: true });
  }

  setTimeout(() => {
    const id = setInterval(() => {
      pct = Math.min(pct + increment + Math.random() * increment * 0.5, 100);
      if (barFill) barFill.style.width = pct + '%';
      if (pctEl)   pctEl.textContent   = Math.round(pct) + '%';
      if (pct >= 100) {
        clearInterval(id);
        if (barFill) barFill.style.width = '100%';
        if (pctEl)   pctEl.textContent   = '100%';
        setTimeout(dismissIntro, 300);
      }
    }, TICK);
  }, START_DELAY);
})();

/* ============================================================
   2. LUCIDE ICONS - initialize after DOM ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  AOS.init({
    duration: 700,
    once: true,
    easing: 'ease-out-cubic',
    offset: 80,
  });

  initNavbar();
  initHamburger();
  initTypingEffect();
  initSkillTabs();
  initProjectFilter();
  initSkillBars();
  initContactForm();
  initScrollIndicator();
  initBackToTop();
  setFooterYear();
  initCursor();
  initSmoothScroll();
  initActiveNavLink();
});

/* ============================================================
   3. CUSTOM CURSOR
   ============================================================ */
function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = -200, my = -200;
  let rx = -200, ry = -200;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  });

  // Smooth ring follow
  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  const hoverEls = document.querySelectorAll('a, button, .project-card, .skill-card, .achievement-card');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
}

/* ============================================================
   4. PARTICLE CANVAS
   ============================================================ */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const PARTICLE_COUNT = 60;
  const particles = [];

  class Particle {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x  = Math.random() * W;
      this.y  = initial ? Math.random() * H : H + 10;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.5 + 0.2);
      this.r  = Math.random() * 1.8 + 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '108,99,255' : '255,101,132';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });
}

/* ============================================================
   5. NAVBAR SCROLL EFFECT
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ============================================================
   6. HAMBURGER MENU
   ============================================================ */
function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    links.classList.toggle('open');
    document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('active');
      links.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      btn.classList.remove('active');
      links.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ============================================================
   7. TYPING EFFECT
   ============================================================ */
function initTypingEffect() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const words = [
    'Frontend Developer',
    'UI/UX Designer',
    'Web Enthusiast',
    'Creative Coder',
    'Problem Solver',
  ];

  let wi = 0, ci = 0, deleting = false;
  const SPEED_TYPE = 90, SPEED_DEL = 50, PAUSE = 1800;

  function type() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(type, PAUSE); return; }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(type, deleting ? SPEED_DEL : SPEED_TYPE);
  }
  setTimeout(type, 800);
}

/* ============================================================
   8. ANIMATED COUNTERS (hero stats)
   ============================================================ */
function animateCounters() {
  const els = document.querySelectorAll('.stat-number[data-target]');
  els.forEach(el => {
    const target = +el.dataset.target;
    let cur = 0;
    const step = target / 40;
    const id = setInterval(() => {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(id); }
      el.textContent = Math.floor(cur);
    }, 40);
  });
}

/* ============================================================
   9. SKILL TABS
   ============================================================ */
function initSkillTabs() {
  const tabs   = document.querySelectorAll('.skill-tab');
  const panels = document.querySelectorAll('.skill-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const panel = document.getElementById('panel-' + target);
      if (panel) {
        panel.classList.add('active');
        // Animate skill bars in the newly shown panel
        panel.querySelectorAll('.skill-bar-fill').forEach(bar => {
          bar.classList.remove('animated');
          setTimeout(() => bar.classList.add('animated'), 50);
        });
      }
    });
  });

  // Animate bars for initially active panel on scroll
  const skillSection = document.getElementById('skills');
  if (!skillSection) return;

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.skill-panel.active .skill-bar-fill').forEach(bar => {
        bar.classList.add('animated');
      });
      obs.disconnect();
    }
  }, { threshold: 0.3 });
  obs.observe(skillSection);
}

/* ============================================================
   10. PROJECT FILTER
   ============================================================ */
function initProjectFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach((card, i) => {
        const cat = card.dataset.category;
        const show = filter === 'all' || cat === filter;
        card.style.transition = `opacity 0.3s ease ${i * 0.05}s, transform 0.3s ease ${i * 0.05}s`;
        if (show) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => card.classList.add('hidden'), 300);
        }
      });
    });
  });
}

/* ============================================================
   11. SKILL BARS (Intersection Observer)
   ============================================================ */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(bar => obs.observe(bar));
}

/* ============================================================
   12. CONTACT FORM (simulated submit)
   ============================================================ */
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const btnText = document.getElementById('submitBtnText');
  const btnIcon = document.getElementById('submitBtnIcon');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = document.getElementById('formName').value.trim();
    const email   = document.getElementById('formEmail').value.trim();
    const message = document.getElementById('formMessage').value.trim();

    if (!name || !email || !message) {
      shakeForm(form);
      return;
    }

    // Loading state
    btnText.textContent = 'Mengirim...';
    if (window.lucide) {
      btnIcon.innerHTML = '';
      btnIcon.setAttribute('data-lucide', 'loader-2');
      lucide.createIcons();
    }
    form.querySelector('button[type="submit"]').disabled = true;
    form.querySelector('button[type="submit"]').style.opacity = '0.7';

    // Simulate async send (replace with real API call)
    setTimeout(() => {
      btnText.textContent = 'Terkirim!';
      if (window.lucide) {
        btnIcon.setAttribute('data-lucide', 'check');
        lucide.createIcons();
      }
      success.classList.add('show');
      form.reset();
      setTimeout(() => {
        btnText.textContent = 'Kirim Pesan';
        if (window.lucide) {
          btnIcon.setAttribute('data-lucide', 'send');
          lucide.createIcons();
        }
        form.querySelector('button[type="submit"]').disabled = false;
        form.querySelector('button[type="submit"]').style.opacity = '1';
        setTimeout(() => success.classList.remove('show'), 5000);
      }, 2000);
    }, 1800);
  });

  // Real-time input focus style
  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('focus', () => {
      input.closest('.form-group').querySelector('label').style.color = 'var(--accent-primary)';
    });
    input.addEventListener('blur', () => {
      input.closest('.form-group').querySelector('label').style.color = '';
    });
  });
}

function shakeForm(form) {
  form.style.animation = 'none';
  form.style.transform = 'translateX(8px)';
  setTimeout(() => {
    form.style.transform = 'translateX(-8px)';
    setTimeout(() => {
      form.style.transform = 'translateX(4px)';
      setTimeout(() => { form.style.transform = ''; }, 80);
    }, 80);
  }, 80);
}

/* ============================================================
   13. SCROLL INDICATOR (hide after scroll)
   ============================================================ */
function initScrollIndicator() {
  const indicator = document.getElementById('scrollIndicator');
  if (!indicator) return;
  const hide = () => {
    if (window.scrollY > 100) {
      indicator.style.opacity = '0';
      indicator.style.pointerEvents = 'none';
    } else {
      indicator.style.opacity = '0.6';
      indicator.style.pointerEvents = 'auto';
    }
  };
  window.addEventListener('scroll', hide, { passive: true });
}

/* ============================================================
   14. BACK TO TOP
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   15. FOOTER YEAR
   ============================================================ */
function setFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ============================================================
   16. SMOOTH SCROLL for nav links
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      // Jika link ke #hero, selalu scroll ke paling atas
      if (href === '#hero') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navH = document.getElementById('navbar');
        const offset = navH ? navH.offsetHeight : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });
}

/* ============================================================
   17. ACTIVE NAV LINK (Intersection Observer)
   ============================================================ */
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.4, rootMargin: '-80px 0px 0px 0px' });

  sections.forEach(s => obs.observe(s));
}

/* ============================================================
   18. CARD TILT EFFECT (on mouse move)
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.project-card, .achievement-card, .skill-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
    });
  });
});

/* ============================================================
   19. PROFILE IMAGE ERROR FALLBACK
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const imgs = document.querySelectorAll('.profile-img, .about-img');
  imgs.forEach(img => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
      const wrapper = img.parentElement;
      if (wrapper) {
        wrapper.style.background = 'linear-gradient(135deg, #6c63ff, #ff6584)';
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
          display:flex; align-items:center; justify-content:center;
          width:100%; height:100%;
          font-family:'Space Grotesk',sans-serif;
          font-size:4rem; font-weight:800; color:rgba(255,255,255,0.9);
        `;
        placeholder.textContent = 'NL';
        wrapper.appendChild(placeholder);
      }
    });
  });
});

/* ============================================================
   20. SCROLL REVEAL for progress bars
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Re-run lucide after AOS reveals elements
  document.addEventListener('aos:in', () => {
    if (window.lucide) lucide.createIcons();
  });
});

/* ============================================================
   21. MUSIC PLAYLIST PLAYER (Web Audio API)
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {

  var youtubeIframe = document.getElementById('playlistYoutubePlayer');
  if (youtubeIframe) {
    var playButton = document.getElementById('youtubePlayPause');
    var progressSlider = document.getElementById('youtubeProgress');
    var volumeSlider = document.getElementById('youtubeVolume');
    var currentTimeLabel = document.getElementById('youtubeCurrentTime');
    var totalTimeLabel = document.getElementById('youtubeTotalTime');
    var durationLabel = document.getElementById('youtubeDuration');
    var playerStatus = document.getElementById('youtubePlayerStatus');
    var videoFrame = youtubeIframe.parentElement;
    var playlistToggle = document.getElementById('youtubePlaylistToggle');
    var playlistPanel = document.getElementById('youtubePlaylist');
    var playlistTracksContainer = document.getElementById('youtubePlaylistTracks');
    var playlistCount = document.getElementById('youtubePlaylistCount');
    var trackTitle = document.getElementById('youtubeTrackTitle');
    var trackArtist = document.getElementById('youtubeTrackArtist');
    var poster = document.getElementById('playlistYoutubePoster');
    var previousButton = document.getElementById('youtubePrevious');
    var nextButton = document.getElementById('youtubeNext');
    var youtubeTracks = [
      {
        videoId: 'jvGu0GK-GJg',
        title: 'BERTAHTA DI ATAS TANAH MEREKA',
        artist: 'Lukanegara (Cover Reggae Version) · AS Tone',
      },
      {
        videoId: 'c8NanRYQQUI',
        title: 'Lagu Barat Slow Enak Di Dengar Sambil Santai Dan Kerja',
        artist: 'Mahmuddin Music Official',
      },
    ];
    var currentTrackIndex = 0;
    var youtubePlayer = null;
    var progressInterval = null;
    var isSeeking = false;

    if (playlistCount) playlistCount.textContent = String(youtubeTracks.length);

    if (playlistToggle && playlistPanel) {
      playlistToggle.addEventListener('click', function () {
        var isExpanded = playlistToggle.getAttribute('aria-expanded') === 'true';
        playlistToggle.setAttribute('aria-expanded', String(!isExpanded));
        playlistToggle.setAttribute('aria-label', isExpanded ? 'Tampilkan playlist' : 'Sembunyikan playlist');
        playlistPanel.hidden = isExpanded;
      });
    }

    function renderYoutubePlaylist() {
      if (!playlistTracksContainer) return;
      playlistTracksContainer.replaceChildren();

      youtubeTracks.forEach(function (track, index) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'compact-playlist-track';
        button.setAttribute('data-track-index', String(index));
        button.setAttribute('aria-current', index === currentTrackIndex ? 'true' : 'false');
        button.disabled = true;

        var image = document.createElement('img');
        image.src = 'https://i.ytimg.com/vi/' + track.videoId + '/default.jpg';
        image.alt = '';
        image.loading = 'lazy';

        var info = document.createElement('span');
        info.className = 'compact-playlist-track-info';

        var title = document.createElement('span');
        title.className = 'compact-playlist-track-title';
        title.textContent = track.title;

        var artist = document.createElement('span');
        artist.className = 'compact-playlist-track-artist';
        artist.textContent = track.artist;

        var icon = document.createElement('i');
        icon.setAttribute('data-lucide', 'play');
        icon.setAttribute('aria-hidden', 'true');

        info.append(title, artist);
        button.append(image, info, icon);
        playlistTracksContainer.appendChild(button);
      });

      if (window.lucide) lucide.createIcons();
    }

    function updateCurrentYoutubeTrack(index) {
      currentTrackIndex = (index + youtubeTracks.length) % youtubeTracks.length;
      var track = youtubeTracks[currentTrackIndex];

      if (trackTitle) trackTitle.textContent = track.title;
      if (trackArtist) trackArtist.textContent = track.artist;
      youtubeIframe.title = track.title + ' - ' + track.artist;
      if (durationLabel) durationLabel.textContent = 'Memuat durasi...';
      if (totalTimeLabel) totalTimeLabel.textContent = '0:00';
      if (currentTimeLabel) currentTimeLabel.textContent = '0:00';
      if (progressSlider) {
        progressSlider.value = '0';
        progressSlider.max = '100';
        progressSlider.style.setProperty('--range-progress', '0%');
      }
      if (poster) poster.src = 'https://i.ytimg.com/vi/' + track.videoId + '/hqdefault.jpg';
      if (videoFrame) videoFrame.classList.remove('is-playing');
      if (playerStatus) playerStatus.textContent = 'Memuat lagu...';

      if (playlistTracksContainer) {
        playlistTracksContainer.querySelectorAll('.compact-playlist-track').forEach(function (button, buttonIndex) {
          button.setAttribute('aria-current', buttonIndex === currentTrackIndex ? 'true' : 'false');
        });
      }

      if (youtubePlayer) {
        isSeeking = false;
        youtubePlayer.loadVideoById({ videoId: track.videoId });
      }
    }

    renderYoutubePlaylist();

    function formatYoutubeTime(seconds) {
      var safeSeconds = Math.max(0, Math.floor(seconds || 0));
      var hours = Math.floor(safeSeconds / 3600);
      var minutes = Math.floor((safeSeconds % 3600) / 60);
      var remainingSeconds = safeSeconds % 60;
      var formattedMinutes = hours ? String(minutes).padStart(2, '0') : String(minutes);
      return formattedMinutes + ':' + String(remainingSeconds).padStart(2, '0');
    }

    function setYoutubePlayIcon(isPlaying) {
      if (!playButton) return;
      playButton.setAttribute('aria-label', isPlaying ? 'Jeda lagu' : 'Putar lagu');
      var icon = playButton.querySelector('[data-lucide]');
      if (icon) {
        icon.setAttribute('data-lucide', isPlaying ? 'pause' : 'play');
        if (window.lucide) lucide.createIcons();
      }
    }

    function updateYoutubeProgress() {
      if (!youtubePlayer || !progressSlider) return;
      var duration = youtubePlayer.getDuration();
      var currentTime = youtubePlayer.getCurrentTime();
      if (!Number.isFinite(duration) || duration <= 0) return;

      progressSlider.max = String(Math.floor(duration));
      if (!isSeeking) {
        progressSlider.value = String(Math.floor(currentTime));
        if (currentTimeLabel) currentTimeLabel.textContent = formatYoutubeTime(currentTime);
      }
      if (totalTimeLabel) totalTimeLabel.textContent = formatYoutubeTime(duration);
      if (durationLabel) durationLabel.textContent = formatYoutubeTime(duration);
      var displayedTime = isSeeking ? Number(progressSlider.value) : currentTime;
      progressSlider.style.setProperty('--range-progress', (displayedTime / duration * 100) + '%');
    }

    function initializeYoutubePlayer() {
      if (!window.YT || !window.YT.Player || youtubePlayer) return;

      youtubePlayer = new window.YT.Player(youtubeIframe, {
        videoId: youtubeTracks[currentTrackIndex].videoId,
        events: {
          onReady: function (event) {
            var duration = event.target.getDuration();
            if (duration > 0) {
              updateYoutubeProgress();
              if (durationLabel) durationLabel.textContent = formatYoutubeTime(duration);
            }
            if (playButton) playButton.disabled = false;
            if (progressSlider) progressSlider.disabled = false;
            if (volumeSlider) volumeSlider.disabled = false;
            if (previousButton) previousButton.disabled = false;
            if (nextButton) nextButton.disabled = false;
            if (playlistTracksContainer) {
              playlistTracksContainer.querySelectorAll('.compact-playlist-track').forEach(function (button) {
                button.disabled = false;
              });
            }
            if (playerStatus) playerStatus.textContent = 'Siap diputar';
            event.target.setVolume(Number(volumeSlider ? volumeSlider.value : 70));
            if (volumeSlider) updateVolumeSlider(Number(volumeSlider.value));
          },
          onStateChange: function (event) {
            var isPlaying = event.data === window.YT.PlayerState.PLAYING;
            if (isPlaying && videoFrame) videoFrame.classList.add('is-playing');
            setYoutubePlayIcon(isPlaying);
            if (playerStatus) {
              playerStatus.textContent = isPlaying ? 'Sedang diputar' :
                event.data === window.YT.PlayerState.ENDED ? 'Lagu selesai' :
                  event.data === window.YT.PlayerState.BUFFERING ? 'Memuat lagu...' : 'Siap diputar';
            }

            if (progressInterval) window.clearInterval(progressInterval);
            progressInterval = isPlaying ? window.setInterval(updateYoutubeProgress, 500) : null;
            updateYoutubeProgress();
            if (playlistTracksContainer) {
              playlistTracksContainer.querySelectorAll('.compact-playlist-track').forEach(function (button, index) {
                button.setAttribute('aria-current', index === currentTrackIndex ? 'true' : 'false');
              });
            }
          },
          onError: function (event) {
            var errorMessage = 'Video YouTube tidak dapat diputar (kode ' + event.data + ').';
            if (playerStatus) playerStatus.textContent = errorMessage;
            console.error(errorMessage);
          },
        },
        playerVars: {
          controls: 0,
          playsinline: 1,
          rel: 0,
        },
      });

      if (playButton) {
        playButton.addEventListener('click', function () {
          if (!youtubePlayer) return;
          if (youtubePlayer.getPlayerState() === window.YT.PlayerState.PLAYING) {
            youtubePlayer.pauseVideo();
          } else {
            youtubePlayer.playVideo();
          }
        });
      }

      if (progressSlider) {
        progressSlider.addEventListener('pointerdown', function () { isSeeking = true; });
        progressSlider.addEventListener('input', function () {
          isSeeking = true;
          if (currentTimeLabel) currentTimeLabel.textContent = formatYoutubeTime(progressSlider.value);
          var duration = Number(progressSlider.max);
          if (duration > 0) progressSlider.style.setProperty('--range-progress', (Number(progressSlider.value) / duration * 100) + '%');
        });
        progressSlider.addEventListener('change', function () {
          youtubePlayer.seekTo(Number(progressSlider.value), true);
          window.setTimeout(function () {
            isSeeking = false;
            updateYoutubeProgress();
          }, 300);
        });
        progressSlider.addEventListener('pointerup', function () {
          window.setTimeout(function () {
            if (isSeeking) {
              isSeeking = false;
              updateYoutubeProgress();
            }
          }, 350);
        });
      }

      function updateVolumeSlider(volume) {
        if (!volumeSlider) return;
        var clampedVolume = Math.max(0, Math.min(100, Math.round(volume)));
        volumeSlider.value = String(clampedVolume);
        volumeSlider.style.setProperty('--range-progress', clampedVolume + '%');
      }

      if (volumeSlider) {
        volumeSlider.addEventListener('input', function () {
          var volume = Number(volumeSlider.value);
          updateVolumeSlider(volume);
          youtubePlayer.setVolume(volume);
          if (volume === 0) youtubePlayer.mute();
          else youtubePlayer.unMute();
        });
      }

      if (playlistTracksContainer) {
        playlistTracksContainer.addEventListener('click', function (event) {
          var button = event.target.closest('.compact-playlist-track');
          if (!button || button.disabled) return;
          updateCurrentYoutubeTrack(Number(button.getAttribute('data-track-index')));
          if (playlistPanel && playlistToggle) {
            playlistPanel.hidden = true;
            playlistToggle.setAttribute('aria-expanded', 'false');
            playlistToggle.setAttribute('aria-label', 'Tampilkan playlist');
          }
        });
      }

      if (previousButton) {
        previousButton.addEventListener('click', function () {
          updateCurrentYoutubeTrack(currentTrackIndex - 1);
        });
      }

      if (nextButton) {
        nextButton.addEventListener('click', function () {
          updateCurrentYoutubeTrack(currentTrackIndex + 1);
        });
      }

      document.addEventListener('keydown', function (event) {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        var key = event.key;
        var increase = key === '+' || key === '=' || key === 'Add' || key === 'NumpadAdd';
        var decrease = key === '-' || key === '_' || key === 'Subtract' || key === 'NumpadSubtract';
        if (!increase && !decrease) return;

        var activeElement = document.activeElement;
        if (activeElement && (
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.tagName === 'SELECT' ||
          (activeElement.tagName === 'INPUT' && activeElement.type !== 'range')
        )) return;
        if (!youtubePlayer || !volumeSlider || volumeSlider.disabled) return;

        event.preventDefault();
        var currentVolume = Number(volumeSlider.value);
        var nextVolume = currentVolume + (increase ? 5 : -5);
        updateVolumeSlider(nextVolume);
        youtubePlayer.setVolume(Number(volumeSlider.value));
        if (Number(volumeSlider.value) === 0) youtubePlayer.mute();
        else youtubePlayer.unMute();
      });
    }

    var previousYoutubeReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () {
      if (typeof previousYoutubeReady === 'function') previousYoutubeReady();
      initializeYoutubePlayer();
    };

    if (window.YT && window.YT.Player) {
      initializeYoutubePlayer();
    } else {
      var youtubeApiScript = document.createElement('script');
      youtubeApiScript.src = 'https://www.youtube.com/iframe_api';
      youtubeApiScript.async = true;
      youtubeApiScript.onerror = function () {
        if (playerStatus) playerStatus.textContent = 'Gagal memuat pemutar YouTube.';
        console.error('Gagal memuat YouTube IFrame Player API.');
      };
      document.head.appendChild(youtubeApiScript);
    }
  }

  /* ---- Guard: playlist section exists? ---- */
  const playlistItems = document.getElementById('playlistItems');
  if (!playlistItems) return;

  /* ---- Playlist Data ---- */
  const SONGS = [
    {
      title: 'Neon Dreams',
      artist: 'Ahmad Ramadani',
      genre: 'Lo-Fi Hip Hop',
      emoji: '🌙',
      color: 'linear-gradient(135deg,#6c63ff,#a78bfa)',
      duration: 185,
      chords: [
        [261.63, 329.63, 392.00],
        [220.00, 277.18, 329.63],
        [196.00, 246.94, 293.66],
        [174.61, 220.00, 261.63],
      ],
      bpm: 85,
    },
    {
      title: 'Code & Chill',
      artist: 'Ahmad Ramadani',
      genre: 'Ambient',
      emoji: '💻',
      color: 'linear-gradient(135deg,#00d4ff,#0070ff)',
      duration: 212,
      chords: [
        [293.66, 369.99, 440.00],
        [246.94, 311.13, 369.99],
        [220.00, 277.18, 329.63],
        [196.00, 246.94, 293.66],
      ],
      bpm: 70,
    },
    {
      title: 'Midnight Sprint',
      artist: 'Ahmad Ramadani',
      genre: 'Electronic',
      emoji: '⚡',
      color: 'linear-gradient(135deg,#ff6584,#ff9a00)',
      duration: 163,
      chords: [
        [329.63, 415.30, 493.88],
        [277.18, 349.23, 415.30],
        [246.94, 311.13, 369.99],
        [220.00, 277.18, 329.63],
      ],
      bpm: 128,
    },
    {
      title: 'Pixel Rain',
      artist: 'Ahmad Ramadani',
      genre: 'Chillwave',
      emoji: '🌧️',
      color: 'linear-gradient(135deg,#00ffaa,#00d4ff)',
      duration: 198,
      chords: [
        [174.61, 220.00, 261.63],
        [155.56, 196.00, 233.08],
        [146.83, 185.00, 220.00],
        [130.81, 164.81, 196.00],
      ],
      bpm: 76,
    },
    {
      title: 'Debug Mode',
      artist: 'Ahmad Ramadani',
      genre: 'Synthwave',
      emoji: '🔧',
      color: 'linear-gradient(135deg,#f093fb,#f5576c)',
      duration: 227,
      chords: [
        [349.23, 440.00, 523.25],
        [293.66, 369.99, 440.00],
        [261.63, 329.63, 392.00],
        [220.00, 277.18, 329.63],
      ],
      bpm: 110,
    },
    {
      title: 'Focus Flow',
      artist: 'Ahmad Ramadani',
      genre: 'Study Beats',
      emoji: '📖',
      color: 'linear-gradient(135deg,#43e97b,#38f9d7)',
      duration: 241,
      chords: [
        [196.00, 246.94, 293.66],
        [174.61, 220.00, 261.63],
        [261.63, 329.63, 392.00],
        [293.66, 369.99, 440.00],
      ],
      bpm: 80,
    },
    {
      title: 'UI Vibes',
      artist: 'Ahmad Ramadani',
      genre: 'Future Bass',
      emoji: '🎨',
      color: 'linear-gradient(135deg,#fa709a,#fee140)',
      duration: 174,
      chords: [
        [220.00, 261.63, 329.63],
        [196.00, 246.94, 311.13],
        [174.61, 207.65, 261.63],
        [155.56, 196.00, 246.94],
      ],
      bpm: 140,
    },
    {
      title: 'Deploy Day',
      artist: 'Ahmad Ramadani',
      genre: 'Indie Pop',
      emoji: '🚀',
      color: 'linear-gradient(135deg,#4facfe,#00f2fe)',
      duration: 193,
      chords: [
        [261.63, 329.63, 392.00],
        [293.66, 369.99, 440.00],
        [329.63, 415.30, 493.88],
        [246.94, 311.13, 369.99],
      ],
      bpm: 95,
    },
    {
      title: 'DJ Selamat Ulang Tahun',
      artist: 'Balik Lobby YT',
      genre: 'Trap Battle',
      emoji: '🎂',
      color: 'linear-gradient(135deg,#f7971e,#ffd200)',
      duration: 245,
      chords: [
        [146.83, 174.61, 220.00],
        [164.81, 196.00, 246.94],
        [130.81, 164.81, 196.00],
        [146.83, 185.00, 220.00],
      ],
      bpm: 150,
    },
    {
      title: 'DJ Pecel Gank Vol 2',
      artist: 'DJ Bongobarbar',
      genre: 'DJ Remix',
      emoji: '🔊',
      color: 'linear-gradient(135deg,#ee0979,#ff6a00)',
      duration: 218,
      chords: [
        [130.81, 164.81, 196.00],
        [146.83, 185.00, 220.00],
        [174.61, 220.00, 261.63],
        [155.56, 196.00, 233.08],
      ],
      bpm: 128,
    },
  ];

  /* ---- State ---- */

  var currentIndex   = 0;
  var isPlaying      = false;
  var isShuffle      = false;
  var isRepeat       = false;
  var volumeLevel    = 0.70;
  var isMuted        = false;
  var prevVolume     = 0.70;
  var progressSeconds = 0;
  var progressTimer  = null;

  // Web Audio API (lazy-init on first play)
  var audioCtx         = null;
  var gainNode         = null;
  var activeOscillators = [];
  var chordIndex       = 0;
  var chordTimer       = null;

  /* ---- DOM Refs ---- */
  var albumVinyl        = document.getElementById('albumVinyl');
  var albumEqBars       = document.getElementById('albumEqBars');
  var nowPlayingLabel   = document.getElementById('nowPlayingLabel');
  var currentSongTitle  = document.getElementById('currentSongTitle');
  var currentSongArtist = document.getElementById('currentSongArtist');
  var currentSongGenre  = document.getElementById('currentSongGenre');
  var progressFill      = document.getElementById('playerProgressFill');
  var progressThumb     = document.getElementById('playerProgressThumb');
  var progressBar       = document.getElementById('playerProgressBar');
  var currentTimeEl     = document.getElementById('currentTime');
  var totalTimeEl       = document.getElementById('totalTime');
  var btnPlayPause      = document.getElementById('btnPlayPause');
  var playIconEl        = document.getElementById('playIcon');
  var btnPrev           = document.getElementById('btnPrev');
  var btnNext           = document.getElementById('btnNext');
  var btnShuffle        = document.getElementById('btnShuffle');
  var btnRepeat         = document.getElementById('btnRepeat');
  var btnMute           = document.getElementById('btnMute');
  var volumeIconEl      = document.getElementById('volumeIcon');
  var volumeFill        = document.getElementById('volumeFill');
  var volumeThumb       = document.getElementById('volumeThumb');
  var volumeLabelEl     = document.getElementById('volumeLabel');
  var volumeTrack       = document.getElementById('volumeTrack');
  var playlistCountEl   = document.getElementById('playlistCount');

  /* ---- Helpers ---- */
  function formatTime(s) {
    var m   = Math.floor(s / 60);
    var sec = Math.floor(s % 60);
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  function setLucideIcon(el, iconName) {
    if (!el) return;
    el.setAttribute('data-lucide', iconName);
    if (window.lucide) lucide.createIcons();
  }

  /* ---- Build Playlist UI ---- */
  function buildPlaylistUI() {
    playlistItems.innerHTML = '';
    if (playlistCountEl) playlistCountEl.textContent = SONGS.length + ' Lagu';

    SONGS.forEach(function (song, idx) {
      var item = document.createElement('div');
      item.className = 'playlist-item' + (idx === currentIndex ? ' active' : '');
      item.setAttribute('data-idx', idx);
      item.innerHTML =
        '<span class="pi-index">' + (idx + 1) + '</span>' +
        '<span class="pi-playing-anim"><span></span><span></span><span></span></span>' +
        '<div class="pi-thumb" style="background:' + (song.color || 'rgba(108,99,255,0.15)') + ';border:none;">' + song.emoji + '</div>' +
        '<div class="pi-info">' +
          '<div class="pi-title">' + song.title + '</div>' +
          '<div class="pi-artist">' + song.artist + ' · ' + song.genre + '</div>' +
        '</div>' +
        '<span class="pi-duration">' + formatTime(song.duration) + '</span>';
      playlistItems.appendChild(item);
    });
  }

  // Use event delegation so we don't need to rebuild on nav
  playlistItems.addEventListener('click', function (e) {
    var item = e.target.closest('.playlist-item');
    if (!item) return;
    var idx = parseInt(item.getAttribute('data-idx'), 10);
    if (isNaN(idx)) return;
    currentIndex    = idx;
    progressSeconds = 0;
    if (isPlaying) {
      stopAudio();
      startAudio();
    }
    updateAllUI();
  });

  /* ---- Display Update ---- */
  function updateAllUI() {
    var song = SONGS[currentIndex];

    // Song info
    if (currentSongTitle)  currentSongTitle.textContent  = song.title;
    if (currentSongArtist) currentSongArtist.textContent = song.artist;
    if (currentSongGenre)  currentSongGenre.textContent  = song.genre;
    if (totalTimeEl)       totalTimeEl.textContent       = formatTime(song.duration);
    if (nowPlayingLabel)   nowPlayingLabel.textContent   = isPlaying ? 'Now Playing \u25cf' : 'Siap Diputar';

    // Update album vinyl color & emoji per song
    if (albumVinyl && song.color) {
      albumVinyl.style.background = song.color;
    }
    var noteIcon = document.getElementById('albumNoteIcon');
    if (noteIcon && song.emoji) {
      noteIcon.setAttribute('data-lucide', 'music');
      noteIcon.parentElement.textContent = song.emoji;
    }

    // Progress
    updateProgressUI();

    // Playlist items active state
    var allItems = playlistItems.querySelectorAll('.playlist-item');
    allItems.forEach(function (el, i) {
      el.classList.toggle('active', i === currentIndex);
    });

    // Scroll to active
    var activeEl = playlistItems.querySelector('.playlist-item.active');
    if (activeEl) activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });

    // Play icon
    setLucideIcon(playIconEl, isPlaying ? 'pause' : 'play');

    // Vinyl & EQ
    if (albumVinyl) albumVinyl.classList.toggle('spinning', isPlaying);
    if (albumEqBars) albumEqBars.classList.toggle('active', isPlaying);
  }


  function updateProgressUI() {
    if (!SONGS[currentIndex]) return;
    var pct = (progressSeconds / SONGS[currentIndex].duration) * 100;
    if (progressFill)  progressFill.style.width = pct + '%';
    if (progressThumb) progressThumb.style.left = pct + '%';
    if (currentTimeEl) currentTimeEl.textContent = formatTime(progressSeconds);
  }

  /* ---- Volume UI ---- */
  function applyVolumeUI() {
    var v   = isMuted ? 0 : volumeLevel;
    var pct = Math.round(v * 100);
    if (volumeFill)    volumeFill.style.width    = pct + '%';
    if (volumeThumb)   volumeThumb.style.left    = pct + '%';
    if (volumeLabelEl) volumeLabelEl.textContent = pct + '%';

    // Update gain langsung (tanpa faktor pengecil 0.3)
    if (gainNode && audioCtx) {
      gainNode.gain.setValueAtTime(v, audioCtx.currentTime);
    }

    // Update volume icon
    var iconName = (isMuted || volumeLevel === 0) ? 'volume-x'
                 : volumeLevel < 0.4              ? 'volume-1'
                 :                                  'volume-2';
    setLucideIcon(volumeIconEl, iconName);
  }

  /* ---- Audio Context (lazy init) ---- */
  var compressor = null;
  function ensureAudioCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      // Compressor agar suara tidak pecah dan terdengar lebih jelas
      compressor = audioCtx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-20, audioCtx.currentTime);
      compressor.knee.setValueAtTime(10, audioCtx.currentTime);
      compressor.ratio.setValueAtTime(6, audioCtx.currentTime);
      compressor.attack.setValueAtTime(0.003, audioCtx.currentTime);
      compressor.release.setValueAtTime(0.25, audioCtx.currentTime);
      gainNode = audioCtx.createGain();
      gainNode.connect(compressor);
      compressor.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    // Volume penuh tanpa faktor pengecil — lebih keras dan jelas terdengar
    gainNode.gain.setValueAtTime(isMuted ? 0 : volumeLevel, audioCtx.currentTime);
  }

  /* ---- Oscillator / Chord Playback ---- */
  function stopOscillators() {
    activeOscillators.forEach(function (o) {
      try { o.stop(0); } catch (err) { /* already stopped */ }
    });
    activeOscillators = [];
  }

  // Tipe waveform per lagu agar lebih bervariasi
  var WAVEFORMS = ['triangle', 'sawtooth', 'square', 'triangle', 'sawtooth',
                   'triangle', 'square', 'triangle', 'sawtooth', 'triangle'];

  function playChord(freqs, dur) {
    var waveType = WAVEFORMS[currentIndex % WAVEFORMS.length] || 'triangle';
    freqs.forEach(function (freq, i) {
      var osc  = audioCtx.createOscillator();
      var env  = audioCtx.createGain();
      // Gunakan triangle untuk nada rendah, waveType untuk nada lain
      osc.type = (i === 0) ? 'triangle' : waveType;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      // Volume jauh lebih tinggi (0.6 per nada, dibagi jumlah nada agar tak pecah)
      var peakGain = 0.55 / freqs.length;
      env.gain.setValueAtTime(0, audioCtx.currentTime);
      env.gain.linearRampToValueAtTime(peakGain, audioCtx.currentTime + 0.06);
      env.gain.setValueAtTime(peakGain * 0.75, audioCtx.currentTime + dur * 0.6);
      env.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);
      osc.connect(env);
      env.connect(gainNode);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + dur);
      activeOscillators.push(osc);
    });
  }

  function playBassNote(freq, dur) {
    var osc = audioCtx.createOscillator();
    var env = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq / 2, audioCtx.currentTime);
    env.gain.setValueAtTime(0,    audioCtx.currentTime);
    env.gain.linearRampToValueAtTime(0.55, audioCtx.currentTime + 0.03);
    env.gain.linearRampToValueAtTime(0,    audioCtx.currentTime + dur * 0.5);
    osc.connect(env);
    env.connect(gainNode);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + dur * 0.5);
    activeOscillators.push(osc);
  }

  // Beat / ketukan drum sederhana agar terasa berirama
  function playDrumBeat(dur) {
    var song = SONGS[currentIndex];
    // Hanya untuk lagu dengan BPM > 80 (lebih berirama)
    if (!song || song.bpm < 80) return;
    var beatInterval = 60 / song.bpm;   // durasi 1 beat
    var beats = Math.floor(dur / beatInterval);
    for (var b = 0; b < beats; b++) {
      (function(beatOffset) {
        // Kick drum (suara bum)
        var kick   = audioCtx.createOscillator();
        var kickEnv = audioCtx.createGain();
        kick.type = 'sine';
        kick.frequency.setValueAtTime(150, audioCtx.currentTime + beatOffset);
        kick.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + beatOffset + 0.15);
        kickEnv.gain.setValueAtTime(0.7, audioCtx.currentTime + beatOffset);
        kickEnv.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + beatOffset + 0.2);
        kick.connect(kickEnv);
        kickEnv.connect(gainNode);
        kick.start(audioCtx.currentTime + beatOffset);
        kick.stop(audioCtx.currentTime + beatOffset + 0.22);
        activeOscillators.push(kick);

        // Hi-hat (suara ts ts) pada off-beat
        if (b % 2 === 1) {
          var buf  = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.05, audioCtx.sampleRate);
          var data = buf.getChannelData(0);
          for (var n = 0; n < data.length; n++) data[n] = Math.random() * 2 - 1;
          var hat    = audioCtx.createBufferSource();
          var hatEnv = audioCtx.createGain();
          var hatFilt = audioCtx.createBiquadFilter();
          hatFilt.type = 'highpass';
          hatFilt.frequency.value = 8000;
          hat.buffer = buf;
          hatEnv.gain.setValueAtTime(0.25, audioCtx.currentTime + beatOffset);
          hatEnv.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + beatOffset + 0.05);
          hat.connect(hatFilt);
          hatFilt.connect(hatEnv);
          hatEnv.connect(gainNode);
          hat.start(audioCtx.currentTime + beatOffset);
        }
      })(b * beatInterval);
    }
  }

  function scheduleChord() {
    if (!isPlaying) return;
    var song        = SONGS[currentIndex];
    var beatsPerSec = song.bpm / 60;
    var chordDur    = 4 / beatsPerSec;   // 4 beats per chord
    var chord       = song.chords[chordIndex % song.chords.length];

    playChord(chord, chordDur);
    playBassNote(chord[0], chordDur);
    playDrumBeat(chordDur);
    chordIndex++;

    chordTimer = setTimeout(scheduleChord, (chordDur - 0.05) * 1000);
  }

  function startAudio() {
    ensureAudioCtx();
    chordIndex = 0;
    scheduleChord();
  }

  function stopAudio() {
    clearTimeout(chordTimer);
    stopOscillators();
  }

  /* ---- Progress Timer ---- */
  function startProgressTimer() {
    stopProgressTimer();
    progressTimer = setInterval(function () {
      var dur = SONGS[currentIndex].duration;
      progressSeconds++;
      if (progressSeconds >= dur) {
        progressSeconds = 0;
        if (isRepeat) {
          stopAudio();
          startAudio();
        } else {
          goNext();
          return;
        }
      }
      updateProgressUI();
    }, 1000);
  }

  function stopProgressTimer() {
    clearInterval(progressTimer);
  }

  /* ---- Playback Control ---- */
  function play() {
    isPlaying = true;
    startAudio();
    startProgressTimer();
    updateAllUI();
  }

  function pause() {
    isPlaying = false;
    stopAudio();
    stopProgressTimer();
    updateAllUI();
  }

  function togglePlay() {
    if (isPlaying) { pause(); } else { play(); }
  }

  function goNext() {
    stopAudio();
    stopProgressTimer();
    if (isShuffle) {
      var r;
      do { r = Math.floor(Math.random() * SONGS.length); }
      while (SONGS.length > 1 && r === currentIndex);
      currentIndex = r;
    } else {
      currentIndex = (currentIndex + 1) % SONGS.length;
    }
    progressSeconds = 0;
    if (isPlaying) {
      startAudio();
      startProgressTimer();
    }
    updateAllUI();
  }

  function goPrev() {
    stopAudio();
    stopProgressTimer();
    if (progressSeconds > 3) {
      // Restart current song
      progressSeconds = 0;
      if (isPlaying) { startAudio(); startProgressTimer(); }
    } else {
      currentIndex    = (currentIndex - 1 + SONGS.length) % SONGS.length;
      progressSeconds = 0;
      if (isPlaying) { startAudio(); startProgressTimer(); }
    }
    updateAllUI();
  }

  /* ---- Seek ---- */
  function seekProgress(e) {
    var rect = progressBar.getBoundingClientRect();
    var pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    progressSeconds = Math.floor(pct * SONGS[currentIndex].duration);
    updateProgressUI();
    if (isPlaying) {
      stopAudio();
      startAudio();
    }
  }

  function seekVolume(e) {
    var rect = volumeTrack.getBoundingClientRect();
    var pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    isMuted      = false;
    volumeLevel  = pct;
    applyVolumeUI();
  }

  /* ---- Event Listeners ---- */
  if (btnPlayPause) btnPlayPause.addEventListener('click', togglePlay);
  if (btnNext)      btnNext.addEventListener('click', goNext);
  if (btnPrev)      btnPrev.addEventListener('click', goPrev);

  if (btnShuffle) {
    btnShuffle.addEventListener('click', function () {
      isShuffle = !isShuffle;
      btnShuffle.classList.toggle('active', isShuffle);
    });
  }

  if (btnRepeat) {
    btnRepeat.addEventListener('click', function () {
      isRepeat = !isRepeat;
      btnRepeat.classList.toggle('active', isRepeat);
    });
  }

  if (btnMute) {
    btnMute.addEventListener('click', function () {
      if (isMuted) {
        isMuted     = false;
        volumeLevel = prevVolume || 0.7;
      } else {
        prevVolume = volumeLevel;
        isMuted    = true;
      }
      applyVolumeUI();
    });
  }

  // Progress bar — click & drag
  if (progressBar) {
    var draggingProgress = false;
    progressBar.addEventListener('mousedown', function (e) {
      draggingProgress = true;
      seekProgress(e);
    });
    progressBar.addEventListener('click', function (e) { seekProgress(e); });
    document.addEventListener('mousemove', function (e) {
      if (draggingProgress) seekProgress(e);
    });
    document.addEventListener('mouseup', function () { draggingProgress = false; });
    progressBar.addEventListener('touchstart', function (e) { seekProgress(e.touches[0]); }, { passive: true });
    progressBar.addEventListener('touchmove',  function (e) { e.preventDefault(); seekProgress(e.touches[0]); }, { passive: false });
  }

  // Volume track — click & drag
  if (volumeTrack) {
    var draggingVol = false;
    volumeTrack.addEventListener('mousedown', function (e) {
      draggingVol = true;
      seekVolume(e);
    });
    volumeTrack.addEventListener('click', function (e) { seekVolume(e); });
    document.addEventListener('mousemove', function (e) {
      if (draggingVol) seekVolume(e);
    });
    document.addEventListener('mouseup', function () { draggingVol = false; });
    volumeTrack.addEventListener('touchstart', function (e) { seekVolume(e.touches[0]); }, { passive: true });
    volumeTrack.addEventListener('touchmove',  function (e) { e.preventDefault(); seekVolume(e.touches[0]); }, { passive: false });
  }

  /* ---- Init ---- */
  buildPlaylistUI();
  applyVolumeUI();
  updateAllUI();

});

/* ============================================================
   22. TOMBOL "BERANDA" - Scroll ke paling atas
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  var beranda = document.getElementById('navBeranda');
  if (beranda) {
    beranda.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Footer logo & back-to-top: juga scroll ke paling atas
  var footerLogo = document.querySelector('.footer-logo');
  if (footerLogo) {
    footerLogo.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
