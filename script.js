const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
 
document.querySelectorAll('.section, .stagger').forEach(el => io.observe(el));
 

const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('opaque', window.scrollY > 60);
}, { passive: true });
 

const ham = document.getElementById('hamburger');
const mMenu = document.getElementById('mobileMenu');
ham.addEventListener('click', () => {
  ham.classList.toggle('open');
  mMenu.classList.toggle('open');
});
document.querySelectorAll('.mobile-link').forEach(a => {
  a.addEventListener('click', () => {
    ham.classList.remove('open');
    mMenu.classList.remove('open');
  });
});
 

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
 

const ordersRange = document.getElementById('ordersRange');
const costRange   = document.getElementById('costRange');
const ordersVal   = document.getElementById('ordersVal');
const costVal     = document.getElementById('costVal');
 
function styleRange(input) {
  const min = +input.min, max = +input.max, val = +input.value;
  const pct = ((val - min) / (max - min)) * 100;
  input.style.background = `linear-gradient(90deg, var(--g) ${pct}%, var(--border2) ${pct}%)`;
}
 
function calcSim() {
  const orders = +ordersRange.value;
  const cost   = +costRange.value;
 
  ordersVal.textContent = orders.toLocaleString('pt-BR');
  costVal.textContent   = `R$ ${cost.toFixed(2).replace('.', ',')}`;
 
  styleRange(ordersRange);
  styleRange(costRange);
 
  const currentTotal = orders * cost;
  const voltaTotal   = orders * 1.20;
  const eco          = currentTotal - voltaTotal;
  const lixo         = Math.min(87 + (cost / 25) * 10, 97).toFixed(0);
  const co2          = (eco / 5000).toFixed(1);
 
  document.getElementById('resEco').textContent  = 'R$ ' + Math.round(eco).toLocaleString('pt-BR');
  document.getElementById('resLixo').textContent = lixo + '%';
  document.getElementById('resCO2').textContent  = co2.replace('.',',') + ' t';
}
 
ordersRange.addEventListener('input', calcSim);
costRange.addEventListener('input', calcSim);
styleRange(ordersRange); styleRange(costRange);
calcSim();
 

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el     = e.target;
    const target = parseFloat(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const dec    = target % 1 !== 0 ? 1 : 0;
    let start = null;
    const duration = 1600;
 
    function step(ts) {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      const val  = target * ease;
      el.textContent = prefix + val.toFixed(dec).replace('.', ',') + suffix;
      if (prog < 1) requestAnimationFrame(step);
    }
 
    requestAnimationFrame(step);
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });
 
document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));
 

const ctx = document.getElementById('impactChart').getContext('2d');
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Aterro', 'Reciclagem', 'Reutilização VOLTA'],
    datasets: [
      {
        label: 'Sem VOLTA',
        data: [87, 8, 5],
        backgroundColor: 'rgba(255,80,80,0.55)',
        borderColor: 'rgba(255,80,80,.8)',
        borderWidth: 1.5,
        borderRadius: 6,
      },
      {
        label: 'Com VOLTA',
        data: [8, 5, 87],
        backgroundColor: 'rgba(0,232,122,0.55)',
        borderColor: 'rgba(0,232,122,.8)',
        borderWidth: 1.5,
        borderRadius: 6,
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: { color: '#8a8a8a', font: { family: 'Instrument Sans', size: 12 }, boxWidth: 12, padding: 16 }
      },
      tooltip: {
        backgroundColor: '#161616',
        borderColor: '#2a2a2a',
        borderWidth: 1,
        titleColor: '#f0f0f0',
        bodyColor: '#8a8a8a',
        callbacks: {
          label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}%`
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#4a4a4a', font: { size: 11 } },
        grid: { color: 'rgba(255,255,255,.04)' }
      },
      y: {
        ticks: { color: '#4a4a4a', callback: v => v + '%', font: { size: 11 } },
        grid: { color: 'rgba(255,255,255,.04)' },
        max: 100
      }
    }
  }
});
 

document.getElementById('ctaBtn').addEventListener('click', () => {
  const btn   = document.getElementById('ctaBtn');
  const email = document.getElementById('ctaEmail').value.trim();

  if (!email || !email.includes('@')) {
    document.getElementById('ctaEmail').style.borderColor = 'rgba(255,80,80,.6)';
    setTimeout(() => document.getElementById('ctaEmail').style.borderColor = '', 1500);
    return;
  }

  btn.textContent = 'Enviando...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '✓ Solicitação enviada!';
    btn.style.background = 'rgba(0,0,0,.9)';
  }, 1400);
});

/* ── TEMA CLARO / ESCURO ── */
const themeBtn = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('tema');

if (savedTheme === 'light') document.body.classList.add('light');

themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  localStorage.setItem('tema', isLight ? 'light' : 'dark');
});