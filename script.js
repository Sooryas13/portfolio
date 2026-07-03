document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  /* ===== LOADER ===== */
  const loader = document.getElementById('loader');
  const loaderFill = document.getElementById('loaderFill');
  let p = 0;
  const loadTimer = setInterval(() => {
    p += Math.random()*18;
    if(p >= 100){ p = 100; clearInterval(loadTimer); }
    loaderFill.style.width = p + '%';
  }, 120);
  window.addEventListener('load', () => {
    setTimeout(() => { loaderFill.style.width='100%'; loader.classList.add('hide'); }, 500);
  });

  /* ===== CURSOR ===== */
  const glow = document.getElementById('cursorGlow');
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mx=innerWidth/2, my=innerHeight/2, rx=mx, ry=my;
  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    glow.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  });
  function ringLoop(){
    rx += (mx-rx)*0.15; ry += (my-ry)*0.15;
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(ringLoop);
  }
  ringLoop();
  document.querySelectorAll('a, button, .skill-card, .proj-card, input, textarea, .stat-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('active'));
  });

  /* ===== MAGNETIC BUTTONS ===== */
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width/2;
      const y = e.clientY - r.top - r.height/2;
      btn.style.transform = `translate(${x*0.25}px, ${y*0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => btn.style.transform = '');
  });

  /* ===== SCROLL PROGRESS + HEADER + ACTIVE NAV ===== */
  const progress = document.getElementById('progress');
  const header = document.getElementById('siteHeader');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progress.style.width = pct + '%';
    header.classList.toggle('scrolled', h.scrollTop > 40);

    let current = '';
    sections.forEach(sec => {
      if(h.scrollTop >= sec.offsetTop - 180) current = sec.id;
    });
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#'+current));
  });

  /* ===== MOBILE NAV ===== */
  const navToggle = document.getElementById('navToggle');
  const navLinksWrap = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => navLinksWrap.classList.toggle('open'));
  navLinksWrap.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinksWrap.classList.remove('open')));

  /* ===== HERO ROLE ROTATOR ===== */
  const roles = document.querySelectorAll('#heroRoles .role');
  let ri = 0;
  setInterval(() => {
    roles[ri].classList.remove('active'); roles[ri].classList.add('exit');
    ri = (ri+1) % roles.length;
    roles[ri].classList.remove('exit'); roles[ri].classList.add('active');
    roles.forEach((r,i) => { if(i!==ri) r.classList.remove('active'); });
    setTimeout(()=> { roles.forEach((r,i)=>{ if(i!==ri) r.classList.remove('exit'); }); }, 650);
  }, 2800);

  /* ===== REVEAL ON SCROLL ===== */
  const revealEls = document.querySelectorAll('.reveal, .reveal-scale');
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  }, {threshold:0.15});
  revealEls.forEach(el => io.observe(el));

  /* ===== DATA: SKILLS ===== */
  const skillData = {
    frontend: [['HTML5',95],['CSS3',95],['SCSS',85],['JavaScript',88],['TypeScript',75],['Angular',82],['Bootstrap',90],['Tailwind CSS',85]],
    cms: [['WordPress',95],['WooCommerce',85],['Shopify',70],['Elementor',92],['ACF',85],['Strapi',65]],
    backend: [['PHP',75],['REST API',85],['WooCommerce API',75]],
    uiux: [['Figma',80],['Responsive Design',95],['Design Systems',78]],
    seo: [['Core Web Vitals',85],['Technical SEO',82],['On-page SEO',85],['Google Analytics',78],['Search Console',80],['Schema Markup',72]],
    tools: [['Git',88],['GitHub',88],['VS Code',95],['Chrome DevTools',90],['cPanel',82]]
  };
  const iconFor = n => {
    const m = {'HTML5':'code-2','CSS3':'palette','SCSS':'palette','JavaScript':'braces','TypeScript':'braces',
      'Angular':'component','Bootstrap':'layout-grid','Tailwind CSS':'wind','WordPress':'globe','WooCommerce':'shopping-cart',
      'Shopify':'shopping-bag','Elementor':'layers','ACF':'settings-2','Strapi':'database','PHP':'server','REST API':'plug',
      'WooCommerce API':'plug-zap','Figma':'figma','Responsive Design':'smartphone','Design Systems':'grid-3x3',
      'Core Web Vitals':'gauge','Technical SEO':'search-code','On-page SEO':'file-search','Google Analytics':'bar-chart-3',
      'Search Console':'monitor-check','Schema Markup':'file-json','Git':'git-branch','GitHub':'github','VS Code':'terminal-square',
      'Chrome DevTools':'chrome','cPanel':'settings'};
    return m[n] || 'star';
  };
  Object.keys(skillData).forEach(cat => {
    const panel = document.querySelector(`.skill-panel[data-panel="${cat}"]`);
    panel.innerHTML = skillData[cat].map(([name,level]) => `
      <div class="skill-card reveal">
        <div class="sicon"><i data-lucide="${iconFor(name)}" width="18" height="18"></i></div>
        <div class="sname">${name}</div>
        <div class="skill-bar"><span data-level="${level}"></span></div>
      </div>`).join('');
  });
  lucide.createIcons();
  document.querySelectorAll('.skill-panel.active').forEach(p => revealSkillBars(p));
  function revealSkillBars(panel){
    panel.querySelectorAll('.skill-bar span').forEach(s => requestAnimationFrame(()=> s.style.width = s.dataset.level+'%'));
    panel.querySelectorAll('.skill-card').forEach(c => c.classList.add('in'));
  }
  document.querySelectorAll('.skill-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.skill-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.skill-panel').forEach(p=>p.classList.remove('active'));
      const panel = document.querySelector(`.skill-panel[data-panel="${tab.dataset.tab}"]`);
      panel.classList.add('active');
      revealSkillBars(panel);
    });
  });

  /* ===== DATA: PROJECTS ===== */
  const projects = [
    {title:'WorldsStar Manpower Solutions', icon:'briefcase', desc:'Custom WordPress build for a manpower solutions company, with ACF-powered content and a strong focus on Core Web Vitals.', stack:['WordPress','ACF','Performance'], achieve:'Optimized for Core Web Vitals with a leaner asset pipeline.', url:'https://www.worldstarmanpower.ae/'},
    {title:'Prabodhanam', icon:'newspaper', desc:'A Malayalam-language digital magazine platform with membership tiers and a custom REST API layer for content delivery.', stack:['WordPress','REST API','Membership'], achieve:'Serves 10K+ monthly readers with Malayalam content support.', url:'https://prabodhanam.com/'},
    {title:'STIMES ERP', icon:'building-2', desc:'Corporate marketing website built in Elementor, engineered around technical and on-page SEO from the ground up.', stack:['Elementor','WordPress','SEO'], achieve:'Structured for search visibility from day one.', url:'https://stimeserp.com/'},
    {title:'Advertisement Management Platform', icon:'megaphone', desc:'An advertisement management platform built in Angular with reactive forms and a live REST API-driven dashboard.', stack:['Angular','REST API','Reactive Forms'], achieve:'Reactive forms drive a real-time management dashboard.', url:''},
    {title:'SaaS Application', icon:'layers', desc:'A comprehensive SaaS application built with Angular, focusing on intuitive UI design and seamless responsiveness across all devices and screen sizes.', stack:['Angular','UI/UX','Responsive Design'], achieve:'Delivered pixel-perfect interfaces with excellent responsiveness on mobile, tablet, and desktop.', url:''},
    {title:'DMS / CMS Platform', icon:'folder-kanban', desc:'An enterprise document management system in Angular, focused on file handling at scale and a fully responsive UI.', stack:['Angular','Enterprise','File Management'], achieve:'Built to handle enterprise-scale file volumes cleanly.', url:''},
  ];
  document.getElementById('projGrid').innerHTML = projects.map((p,i) => `
    <div class="proj-card reveal ${i >= 3 ? 'angular-proj' : ''}">
      <div class="proj-shot"><i data-lucide="${p.icon}" width="56" height="56" class="mono-icon"></i></div>
      <div class="proj-body">
        <h3 class="proj-title">${p.title}</h3>
        <p class="proj-desc">${p.desc}</p>
        <div class="proj-stack">${p.stack.map(s=>`<span>${s}</span>`).join('')}</div>
        <div class="proj-achieve"><i data-lucide="check-circle-2" width="15" height="15"></i><span>${p.achieve}</span></div>
        ${p.url ? `<a href="${p.url}" target="_blank" rel="noopener noreferrer" class="proj-link">Live Website <i data-lucide="arrow-up-right" width="15" height="15"></i></a>` : '<span class="proj-link-disabled">Private Project</span>'}
      </div>
    </div>`).join('');

  /* ===== DATA: SERVICES ===== */
  const services = [
    ['layout-template','WordPress Development','Custom themes and full site builds tailored to your content and workflow.'],
    ['code','Frontend Development','Fast, accessible interfaces and landing pages built with modern JS frameworks.'],
    ['zap','Website Optimization','Technical SEO and Core Web Vitals tuning so your site loads fast and ranks well.'],
    ['wrench','Website Maintenance','Ongoing performance monitoring, updates, and small enhancements after launch.'],
  ];
  document.getElementById('svcGrid').innerHTML = services.map(([ic,t,d])=>`
    <div class="svc-card reveal"><div class="svc-icon"><i data-lucide="${ic}" width="22" height="22"></i></div><h4>${t}</h4><p>${d}</p></div>`).join('');

  /* ===== DATA: PROCESS ===== */
  const process = [['search','Discover'],['file-search-2','Research'],['code-2','Develop'],['bug','Test'],['rocket','Deploy'],['life-buoy','Maintain']];
  document.getElementById('processRow').innerHTML = process.map(([ic,t],i)=>`
    <div class="proc-card reveal"><div class="proc-num">0${i+1}</div><div class="proc-icon"><i data-lucide="${ic}" width="18" height="18"></i></div><h5>${t}</h5></div>`).join('');

  /* ===== DATA: TESTIMONIALS ===== */
  const testimonials = [
    {quote:"Soorya turned our outdated WordPress site into something fast, clean, and genuinely easy to manage. Communication was clear the whole way through.", name:'Project Lead', role:'Corporate Client', initials:'PL'},
    {quote:"The Angular dashboard he built handles our advertisement workflow flawlessly. Reactive forms just work, every time.", name:'Product Owner', role:'Angular Platform', initials:'PO'},
    {quote:"Attention to pixel detail and page speed both — that combination is rare. Our Core Web Vitals scores improved noticeably.", name:'Marketing Head', role:'STIMES ERP', initials:'MH'},
  ];
  document.getElementById('testiSlides').innerHTML = testimonials.map(t=>`
    <div class="testi-slide"><p class="testi-quote">"${t.quote}"</p>
      <div class="testi-person"><div class="testi-avatar">${t.initials}</div><div style="text-align:left;"><div class="testi-name">${t.name}</div><div class="testi-role">${t.role}</div></div></div>
    </div>`).join('');
  document.getElementById('testiDots').innerHTML = testimonials.map((_,i)=>`<span class="${i===0?'active':''}" data-i="${i}"></span>`).join('');
  let tIdx = 0;
  const tSlidesEl = document.getElementById('testiSlides');
  const tDots = document.querySelectorAll('.testi-dots span');
  function goTesti(i){ tIdx=i; tSlidesEl.style.transform=`translateX(-${i*100}%)`; tDots.forEach((d,j)=>d.classList.toggle('active', j===i)); }
  tDots.forEach(d => d.addEventListener('click', ()=> goTesti(+d.dataset.i)));
  setInterval(()=> goTesti((tIdx+1)%testimonials.length), 5000);

  /* ===== DATA: ACHIEVEMENTS ===== */
  const achievements = [['2+','Years Experience'],['15+','Projects'],['99%','Client Satisfaction'],['40%','Performance Improvement'],['25%','SEO Growth']];
  document.getElementById('achieveGrid').innerHTML = achievements.map(([n,l])=>`
    <div class="achieve-card reveal"><div class="achieve-num" data-target="${n}">0</div><div class="achieve-label">${l}</div></div>`).join('');
  const counterIO = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if(en.isIntersecting){
        const el = en.target; const target = el.dataset.target;
        const num = parseFloat(target); const suffix = target.replace(/[0-9.]/g,'');
        let cur = 0; const step = Math.max(num/50,0.5);
        const t = setInterval(()=>{ cur += step; if(cur>=num){cur=num; clearInterval(t);} el.textContent = (num%1===0? Math.floor(cur):cur.toFixed(1)) + suffix; },30);
        counterIO.unobserve(el);
      }
    });
  }, {threshold:0.5});
  document.querySelectorAll('.achieve-num').forEach(el => counterIO.observe(el));

  /* ===== DATA: WHY CHOOSE ME ===== */
  const why = [['zap','Fast Delivery'],['search','SEO Friendly'],['ruler','Pixel Perfect'],['smartphone','Fully Responsive'],['file-code','Clean Code'],['gauge','Performance Focused'],['trending-up','Scalable'],['users','User-Focused']];
  document.getElementById('whyGrid').innerHTML = why.map(([ic,t])=>`
    <div class="why-card reveal"><i data-lucide="${ic}" width="24" height="24"></i><h5>${t}</h5></div>`).join('');

  /* ===== DATA: TECH STACK MARQUEE ===== */
  const tech = [['html5','HTML'],['palette','CSS'],['braces','JavaScript'],['component','Angular'],['globe','WordPress'],
    ['server','PHP'],['wind','Tailwind'],['layout-grid','Bootstrap'],['git-branch','Git'],['github','GitHub'],
    ['figma','Figma'],['shopping-cart','WooCommerce'],['shopping-bag','Shopify']];
  const techHtml = tech.map(([ic,t])=>`<div class="tech-chip"><i data-lucide="${ic}" width="17" height="17"></i>${t}</div>`).join('');
  document.getElementById('techTrack').innerHTML = techHtml + techHtml;

  lucide.createIcons();
  document.querySelectorAll('.svc-card, .proc-card, .why-card, .achieve-card, .proj-card').forEach(el => io.observe(el));

  /* ===== TILT ON PROJECT CARDS ===== */
  document.querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX-r.left)/r.width - 0.5, py = (e.clientY-r.top)/r.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${px*6}deg) rotateX(${-py*6}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });

  /* ===== RESUME BUTTON ===== */
  document.getElementById('resumeBtn').addEventListener('click', e => {
    e.preventDefault();
    const link = document.createElement('a');
    link.href = 'Soorya_S_Resume.pdf';
    link.download = 'Soorya_S_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  /* ===== COMMAND PALETTE ===== */
  const paletteOverlay = document.getElementById('palette-overlay');
  const paletteInput = document.getElementById('paletteInput');
  const paletteList = document.getElementById('paletteList');
  const paletteItems = [
    ['home','Home','home'],['about','About Me','user'],['experience','Experience','briefcase'],
    ['education','Education','book-open'],['skills','Skills','cpu'],['projects','Projects','folder'],['services','Services','layers'],
    ['process','Process','git-commit'],['testimonials','Testimonials','message-circle'],
    ['achievements','Achievements','trophy'],['why','Why Choose Me','check-circle'],
    ['techstack','Tech Stack','box'],['contact','Contact','mail']
  ];
  function renderPalette(filter=''){
    const items = paletteItems.filter(([,label]) => label.toLowerCase().includes(filter.toLowerCase()));
    paletteList.innerHTML = items.map(([id,label,ic],i)=>`<div class="palette-item ${i===0?'sel':''}" data-id="${id}"><i data-lucide="${ic}" width="15" height="15"></i>${label}</div>`).join('') || '<div class="palette-item">No results</div>';
    lucide.createIcons();
    paletteList.querySelectorAll('.palette-item').forEach(it => it.addEventListener('click', ()=>{
      const id = it.dataset.id; if(id){ document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); closePalette(); }
    }));
  }
  function openPalette(){ paletteOverlay.classList.add('open'); paletteInput.value=''; renderPalette(); paletteInput.focus(); }
  function closePalette(){ paletteOverlay.classList.remove('open'); }
  document.addEventListener('keydown', e => {
    if((e.metaKey||e.ctrlKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); openPalette(); }
    if(e.key === 'Escape') closePalette();
  });
  paletteInput?.addEventListener('input', () => renderPalette(paletteInput.value));
  paletteOverlay.addEventListener('click', e => { if(e.target === paletteOverlay) closePalette(); });

});