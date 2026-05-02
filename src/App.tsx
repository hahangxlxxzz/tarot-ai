import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform, useMotionValueEvent } from 'motion/react';
import Markdown from 'react-markdown';
import { 
  Sparkles, 
  History, 
  Settings, 
  Layers, 
  Diamond, 
  Zap, 
  PenTool, 
  Moon, 
  Sun, 
  User as UserIcon, 
  Share2, 
  Bookmark, 
  RefreshCcw, 
  Save, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
  Stars as StarsIcon,
  Menu,
  Info,
  MessageSquare,
  Send,
  CheckCircle2,
  Music,
  Music2
} from 'lucide-react';
import { cn } from './lib/utils';
import { Button, GlassCard, SectionTitle } from './components/UI';
import { generateDeck, shuffleDeck, TarotCard, ReadingCard, SPREADS } from './lib/tarot';
import { CARD_IMAGES } from './lib/cardImages';
import { streamTarotInterpretation, getChatSession } from './services/gemini';
import { useAuth, FirebaseProvider } from './components/FirebaseProvider';
import { db, signInWithGoogle, handleFirestoreError, OperationType } from './firebase';
import { collection, addDoc, getDocs, orderBy, query, where, Timestamp } from 'firebase/firestore';

import { useTranslation } from 'react-i18next';

const SpaceBackground = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const layers = useMemo(() => {
    const starLayers = [30, 40, 30].map((count, layerIdx) => 
      Array.from({ length: count }).map((_, i) => ({
        id: `layer-${layerIdx}-star-${i}`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: `${3 + Math.random() * 5}s`,
        delay: `${Math.random() * 10}s`,
        opacity: 0.1 + Math.random() * 0.7,
        size: `${(layerIdx + 1) * (Math.random() * 1.5 + 0.5)}px`,
      }))
    );

    const nebulaeData = Array.from({ length: 4 }).map((_, i) => ({
      id: `nebula-${i}`,
      left: `${Math.random() * 80 + 10}%`,
      top: `${Math.random() * 80 + 10}%`,
      size: `${300 + Math.random() * 400}px`,
      color: i % 2 === 0 ? 'rgba(197, 160, 89, 0.1)' : 'rgba(100, 100, 150, 0.08)',
      duration: `${20 + Math.random() * 20}s`,
    }));

    const shootingStarsData = Array.from({ length: 3 }).map((_, i) => ({
      id: `shooting-star-${i}`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 50}%`,
      duration: `${4 + Math.random() * 6}s`,
      delay: `${Math.random() * 15}s`,
    }));

    return { starLayers, nebulaeData, shootingStarsData };
  }, []);

  const galaxies = useMemo(() => Array.from({ length: 3 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: `${80 + Math.random() * 80}s`,
  })), []);

  return (
    <div className="stars-container">
      <div className="cosmic-dust" />
      
      {/* Background Layer (Galaxies) */}
      <div 
        className="parallax-layer" 
        style={{ transform: `translate(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px)` }}
      >
        {galaxies.map((g) => (
          <div
            key={`galaxy-${g.id}`}
            className="galaxy"
            style={{
              left: g.left,
              top: g.top,
              '--duration': g.duration,
            } as any}
          />
        ))}
      </div>

      {/* Middle Layer (Nebulae) */}
      <div 
        className="parallax-layer" 
        style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}
      >
        {layers.nebulaeData.map((n) => (
          <div
            key={n.id}
            className="nebula"
            style={{
              left: n.left,
              top: n.top,
              width: n.size,
              height: n.size,
              backgroundColor: n.color,
              '--duration': n.duration,
            } as any}
          />
        ))}
      </div>

      {/* Star Layers */}
      {layers.starLayers.map((stars, idx) => (
        <div 
          key={`layer-${idx}`}
          className="parallax-layer" 
          style={{ transform: `translate(${mousePos.x * (idx + 1) * 0.8}px, ${mousePos.y * (idx + 1) * 0.8}px)` }}
        >
          {stars.map((star) => (
            <div
              key={star.id}
              className="star"
              style={{
                left: star.left,
                top: star.top,
                width: star.size,
                height: star.size,
                '--duration': star.duration,
                '--delay': star.delay,
                '--opacity': star.opacity,
              } as any}
            />
          ))}
        </div>
      ))}

      {/* Shooting Stars (Fastest) */}
      <div className="parallax-layer">
        {layers.shootingStarsData.map((s) => (
          <div
            key={s.id}
            className="shooting-star"
            style={{
              left: s.left,
              top: s.top,
              '--duration': s.duration,
              '--delay': s.delay,
            } as any}
          />
        ))}
      </div>
    </div>
  );
};

const ConstellationMap = () => {
  const points = useMemo(() => Array.from({ length: 12 }).map(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100
  })), []);

  return (
    <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
      {points.map((p, i) => (
        <React.Fragment key={i}>
          <circle cx={p.x} cy={p.y} r="0.5" fill="var(--color-primary)" />
          {i > 0 && (
            <motion.line 
              x1={points[i-1].x} y1={points[i-1].y} 
              x2={p.x} y2={p.y} 
              className="constellation-line"
              strokeWidth="0.1"
            />
          )}
        </React.Fragment>
      ))}
    </svg>
  );
};

const JourneyInput = ({ question, setQuestion, onAsk, onDraw, currentLang, t }: any) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.1, y: -20 }}
      className="max-w-2xl w-full p-8 sm:p-12 glass-morphism rounded-3xl shadow-[0_0_60px_rgba(197,160,89,0.15)] flex flex-col items-center gap-8 relative overflow-hidden"
    >
      <div className="absolute inset-0 atmosphere opacity-20 pointer-events-none" />
      
      <div className="text-center group relative z-10 w-full px-2">
        <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.5em] text-primary font-bold mb-2 sm:mb-4 block ritual-text">
          {t('reading.spiritual_journey')}
        </span>
        <h3 className="text-lg sm:text-4xl font-serif italic text-secondary mb-6 sm:mb-10 leading-tight gold-text-gradient ritual-text">
          {t('reading.guiding_path')}
        </h3>
        
        <div className="relative w-full mb-8 sm:mb-12">
          <input 
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="..."
            className="w-full bg-surface-container/60 border-b-2 border-primary/20 p-3 sm:p-6 text-center text-secondary font-serif italic text-base sm:text-xl focus:border-primary outline-none transition-all placeholder:opacity-20 backdrop-blur-sm rounded-t-2xl"
          />
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full">
          <button 
            onClick={onDraw}
            className="w-full sm:w-auto relative px-6 sm:px-12 py-3 sm:py-5 bg-surface-container/90 border-2 border-primary/40 rounded-full text-primary font-serif italic text-base sm:text-xl shadow-2xl hover:scale-105 active:scale-95 hover:border-primary transition-all flex items-center justify-center gap-2 sm:gap-4 backdrop-blur-xl group cursor-pointer"
          >
            <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 animate-pulse" />
            <span className="relative z-10 font-bold tracking-wider text-sm sm:text-base">{t('reading.draw_button')}</span>
          </button>

          <button 
            onClick={onAsk}
            className="w-full sm:w-auto relative px-6 sm:px-12 py-3 sm:py-5 bg-primary text-surface-dim rounded-full font-serif italic text-base sm:text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 sm:gap-4 group cursor-pointer"
          >
            <PenTool className="w-4 h-4 sm:w-6 sm:h-6" />
            <span className="relative z-10 font-bold tracking-wider text-sm sm:text-base">{t('reading.ask')}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const TarotApp = () => {
  const { t, i18n } = useTranslation();
  const { user, isAuthReady } = useAuth();
  const [activeSpread, setActiveSpread] = useState(SPREADS.THREE_CARD);
  const [deck, setDeck] = useState<TarotCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<ReadingCard[]>([]);
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [isDealing, setIsDealing] = useState(false);
  const [interpretation, setInterpretation] = useState('');
  const [isReadingComplete, setIsReadingComplete] = useState(false);
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [isConversationsListOpen, setIsConversationsListOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInterpretationModalOpen, setIsInterpretationModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const chatToggleButtonRef = useRef<HTMLButtonElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model'; content: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [currentReadingId, setCurrentReadingId] = useState<string | null>(null);
  const chatSessionRef = useRef<any>(null);

  // Carousel State
  const carouselDragX = useMotionValue(0);
  const carouselControls = useAnimation();
  const [isCarouselDragging, setIsCarouselDragging] = useState(false);

  // High-performance SNAP logic
  const snapToCard = useCallback((velocity = 0) => {
    const total = selectedCards.length;
    if (total <= 1) {
      carouselControls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } });
      return;
    }

    const arcRange = total <= 5 ? 120 : 360;
    const angleStep = arcRange / Math.max(total - 1, 1);
    const startAngle = total <= 1 ? 0 : (total <= 5 ? -arcRange / 2 : 0);
    
    const currentX = carouselDragX.get();
    const projectedX = currentX + velocity * 0.1;
    const projectedRot = projectedX * 0.4;

    let closestIdx = 0;
    let minDiff = Infinity;
    for (let i = 0; i < total; i++) {
      const base = startAngle + i * angleStep;
      const diff = Math.abs((projectedRot + base) % 360);
      const normalizedDiff = Math.min(diff, 360 - diff);
      if (normalizedDiff < minDiff) {
        minDiff = normalizedDiff;
        closestIdx = i;
      }
    }
    
    const finalTargetRotation = -(startAngle + closestIdx * angleStep);
    const finalTargetX = finalTargetRotation / 0.4;

    carouselControls.start({
      x: finalTargetX,
      transition: { type: "spring", stiffness: 200, damping: 25 }
    });
  }, [selectedCards, carouselControls, carouselDragX]);

  // Audio refs for mystical feedback
  const shuffleSound = useRef<HTMLAudioElement | null>(null);
  const cardFlickSound = useRef<HTMLAudioElement | null>(null);
  const oracleHumSound = useRef<HTMLAudioElement | null>(null);
  const magicRevealSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    shuffleSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2364/2364-preview.mp3'); // Mystical shimmer/ritual
    cardFlickSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/611/611-preview.mp3'); // Magic appear/deal
    oracleHumSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'); // Deep mystic resonance/AI
    magicRevealSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'); // Magic chime/swish
    
    if (shuffleSound.current) shuffleSound.current.volume = 0.2;
    if (cardFlickSound.current) cardFlickSound.current.volume = 0.3;
    if (oracleHumSound.current) oracleHumSound.current.volume = 0.15;
    if (magicRevealSound.current) magicRevealSound.current.volume = 0.3;
  }, []);

  const playSound = (sound: React.RefObject<HTMLAudioElement | null>) => {
    if (sound && sound.current) {
      sound.current.currentTime = 0;
      sound.current.play().catch(() => {}); // Catch browser auto-play blocks
    }
  };
  
  const [aiSettings, setAiSettings] = useState(() => {
    const saved = localStorage.getItem('astra_oracle_settings');
    return saved ? JSON.parse(saved) : { model: 'gemini-3-flash-preview', apiKey: '' };
  });
  
  const [isMusicEnabled, setIsMusicEnabled] = useState(false);
  const bgMusic = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Elegant ambient background music
    bgMusic.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2645/2645-preview.mp3'); // Smooth cosmic ambient
    if (bgMusic.current) {
      bgMusic.current.loop = true;
      bgMusic.current.volume = 0.15;
    }
    
    return () => {
      bgMusic.current?.pause();
    };
  }, []);

  const toggleMusic = () => {
    if (bgMusic.current) {
      if (isMusicEnabled) {
        bgMusic.current.pause();
      } else {
        bgMusic.current.play().catch(e => console.log("Audio play blocked", e));
      }
      setIsMusicEnabled(!isMusicEnabled);
    }
  };
  
  const currentLang = i18n.language.startsWith('vi') ? 'vi' : 'en';

  useEffect(() => {
    localStorage.setItem('astra_oracle_settings', JSON.stringify(aiSettings));
  }, [aiSettings]);

  // Logic: Reset reading if spread changes to avoid mixed state
  useEffect(() => {
    setSelectedCards([]);
    setInterpretation('');
    setIsReadingComplete(false);
  }, [activeSpread]);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const toggleLanguage = () => {
    const next = currentLang === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(next);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (isChatOpen && chatRef.current && !chatRef.current.contains(target) && !chatToggleButtonRef.current?.contains(target)) {
        setIsChatOpen(false);
      }
      if (isGuideOpen && guideRef.current && !guideRef.current.contains(target)) {
        setIsGuideOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isChatOpen, isGuideOpen]);

  // WebSocket logic - Removed as it causes errors on standard hosts like Vercel
  // and isn't strictly necessary for the core app functionality.
  
  useEffect(() => {
    setDeck(shuffleDeck(generateDeck()));
  }, []);

  // Update chat session when reading is complete or interpretation changes
  useEffect(() => {
    if (isReadingComplete && interpretation) {
      chatSessionRef.current = getChatSession(
        `User is currently reviewing their interpretation: ${interpretation}. Spread: ${activeSpread.name}. Question: ${question}`,
        currentLang,
        { model: aiSettings.model, apiKey: aiSettings.apiKey, history: chatMessages }
      );
    }
  }, [isReadingComplete, interpretation, currentLang, aiSettings, activeSpread, question]);

  const handleLoadReading = (item: any) => {
    setCurrentReadingId(item.id);
    setQuestion(item.question);
    const spread = Object.values(SPREADS).find(s => s.name === item.spreadType) || SPREADS.THREE_CARD;
    setActiveSpread(spread);
    setSelectedCards(item.cards);
    setInterpretation(item.interpretation);
    setChatMessages(item.chatMessages || []);
    setIsReadingComplete(true);
    setIsHistoryOpen(false);
    carouselDragX.set(0);
    
    // Refresh chat context
    try {
      chatSessionRef.current = getChatSession(item.interpretation, currentLang, { 
        model: aiSettings.model, 
        apiKey: aiSettings.apiKey,
        history: item.chatMessages || []
      });
    } catch (e) {
      console.error("Chat refresh fail", e);
    }
  };

  const handlePrepareReading = () => {
    setSelectedCards([]);
    setInterpretation('');
    setIsReadingComplete(false);
    setIsInterpretationModalOpen(false);
    setCurrentReadingId(null);
    setChatMessages([]);
    carouselDragX.set(0);
  };

  const handleExecuteReading = async () => {
    setInterpretation('');
    setIsReadingComplete(false);
    carouselDragX.set(0);
    setSelectedCards([]);
    
    // Start Dealing Ritual
    setIsDealing(true);
    
    // Play initial mystical sound
    if (magicRevealSound.current) {
      magicRevealSound.current.currentTime = 0;
      magicRevealSound.current.volume = 0.4;
      magicRevealSound.current.play().catch(() => {});
    }
    
    // Draw logic
    const drawn: ReadingCard[] = [];
    const currentDeck = shuffleDeck(generateDeck());
    
    activeSpread.positions.forEach((posName, i) => {
      const card = currentDeck[i];
      drawn.push({
        ...card,
        positionName: posName,
        isReversed: Math.random() > 0.7 
      });
    });
    
    // Ritual Circle Animation - Give time for the cards to "invoc"
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setSelectedCards(drawn);
    setIsDealing(false);
    
    // Play transition sound
    if (cardFlickSound.current) {
       cardFlickSound.current.volume = 0.5;
       cardFlickSound.current.play().catch(() => {});
    }

    // Short pause to allow cards to stabilize
    await new Promise(resolve => setTimeout(resolve, 500));

    setInterpretation(t('reading.analyzing'));
    if (oracleHumSound.current) {
      oracleHumSound.current.volume = 0.3;
      oracleHumSound.current.play().catch(() => {});
    }
    startInterpretation(drawn);
  };

  const startInterpretation = async (cards: ReadingCard[]) => {
    setIsInterpreting(true);
    let fullText = '';
    
    try {
      const stream = streamTarotInterpretation(
        question || t('reading.question_placeholder'), 
        activeSpread.name, 
        cards, 
        currentLang,
        { model: aiSettings.model, apiKey: aiSettings.apiKey }
      );
      
      for await (const chunk of stream) {
        fullText += chunk;
        setInterpretation(fullText);
      }
      
      setIsReadingComplete(true);
      setIsInterpretationModalOpen(true);
      
      // Initialize chat session with the interpretation context
      try {
        chatSessionRef.current = getChatSession(fullText, currentLang, { model: aiSettings.model, apiKey: aiSettings.apiKey });
        setChatMessages([]);
      } catch (e) {
        console.error("Chat session init fail", e);
      }
    } catch (error) {
      console.error('Interpretation failed:', error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      if (errorMsg.includes('API Key missing') || errorMsg.includes('403')) {
        setInterpretation(t('reading.api_key_required', { defaultValue: 'API Key Required' }));
        setIsReadingComplete(true);
        setIsInterpretationModalOpen(true);
      } else {
        setInterpretation(t('reading.error_resting'));
      }
    } finally {
      setIsInterpreting(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    
    const userMsg = chatInput.trim();
    setChatInput('');
    const userMessageObj = { role: 'user' as const, content: userMsg };
    setChatMessages(prev => [...prev, userMessageObj]);
    setIsChatLoading(true);

    try {
      // Initialize if session doesn't exist
      if (!chatSessionRef.current) {
        const dynamicContext = isReadingComplete 
          ? `User is currently reviewing their Tarot reading: ${interpretation}. Question: ${question}`
          : `User is currently at the start or in progress. Spread: ${activeSpread.name}. Question so far: ${question}`;
        
        chatSessionRef.current = getChatSession(dynamicContext, currentLang, { 
          model: aiSettings.model, 
          apiKey: aiSettings.apiKey,
          history: chatMessages
        });
      }

      const result = await chatSessionRef.current.sendMessage({ message: userMsg });
      const text = result.text;
      if (text) {
        const botMessageObj = { role: 'model' as const, content: text };
        setChatMessages(prev => {
          const newMsgs = [...prev, botMessageObj];
          
          // Auto-save if it's a known reading
          if (user && currentReadingId) {
            import('firebase/firestore').then(({ doc, updateDoc }) => {
              updateDoc(doc(db, 'readings', currentReadingId), {
                chatMessages: newMsgs
              }).catch(console.error);
            });
          }
          return newMsgs;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages(prev => [...prev, { role: 'model', content: t('chat.error') }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const saveToHistory = async () => {
    if (!user) {
      signInWithGoogle();
      return;
    }

    try {
      if (currentReadingId) {
        // Update existing reading with chat messages
        const { doc, updateDoc } = await import('firebase/firestore');
        await updateDoc(doc(db, 'readings', currentReadingId), {
          chatMessages: chatMessages
        });
      } else {
        const docRef = await addDoc(collection(db, 'readings'), {
          userId: user.uid,
          question: question || t('reading.question_placeholder'),
          spreadType: activeSpread.name,
          cards: selectedCards.map(c => ({
            id: c.id,
            name: c.name,
            position: c.positionName,
            isReversed: c.isReversed,
            imageUrl: c.imageUrl
          })),
          interpretation,
          chatMessages,
          timestamp: Date.now()
        });
        setCurrentReadingId(docRef.id);
      }
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 3000);
      loadHistory();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'readings');
    }
  };

  const loadHistory = useCallback(async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, 'readings'), 
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHistory(data);
    } catch (err) {
      console.error("Error loading history:", err);
    }
  }, [user]);

  useEffect(() => {
    if (user) loadHistory();
  }, [user, loadHistory]);

  return (
    <div className="h-screen natural-bg flex flex-col lg:flex-row font-sans overflow-hidden">
      <SpaceBackground />
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b border-primary/10 bg-surface-container/80 backdrop-blur-md z-[100] px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> 
            <h2 className="text-primary font-serif italic text-lg">{t('app.title')}</h2>
          </div>
          <div className="flex bg-surface-container-highest/30 border border-primary/10 p-0.5 rounded-full scale-75 origin-left">
            <button 
              onClick={() => i18n.changeLanguage('en')}
              className={cn(
                "px-2 py-0.5 rounded-full text-[8px] font-bold transition-all",
                i18n.language.startsWith('en') ? "bg-primary text-white" : "text-outline"
              )}
            >
              EN
            </button>
            <button 
              onClick={() => i18n.changeLanguage('vi')}
              className={cn(
                "px-2 py-0.5 rounded-full text-[8px] font-bold transition-all",
                i18n.language.startsWith('vi') ? "bg-primary text-white" : "text-outline"
              )}
            >
              VI
            </button>
          </div>
        </div>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-outline">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Floating Header (Right) */}
      <div className="fixed top-20 lg:top-6 right-6 z-50 flex items-center gap-3">
        {isReadingComplete && (
           <Button variant="tertiary" className="rounded-full w-10 h-10 p-0 shadow-lg border-primary/20 bg-surface-container/80 backdrop-blur-md" onClick={() => setIsInterpretationModalOpen(true)}>
              <StarsIcon className="w-4 h-4 text-primary" />
           </Button>
        )}
      </div>

      {/* Sidebar Navigation */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarCollapsed ? 80 : 288 }}
        className="hidden lg:flex flex-col bg-surface-container border-r border-primary/10 pt-8 p-4 pb-8 z-40 fixed h-screen left-0 shadow-2xl transition-all duration-300 overflow-hidden"
      >
        <div className="flex flex-col items-center lg:items-start gap-8 h-full">
          {/* Top Section */}
          <div className="w-full mb-2">
            <div 
              onClick={toggleSidebar}
              className={cn(
                "flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg transition-all cursor-pointer",
                isSidebarCollapsed ? "mx-auto" : "w-full"
              )}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && toggleSidebar()}
            >
              <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
              {!isSidebarCollapsed && (
                <div className="flex items-center justify-between w-full">
                  <h2 className="text-primary font-serif italic text-xl tracking-wide whitespace-nowrap">
                    {t('app.title')}
                  </h2>
                  <div className="flex bg-surface-container-highest/30 border border-primary/10 p-0.5 rounded-full scale-90" onClick={e => e.stopPropagation()}>
                    <button 
                      onClick={() => i18n.changeLanguage('en')}
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[7px] font-bold transition-all",
                        currentLang === 'en' ? "bg-primary text-white" : "text-outline"
                      )}
                    >
                      EN
                    </button>
                    <button 
                      onClick={() => i18n.changeLanguage('vi')}
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[7px] font-bold transition-all",
                        currentLang === 'vi' ? "bg-primary text-white" : "text-outline"
                      )}
                    >
                      VI
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {!isSidebarCollapsed && (
            <p className="text-[10px] text-outline uppercase tracking-[0.2em] -mt-6 opacity-70 whitespace-nowrap px-2">{t('app.subtitle')}</p>
          )}

          <nav className="flex flex-col gap-1 w-full">
            {[
              { id: 'draw', name: t('nav.ritual'), action: () => { handlePrepareReading(); setActiveSpread(SPREADS.DAILY); }, icon: Sparkles, special: true },
              { id: 'daily', name: t('spreads.daily'), spread: SPREADS.DAILY, icon: Zap },
              { id: 'three', name: t('spreads.three'), spread: SPREADS.THREE_CARD, icon: Layers },
              { id: 'celtic', name: t('spreads.celtic'), spread: SPREADS.CELTIC_CROSS, icon: Diamond },
              { id: 'custom', name: t('reading.custom_ritual', { defaultValue: t('spreads.custom') }), spread: SPREADS.DAILY, icon: Moon },
            ].map((item: any) => (
              <button
                key={item.id}
                onClick={() => item.action ? item.action() : setActiveSpread(item.spread)}
                className={cn(
                  "flex items-center gap-4 px-3 py-3 rounded-xl transition-all group text-sm relative",
                  (item.id === 'draw' && activeSpread.id === 'daily') || (item.spread && activeSpread.id === item.spread.id)
                    ? "bg-primary/5 text-primary" 
                    : "text-outline hover:text-secondary hover:bg-white/5"
                )}
                title={isSidebarCollapsed ? item.name : ""}
              >
                <item.icon className={cn("w-5 h-5 flex-shrink-0", item.special && "animate-pulse")} />
                {!isSidebarCollapsed && <span className="font-medium whitespace-nowrap">{item.name}</span>}
                {item.spread && activeSpread.name === item.spread.name && !isSidebarCollapsed && (
                  <motion.div layoutId="sidebar-active" className="absolute left-0 w-1 h-6 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-primary/10 flex flex-col gap-1 w-full">
            <button 
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center gap-4 px-3 py-3 text-outline hover:text-secondary group transition-colors"
              title={t('nav.guide')}
            >
              <Info className="w-5 h-5 flex-shrink-0" />
              {!isSidebarCollapsed && <span className="text-xs uppercase tracking-tighter whitespace-nowrap">{t('nav.guide')}</span>}
            </button>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-4 px-3 py-3 text-outline hover:text-secondary group transition-colors" 
              title={t('nav.settings')}
            >
              <Settings className="w-5 h-5 flex-shrink-0" /> 
              {!isSidebarCollapsed && <span className="text-xs uppercase tracking-tighter whitespace-nowrap">{t('nav.settings')}</span>}
            </button>
            <button 
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-4 px-3 py-3 text-outline hover:text-secondary group transition-colors"
              title={t('nav.archive')}
            >
              <History className="w-5 h-5 flex-shrink-0" /> 
              {!isSidebarCollapsed && <span className="text-xs uppercase tracking-tighter whitespace-nowrap">{t('nav.archive')}</span>}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] lg:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed left-0 top-0 h-screen w-4/5 max-w-[300px] bg-surface-container z-[111] lg:hidden flex flex-col p-6 shadow-2xl border-r border-primary/10"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" /> 
                  <h2 className="text-primary font-serif italic text-xl">{t('app.title')}</h2>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)}><ChevronLeft className="w-6 h-6 text-outline" /></button>
              </div>

              <div className="flex flex-col gap-6">
                 {/* Mobile Spread Selector */}
                 <div className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-outline pl-2 mb-2">Navigation</span>
                    {[
                      { id: 'draw', name: t('nav.ritual'), action: () => { handlePrepareReading(); setActiveSpread(SPREADS.DAILY); }, icon: Sparkles },
                      { id: 'daily', name: t('spreads.daily'), spread: SPREADS.DAILY, icon: Zap },
                      { id: 'three', name: t('spreads.three'), spread: SPREADS.THREE_CARD, icon: Layers },
                      { id: 'celtic', name: t('spreads.celtic'), spread: SPREADS.CELTIC_CROSS, icon: Diamond },
                    ].map((item: any) => (
                      <button
                        key={item.id}
                        onClick={() => { 
                          if (item.action) item.action();
                          else setActiveSpread(item.spread); 
                          setIsMobileMenuOpen(false); 
                        }}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-sm",
                          (item.id === 'draw' && activeSpread.id === 'daily') || (item.spread && activeSpread.id === item.spread.id) ? "bg-primary/10 text-primary" : "text-outline"
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </button>
                    ))}
                 </div>

                 <div className="mt-auto border-t border-primary/10 pt-6 flex flex-col gap-2">
                    <button onClick={() => { setIsGuideOpen(true); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 p-3 text-outline">
                      <Info className="w-5 h-5" /> {currentLang === 'vi' ? 'Hướng dẫn' : 'Guide'}
                    </button>
                    <button onClick={() => { setIsSettingsOpen(true); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 p-3 text-outline">
                      <Settings className="w-5 h-5" /> {t('nav.settings')}
                    </button>
                   <button onClick={() => { setIsHistoryOpen(true); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 p-3 text-outline">
                      <History className="w-5 h-5" /> {t('nav.archive')}
                    </button>
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Board */}
      <main className={cn(
        "flex-1 h-full pt-24 lg:pt-20 pb-12 px-6 lg:px-12 grid grid-cols-1 xl:grid-cols-12 gap-8 relative transition-all duration-300 overflow-y-auto custom-scrollbar",
        isSidebarCollapsed ? "lg:ml-20" : "lg:ml-72"
      )}>
        {/* Global Chat Floating Button */}
        <div className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-[230]">
          <motion.button
            ref={chatToggleButtonRef}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsChatOpen(prev => !prev)}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-primary text-surface-dim rounded-full shadow-[0_0_30px_rgba(197,160,89,0.4)] flex items-center justify-center cursor-pointer relative group border border-primary/40"
          >
            <AnimatePresence mode="wait">
              {isChatOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                  <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.div>
              )}
            </AnimatePresence>
            {!isChatOpen && isReadingComplete && (
               <motion.div 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-primary" 
              />
            )}
            
            {!isChatOpen && (
              <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-surface-container border border-primary/20 rounded text-[10px] uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden sm:block">
                {t('chat.title')}
              </div>
            )}
          </motion.button>
        </div>

        {/* Status Bar */}
        {(selectedCards.length > 0 || isDealing || isInterpreting) && (
          <div className="xl:col-span-12 flex flex-col sm:flex-row justify-between items-center gap-4 mb-4 border-b border-primary/10 pb-4">
             <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 text-[9px] sm:text-[10px] uppercase tracking-widest text-outline">
                <div>{t('reading.status.spread')}: <span className="text-primary font-bold">{currentLang === 'vi' ? activeSpread.nameVi : activeSpread.name}</span></div>
                <div>{t('reading.status.phase')}: <span className="text-primary font-bold">
                   {isDealing ? t('reading.status.dealing', { defaultValue: 'Dealing...' }) :
                   isInterpreting ? t('reading.status.ascending') : 
                   t('reading.status.quiet')}
                </span></div>
             </div>
             <div className="flex gap-2 sm:gap-3">
                <button 
                  onClick={toggleMusic}
                  className="flex items-center gap-2 p-1.5 px-3 bg-surface-container rounded-full border border-primary/10 hover:border-primary/30 transition-all text-[9px] uppercase tracking-widest text-outline hover:text-primary backdrop-blur-sm"
                  title="Toggle Music"
                >
                  {isMusicEnabled ? (
                    <>
                      <Music className="w-3 h-3 text-primary animate-pulse" />
                      <span>{currentLang === 'vi' ? 'Bật' : 'On'}</span>
                    </>
                  ) : (
                    <>
                      <Music2 className="w-3 h-3 text-primary/40" />
                      <span>{currentLang === 'vi' ? 'Tắt' : 'Off'}</span>
                    </>
                  )}
                </button>
                <button 
                  onClick={handlePrepareReading}
                  className="p-1.5 px-4 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-all text-[9px] uppercase tracking-widest font-bold border border-primary/20"
                >
                  {t('reading.ritual.start_over')}
                </button>
             </div>
          </div>
        )}

        <div className="xl:col-span-12 flex flex-col gap-4 sm:gap-6">
          <div className="relative min-h-[500px] sm:min-h-[600px] bg-surface-container-low/20 rounded-md p-4 sm:p-8 flex flex-col items-center justify-center overflow-hidden border border-primary/10">
            
            {/* Atmospheric Backgrounds & Dealing Ritual */}
            <AnimatePresence>
              {(isDealing || isInterpreting) && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-0 atmosphere"
                  />
                  {isDealing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center z-50 backdrop-blur-sm"
                    >
                      <div className="relative w-80 h-80 sm:w-[500px] sm:h-[500px] flex items-center justify-center perspective-[1200px]">
                        {/* Mystic Runes / Geometry */}
                        <motion.div 
                          animate={{ rotate: 360 }} 
                          transition={{ duration: 25, repeat: Infinity, ease: "linear" }} 
                          className="absolute inset-4 border border-primary/10 rounded-full flex items-center justify-center"
                        >
                           <div className="w-full h-full border-2 border-primary/5 rounded-full border-dashed p-10" />
                        </motion.div>

                        <div className="absolute inset-0 flex items-center justify-center">
                           <motion.div 
                             animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
                             transition={{ duration: 3, repeat: Infinity }}
                             className="w-64 h-64 bg-primary/20 rounded-full blur-[100px]"
                           />
                        </div>
                        
                        <Sparkles className="w-12 h-12 text-primary opacity-30 animate-pulse absolute" />
                        
                        {/* Orbiting Deck Ritual - Moons orbiting a central star with 3D perspective */}
                        {[...Array(24)].map((_, i) => (
                          <motion.div
                            key={`dealing-card-${i}`}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ 
                              opacity: [0, 1, 1, 0], 
                              scale: [0, 0.4, 0.4, 0],
                              rotateY: 180,
                              // Elliptic orbit logic
                              x: [
                                Math.cos(((i * 15) * Math.PI) / 180) * (window.innerWidth < 640 ? 120 : 280),
                                Math.cos(((i * 15 + 360) * Math.PI) / 180) * (window.innerWidth < 640 ? 120 : 280)
                              ],
                              y: [
                                Math.sin(((i * 15) * Math.PI) / 180) * (window.innerWidth < 640 ? 80 : 120),
                                Math.sin(((i * 15 + 360) * Math.PI) / 180) * (window.innerWidth < 640 ? 80 : 120)
                              ],
                              z: [
                                Math.sin(((i * 15) * Math.PI) / 180) * 150,
                                Math.sin(((i * 15 + 360) * Math.PI) / 180) * 150
                              ],
                              rotateZ: [i * 15, i * 15 + 360]
                            }}
                            transition={{ 
                              x: { duration: 6, repeat: Infinity, ease: "linear" },
                              y: { duration: 6, repeat: Infinity, ease: "linear" },
                              z: { duration: 6, repeat: Infinity, ease: "linear" },
                              rotateZ: { duration: 12, repeat: Infinity, ease: "linear" },
                              opacity: { duration: 1, times: [0, 0.1, 0.9, 1], delay: i * 0.05 },
                              scale: { duration: 1, times: [0, 0.1, 0.9, 1], delay: i * 0.05 },
                            }}
                            className="absolute w-24 h-40 bg-surface-container-highest border border-primary/40 rounded-xl overflow-hidden shadow-2xl preserve-3d"
                          >
                             <img src={CARD_IMAGES['card-back']} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-primary/5" />
                          </motion.div>
                        ))}

                        {/* Concentration Point */}
                        <motion.div 
                          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.2, 0.5, 0.2] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-4 h-4 bg-primary rounded-full blur-sm"
                        />
                      </div>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 text-center"
                      >
                        <h3 className="text-2xl sm:text-3xl font-serif italic text-primary gold-text-gradient ritual-text mb-2">{t('reading.invoking_will')}</h3>
                        <p className="text-[10px] text-outline tracking-[0.4em] uppercase font-bold opacity-40">{t('reading.spiritual_currents')}</p>
                      </motion.div>
                    </motion.div>
                  )}
                </>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {selectedCards.length === 0 && !isDealing && !isInterpreting ? (
                <motion.div 
                  key="journey-input"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative z-20 w-full flex justify-center"
                >
                  <JourneyInput 
                    question={question} 
                    setQuestion={setQuestion} 
                    onAsk={() => {
                      if (question.trim()) handleExecuteReading();
                      else alert(t('reading.question_placeholder'));
                    }} 
                    onDraw={() => handleExecuteReading()} 
                    currentLang={currentLang} 
                    t={t} 
                  />
                </motion.div>
              ) : (
                <motion.div 
                  key="reading-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full flex flex-col items-center"
                >
                  <div className="text-center mb-8 sm:mb-16 opacity-80 uppercase tracking-[0.3em] relative z-10 w-full">
                    <h1 className="text-xl sm:text-3xl font-serif italic text-secondary mb-3 ritual-text gold-text-gradient">{currentLang === 'vi' ? activeSpread.nameVi : activeSpread.name}</h1>
                    <div className="h-0.5 w-12 bg-primary/40 mx-auto mystic-glow" />
                    
                    {/* Confirmed Journey Text */}
                    {selectedCards.length > 0 && question && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 max-w-xl mx-auto"
                      >
                        <p className="text-primary/70 font-serif italic text-sm sm:text-base ritual-text">
                          "{question}"
                        </p>
                      </motion.div>
                    )}
                  </div>

                  <div className="w-full h-[400px] sm:h-[500px] flex justify-center items-center tarot-card-container perspective-[2000px] relative z-10 py-10 touch-none">
                    {/* High-priority interaction layer - Above all cards to handle drag exclusively */}
                    <div className="absolute inset-0 z-[1000] cursor-grab active:cursor-grabbing touch-none select-none overflow-hidden">
                      <motion.div 
                        onPan={(e, info) => {
                           // Reduced sensitivity for smoother control
                           carouselDragX.set(carouselDragX.get() + info.delta.x * 1.2);
                           setIsCarouselDragging(true);
                        }}
                        onPanEnd={(e, info) => {
                           setIsCarouselDragging(false);
                           snapToCard(info.velocity.x);
                        }}
                        onWheel={(e) => {
                           const delta = e.deltaX || e.deltaY;
                           carouselDragX.set(carouselDragX.get() - delta * 0.3);
                        }}
                        className="w-full h-full"
                      />
                    </div>

                    <div className="relative w-full h-full flex items-center justify-center preserve-3d pointer-events-none">
                      {isReadingComplete && selectedCards.length > 1 && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0.1, 0.4, 0.1] }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className="absolute bottom-4 flex flex-col items-center gap-1 z-[60] pointer-events-none"
                        >
                           <div className="flex gap-4 text-primary/30">
                              <ChevronLeft className="w-5 h-5" />
                              <ChevronRight className="w-5 h-5" />
                           </div>
                           <p className="text-[9px] uppercase tracking-[0.3em] text-primary/20 font-serif italic">
                              {currentLang === 'vi' ? 'Vuốt vùng trống để xoay' : 'Swipe area to rotate'}
                           </p>
                        </motion.div>
                      )}
                      
                      <div className="relative z-50 flex items-center justify-center preserve-3d pointer-events-auto">
                        {selectedCards.map((card, idx) => (
                          <CarouselCard
                            key={`${card.id}-${idx}`}
                            card={card}
                            idx={idx}
                            total={selectedCards.length}
                            carouselDragX={carouselDragX}
                            isReadingComplete={isReadingComplete}
                            currentLang={currentLang}
                            onCardClick={() => isReadingComplete && setIsInterpretationModalOpen(true)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        {/* AI Interpretation Loading Overlay */}
        <AnimatePresence>
          {isInterpreting && !isInterpretationModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-surface-dim/95 backdrop-blur-2xl z-[300] flex flex-col items-center justify-center p-8 overflow-hidden"
            >
              {/* Atmospheric background */}
              <div className="absolute inset-0 atmosphere opacity-60" />
              <ConstellationMap />
              
              <div className="relative z-10 flex flex-col items-center max-w-lg w-full">
                {/* Twinkling Constellations */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(50)].map((_, i) => (
                    <motion.div
                      key={`sparkle-${i}`}
                      initial={{ 
                        opacity: 0, 
                        x: Math.random() * 1000 - 500, 
                        y: Math.random() * 1000 - 500 
                      }}
                      animate={{ 
                        opacity: [0, Math.random(), 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{ 
                        duration: 2 + Math.random() * 3, 
                        repeat: Infinity, 
                        delay: Math.random() * 5 
                      }}
                      className="absolute w-1 h-1 bg-primary rounded-full blur-[1px]"
                    />
                  ))}
                </div>

                <motion.div 
                   initial={{ opacity: 0, scale: 0.5 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ duration: 1 }}
                   className="relative w-64 h-64 mb-16"
                >
                  {/* Sacred Geometry / Mandalas */}
                  <svg viewBox="0 0 100 100" className="w-full h-full text-primary/20">
                    <motion.circle 
                      cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" 
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 4, repeat: Infinity }}
                    />
                    <motion.path 
                      d="M50 5 L95 80 L5 80 Z" fill="none" stroke="currentColor" strokeWidth="0.5"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                    />
                    <motion.path 
                      d="M50 95 L5 20 L95 20 Z" fill="none" stroke="currentColor" strokeWidth="0.5"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                    />
                  </svg>
                  
                  <motion.div 
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                      scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Sparkles className="w-16 h-16 text-primary mystic-glow" />
                  </motion.div>
                  
                  {/* Floating Moons */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        rotate: [i * 120, i * 120 + 360],
                      }}
                      transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0"
                    >
                      <motion.div 
                        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i }}
                        className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4"
                      >
                        <Moon className="w-6 h-6 text-primary" />
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>

                <div className="text-center">
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] uppercase tracking-[0.5em] text-primary/80 font-bold mb-4 block ritual-text"
                  >
                    {currentLang === 'vi' ? 'KHỞI TẠO Ý CHÍ VŨ TRỤ' : 'INVOKING COSMIC WILL'}
                  </motion.span>
                  
                  <motion.h3 
                    key={currentLang}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl sm:text-4xl font-serif italic text-secondary mb-8 leading-tight gold-text-gradient ritual-text"
                  >
                    {currentLang === 'vi' ? 'Dòng chảy tâm linh đang dẫn lối...' : 'The spiritual currents are guiding us...'}
                  </motion.h3>
                  
                  {/* Subtle progress indicator */}
                  <div className="flex gap-2 justify-center">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          scale: [1, 1.5, 1],
                          opacity: [0.3, 1, 0.3],
                          backgroundColor: ["#c5a059", "#ffffff", "#c5a059"]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                        className="w-1.5 h-1.5 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interpretation Modal (Overlay) */}
        <AnimatePresence>
          {isInterpretationModalOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsInterpretationModalOpen(false)}
                className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200]"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateX: -10 }}
                className="fixed inset-2 sm:inset-10 lg:inset-x-32 lg:inset-y-16 z-[201] flex flex-col items-center justify-center pointer-events-none"
              >
                <div className="w-full h-full max-w-5xl bg-surface-dim/80 glass-morphism border-primary/30 border rounded-[2rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden relative flex flex-col pointer-events-auto">
                  {/* Mystic Background Layers */}
                  <div className="absolute inset-0 atmosphere opacity-10 pointer-events-none" />
                  <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
                  
                  {/* Sacred Geometry Corners */}
                  <div className="absolute top-0 left-0 w-24 h-24 opacity-20 pointer-events-none">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
                      <circle cx="0" cy="0" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
                    </svg>
                  </div>
                  
                  {/* Header - More Compact & Mobile Responsive */}
                  <div className="flex items-center justify-between py-3 px-4 sm:px-8 relative z-10 border-b border-primary/5 bg-surface-dim/40 backdrop-blur-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      <motion.div 
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/15 rounded-xl flex items-center justify-center border border-primary/30 shrink-0"
                      >
                        <Sparkles className="w-4 h-4 sm:w-5 h-5 text-primary" />
                      </motion.div>
                      
                      <div className="min-w-0">
                        <h2 className="text-sm sm:text-xl font-serif italic text-secondary leading-tight gold-text-gradient ritual-text tracking-wide truncate">
                          {t('reading.oracle_interpretation')}
                        </h2>
                        <div className="flex items-center gap-2">
                          <span className="text-[7px] sm:text-[9px] text-primary/60 font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] ritual-text whitespace-nowrap">{t('reading.insight_title')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                      <button 
                        onClick={saveToHistory} 
                        className="w-8 h-8 sm:w-10 sm:h-10 bg-primary text-surface-dim rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 border border-primary/20"
                        title={t('reading.journal_entry')}
                      >
                        <Save className="w-4 h-4 sm:w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setIsInterpretationModalOpen(false)}
                        className="w-8 h-8 sm:w-10 sm:h-10 text-primary/40 hover:text-primary transition-all hover:bg-primary/10 rounded-full border border-primary/20 flex items-center justify-center"
                      >
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                    </div>
                  </div>

                  {/* Enhanced Scroll Content */}
                  <div 
                    id="interpretation-panel"
                    className="flex-1 overflow-y-auto custom-scrollbar px-6 sm:px-12 pb-10 relative z-10"
                  >
                    <div className="max-w-3xl mx-auto w-full pt-8">
                      <div className="prose prose-invert prose-sepia max-w-none text-secondary/90 font-serif leading-relaxed text-base sm:text-xl italic text-justify selection:bg-primary/30">
                        <Markdown>{interpretation}</Markdown>
                        {isInterpreting && (
                          <motion.span 
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="inline-block w-2.5 h-2.5 bg-primary rounded-full ml-2 mb-1 shadow-[0_0_10px_#c5a059]" 
                          />
                        )}
                      </div>
                      
                      <div className="mt-12 pt-8 border-t border-primary/20 relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-surface-dim px-4">
                           <Moon className="w-6 h-6 text-primary/40 rotate-12" />
                        </div>
                        
                        <div className="text-center mb-6">
                          <h4 className="text-[10px] uppercase tracking-[0.4em] text-primary mb-1 font-bold">{t('reading.status.phase')}</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {selectedCards.map((card, idx) => (
                             <motion.div 
                                key={idx} 
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + idx * 0.1 }}
                                className="flex flex-row gap-3 p-3 bg-primary/5 rounded-2xl border border-primary/10 hover:bg-primary/10 transition-all group overflow-hidden relative items-center"
                             >
                               <div className="relative shrink-0">
                                 <div className={`w-12 h-20 overflow-hidden rounded-lg border border-primary/20 transition-transform group-hover:scale-105 duration-500 ${card.isReversed ? 'rotate-180' : ''}`}>
                                   <img 
                                     src={card.imageUrl} 
                                     className="w-full h-full object-cover" 
                                     onError={(e) => {
                                       const target = e.target as HTMLImageElement;
                                       target.src = CARD_IMAGES['card-back'];
                                     }}
                                   />
                                 </div>
                               </div>
                               <div className="min-w-0">
                                 <p className="text-[8px] text-primary font-bold uppercase tracking-wider mb-0.5 line-clamp-1">{card.positionName}</p>
                                 <h5 className="text-[11px] font-serif italic text-secondary line-clamp-2">{card.name[currentLang as 'vi' | 'en']}</h5>
                               </div>
                             </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Compact, Clean Footer - Removed content as requested */}
                  <div className="p-4 bg-surface-dim/20 relative z-10">
                    {/* Footer buttons removed and moved to top */}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>


      {/* History Slide-over */}
      <AnimatePresence>
        {isHistoryOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHistoryOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-screen w-full max-w-md bg-surface-container shadow-2xl z-[101] p-8 border-l border-primary/10"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-serif italic text-secondary flex items-center gap-3">
                  <History className="w-5 h-5 text-primary" /> {t('nav.past_journeys')}
                </h3>
                <button onClick={() => setIsHistoryOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-outline hover:text-primary transition-colors">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {!user ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-50">
                  <UserIcon className="w-12 h-12 text-outline mb-6" />
                  <p className="text-outline text-xs uppercase tracking-widest mb-8">{t('nav.auth_required')}</p>
                  <Button onClick={signInWithGoogle}>Sign In</Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-140px)] pr-2 custom-scrollbar">
                  {history.length > 0 ? history.map((item: any) => (
                    <div 
                      key={item.id} 
                      onClick={() => handleLoadReading(item)}
                      className="bg-surface-container-highest/40 border border-primary/10 p-4 rounded-sm hover:bg-primary/5 transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-2 opacity-60">
                        <span className="text-[8px] text-primary uppercase font-bold tracking-widest">{t(`spreads.${item.spreadType.toLowerCase().replace(' ', '_')}`, { defaultValue: item.spreadType })}</span>
                        <span className="text-[8px] text-outline italic">{new Date(item.timestamp).toLocaleDateString(currentLang)}</span>
                      </div>
                      <p className="text-xs font-serif italic text-secondary group-hover:text-primary transition-colors line-clamp-1 mb-2">{item.question}</p>
                      <div className="flex gap-1.5 opacity-40 group-hover:opacity-70 transition-opacity">
                        {item.cards.map((c: any, i: number) => (
                          <div key={i} className="w-4 h-6 rounded-xs bg-surface-dim border border-primary/10 overflow-hidden">
                            <img src={c.imageUrl} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )) : (
                    <p className="text-center text-outline italic py-20">{t('nav.empty_journal')}</p>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[250]"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md bg-surface-container border border-primary/10 shadow-2xl z-[251] p-8 rounded-sm"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-serif italic text-secondary">{t('nav.settings')}</h3>
                <button onClick={() => setIsSettingsOpen(false)}><ChevronRight className="w-6 h-6 rotate-90" /></button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-outline mb-2 block">AI Model</label>
                  <select 
                    value={aiSettings.model}
                    onChange={(e) => setAiSettings({ ...aiSettings, model: e.target.value })}
                    className="w-full bg-surface-dim border border-primary/10 p-3 text-secondary focus:border-primary outline-none transition-all rounded-xs"
                  >
                    <option value="gemini-3-flash-preview">Gemini 3 Flash (Fast)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-outline mb-2 block">API Key (Optional)</label>
                  <input 
                    type="password"
                    placeholder="Enter your Gemini API key"
                    value={aiSettings.apiKey}
                    onChange={(e) => setAiSettings({ ...aiSettings, apiKey: e.target.value })}
                    className="w-full bg-surface-dim border border-primary/10 p-3 text-secondary focus:border-primary outline-none transition-all rounded-xs"
                  />
                  <p className="text-[9px] text-outline/50 mt-2 italic">
                    {t('settings.api_key_note', { defaultValue: 'Note: If left blank, the default system key will be used.' })}
                  </p>
                </div>

                <div className="pt-4 space-y-4">
                   <Button onClick={() => { setIsSettingsOpen(false); setIsConfirmClearOpen(false); }} className="w-full">Save Changes</Button>
                   
                   {!isConfirmClearOpen ? (
                     <Button 
                      variant="tertiary" 
                      className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                      onClick={() => setIsConfirmClearOpen(true)}
                    >
                      {t('settings.clear_cache')}
                    </Button>
                   ) : (
                     <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl space-y-3">
                       <p className="text-[11px] text-red-400 italic font-serif text-center">
                         {t('settings.clear_confirm')}
                       </p>
                       <div className="flex gap-2">
                         <Button 
                           variant="primary" 
                           className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                           onClick={() => {
                             localStorage.removeItem('astra_oracle_settings');
                             localStorage.clear();
                             sessionStorage.clear();
                             window.location.reload();
                           }}
                         >
                           {t('settings.clear')}
                         </Button>
                         <Button 
                           variant="tertiary" 
                           className="flex-1"
                           onClick={() => setIsConfirmClearOpen(false)}
                         >
                           {t('settings.cancel')}
                         </Button>
                       </div>
                     </div>
                   )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Chat Component - Floating Widget */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            ref={chatRef}
            initial={{ opacity: 0, scale: 0.8, y: 40, transformOrigin: 'bottom right', rotate: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40, rotate: -5 }}
            className="fixed bottom-24 right-6 sm:right-10 w-[min(calc(100vw-48px),420px)] h-[min(580px,calc(100vh-120px))] bg-surface-dim/90 border border-primary/20 shadow-[0_30px_100px_rgba(0,0,0,0.8)] z-[225] flex flex-col rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden backdrop-blur-3xl"
          >
            {/* Header - Compact */}
            <div className="px-4 py-2.5 sm:px-5 sm:py-3.5 bg-primary/10 border-b border-primary/10 flex justify-between items-center relative">
              <div className="absolute inset-0 atmosphere opacity-10 pointer-events-none" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                  <StarsIcon className="w-4 h-4 text-primary" />
                </div>
                <div>
                   <h3 className="text-sm font-serif italic text-primary leading-tight">{t('chat.title')}</h3>
                   <p className="text-[8px] uppercase tracking-widest text-outline/60 mt-0.5">{t('reading.status.phase')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 relative z-10">
                <button 
                  onClick={() => setIsConversationsListOpen(!isConversationsListOpen)} 
                  className="w-7 h-7 rounded-full border border-primary/10 flex items-center justify-center text-outline hover:text-primary hover:border-primary/40 transition-all"
                  title={t('chat.previous_conversations')}
                >
                  <History className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setIsChatOpen(false)} 
                  className="w-7 h-7 rounded-full border border-primary/10 flex items-center justify-center text-outline hover:text-primary hover:border-primary/40 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden relative flex flex-col">
              <AnimatePresence>
                {isConversationsListOpen && (
                  <motion.div 
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    className="absolute inset-0 bg-surface-dim/95 z-30 border-l border-primary/10 overflow-y-auto custom-scrollbar p-5"
                  >
                    <div className="flex justify-between items-center mb-5">
                      <h4 className="text-[9px] uppercase tracking-[0.2em] text-primary font-bold">{t('chat.recent_conversations')}</h4>
                      <button onClick={() => setIsConversationsListOpen(false)} className="text-primary hover:scale-110 transition-transform">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {history.filter(h => h.chatMessages && h.chatMessages.length > 0).length === 0 ? (
                        <div className="flex flex-col items-center py-8 text-center text-outline/30">
                           <History className="w-6 h-6 mb-2" />
                           <p className="text-[10px] italic font-serif ">{t('chat.no_conversations')}</p>
                        </div>
                      ) : (
                        history.filter(h => h.chatMessages && h.chatMessages.length > 0).map((h) => (
                          <button
                            key={h.id}
                            onClick={() => {
                              handleLoadReading(h);
                              setIsConversationsListOpen(false);
                            }}
                            className={cn(
                              "w-full text-left p-3 rounded-xl border transition-all relative overflow-hidden group",
                              currentReadingId === h.id 
                                ? "bg-primary/15 border-primary/40" 
                                : "bg-primary/5 border-primary/10 hover:border-primary/20"
                            )}
                          >
                            <p className="text-[10px] text-primary font-bold truncate mb-0.5 relative z-10">{h.question || 'Tarot Reading'}</p>
                            <p className="text-[8px] text-outline italic truncate relative z-10">{h.spreadType} • {new Date(h.timestamp).toLocaleDateString()}</p>
                          </button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                {!isReadingComplete && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-3 px-3 bg-primary/5 rounded-2xl border border-primary/10 relative overflow-hidden"
                  >
                    <Info className="w-3.5 h-3.5 text-primary mx-auto mb-1.5 opacity-50" />
                    <p className="text-xs text-secondary/70 italic font-serif leading-relaxed px-2">
                      {t('chat.guidance')}
                    </p>
                  </motion.div>
                )}
                
                {chatMessages.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center py-8 text-center opacity-30">
                    <Moon className="w-6 h-6 text-primary mb-2" />
                    <p className="text-xs font-serif italic text-secondary px-8">{t('chat.welcome')}</p>
                  </div>
                )}
                
                {chatMessages.map((msg, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      "max-w-[90%] rounded-xl sm:rounded-2xl p-3 sm:p-4 text-[12px] font-serif italic leading-relaxed shadow-sm",
                      msg.role === 'user' 
                        ? "ml-auto bg-primary text-surface-dim" 
                        : "mr-auto bg-primary/5 border border-primary/10 text-secondary"
                    )}
                  >
                    {msg.content}
                  </motion.div>
                ))}
                {isChatLoading && (
                  <div className="mr-auto bg-primary/5 border border-primary/10 rounded-2xl p-3.5 flex gap-1.5">
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                ) }
              </div>

              {/* Chat Input Section */}
              <div className="p-3 sm:p-4 bg-primary/5 border-t border-primary/10">
                <div className="flex gap-2 p-1.5 bg-surface-dim rounded-full items-center border border-primary/10 focus-within:border-primary/30 transition-all">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={t('chat.placeholder')}
                    className="flex-1 bg-transparent border-none outline-none px-3 py-1.5 text-xs text-secondary placeholder:text-outline/40 font-serif italic"
                  />
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSendMessage}
                    disabled={isChatLoading || !chatInput.trim()}
                    className="w-8 h-8 bg-primary text-surface-dim rounded-full flex items-center justify-center disabled:opacity-20 transition-all cursor-pointer shadow-md"
                  >
                    <Send className="w-3 h-3 ml-0.5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast for Saving History */}
      <AnimatePresence>
        {showSaveToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] bg-surface-container-highest border border-primary px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-xl"
          >
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span className="text-secondary font-serif italic text-sm">{t('reading.journal_saved')}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guide Modal */}
      <AnimatePresence>
        {isGuideOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[240]"
              onClick={() => setIsGuideOpen(false)}
            />
            <motion.div 
              ref={guideRef}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg bg-surface-container border border-primary/10 shadow-2xl z-[241] p-8 rounded-2xl flex flex-col max-h-[80vh] overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Info className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-serif italic text-secondary">
                    {t('guide.title')}
                  </h3>
                </div>
                <button 
                  onClick={() => setIsGuideOpen(false)}
                  className="p-2 text-outline hover:text-primary transition-all hover:bg-primary/10 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6 text-secondary/80 font-serif italic text-sm leading-relaxed">
                <section>
                  <h4 className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2">{t('guide.step1_title')}</h4>
                  <p>{t('guide.step1_desc')}</p>
                </section>

                <section>
                  <h4 className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2">{t('guide.step2_title')}</h4>
                  <p>{t('guide.step2_desc')}</p>
                </section>

                <section>
                  <h4 className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2">{t('guide.step3_title')}</h4>
                  <p>{t('guide.step3_desc')}</p>
                </section>

                <section>
                  <h4 className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2">{t('guide.step4_title')}</h4>
                  <p>{t('guide.step4_desc')}</p>
                </section>
              </div>

              <div className="mt-8 pt-6 border-t border-primary/10 text-center">
                <Button onClick={() => setIsGuideOpen(false)} variant="primary" className="px-8 py-2 rounded-full">
                  {t('guide.understood')}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(198, 191, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(198, 191, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

// High-performance Carousel Card component
const CarouselCard = ({ card, idx, total, carouselDragX, isReadingComplete, currentLang, onCardClick }: any) => {
  const arcRange = total <= 1 ? 0 : (total <= 5 ? 120 : 360);
  const angleStep = arcRange / Math.max(total - 1, 1);
  const startAngle = total <= 1 ? 0 : (total <= 5 ? -arcRange / 2 : 0);
  const cardBaseAngle = startAngle + idx * angleStep;

  // X movement to rotationY
  const rotationY = useTransform(carouselDragX, (x: number) => cardBaseAngle + x * 0.4);
  
  const radius = typeof window !== 'undefined' && window.innerWidth < 640 ? 120 : 250;
  
  const x = useTransform(rotationY, (rot) => Math.sin((rot * Math.PI) / 180) * radius);
  const z = useTransform(rotationY, (rot) => Math.cos((rot * Math.PI) / 180) * radius);
  const opacity = useTransform(z, (val) => Math.max(0.1, (val + radius) / (radius * 2.2)));
  const scale = useTransform(z, (val) => 0.7 + (val + radius) / (radius * 3));
  const labelOpacity = useTransform(z, (val) => (val > radius * 0.7 ? 1 : 0));
  const rotateX = useTransform(z, (val) => (val > radius * 0.7 ? 0 : 5));

  return (
    <motion.div
      style={{
        x,
        z,
        rotateY: rotationY,
        opacity,
        scale,
        zIndex: useTransform(z, v => Math.round(v + radius)),
        rotateX
      }}
      className="absolute pointer-events-auto"
    >
      <div className="relative preserve-3d flex flex-col items-center">
        <motion.div 
          style={{ opacity: labelOpacity }}
          className="absolute -top-12 z-[100] whitespace-nowrap"
        >
          <span className="text-[8px] sm:text-[9px] text-primary uppercase font-bold bg-surface-dim/95 backdrop-blur-md px-4 py-1.5 rounded-full border border-primary/20 shadow-xl ritual-text tracking-[0.3em]">
            {card.positionName}
          </span>
        </motion.div>
        
        <motion.div 
          onClick={onCardClick}
          animate={{ 
            rotateZ: card.isReversed ? 180 : 0
          }}
          className="w-20 sm:w-32 aspect-[2/3.4] cursor-pointer relative preserve-3d group rounded-lg"
        >
          <div className="absolute inset-0 rounded-lg card-glow-refined pointer-events-none" />
          
          <div className="absolute inset-0 backface-hidden bg-surface-container-highest rounded-lg overflow-hidden border border-primary/20">
            <img 
              src={card.imageUrl} 
              alt={card.name[currentLang as 'vi' | 'en']} 
              className="w-full h-full object-cover select-none pointer-events-none"
              draggable="false"
              loading="eager"
            />
            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
               <p className="text-[7px] sm:text-[8px] text-primary-fixed font-serif italic text-center truncate gold-text-gradient">{card.name[currentLang as 'vi' | 'en']}</p>
            </div>
          </div>
          
          <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] bg-surface-container-highest border border-primary/20 rounded-lg overflow-hidden">
            <img src={CARD_IMAGES['card-back']} className="w-full h-full object-cover" alt="card back" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function App() {
  return (
    <FirebaseProvider>
      <TarotApp />
    </FirebaseProvider>
  );
}
