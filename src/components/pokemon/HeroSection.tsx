"use client";

// ─── HeroSection — Epic Battle Scene ─────────────────────────────────────────
// Sunset orange + gold theme, wild forest background, cinematic Pokéball
// animation that triggers on "Explore Database" click.

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const POKEMON_SILHOUETTES = [
  "M50 20 C45 15 35 18 30 25 C25 32 28 40 25 45 C20 50 15 52 18 58 C21 64 30 62 35 65 C38 72 36 80 40 82 C44 84 50 78 50 78 C50 78 56 84 60 82 C64 80 62 72 65 65 C70 62 79 64 82 58 C85 52 80 50 75 45 C72 40 75 32 70 25 C65 18 55 15 50 20Z",
  "M35 45 C30 40 28 30 32 22 C36 14 44 12 50 15 C56 12 64 14 68 22 C72 30 70 40 65 45 C70 50 72 58 68 64 C64 70 56 72 50 70 C44 72 36 70 32 64 C28 58 30 50 35 45Z",
  "M50 15 C38 15 25 25 22 38 C19 51 25 62 30 68 C25 72 20 78 25 82 C30 86 38 80 42 76 C44 80 46 85 50 85 C54 85 56 80 58 76 C62 80 70 86 75 82 C80 78 75 72 70 68 C75 62 81 51 78 38 C75 25 62 15 50 15Z",
];

export default function HeroSection() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef(0);

  const [phase, setPhase] = useState<"idle"|"throw"|"explode"|"reveal"|"exit">("idle");
  const [ballY, setBallY] = useState(0);
  const [ballScale, setBallScale] = useState(1);
  const [ballRotation, setBallRotation] = useState(0);
  const [showPokemon, setShowPokemon] = useState(false);
  const [pokemonOpacity, setPokemonOpacity] = useState(0);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [screenFlash, setScreenFlash] = useState(0);
  const [particles, setParticles] = useState<Array<{id:number;x:number;y:number;vx:number;vy:number;size:number;color:string;life:number}>>([]);
  const [currentSilhouette] = useState(() => Math.floor(Math.random() * POKEMON_SILHOUETTES.length));

  // Canvas background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const draw = (t: number) => {
      timeRef.current = t * 0.001;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Sky
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0,   "#0d0510");
      sky.addColorStop(0.3, "#1a0820");
      sky.addColorStop(0.55,"#3d1506");
      sky.addColorStop(0.75,"#7a2e08");
      sky.addColorStop(0.88,"#c45c0a");
      sky.addColorStop(1,   "#e8890a");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // God rays
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI - Math.PI * 0.5 + Math.sin(timeRef.current * 0.3 + i) * 0.04;
        const alpha = 0.04 + Math.sin(timeRef.current * 0.5 + i * 0.8) * 0.02;
        const grad = ctx.createLinearGradient(W*0.5, H*0.78, W*0.5+Math.cos(angle)*H*1.5, H*0.78+Math.sin(angle)*H*1.5);
        grad.addColorStop(0, `rgba(255,180,50,${alpha})`);
        grad.addColorStop(1, "rgba(255,180,50,0)");
        ctx.beginPath();
        ctx.moveTo(W*0.5, H*0.78);
        const sp = 0.12;
        ctx.lineTo(W*0.5+Math.cos(angle-sp)*H*2, H*0.78+Math.sin(angle-sp)*H*2);
        ctx.lineTo(W*0.5+Math.cos(angle+sp)*H*2, H*0.78+Math.sin(angle+sp)*H*2);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Embers
      for (let i = 0; i < 40; i++) {
        const x = ((i * 137.5 + timeRef.current * 20) % W);
        const y = H - ((i * 89 + timeRef.current * 15 * (0.5 + (i%3)*0.3)) % (H*0.8));
        ctx.beginPath();
        ctx.arc(x, y, 1+(i%3)*0.8, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,${150+(i%5)*20},50,${0.3+Math.sin(timeRef.current*2+i)*0.2})`;
        ctx.fill();
      }

      // Back trees
      ctx.fillStyle = "rgba(15,5,20,0.7)";
      for (let i = 0; i < 20; i++) {
        const x = (i/20)*W+(i%3)*30, tH = H*0.25+(i%5)*H*0.04, tW = W*0.03+(i%3)*W*0.01;
        ctx.beginPath(); ctx.moveTo(x+tW/2,H*0.78-tH); ctx.lineTo(x+tW,H*0.78); ctx.lineTo(x,H*0.78); ctx.closePath(); ctx.fill();
      }

      // Front trees
      const trees = [{x:-W*0.02,w:W*0.09,h:H*0.55},{x:W*0.06,w:W*0.07,h:H*0.48},{x:W*0.82,w:W*0.09,h:H*0.52},{x:W*0.92,w:W*0.07,h:H*0.45},{x:W*0.15,w:W*0.05,h:H*0.38},{x:W*0.78,w:W*0.05,h:H*0.40}];
      trees.forEach(({x,w,h}) => {
        ctx.fillStyle = "rgba(5,2,8,0.95)";
        ctx.beginPath(); ctx.moveTo(x+w/2,H-h); ctx.lineTo(x+w,H); ctx.lineTo(x,H); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(x+w/2,H-h*0.75); ctx.lineTo(x+w*1.2,H-h*0.35); ctx.lineTo(x-w*0.2,H-h*0.35); ctx.closePath(); ctx.fill();
      });

      // Ground mist
      const mist = ctx.createLinearGradient(0,H*0.82,0,H);
      mist.addColorStop(0,"rgba(200,100,20,0)");
      mist.addColorStop(0.5,"rgba(180,80,10,0.15)");
      mist.addColorStop(1,"rgba(150,60,5,0.4)");
      ctx.fillStyle = mist;
      ctx.fillRect(0,H*0.82,W,H*0.18);

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animFrameRef.current); window.removeEventListener("resize", resize); };
  }, []);

  const handleExplore = useCallback(() => {
    if (phase !== "idle") return;
    setPhase("throw");
    let prog = 0;
    const interval = setInterval(() => {
      prog += 0.04;
      setBallY(-prog * 180);
      setBallRotation(prog * 720);
      setBallScale(1 + prog * 0.3);
      if (prog >= 1) {
        clearInterval(interval);
        setPhase("explode");
        setBallScale(0);
        setScreenFlash(1);

        // Spawn particles
        const colors = ["#FFB830","#FF6B00","#FFD700","#FF4500","#FFF","#E3350D"];
        setParticles(Array.from({length:60},(_,i) => ({
          id: Date.now()+i, x: window.innerWidth/2, y: window.innerHeight*0.38,
          vx:(Math.random()-0.5)*12, vy:(Math.random()-0.5)*12-3,
          size:3+Math.random()*6, color:colors[Math.floor(Math.random()*colors.length)], life:1
        })));

        // Animate particles
        let pTick = 0;
        const pInt = setInterval(() => {
          pTick++;
          setParticles(ps => ps.map(p => ({...p,x:p.x+p.vx,y:p.y+p.vy,vy:p.vy+0.3,life:p.life-0.025})).filter(p=>p.life>0));
          if (pTick > 80) clearInterval(pInt);
        }, 16);

        // Flash fade
        let fl = 1;
        const flInt = setInterval(() => { fl -= 0.08; setScreenFlash(Math.max(0,fl)); if(fl<=0) clearInterval(flInt); }, 16);

        // Pokemon reveal
        setTimeout(() => {
          setPhase("reveal"); setShowPokemon(true);
          let op = 0, gl = 0;
          const revInt = setInterval(() => {
            op += 0.04; gl += 0.05;
            setPokemonOpacity(Math.min(1,op));
            setGlowIntensity(Math.min(1,gl));
            if(op>=1) clearInterval(revInt);
          }, 16);

          // Exit
          setTimeout(() => {
            setPhase("exit");
            let ex = 1;
            const exInt = setInterval(() => {
              ex -= 0.04; setPokemonOpacity(Math.max(0,ex));
              if(ex<=0) { clearInterval(exInt); router.push("/pokedex"); }
            }, 16);
          }, 1800);
        }, 600);
      }
    }, 16);
  }, [phase, router]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {screenFlash > 0 && (
        <div className="absolute inset-0 z-20 pointer-events-none" style={{backgroundColor:`rgba(255,200,80,${screenFlash*0.8})`}} />
      )}

      <svg className="absolute inset-0 z-20 pointer-events-none w-full h-full">
        {particles.map(p => <circle key={p.id} cx={p.x} cy={p.y} r={p.size*p.life} fill={p.color} opacity={p.life} />)}
      </svg>

      {showPokemon && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{opacity:pokemonOpacity}}>
          <svg width="300" height="300" viewBox="0 0 100 100">
            <defs>
              <filter id="pkglow"><feGaussianBlur stdDeviation={glowIntensity*5} result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <path d={POKEMON_SILHOUETTES[currentSilhouette]} fill={`rgba(255,${150+glowIntensity*80},0,${0.4+glowIntensity*0.4})`} filter="url(#pkglow)" />
          </svg>
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl mx-auto" style={{opacity:phase==="exit"?0:1,transition:"opacity 0.5s ease"}}>
        <span className="font-mono text-xs tracking-[0.3em] uppercase animate-fadeIn" style={{color:"#FFB830"}}>
          Gen I — 151 Pokémon
        </span>

        <div
          style={{
            transform:`translateY(${ballY}px) scale(${ballScale}) rotate(${ballRotation}deg)`,
            opacity:phase==="explode"||phase==="reveal"||phase==="exit"?0:1,
            filter:phase==="throw"?"drop-shadow(0 0 30px rgba(255,180,50,0.8))":"drop-shadow(0 0 20px rgba(255,150,30,0.4))",
            cursor:"pointer",
          }}
          onClick={handleExplore}
        >
          <div style={{animation:phase==="idle"?"floatY 3s ease-in-out infinite":"none"}}>
            <PokeBallSVG size={100} />
          </div>
          {phase==="idle" && (
            <div className="text-center mt-3" style={{color:"rgba(255,180,80,0.7)",fontSize:"10px",fontFamily:"monospace",letterSpacing:"0.2em"}}>
              TAP TO THROW
            </div>
          )}
        </div>

        <h1
          className="font-display tracking-widest leading-none animate-fadeIn"
          style={{
            fontSize:"clamp(4rem,12vw,10rem)",
            animationDelay:"0.1s",
            background:"linear-gradient(135deg,#FFD700 0%,#FF8C00 40%,#FF4500 70%,#FFB830 100%)",
            WebkitBackgroundClip:"text",
            WebkitTextFillColor:"transparent",
            backgroundClip:"text",
            filter:"drop-shadow(0 4px 20px rgba(255,140,0,0.4))",
          }}
        >
          POKÉDEX
        </h1>

        <p className="font-body text-base sm:text-lg max-w-lg leading-relaxed animate-fadeIn" style={{animationDelay:"0.2s",color:"rgba(255,200,120,0.8)"}}>
          Step into the wild. Explore every Pokémon, master their stats, and prepare for battle.
        </p>

        <div className="flex flex-wrap gap-4 justify-center animate-fadeIn" style={{animationDelay:"0.3s"}}>
          <button
            onClick={handleExplore}
            disabled={phase!=="idle"}
            className="relative px-10 py-4 rounded-xl font-body font-bold text-sm tracking-widest uppercase overflow-hidden disabled:opacity-70"
            style={{
              background:"linear-gradient(135deg,#FF8C00,#FFD700)",
              color:"#1a0808",
              boxShadow:"0 0 30px rgba(255,150,0,0.5),inset 0 1px 0 rgba(255,255,255,0.3)",
            }}
          >
            {phase==="idle" ? "⚔ Explore Database" : "✦ Summoning..."}
          </button>
          <a
            href="#about"
            className="px-8 py-4 rounded-xl font-body text-sm tracking-widest uppercase transition-all duration-200"
            style={{border:"1px solid rgba(255,150,30,0.3)",color:"rgba(255,180,80,0.7)"}}
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}

function PokeBallSVG({size}:{size:number}) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="tG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FF8C00"/><stop offset="100%" stopColor="#FF4500"/></linearGradient>
        <linearGradient id="bG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1a0808"/><stop offset="100%" stopColor="#0d0510"/></linearGradient>
      </defs>
      <circle cx="50" cy="50" r="42" fill="rgba(0,0,0,0.3)"/>
      <path d="M 8 50 A 42 42 0 0 1 92 50 Z" fill="url(#tG)"/>
      <path d="M 8 50 A 42 42 0 0 0 92 50 Z" fill="url(#bG)"/>
      <circle cx="50" cy="50" r="42" stroke="rgba(255,180,50,0.6)" strokeWidth="2" fill="none"/>
      <line x1="8" y1="50" x2="92" y2="50" stroke="rgba(255,180,50,0.6)" strokeWidth="2.5"/>
      <circle cx="50" cy="50" r="13" fill="#0d0510" stroke="rgba(255,180,50,0.8)" strokeWidth="2.5"/>
      <circle cx="50" cy="50" r="7" fill="#FFD700"/>
      <circle cx="46" cy="46" r="2.5" fill="rgba(255,255,255,0.6)"/>
    </svg>
  );
}
