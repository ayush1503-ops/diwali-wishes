import { useRef, useEffect } from "react";

export function Fireworks({ count = 25 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width, height;
    let particles = [];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 12;
        this.speedY = (Math.random() - 0.5) * 12;
        this.life = 100;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 2;
      }
      draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life / 100;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    function explode(x, y) {
      const colors = ["#D4AF37", "#FF9F00", "#FF9933", "#FFFFFF", "#8B0000"];
      for (let i = 0; i < 12; i++) {
        particles.push(new Particle(x, y, colors[Math.floor(Math.random() * colors.length)]));
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0) particles.splice(i, 1);
      }
      if (particles.length > 0) requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener("resize", resize);

    // Auto-trigger fireworks
    let fired = 0;
    const interval = setInterval(() => {
      explode(
        Math.random() * width,
        Math.random() * height * 0.5
      );
      animate();
      fired++;
      if (fired >= count) clearInterval(interval);
    }, 400);

    return () => {
      window.removeEventListener("resize", resize);
      clearInterval(interval);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}

export default Fireworks;
