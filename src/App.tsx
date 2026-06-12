import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Music, 
  Pause, 
  Play, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Calendar, 
  Compass, 
  Flame, 
  RotateCcw, 
  Upload, 
  X, 
  Settings, 
  Check,
  ChevronDown,
  Globe
} from 'lucide-react';

// ==========================================
// ❤️ DESIGNED TYPES & LIST DATA FOR THE MEMORY JAR
// ==========================================
interface ClickedHeart {
  id: number;
  x: number;
  y: number;
  angle: number;
  scale: number;
  color: string;
}

const LOVE_QUOTES = [
  "Agradeço a Deus todos os dias por ter me dado o anjo mais lindo para guiar e segurar minha mão.",
  "Com você, cada dificuldade se transforma em uma linda oportunidade de provar o nosso compromisso.",
  "Sou contente por conhecer cada maravilha de Deus ao seu lado, descobrindo o mundo de mãos dadas.",
  "Ana Redmerski, o seu amor me aquece nos dias mais frios e clareia os momentos mais tempestuosos da nossa caminhada.",
  "Passado, presente, futuro... Todas as estradas me guiam para o mesmo destino: você, meu anjinho.",
  "Nosso amor é uma história linda e complicada, mas que no final sempre se transforma na mais bela alegria.",
  "Segurar a sua mão é a certeza de que Deus me deu o porto seguro que eu sempre precisei.",
  "Estamos construindo uma trajetória eterna, cheia de bonanças, superações e sorrisos.",
  "Não importa a distância ou o caminho, prometo estar ao seu lado até o FIM. ❤️",
  "Você é a minha maravilhosa mulher, a rainha dos meus melhores sonhos e a realidade mais doce."
];

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [bgImage, setBgImage] = useState('IMG_2330.jpg');
  const [bgOpacity, setBgOpacity] = useState(0.40); // Standard background opacity
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [anniversaryDate, setAnniversaryDate] = useState('2021-06-12'); // Standard romantic Brazilian lovers day fallback
  const [clickedHearts, setClickedHearts] = useState<ClickedHeart[]>([]);
  const [activeQuote, setActiveQuote] = useState(LOVE_QUOTES[0]);
  const [showSettings, setShowSettings] = useState(false);
  const [isHoveredQuoteJar, setIsHoveredQuoteJar] = useState(false);
  const [poteSparkle, setPoteSparkle] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize dynamic time counter
  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const start = new Date(anniversaryDate);
      let diffMs = now.getTime() - start.getTime();

      if (diffMs < 0) {
        setTimeElapsed({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      // Exact mathematical breakdowns
      const startYear = start.getFullYear();
      const nowYear = now.getFullYear();
      let years = nowYear - startYear;
      
      let startMonth = start.getMonth();
      let nowMonth = now.getMonth();
      let months = nowMonth - startMonth;
      
      let startDate = start.getDate();
      let nowDate = now.getDate();
      let days = nowDate - startDate;

      if (days < 0) {
        months--;
        // Get remaining days of the prior month
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
      }

      if (months < 0) {
        years--;
        months += 12;
      }

      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      // For exact live hours/minutes count:
      const startHours = start.getHours();
      const startMinutes = start.getMinutes();
      const startSeconds = start.getSeconds();

      let diffHours = hours - startHours;
      let diffMinutes = minutes - startMinutes;
      let diffSeconds = seconds - startSeconds;

      if (diffSeconds < 0) {
        diffMinutes--;
        diffSeconds += 60;
      }
      if (diffMinutes < 0) {
        diffHours--;
        diffMinutes += 60;
      }
      if (diffHours < 0) {
        // days are already adjusted by Date library
        diffHours += 24;
      }

      setTimeElapsed({
        years: Math.max(0, years),
        months: Math.max(0, months),
        days: Math.max(0, days),
        hours: Math.max(0, diffHours),
        minutes: Math.max(0, diffMinutes),
        seconds: Math.max(0, diffSeconds)
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [anniversaryDate]);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Handle local music volume settings
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicVolume;
    }
  }, [musicVolume]);

  const handleOpenLetter = () => {
    setIsOpen(true);
    setIsPlayingMusic(true);
    triggerQuoteJar();
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.log("Audio play on letter open state blocked or failed:", err);
      });
    }
  };

  const handleToggleMusic = () => {
    if (audioRef.current) {
      if (isPlayingMusic) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          console.log("Audio play on toggle failed:", err);
        });
      }
    }
    setIsPlayingMusic(!isPlayingMusic);
  };

  // Click-to-heart particle spawner
  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Avoid triggering hearts on interactive controls clicking
    if ((e.target as HTMLElement).closest('button') || 
        (e.target as HTMLElement).closest('input') || 
        (e.target as HTMLElement).closest('a') ||
        (e.target as HTMLElement).closest('.settings-overlay')) {
      return;
    }

    const colors = ['#c19a6b', '#dfba8e', '#a37b4c', '#fdf2f2', '#f43f5e', '#ec4899'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newHeart: ClickedHeart = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY,
      angle: (Math.random() - 0.5) * 40, // mild tilt
      scale: 0.5 + Math.random() * 0.8,
      color: randomColor
    };

    setClickedHearts(prev => [...prev, newHeart]);

    // Retain only elements currently in animation to prevent massive state memory leaks
    setTimeout(() => {
      setClickedHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1200);
  };

  // Image load helper
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBgImage(url);
    }
  };

  // Trigger next romantic wisdom inside the quote jar
  const triggerQuoteJar = () => {
    setPoteSparkle(true);
    const unfilteredList = LOVE_QUOTES.filter(q => q !== activeQuote);
    const random = unfilteredList[Math.floor(Math.random() * unfilteredList.length)];
    setActiveQuote(random);
    setTimeout(() => setPoteSparkle(false), 800);
  };

  return (
    <div 
      id="valentines-app-root"
      className="min-h-screen bg-dark-romantic text-warm-light flex flex-col justify-between overflow-x-hidden relative select-none font-sans"
      onClick={handleScreenClick}
    >
      {/* Hidden audio player targeting musica.mp3 */}
      <audio autoPlay id="musica-fundo" ref={audioRef} loop className="hidden">
        <source src="musica.mp3" type="audio/mpeg" />
        Seu navegador não suporta o elemento de áudio.
      </audio>

      {/* Elegant thick border overlay framing the layout */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none border-[12px] sm:border-[20px] md:border-[32px] border-dark-romantic z-35" />

      {/* ================= BACKGROUND IMAGE LAYER WITH OPACITY CONTROLS ================= */}
      <div 
        id="bg-image-wrapper"
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none transition-all duration-700 ease-out"
      >
        <img 
          id="bg-image-element"
          src={bgImage} 
          onError={() => {
            // Safe fallback if target photofile isn't in build files folder yet
            console.log('Background IMG_2330.jpg not found locally in applet root. Using CSS romantic aurora.');
          }}
          style={{ opacity: bgOpacity }}
          className="w-full h-full object-cover select-none scale-105 filter blur-[0.5px] contrast-125 animate-slow-pan transition-all duration-700"
          alt="Valentine Couple Background"
          referrerPolicy="no-referrer"
        />
        {/* Soft, sophisticated gradient washes over the picture */}
        <div id="bg-overlay-tint" className="absolute inset-0 bg-gradient-to-t from-dark-romantic via-transparent to-dark-romantic opacity-85 mix-blend-multiply" />
        
        {/* Animated ambient cosmic dust backing */}
        <div id="ambient-radial-glow" className="absolute top-[20%] left-[30%] w-[45vw] h-[45vw] bg-gold-accent/5 rounded-full blur-[120px] animate-soft-pulse pointer-events-none" />
        <div id="ambient-radial-glow-secondary" className="absolute bottom-[20%] right-[25%] w-[35vw] h-[35vw] bg-rose-950/10 rounded-full blur-[100px] animate-soft-pulse pointer-events-none" style={{ animationDelay: '3s' }} />
      </div>

      {/* ================= STATIC CONSTANT FLOATING HEARTS (BACKGROUND LAYER) ================= */}
      <div id="bg-floating-hearts" className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {[...Array(12)].map((_, i) => {
          const delay = i * 2.1;
          const left = 5 + (i * 8.5);
          const size = 15 + (i % 3) * 14;
          const colorClass = i % 2 === 0 ? 'text-gold-accent/15' : 'text-warm-light/10';
          return (
            <div
              key={`heart-float-${i}`}
              className={`absolute animate-float-up pointer-events-none ${colorClass}`}
              style={{
                left: `${left}%`,
                animationDelay: `${delay}s`,
                fontSize: `${size}px`,
                bottom: '-50px'
              }}
            >
              ❤️
            </div>
          );
        })}
      </div>

      {/* ================= SPARKLE CLICK-BURST EVENT LAYER ================= */}
      <div id="click-particles-layer" className="absolute inset-0 overflow-hidden pointer-events-none z-40">
        <AnimatePresence>
          {clickedHearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{ opacity: 1, scale: 0.2, x: heart.x, y: heart.y }}
              animate={{ 
                opacity: 0, 
                scale: heart.scale,
                y: heart.y - 140, // floats up rapidly
                x: heart.x + (Math.random() - 0.5) * 80,
                rotate: heart.angle
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute pointer-events-none text-2xl select-none"
              style={{ color: heart.color }}
            >
              ❤️
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ================= HEADER BAR AREA ================= */}
      <header id="app-header-bar" className="w-full px-6 py-4 flex items-center justify-between z-40 pointer-events-auto max-w-7xl mx-auto md:px-12 mt-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="p-2 bg-gold-accent/10 rounded-full border border-gold-accent/25 backdrop-blur-md">
            <Heart className="w-5 h-5 text-gold-accent fill-gold-accent animate-pulse" />
          </div>
          <span className="font-cursive text-gold-accent text-3xl font-medium tracking-wide drop-shadow">
            Para meu Amor
          </span>
        </motion.div>

        <div className="flex items-center gap-3">
          {/* Audio Synthesizer toggle */}
          {isOpen && (
            <motion.button
              id="music-toggle-btn"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleMusic}
              className={`p-2.5 rounded-full border backdrop-blur-md transition-all duration-300 ${
                isPlayingMusic 
                ? 'bg-gold-accent/20 hover:bg-gold-accent/30 border-gold-accent/40 text-gold-accent' 
                : 'bg-stone-900/40 hover:bg-stone-900/60 border-stone-800/50 text-stone-300'
              }`}
              title="Música de Fundo"
            >
              {isPlayingMusic ? <Music className="w-5 h-5 text-gold-accent animate-spin" style={{ animationDuration: '4s' }} /> : <Music className="w-5 h-5 text-stone-300" />}
            </motion.button>
          )}

          {/* Quick Settings Icon */}
          <button
            id="settings-trigger-btn"
            onClick={() => setShowSettings(!showSettings)}
            className="p-2.5 rounded-full bg-stone-900/40 hover:bg-stone-900/60 border border-stone-800/50 backdrop-blur-md text-gold-accent transition-all duration-300"
            title="Ajustes e Foto"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ================= MAIN INTERACTIVE WORKSPACE ================= */}
      <main id="main-envelope-wrapper" className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 flex flex-col justify-center items-center z-20">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* ==========================================
               ✉️ ENVELOPE (CLOSED INITIAL FRAME WITH WAX SEAL)
               ========================================== */
            <motion.div
              id="envelope-root"
              key="envelope"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0, y: -50 }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
              className="w-full max-w-xl aspect-[1.4/1] bg-dark-romantic/85 border-2 border-gold-accent/20 p-6 rounded-sm shadow-2xl relative flex flex-col justify-between items-center backdrop-blur-xl overflow-hidden"
              style={{
                boxShadow: '0 25px 50px -12px rgba(193, 154, 107, 0.15)'
              }}
            >
              {/* Elegant golden corner bracket ornaments on the envelope preview */}
              <div className="absolute top-4 left-4 w-16 h-16 border-l border-t border-gold-accent/40 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-16 h-16 border-r border-b border-gold-accent/40 pointer-events-none" />

              {/* Retro Classic Double Border styling */}
              <div className="absolute inset-3 border border-dashed border-gold-accent/20 rounded-sm pointer-events-none" />
              <div className="absolute inset-4 border border-gold-accent/10 rounded-sm pointer-events-none" />

              <div className="flex flex-col items-center text-center mt-6 z-10">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="mb-3 text-gold-accent"
                >
                  <Sparkles className="w-7 h-7 mx-auto stroke-[1.5] text-gold-accent animate-pulse" />
                </motion.div>
                <h1 className="font-serif text-3xl font-light tracking-[0.1em] text-gold-accent mb-1 uppercase">
                  Cartão Especial
                </h1>
                <p className="font-sans text-[9px] tracking-[0.2em] text-warm-light/60 font-semibold uppercase px-4 py-1 bg-gold-accent/5 rounded-none border border-gold-accent/15">
                  Para o Amor da Minha Vida
                </p>
              </div>

              {/* WAX SEAL (INTERACTIVE EMBLEM IN CENTER) */}
              <div className="flex flex-col items-center z-20 mb-4">
                <motion.button
                  id="wax-seal-button"
                  onClick={handleOpenLetter}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.93 }}
                  className="w-20 h-20 bg-gradient-to-br from-rose-950 via-rose-900 to-stone-950 rounded-full relative flex items-center justify-center cursor-pointer shadow-lg group focus:outline-none"
                  style={{
                    boxShadow: '0 10px 25px -5px rgba(193, 154, 107, 0.3), inset 0 3px 6px rgba(193, 154, 107, 0.2)',
                    border: '2px solid #c19a6b'
                  }}
                >
                  {/* Outer delicate seal ring */}
                  <div className="absolute inset-1 border border-gold-accent/20 rounded-full border-dashed" />
                  <Heart className="w-8 h-8 text-gold-accent fill-gold-accent/90 group-hover:scale-110 transition-transform duration-300 animate-pulse" />
                  
                  {/* Subtle sparkling glow circles */}
                  <div className="absolute -inset-1 border border-gold-accent/10 rounded-full animate-soft-pulse" />
                </motion.button>
                <span className="text-gold-accent font-sans font-semibold uppercase tracking-[0.2em] mt-3.5 animate-pulse bg-gold-accent/5 px-3 py-1 rounded-none text-[9px] border border-gold-accent/15">
                  Toque no Selo para Abrir
                </span>
              </div>

              {/* Cute stamps detailing */}
              <div className="absolute top-4 right-4 w-12 h-14 border border-gold-accent/25 rounded-none flex flex-col justify-center items-center p-1 bg-dark-romantic/60 select-none">
                <Heart className="w-4 h-4 text-gold-accent stroke-[1.5]" />
                <span className="text-[7px] text-gold-accent font-mono font-bold mt-1">LOVE-12</span>
              </div>
              <div className="absolute bottom-4 left-6 text-left">
                <p className="font-cursive text-gold-accent/40 text-xl leading-none">Com amor,</p>
                <p className="font-serif text-[10px] uppercase font-bold text-warm-light/30 tracking-[0.2em] leading-none mt-1">Até o Fim</p>
              </div>
            </motion.div>
          ) : (
            /* ==========================================
               💝 OPENED CARD FRAME (ROYAL ROMANTIC CORE DESIGN)
               ========================================== */
            <motion.div
              id="opened-card-container"
              key="card"
              initial={{ opacity: 0, y: 70, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 80, damping: 14 }}
              className="w-full max-w-2xl bg-dark-romantic/60 border border-gold-accent/20 p-6 sm:p-10 rounded-sm relative flex flex-col items-center backdrop-blur-md shadow-2xl animate-float-card animate-duration-[6000ms]"
              style={{
                boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.55)'
              }}
            >
              {/* Outer Golden Double Border framing layout */}
              <div className="absolute inset-3 border border-gold-accent/15 pointer-events-none" />
              <div className="absolute inset-[15px] border border-gold-accent/5 pointer-events-none" />
              
              {/* Grand classic corner bracket structures from Sophisticated Dark design */}
              <div className="absolute top-6 left-6 w-32 h-32 border-l border-t border-gold-accent/40 pointer-events-none hidden sm:block" />
              <div className="absolute bottom-6 right-6 w-32 h-32 border-r border-b border-gold-accent/40 pointer-events-none hidden sm:block" />
              
              {/* Responsive smaller corner brackets for extreme mobile screens */}
              <div className="absolute top-4 left-4 w-12 h-12 border-l border-t border-gold-accent/40 pointer-events-none sm:hidden" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-r border-b border-gold-accent/40 pointer-events-none sm:hidden" />

              {/* Romantic Title Greeting */}
              <div className="text-center z-10 w-full mb-8 pt-4">
                <h1 className="font-serif font-light italic tracking-[0.18em] text-gold-accent text-3xl sm:text-4xl uppercase block mb-3 drop-shadow-md">
                  Para a Minha Eterna Namorada
                </h1>
                <span className="font-cursive text-warm-light/95 text-3xl leading-none block mb-1">
                  Minha Maravilhosa Mulher,
                </span>
                <span className="text-[9px] font-sans font-bold text-gold-accent/80 uppercase tracking-[0.25em] bg-gold-accent/5 px-4 py-1.5 rounded-none border border-gold-accent/20 inline-block mt-1">
                  Para o Amor da Minha Vida
                </span>
              </div>

              {/* ================= CORE PORTUGUESE VALENTINES MESSAGE ================= */}
              <div 
                id="message-panel" 
                className="w-full text-center px-4 sm:px-6 relative z-10 leading-[1.85] font-serif text-warm-light/95 text-[15px] sm:text-[17px] tracking-wide"
              >
                {/* Floating Highlights & exact text block */}
                <p className="indent-4 mb-5 text-justify hover:text-warm-light transition-colors duration-300">
                  <span className="font-semibold text-gold-accent">Para o amor da minha vida</span>, minha maravilhosa mulher. 
                  Obrigado por estar comigo em todos os momentos, você é a pessoa que <span className="underline decoration-gold-accent decoration-wavy underline-offset-4 font-semibold text-gold-accent font-medium">sempre está segurando a minha mão</span> e me ajudando a conquistar as boas coisas que Deus tem para nos oferecer.
                </p>
                <p className="indent-4 mb-5 text-justify hover:text-warm-light transition-colors duration-300">
                  Com esse amor que me aquece, vamos possuir as bonanças da vida e viajar pelo mundo conhecendo as maravilhas de Deus, agradecendo pela nossa trajetória linda e complicada que a cada dificuldade se transformou em uma história de alegria para ser contada.
                </p>
                
                {/* Powerful emotional conclusion */}
                <p className="mt-8 mb-6 text-center font-cursive text-gold-accent text-5xl leading-none py-3 bg-gradient-to-r from-transparent via-gold-accent/5 to-transparent border-y border-gold-accent/20">
                  te amo meu anjinho
                </p>
                <div className="flex flex-col items-center justify-center mt-6">
                  <p className="font-sans font-extrabold text-xs uppercase tracking-[0.25em] text-gold-accent flex items-center justify-center gap-2">
                    <Flame className="w-4 h-4 text-gold-accent fill-gold-accent" />
                    Estamos juntos até o FIM. ❤️🔥😏
                  </p>
                  
                  {/* Decorative vintage spacing dots from Design HTML */}
                  <div className="flex justify-center mt-5 mb-2">
                    <div className="w-1.5 h-1.5 bg-gold-accent rounded-full mx-1"></div>
                    <div className="w-1.5 h-1.5 bg-gold-accent/50 rounded-full mx-1"></div>
                    <div className="w-1.5 h-1.5 bg-gold-accent/25 rounded-full mx-1"></div>
                  </div>
                </div>
              </div>

              {/* ================= INTERACTIVE MEMORY JAR ================= */}
              <div 
                id="interactive-gratitude-jar" 
                className="w-full mt-8 bg-gold-accent/5 border border-gold-accent/15 rounded-none p-5 text-center z-10 hover:bg-gold-accent/10 hover:border-gold-accent/25 transition-all duration-300 relative cursor-pointer"
                onMouseEnter={() => setIsHoveredQuoteJar(true)}
                onMouseLeave={() => setIsHoveredQuoteJar(false)}
                onClick={triggerQuoteJar}
              >
                {/* Sparkly overlay */}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Sparkles className={`w-4 h-4 text-gold-accent ${isHoveredQuoteJar ? 'animate-bounce' : 'animate-pulse'}`} />
                </div>
                
                <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-gold-accent bg-dark-romantic/90 border border-gold-accent/20 px-3.5 py-1.5 rounded-none inline-block mb-3">
                  ✦ Pote de Promessas de Amor ✦
                </span>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={activeQuote}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="font-serif italic font-light text-xs sm:text-[13px] text-warm-light/90 leading-relaxed px-4 min-h-[44px] flex items-center justify-center"
                  >
                    "{activeQuote}"
                  </motion.p>
                </AnimatePresence>

                <p className="text-[8px] font-sans text-gold-accent/50 uppercase tracking-[0.2em] mt-2.5">
                  Aperte para tirar outra mensagem ❤️
                </p>
              </div>

              {/* Playback indicator details */}
              {isPlayingMusic && (
                <div className="mt-5 flex items-center gap-1.5 text-gold-accent/60 z-10">
                  <div className="w-1.5 h-1.5 bg-gold-accent rounded-full animate-ping" />
                  <span className="font-mono text-[9px] uppercase tracking-wider animate-pulse">Reproduzindo Melodia de Amor</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ================= SETTINGS TRADI/DRAWER (OPACITY & CUSTOM IMAGE LOAD FALLBACK) ================= */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            id="settings-drawer-root"
            initial={{ y: 250, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 250, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 105, damping: 14 }}
            className="w-full bg-dark-romantic border-t border-gold-accent/25 backdrop-blur-2xl px-6 py-6 text-warm-light z-55 relative footer-controls select-none"
            style={{
              boxShadow: '0 -15px 40px -10px rgba(0,0,0,0.6)'
            }}
          >
            <div className="max-w-xl mx-auto flex flex-col gap-5 settings-overlay">
              {/* Settings Header */}
              <div className="flex items-center justify-between border-b border-gold-accent/15 pb-3">
                <span className="font-serif font-light tracking-[0.1em] text-gold-accent text-lg flex items-center gap-1.5 uppercase">
                  <Settings className="w-5 h-5 text-gold-accent" />
                  Ajustes do Painel
                </span>
                <button
                  id="close-settings-btn"
                  onClick={() => setShowSettings(false)}
                  className="p-1 rounded-none border border-gold-accent/20 bg-stone-900 hover:bg-stone-800 text-gold-accent transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Custom Uploader: drag & drop layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-gold-accent/80">
                    Foto do Casal (IMG_2330.jpg)
                  </label>
                  <p className="text-[9px] text-warm-light/50 mb-1.5 leading-normal">
                    Atualize a imagem de fundo enviando sua foto direta.
                  </p>
                  
                  <button
                    id="trigger-file-upload"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-gold-accent/5 hover:bg-gold-accent/10 border border-gold-accent/25 rounded-none text-gold-accent text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    Importar Imagem
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Opacity slider */}
                <div className="flex flex-col justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-gold-accent/80">
                        Opacidade do Fundo
                      </label>
                      <span className="font-mono text-[10px] bg-gold-accent/10 text-gold-accent px-1.5 py-0.5 rounded-none border border-gold-accent/20 font-bold">
                        {Math.round(bgOpacity * 100)}%
                      </span>
                    </div>
                    <p className="text-[9px] text-warm-light/50 mb-1.5 leading-normal">
                      Ajuste para dar mais destaque à foto ou melhorar a leitura.
                    </p>
                    <input
                      id="bg-opacity-input"
                      type="range"
                      min="0.10"
                      max="1.00"
                      step="0.05"
                      value={bgOpacity}
                      onChange={(e) => setBgOpacity(parseFloat(e.target.value))}
                      className="w-full accent-gold-accent cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Customizers: Music volume */}
              <div className="border-t border-gold-accent/15 pt-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-gold-accent/80">
                      Volume da Música Box
                    </label>
                    <span className="font-mono text-[9px] font-bold text-gold-accent">
                      {Math.round(musicVolume * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <VolumeX className="w-3.5 h-3.5 text-warm-light/40" />
                    <input
                      id="music-volume-input"
                      type="range"
                      min="0.0"
                      max="0.8"
                      step="0.05"
                      value={musicVolume}
                      onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                      className="w-full accent-gold-accent cursor-pointer"
                    />
                    <Volume2 className="w-3.5 h-3.5 text-gold-accent" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= COMPACT FOOTER DETAILS ================= */}
      <footer id="app-footer-credit" className="w-full text-center py-4 z-20 pointer-events-none mb-4">
        <p className="font-serif italic text-[11px] text-gold-accent/65 tracking-[0.05em]">
          "O amor tudo sofre, tudo crê, tudo espera, tudo suporta" — 1 Coríntios 13:7
        </p>
      </footer>
    </div>
  );
}
