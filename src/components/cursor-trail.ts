export function initCursorTrail() {
  const canvas = document.getElementById('trail-canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;
  const positions: { x: number; y: number }[] = [];
  const MAX = 25;

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', (e) => {
    positions.push({ x: e.clientX, y: e.clientY });
    if (positions.length > MAX) positions.shift();
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (positions.length < 2) { requestAnimationFrame(draw); return; }
    for (let i = 1; i < positions.length; i++) {
      const alpha = i / positions.length;
      ctx.beginPath();
      ctx.moveTo(positions[i - 1]!.x, positions[i - 1]!.y);
      ctx.lineTo(positions[i]!.x, positions[i]!.y);
      ctx.strokeStyle = `rgba(121, 192, 255, ${alpha * 0.5})`;
      ctx.lineWidth = alpha * 3;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}
