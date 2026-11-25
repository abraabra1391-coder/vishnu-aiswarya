/* =====================================================================
   WEDDING INVITATION — BEHAVIOUR
   Reads everything from config.js (window.WEDDING).
   You normally never need to edit this file.
   ===================================================================== */
(function(){
  "use strict";

  var W = window.WEDDING || {};
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------
     0. FILL THE PAGE FROM config.js
  --------------------------------------------------------------- */
  function get(path){
    return path.split('.').reduce(function(o,k){ return (o && o[k] !== undefined) ? o[k] : undefined; }, W);
  }
  function abs(path){ try { return new URL(path, document.baseURI).href; } catch(e){ return path; } }

  document.querySelectorAll('[data-bind]').forEach(function(el){
    var v = get(el.getAttribute('data-bind'));
    if(v !== undefined) el.textContent = v;
  });
  document.querySelectorAll('[data-href]').forEach(function(el){
    var v = get(el.getAttribute('data-href'));
    if(v) el.setAttribute('href', v);
  });
  document.querySelectorAll('[data-name]').forEach(function(el){
    var n = el.getAttribute('data-name') === 'bride' ? W.brideName : W.groomName;
    el.textContent = String(n || '').toUpperCase();
  });

  // Background photo used by the opening cover and every section
  if(W.coverImage){
    document.documentElement.style.setProperty('--cover-image', 'url("' + abs(W.coverImage) + '")');
  }

  // Ganesha image
  var ganesha = document.getElementById('ganesha-img');
  if(ganesha && W.ganeshaImage) ganesha.src = W.ganeshaImage;

  // Opening video (loaded only when "Open Invitation" is pressed)
  var video = document.getElementById('opening-video');
  if(W.coverImage) video.setAttribute('poster', W.coverImage);
  if(W.openingVideo){
    var vs = document.createElement('source');
    vs.src = W.openingVideo; vs.type = 'video/mp4';
    video.appendChild(vs);
  }

  // Background music
  var bgMusic = document.getElementById('bg-music');
  if(W.backgroundMusic){
    var as = document.createElement('source');
    as.src = W.backgroundMusic; as.type = 'audio/mpeg';
    bgMusic.appendChild(as);
  }

  // Optional sections
  if(W.showCoupleSection) document.getElementById('couple').hidden = false;
  if(W.showMessageSection) document.getElementById('message').hidden = false;

  // Footer credit
  var credit = document.getElementById('closing-credit');
  var T = W.text || {};
  if(credit && (T.creditText || T.creditLinkText)){
    credit.appendChild(document.createTextNode((T.creditText || '') + ' '));
    if(T.creditLinkText){
      var a = document.createElement('a');
      a.href = T.creditLinkUrl || '#';
      a.target = '_blank'; a.rel = 'noopener';
      a.textContent = T.creditLinkText;
      credit.appendChild(a);
    }
  }

  // Gallery cards — the first three use the exact tilt/entrance of the
  // reference; extra photos cycle through the same three styles.
  var CARD_STYLES = [
    { size:'lg', enter:'left',  speed: 0.05, style:'--rot:-2.6deg;--nudge-y:14px;--scale:1;--drift-delay:0s;' },
    { size:'md', enter:'up',    speed:-0.04, style:'--rot:2.2deg;--nudge-y:-8px;--scale:.97;--drift-delay:.6s;' },
    { size:'md', enter:'right', speed: 0.06, style:'--rot:-3.2deg;--nudge-y:10px;--scale:.98;--drift-delay:1.1s;' }
  ];
  var wall = document.getElementById('photoWall');
  var photos = W.gallery || [];
  photos.forEach(function(p, i){
    var s = CARD_STYLES[i % CARD_STYLES.length];
    var fig = document.createElement('figure');
    fig.className = 'photo-card photo-card--' + s.size;
    fig.setAttribute('data-enter', s.enter);
    fig.setAttribute('data-speed', s.speed);
    fig.setAttribute('style', s.style);
    fig.innerHTML =
      '<div class="photo-card__inner">' +
        '<div class="photo-card__paper" data-lightbox>' +
          '<img loading="lazy" decoding="async">' +
        '</div>' +
      '</div>';
    var paper = fig.querySelector('.photo-card__paper');
    paper.setAttribute('data-full', p.src);
    var img = fig.querySelector('img');
    img.src = p.src; img.alt = p.alt || '';
    wall.appendChild(fig);
  });
  if(photos.length === 3) wall.classList.add('photo-wall--three');
  if(!photos.length) document.getElementById('gallery').hidden = true;

  /* ---------------------------------------------------------------
     1. OPEN INVITATION → VIDEO → HERO
  --------------------------------------------------------------- */
  var openingEl = document.getElementById('opening');
  var openingCover = document.getElementById('opening-cover');
  var main = document.getElementById('main');
  var skipBtn = document.getElementById('skip-intro');
  var openBtn = document.getElementById('open-invitation-btn');
  var introDone = false, videoStarted = false;

  function endIntro(){
    if(introDone) return;
    introDone = true;
    openingEl.classList.add('is-fading');
    main.classList.add('is-visible');
    document.body.classList.remove('intro-active');
    startMusic();
    playHeroEntrance();
    if(window.ScrollTrigger) setTimeout(function(){ ScrollTrigger.refresh(); }, 60);
    setTimeout(function(){
      openingEl.style.display = 'none';
      video.pause();
    }, 1500);
  }

  function startInvitation(){
    if(videoStarted) return;
    videoStarted = true;
    startMusic(); // direct tap = most reliable moment for audio to be allowed

    if(!W.openingVideo){ endIntro(); return; }
    video.load();
    openingCover.classList.add('is-hidden');
    skipBtn.classList.add('is-active');

    var attempt = video.play();
    if(attempt !== undefined){
      attempt.catch(function(){ endIntro(); }); // blocked → go straight in
    }
  }

  openBtn.addEventListener('click', startInvitation);
  skipBtn.addEventListener('click', endIntro);
  video.addEventListener('ended', endIntro);
  video.addEventListener('error', function(){ if(videoStarted) endIntro(); }, true);
  video.addEventListener('playing', function(){ setTimeout(endIntro, 20000); });

  /* ---------------------------------------------------------------
     1b. BACKGROUND MUSIC
  --------------------------------------------------------------- */
  var musicToggle = document.getElementById('music-toggle');
  var musicStarted = false;

  function startMusic(){
    if(musicStarted || !W.backgroundMusic) return;
    musicStarted = true;
    bgMusic.load();
    var attempt = bgMusic.play();
    if(attempt !== undefined) attempt.catch(function(){});
    musicToggle.classList.remove('is-hidden');
    musicToggle.classList.add('is-visible');
  }

  musicToggle.addEventListener('click', function(){
    if(!musicStarted){ startMusic(); return; }
    if(bgMusic.paused){
      bgMusic.play().catch(function(){});
      musicToggle.classList.remove('is-muted');
      musicToggle.setAttribute('aria-pressed', 'true');
    } else {
      bgMusic.pause();
      musicToggle.classList.add('is-muted');
      musicToggle.setAttribute('aria-pressed', 'false');
    }
  });

  /* ---------------------------------------------------------------
     2. COUNTDOWN
  --------------------------------------------------------------- */
  var target = Date.parse(W.weddingDateTime);
  var cd = document.getElementById('countdown-wedding');
  var cdEls = {
    d: cd.querySelector('[data-d]'), h: cd.querySelector('[data-h]'),
    m: cd.querySelector('[data-m]'), s: cd.querySelector('[data-s]')
  };
  function pad(n){ return String(n).padStart(2, '0'); }
  function setFlip(el, value){
    if(!el || el.textContent === value) return;
    el.textContent = value;
    var card = el.closest('.flip-card');
    if(card && !reduceMotion){
      card.classList.remove('is-flipping');
      void card.offsetWidth;
      card.classList.add('is-flipping');
    }
  }
  function tick(){
    var diff = isNaN(target) ? 0 : Math.max(0, target - Date.now());
    setFlip(cdEls.d, pad(Math.floor(diff / 86400000)));
    setFlip(cdEls.h, pad(Math.floor((diff % 86400000) / 3600000)));
    setFlip(cdEls.m, pad(Math.floor((diff % 3600000) / 60000)));
    setFlip(cdEls.s, pad(Math.floor((diff % 60000) / 1000)));
  }
  tick();
  setInterval(tick, 1000);

  /* ---------------------------------------------------------------
     3. SCROLL REVEALS (GSAP + ScrollTrigger)
  --------------------------------------------------------------- */
  var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  if(!hasGsap || reduceMotion) document.documentElement.classList.add('no-anim');

  if(hasGsap && !reduceMotion){
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.section').forEach(function(section){
      if(section.id === 'hero') return; // hero plays when the intro ends
      var reveals = section.querySelectorAll('.reveal');
      var scales = section.querySelectorAll('.reveal-scale');
      if(reveals.length){
        gsap.to(reveals, { opacity:1, y:0, duration:1.1, ease:'power2.out', stagger:0.12,
          scrollTrigger:{ trigger:section, start:'top 78%', once:true } });
      }
      if(scales.length){
        gsap.to(scales, { opacity:1, scale:1, duration:1.3, ease:'power2.out',
          scrollTrigger:{ trigger:section, start:'top 75%', once:true } });
      }
    });
    gsap.set('#hero .reveal', { opacity:0, y:26 });
    gsap.set('#hero .reveal-scale', { opacity:0, scale:.94 });
    window.addEventListener('load', function(){ ScrollTrigger.refresh(); });
  }

  var heroPlayed = false;
  function playHeroEntrance(){
    if(heroPlayed || !hasGsap || reduceMotion) return;
    heroPlayed = true;
    var tl = gsap.timeline({ delay:0.3 });
    tl.to('#hero .reveal', { opacity:1, y:0, duration:1.1, ease:'power2.out', stagger:0.12 }, 0);
    tl.to('#hero .reveal-scale', { opacity:1, scale:1, duration:1.3, ease:'power2.out' }, 0.15);
  }

  /* ---------------------------------------------------------------
     4. GALLERY — entrance, touch bounce, parallax, lightbox
  --------------------------------------------------------------- */
  var cards = wall.querySelectorAll('.photo-card');
  function revealCard(c){ c.classList.add('is-in'); }

  if(reduceMotion || !('IntersectionObserver' in window)){
    cards.forEach(revealCard);
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(!en.isIntersecting) return;
        revealCard(en.target);
        io.unobserve(en.target);
      });
    }, { threshold:0.14, rootMargin:'0px 0px -6% 0px' });
    cards.forEach(function(c){ io.observe(c); });
  }

  cards.forEach(function(card){
    card.addEventListener('pointerdown', function(e){
      if(e.pointerType === 'mouse') return;
      card.classList.add('is-touched');
      setTimeout(function(){ card.classList.remove('is-touched'); }, 560);
    }, { passive:true });
  });

  if(!reduceMotion && cards.length){
    var speeds = Array.prototype.map.call(cards, function(c, i){
      var r = parseFloat(c.getAttribute('data-speed'));
      return isNaN(r) ? (i % 2 === 0 ? 0.05 : -0.04) : r;
    });
    var ticking = false;
    var updateParallax = function(){
      ticking = false;
      var vh = window.innerHeight || 1, mid = vh * 0.5;
      cards.forEach(function(card, i){
        if(!card.classList.contains('is-in')) return;
        var r = card.getBoundingClientRect();
        if(r.bottom < -80 || r.top > vh + 80) return;
        var off = Math.max(-18, Math.min(18, (r.top + r.height * 0.5 - mid) * speeds[i]));
        card.style.setProperty('--parallax-y', off.toFixed(2) + 'px');
      });
    };
    window.addEventListener('scroll', function(){
      if(ticking) return;
      ticking = true;
      requestAnimationFrame(updateParallax);
    }, { passive:true });
    updateParallax();
  }

  (function lightbox(){
    var box = document.getElementById('gallery-lightbox');
    var img = document.getElementById('gallery-lightbox-img');
    var close = document.getElementById('gallery-lightbox-close');
    function open(t){
      var i = t.querySelector('img');
      img.src = t.getAttribute('data-full');
      img.alt = i ? i.alt : '';
      box.classList.add('show');
      box.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function shut(){
      box.classList.remove('show');
      box.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    document.querySelectorAll('[data-lightbox]').forEach(function(t){
      t.addEventListener('click', function(){ open(t); });
    });
    close.addEventListener('click', shut);
    box.addEventListener('click', function(e){ if(e.target === box) shut(); });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && box.classList.contains('show')) shut();
    });
  })();

  /* ---------------------------------------------------------------
     5. CURSOR GLOW (mouse only)
  --------------------------------------------------------------- */
  var dot = document.getElementById('cursor-dot');
  var finePointer = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if(dot && finePointer){
    window.addEventListener('mousemove', function(e){
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
    }, { passive:true });
    document.querySelectorAll('a, button, .photo-card__paper, .location-card').forEach(function(el){
      el.addEventListener('mouseenter', function(){ dot.classList.add('is-active'); });
      el.addEventListener('mouseleave', function(){ dot.classList.remove('is-active'); });
    });
  } else if(dot){
    dot.style.display = 'none';
  }

  /* ---------------------------------------------------------------
     6. SCROLL PROGRESS + BACK TO TOP
  --------------------------------------------------------------- */
  var bar = document.getElementById('scroll-progress');
  var toTop = document.getElementById('back-to-top');
  function onScrollUI(){
    var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    toTop.classList.toggle('show', window.scrollY > window.innerHeight * 0.9);
  }
  window.addEventListener('scroll', function(){ requestAnimationFrame(onScrollUI); }, { passive:true });
  onScrollUI();
  toTop.addEventListener('click', function(){
    window.scrollTo({ top:0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---------------------------------------------------------------
     7. FLOATING GOLD DUST + PETALS
  --------------------------------------------------------------- */
  (function particles(){
    if(reduceMotion) return;
    var canvas = document.getElementById('particles');
    if(!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d'), w, h;
    function resize(){ w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    var COUNT = window.innerWidth < 700 ? 16 : 30;
    function spawn(){
      var petal = Math.random() > 0.6;
      return {
        x: Math.random() * w, y: Math.random() * h - h,
        r: petal ? (3 + Math.random() * 4) : (1 + Math.random() * 1.6),
        speedY: 0.18 + Math.random() * 0.4,
        speedX: (Math.random() - 0.5) * 0.45,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.008 + Math.random() * 0.016,
        opacity: 0.18 + Math.random() * 0.34,
        petal: petal
      };
    }
    var ps = [];
    for(var i = 0; i < COUNT; i++) ps.push(spawn());

    (function draw(){
      ctx.clearRect(0, 0, w, h);
      for(var i = 0; i < ps.length; i++){
        var p = ps[i];
        p.sway += p.swaySpeed;
        p.x += p.speedX + Math.sin(p.sway) * 0.35;
        p.y += p.speedY;
        if(p.y > h + 20){ p.y = -20; p.x = Math.random() * w; }
        if(p.x > w + 20) p.x = -20;
        if(p.x < -20) p.x = w + 20;
        ctx.beginPath();
        if(p.petal){
          ctx.fillStyle = 'rgba(181,138,58,' + p.opacity + ')';
          ctx.ellipse(p.x, p.y, p.r, p.r * 0.6, p.sway, 0, Math.PI * 2);
        } else {
          ctx.fillStyle = 'rgba(255,248,232,' + p.opacity + ')';
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        }
        ctx.fill();
      }
      requestAnimationFrame(draw);
    })();
  })();
})();
