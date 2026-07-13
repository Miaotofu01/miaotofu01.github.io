/**
 * Unified osu! cursor system — cursor ring, trail, glow, click flash, ripple.
 * Matches the reference implementation at /home/tofu/我的项目/temp/index.html
 */
export function initCursorSystem() {
  const hero = document.getElementById('hero');
  const cursor = document.getElementById('global-cursor')!;
  const canvas = document.getElementById('cursor-canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;
  // Track editor for parallax (if present in hero)
  const editor: HTMLElement | null = hero?.querySelector('.editor') as HTMLElement ?? null;

  let mouseX = -200, mouseY = -200;
  let isPressing = false;
  let glowRadius = 40;
  const trail: { x: number; y: number }[] = [];
  const MAX_TRAIL = 25;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // ── Global cursor + trail recording ──
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Direct follow — no lerp lag
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';

    trail.push({ x: e.clientX, y: e.clientY });
    if (trail.length > MAX_TRAIL) trail.shift();
  });

  // ── Hero: parallax (editor window tilt) ──
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      if (!editor) return;
      const rect = hero.getBoundingClientRect();
      const hx = e.clientX - rect.left;
      const hy = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const ox = ((hx - cx) / cx) * 8;
      const oy = ((hy - cy) / cy) * 8;
      editor.style.transform = `translate(${ox.toFixed(1)}px, ${oy.toFixed(1)}px)`;
      editor.style.transition = 'transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });

    hero.addEventListener('mouseenter', () => cursor.classList.add('in-hero'));
    hero.addEventListener('mouseleave', () => {
      cursor.classList.remove('in-hero');
      if (editor) editor.style.transform = 'translate(0, 0)';
    });

    // ── Hero click ripple ──
    hero.addEventListener('mousedown', (e) => {
      isPressing = true;
      cursor.classList.add('pressing');
      glowRadius = 70;

      const rect = hero.getBoundingClientRect();
      const ring = document.createElement('div');
      ring.className = 'ripple-ring';
      ring.style.left = (e.clientX - rect.left) + 'px';
      ring.style.top = (e.clientY - rect.top) + 'px';
      hero.appendChild(ring);
      setTimeout(() => ring.remove(), 650);
    });
  }

  // ── Global click flash + cursor expand ──
  document.addEventListener('mousedown', (e) => {
    if (!isPressing) {
      isPressing = true;
      cursor.classList.add('pressing');
    }
    const flash = document.createElement('div');
    flash.className = 'click-flash';
    flash.style.left = e.clientX + 'px';
    flash.style.top = e.clientY + 'px';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 380);
  });

  document.addEventListener('mouseup', () => {
    isPressing = false;
    cursor.classList.remove('pressing');
  });

  // ── Draw loop: trail + glow ──
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Glow radius easing on release
    if (!isPressing && glowRadius > 40) {
      glowRadius += (40 - glowRadius) * 0.15;
      if (Math.abs(glowRadius - 40) < 0.5) glowRadius = 40;
    }

    // Smooth trail — fading polyline, global
    if (trail.length >= 2) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      for (let i = 1; i < trail.length; i++) {
        const t = i / (trail.length - 1); // 0→1
        const alpha = t * 0.28;
        const width = t * 5;
        ctx.beginPath();
        ctx.moveTo(trail[i - 1]!.x, trail[i - 1]!.y);
        ctx.lineTo(trail[i]!.x, trail[i]!.y);
        ctx.strokeStyle = `rgba(121, 192, 255, ${alpha.toFixed(3)})`;
        ctx.lineWidth = width;
        ctx.stroke();
      }
    }

    // Ambient glow — global, follows cursor everywhere
    const intensity = isPressing ? 0.16 : 0.08;
    const glow = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, glowRadius);
    glow.addColorStop(0, `rgba(88, 166, 255, ${intensity.toFixed(2)})`);
    glow.addColorStop(0.5, `rgba(121, 192, 255, ${(intensity * 0.35).toFixed(2)})`);
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, glowRadius, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}
