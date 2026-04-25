"use client";

// ─── PersonalityQuiz ──────────────────────────────────────────────────────────
// Modal quiz: kombinasi MCQ + free text input
// Result: Pokemon type berdasarkan personality
// Triggered by button di Navbar atau halaman manapun

import { useState, useCallback } from "react";
import Image from "next/image";
import { TYPE_COLORS } from "@/types/pokemon";

// ── Quiz Data ─────────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 1,
    question: "Kalau ada konflik sama temen, lo biasanya...",
    options: [
      { text: "Langsung confrontasi & selesaikan", types: ["fire", "fighting"] },
      { text: "Dengerin dulu, cari solusi bareng", types: ["water", "psychic"] },
      { text: "Diam dulu, butuh waktu sendiri", types: ["ghost", "dark"] },
      { text: "Coba bikin suasana cair dengan humor", types: ["electric", "normal"] },
    ],
  },
  {
    id: 2,
    question: "Weekend ideal lo itu...",
    options: [
      { text: "Petualangan outdoor, hiking, eksplorasi", types: ["fire", "ground", "rock"] },
      { text: "Santai di rumah, baca buku / nonton", types: ["water", "ice", "psychic"] },
      { text: "Hangout rame-rame, party, social", types: ["electric", "fairy", "normal"] },
      { text: "Solo time, gym, atau kerja project", types: ["steel", "fighting", "dark"] },
    ],
  },
  {
    id: 3,
    question: "Temen-temen lo describe lo sebagai...",
    options: [
      { text: "Energetic & passionate", types: ["fire", "electric"] },
      { text: "Calm & reliable", types: ["water", "steel"] },
      { text: "Creative & mysterious", types: ["ghost", "psychic", "dragon"] },
      { text: "Friendly & caring", types: ["fairy", "normal", "grass"] },
    ],
  },
  {
    id: 4,
    question: "Waktu ngambil keputusan penting, lo...",
    options: [
      { text: "Ikutin insting / gut feeling", types: ["fire", "fighting", "dragon"] },
      { text: "Analisis semua data dulu", types: ["psychic", "steel", "water"] },
      { text: "Minta pendapat orang-orang terdekat", types: ["fairy", "normal", "grass"] },
      { text: "Itung risk vs reward dengan cermat", types: ["dark", "ice", "rock"] },
    ],
  },
  {
    id: 5,
    question: "Lo paling takut sama...",
    options: [
      { text: "Gagal & nggak achieve goals", types: ["fire", "dragon"] },
      { text: "Kehilangan orang yang lo sayang", types: ["water", "fairy", "psychic"] },
      { text: "Dikhianati atau dibohongi", types: ["dark", "ghost"] },
      { text: "Nggak bisa kontrol situasi", types: ["steel", "rock", "ground"] },
    ],
  },
];

// ── Type to Pokemon mapping ───────────────────────────────────────────────────
const TYPE_POKEMON: Record<string, { name: string; id: number; description: string; traits: string[] }> = {
  fire:     { name: "Charizard",   id: 6,   description: "Lo adalah jiwa yang membara — passionate, ambisius, dan nggak pernah takut ngambil risiko. Natural leader yang menginspirasi orang di sekitar lo.", traits: ["Passionate","Ambitious","Bold","Leader"] },
  water:    { name: "Vaporeon",    id: 134, description: "Lo adaptif dan tenang kayak air. Bisa ngalir ke mana aja, tapi punya kedalaman yang nggak semua orang liat. Empati tinggi dan selalu ada buat orang lain.", traits: ["Empathetic","Adaptable","Calm","Loyal"] },
  electric: { name: "Jolteon",     id: 135, description: "Energi lo nular ke semua orang! Quick thinker, spontan, dan selalu bawa vibes yang hype. Lo yang bikin gathering jadi memorable.", traits: ["Energetic","Spontaneous","Witty","Social"] },
  psychic:  { name: "Alakazam",    id: 65,  description: "Otak lo jalan terus. Analytical, intuitif, dan selalu selangkah lebih maju. Lo nggak cuma mikir — lo ngerti hal-hal yang orang lain miss.", traits: ["Analytical","Intuitive","Strategic","Wise"] },
  ghost:    { name: "Gengar",      id: 94,  description: "Lo enigmatic dan punya depth yang jarang orang tau. Suka ngerti hal-hal dari perspektif yang berbeda. Loyal banget ke inner circle lo.", traits: ["Mysterious","Deep","Creative","Independent"] },
  dark:     { name: "Umbreon",     id: 197, description: "Lo cool, calculated, dan nggak gampang dibaca. Strong instinct buat ngedeteksi vibe orang. Protektif banget sama orang yang lo care.", traits: ["Calculated","Protective","Resilient","Perceptive"] },
  grass:    { name: "Venusaur",    id: 3,   description: "Lo grounded dan genuine. Patient, nurturing, dan selalu tumbuh. Lo yang jadi 'rumah' buat temen-temen — tempat balik kalau capek.", traits: ["Nurturing","Patient","Grounded","Genuine"] },
  dragon:   { name: "Dragonite",   id: 149, description: "Lo rare — punya power yang besar tapi hati yang hangat. Visioner, driven, dan kalau lo commit ke sesuatu, nggak ada yang bisa stop lo.", traits: ["Visionary","Powerful","Warm","Driven"] },
  fairy:    { name: "Clefable",    id: 36,  description: "Lo bawa cahaya ke mana pun lo pergi. Optimis, caring, dan punya cara bikin orang ngerasa diterima. Lo percaya sama kebaikan — dan itu kekuatan lo.", traits: ["Optimistic","Caring","Charming","Kind"] },
  fighting: { name: "Machamp",     id: 68,  description: "Lo straight-forward, disciplined, dan nggak suka basa-basi. Kerja keras adalah bahasa cinta lo. Lo yang paling bisa diandalkan waktu situasi sulit.", traits: ["Disciplined","Direct","Reliable","Strong-willed"] },
  steel:    { name: "Metagross",   id: 376, description: "Lo solid, dependable, dan punya standard yang tinggi. Nggak mudah digoyahkan. Orang lain ngerasa aman ada lo — karena lo memang bisa diandalkan.", traits: ["Reliable","Principled","Logical","Steadfast"] },
  ice:      { name: "Lapras",      id: 131, description: "Lo tenang, thoughtful, dan punya keindahan yang nggak semua orang langsung liat. Suka kedalaman dan nggak suka hal yang superficial.", traits: ["Thoughtful","Calm","Elegant","Introspective"] },
  rock:     { name: "Golem",       id: 76,  description: "Lo steady dan nggak gampang goyah. Orang tahu kalau lo bilang sesuatu, itu beneran. Nggak banyak bicara tapi actionnya yang ngomong.", traits: ["Steadfast","Honest","Tough","Dependable"] },
  ground:   { name: "Sandslash",   id: 28,  description: "Lo practical, resourceful, dan tau cara survive di kondisi apapun. Nggak suka drama — lo fokus sama yang bisa dikontrol dan dikerjain.", traits: ["Practical","Resourceful","Focused","Grounded"] },
  flying:   { name: "Pidgeot",     id: 18,  description: "Lo free-spirited dan punya perspektif yang luas. Nggak mau dikekang — lo butuh ruang buat terbang dan explore. Visioner yang nggak takut tinggi.", traits: ["Free-spirited","Visionary","Independent","Swift"] },
  bug:      { name: "Butterfree",  id: 12,  description: "Lo growth-oriented — selalu dalam proses transformasi. Adaptif dan nggak takut berubah. Lo udah jauh dari titik awal lo, dan masih terus berkembang.", traits: ["Growth-minded","Adaptable","Gentle","Persistent"] },
  poison:   { name: "Nidoking",    id: 34,  description: "Lo fierce dan nggak takut jadi beda. Punya edge yang bikin orang respect — bukan karena lo cari perhatian, tapi karena lo genuinely powerful.", traits: ["Fierce","Unique","Confident","Intense"] },
  normal:   { name: "Eevee",       id: 133, description: "Lo versatile dan full of potential — bisa jadi apa aja yang lo mau. Genuine, approachable, dan punya kemampuan adaptasi yang luar biasa.", traits: ["Versatile","Genuine","Friendly","Potential"] },
};

// ── Free text → type mapping ──────────────────────────────────────────────────
function analyzeText(text: string): string[] {
  const lower = text.toLowerCase();
  const scores: Record<string, number> = {};

  const keywords: Record<string, string[]> = {
    fire:     ["semangat","passionate","api","berani","bold","ambisius","ambis","leader","panas","gasgas","nggak takut","energi"],
    water:    ["tenang","calm","empati","dengerin","sabar","adaptif","flexible","chill","slow","santai"],
    electric: ["hype","energetic","spontan","seru","lucu","social","rame","nongkrong","asik","fun","jokes"],
    psychic:  ["mikir","analisis","overthink","strategic","smart","pintar","ngerti","paham","deep","filosofi"],
    ghost:    ["misterius","introvert","sendiri","diem","quiet","nggak banyak omong","private","dalam"],
    dark:     ["realistis","skeptis","hati-hati","nggak gampang percaya","calculated","observasi","waspada"],
    grass:    ["peduli","care","nurturing","temen","keluarga","supportive","setia","grow","berkembang"],
    dragon:   ["driven","gede","goals","mimpi","visioner","powerful","nggak bisa distop","rare","unik"],
    fairy:    ["optimis","positif","baik","sweet","caring","senyum","cahaya","hangat","senang bantu"],
    fighting: ["disiplin","kerja keras","serius","langsung","direct","tangguh","latihan","strong"],
    steel:    ["principled","konsisten","reliable","diandalkan","logic","nggak gampang goyah","firm"],
    ice:      ["kalem","thoughtful","elegan","nggak suka drama","introspektif","reflektif","dalam"],
  };

  Object.entries(keywords).forEach(([type, words]) => {
    scores[type] = 0;
    words.forEach(w => { if (lower.includes(w)) scores[type]++; });
  });

  const sorted = Object.entries(scores).sort((a,b) => b[1]-a[1]);
  return sorted.slice(0,2).map(e => e[0]).filter((_,i,arr) => scores[arr[0][0]] > 0 || i === 0);
}

// ── Component ─────────────────────────────────────────────────────────────────
interface Props { onClose: () => void; }

export default function PersonalityQuiz({ onClose }: Props) {
  const [step, setStep] = useState<"intro"|"quiz"|"text"|"result">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [typeScores, setTypeScores] = useState<Record<string, number>>({});
  const [freeText, setFreeText] = useState("");
  const [result, setResult] = useState<typeof TYPE_POKEMON[string] | null>(null);
  const [resultType, setResultType] = useState("");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const addScore = useCallback((types: string[]) => {
    setTypeScores(prev => {
      const next = {...prev};
      types.forEach(t => { next[t] = (next[t] || 0) + 1; });
      return next;
    });
  }, []);

  const handleOption = useCallback((types: string[], idx: number) => {
    setSelectedOption(idx);
    setTimeout(() => {
      addScore(types);
      setSelectedOption(null);
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(q => q + 1);
      } else {
        setStep("text");
      }
    }, 400);
  }, [currentQ, addScore]);

  const handleFinish = useCallback(() => {
    const finalScores = {...typeScores};

    // Merge text analysis
    if (freeText.trim()) {
      const textTypes = analyzeText(freeText);
      textTypes.forEach((t, i) => { finalScores[t] = (finalScores[t] || 0) + (2 - i); });
    }

    // Find winner
    const winner = Object.entries(finalScores).sort((a,b) => b[1]-a[1])[0]?.[0] || "normal";
    setResultType(winner);
    setResult(TYPE_POKEMON[winner] || TYPE_POKEMON.normal);
    setStep("result");
  }, [typeScores, freeText]);

  const handleRetry = useCallback(() => {
    setStep("intro"); setCurrentQ(0); setTypeScores({});
    setFreeText(""); setResult(null); setResultType(""); setSelectedOption(null);
  }, []);

  const color = resultType ? (TYPE_COLORS[resultType] ?? "#A8A878") : "#7B2FFF";
  const progress = ((currentQ) / QUESTIONS.length) * 100;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{backgroundColor:"rgba(0,0,0,0.85)", backdropFilter:"blur(12px)"}}
      onClick={onClose}>
      <div className="relative w-full max-w-lg rounded-3xl overflow-hidden"
        style={{
          background:"linear-gradient(135deg,rgba(15,5,35,0.98),rgba(8,3,20,0.98))",
          border:"1px solid rgba(120,80,255,0.25)",
          boxShadow:"0 40px 80px rgba(0,0,0,0.8), 0 0 60px rgba(100,60,255,0.15)",
          maxHeight:"90vh", overflowY:"auto"
        }}
        onClick={e => e.stopPropagation()}>

        {/* Top accent */}
        <div className="h-1 w-full" style={{background:"linear-gradient(90deg,#7B2FFF,#4B8FFF,#7B2FFF)"}}/>

        {/* Close */}
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full z-10
                     text-sm transition-colors"
          style={{background:"rgba(120,80,255,0.15)",color:"rgba(180,150,255,0.7)"}}>
          ✕
        </button>

        <div className="p-6 sm:p-8">

          {/* ── INTRO ── */}
          {step === "intro" && (
            <div className="flex flex-col items-center text-center gap-6">
              <div className="text-5xl animate-float">🔮</div>
              <div>
                <h2 className="font-display text-3xl tracking-widest mb-2"
                  style={{background:"linear-gradient(135deg,#fff,#c8aaff)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>
                  KAMU POKEMON APA?
                </h2>
                <p className="font-body text-sm leading-relaxed" style={{color:"rgba(180,150,255,0.7)"}}>
                  Jawab beberapa pertanyaan dan ceritain diri lo — AI akan analisis personality lo dan match sama Pokemon yang paling cocok.
                </p>
              </div>
              <div className="flex gap-3 text-xs font-mono" style={{color:"rgba(150,120,255,0.6)"}}>
                <span>5 Pertanyaan</span><span>•</span>
                <span>Free Text</span><span>•</span>
                <span>Personality Match</span>
              </div>
              <button onClick={() => setStep("quiz")}
                className="px-10 py-3.5 rounded-xl font-body font-bold text-sm tracking-widest uppercase"
                style={{background:"linear-gradient(135deg,#7B2FFF,#4B8FFF)",color:"#fff",boxShadow:"0 0 30px rgba(100,60,255,0.4)"}}>
                Mulai Quiz ✨
              </button>
            </div>
          )}

          {/* ── QUIZ ── */}
          {step === "quiz" && (
            <div className="flex flex-col gap-6">
              {/* Progress */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-mono text-xs" style={{color:"rgba(150,120,255,0.6)"}}>
                    Pertanyaan {currentQ+1} / {QUESTIONS.length}
                  </span>
                  <span className="font-mono text-xs" style={{color:"rgba(150,120,255,0.6)"}}>
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="h-1 rounded-full" style={{background:"rgba(120,80,255,0.2)"}}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{width:`${progress}%`,background:"linear-gradient(90deg,#7B2FFF,#4B8FFF)"}}/>
                </div>
              </div>

              {/* Question */}
              <h3 className="font-body text-lg font-semibold leading-snug" style={{color:"rgba(220,200,255,0.95)"}}>
                {QUESTIONS[currentQ].question}
              </h3>

              {/* Options */}
              <div className="flex flex-col gap-3">
                {QUESTIONS[currentQ].options.map((opt, idx) => (
                  <button key={idx} onClick={() => handleOption(opt.types, idx)}
                    className="w-full text-left px-5 py-4 rounded-xl font-body text-sm transition-all duration-200"
                    style={{
                      background: selectedOption === idx
                        ? "rgba(120,80,255,0.35)"
                        : "rgba(120,80,255,0.08)",
                      border: selectedOption === idx
                        ? "1px solid rgba(150,100,255,0.8)"
                        : "1px solid rgba(120,80,255,0.15)",
                      color: selectedOption === idx
                        ? "rgba(220,200,255,1)"
                        : "rgba(180,150,255,0.8)",
                      transform: selectedOption === idx ? "scale(1.01)" : "scale(1)",
                    }}>
                    <span className="mr-3" style={{color:"rgba(150,120,255,0.5)"}}>
                      {["A","B","C","D"][idx]}.
                    </span>
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── FREE TEXT ── */}
          {step === "text" && (
            <div className="flex flex-col gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">✍️</div>
                <h3 className="font-display text-2xl tracking-widest mb-2"
                  style={{color:"rgba(220,200,255,0.95)"}}>
                  CERITAIN DIRI LO
                </h3>
                <p className="font-body text-sm" style={{color:"rgba(150,120,255,0.6)"}}>
                  Describe diri lo dalam 2-3 kalimat. Personality, hobi, cara lo ngejalanin hidup — apapun yang lo rasa mendefinisiin lo.
                </p>
              </div>
              <textarea
                value={freeText}
                onChange={e => setFreeText(e.target.value)}
                placeholder="Contoh: Gw orangnya passionate sama goals gw, sering overthink tapi itu yang bikin gw selalu prepared. Temen-temen bilang gw reliable tapi susah dibaca..."
                rows={5}
                className="w-full px-4 py-3 rounded-xl font-body text-sm resize-none focus:outline-none transition-colors"
                style={{
                  background:"rgba(120,80,255,0.08)",
                  border:"1px solid rgba(120,80,255,0.2)",
                  color:"rgba(220,200,255,0.9)",
                  lineHeight:"1.6",
                }}
              />
              <div className="flex gap-3">
                <button onClick={() => setFreeText("")}
                  className="flex-1 py-3 rounded-xl font-body text-sm transition-colors"
                  style={{border:"1px solid rgba(120,80,255,0.2)",color:"rgba(150,120,255,0.6)"}}>
                  Skip
                </button>
                <button onClick={handleFinish}
                  className="flex-1 py-3 rounded-xl font-body font-bold text-sm tracking-widest uppercase"
                  style={{background:"linear-gradient(135deg,#7B2FFF,#4B8FFF)",color:"#fff",boxShadow:"0 0 20px rgba(100,60,255,0.4)"}}>
                  Reveal! 🔮
                </button>
              </div>
            </div>
          )}

          {/* ── RESULT ── */}
          {step === "result" && result && (
            <div className="flex flex-col items-center gap-6 text-center">
              <div>
                <p className="font-mono text-xs tracking-[0.3em] uppercase mb-1" style={{color:"rgba(150,120,255,0.6)"}}>
                  Kamu adalah...
                </p>
                <h2 className="font-display text-4xl tracking-widest"
                  style={{color: color, textShadow:`0 0 30px ${color}66`}}>
                  {result.name.toUpperCase()}
                </h2>
                <span className="font-mono text-xs px-3 py-1 rounded-full mt-2 inline-block uppercase tracking-widest"
                  style={{background:`${color}22`,color,border:`1px solid ${color}44`}}>
                  {resultType} type
                </span>
              </div>

              {/* Pokemon artwork */}
              <div className="relative w-36 h-36">
                <div className="absolute inset-0 rounded-full"
                  style={{background:`radial-gradient(ellipse,${color}33,transparent 70%)`}}/>
                <Image src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${result.id}.png`}
                  alt={result.name} fill className="object-contain animate-float" unoptimized/>
              </div>

              {/* Traits */}
              <div className="flex flex-wrap gap-2 justify-center">
                {result.traits.map(t => (
                  <span key={t} className="font-mono text-xs px-3 py-1 rounded-full"
                    style={{background:`${color}15`,color:`${color}CC`,border:`1px solid ${color}33`}}>
                    {t}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="font-body text-sm leading-relaxed max-w-sm" style={{color:"rgba(180,150,255,0.8)"}}>
                {result.description}
              </p>

              {/* Actions */}
              <div className="flex gap-3 w-full">
                <button onClick={handleRetry}
                  className="flex-1 py-3 rounded-xl font-body text-sm transition-colors"
                  style={{border:"1px solid rgba(120,80,255,0.25)",color:"rgba(150,120,255,0.7)"}}>
                  🔄 Coba Lagi
                </button>
                <button onClick={onClose}
                  className="flex-1 py-3 rounded-xl font-body font-bold text-sm"
                  style={{background:`linear-gradient(135deg,${color},${color}99)`,color:"#fff"}}>
                  Lihat Pokédex →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
