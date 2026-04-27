import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  CheckCircle2
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
      
      <div className="text-center group relative z-10 w-full">
        <span className="text-[10px] uppercase tracking-[0.5em] text-primary font-bold mb-4 block ritual-text">
          {currentLang === 'vi' ? 'HÀNH TRÌNH TÂM LINH' : 'SPIRITUAL JOURNEY'}
        </span>
        <h3 className="text-2xl sm:text-4xl font-serif italic text-secondary mb-10 leading-tight gold-text-gradient ritual-text">
          {currentLang === 'vi' ? 'Điều gì đang dẫn lối bước chân bạn?' : 'What is guiding your path today?'}
        </h3>
        
        <div className="relative w-full mb-12">
          <input 
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="..."
            className="w-full bg-surface-container/60 border-b-2 border-primary/20 p-6 text-center text-secondary font-serif italic text-xl focus:border-primary outline-none transition-all placeholder:opacity-20 backdrop-blur-sm rounded-t-2xl"
          />
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
          <button 
            onClick={onDraw}
            className="w-full sm:w-auto relative px-12 py-5 bg-surface-container/90 border-2 border-primary/40 rounded-full text-primary font-serif italic text-xl shadow-2xl hover:scale-105 active:scale-95 hover:border-primary transition-all flex items-center justify-center gap-4 backdrop-blur-xl group cursor-pointer"
          >
            <Sparkles className="w-6 h-6 animate-pulse" />
            <span className="relative z-10 font-bold tracking-wider">{t('reading.draw_button')}</span>
          </button>

          <button 
            onClick={onAsk}
            className="w-full sm:w-auto relative px-12 py-5 bg-primary text-surface-dim rounded-full font-serif italic text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 group cursor-pointer"
          >
            <PenTool className="w-6 h-6" />
            <span className="relative z-10 font-bold tracking-wider">{t('reading.ask')}</span>
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
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInterpretationModalOpen, setIsInterpretationModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model'; content: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const chatSessionRef = useRef<any>(null);
  
  const [aiSettings, setAiSettings] = useState(() => {
    const saved = localStorage.getItem('astra_oracle_settings');
    return saved ? JSON.parse(saved) : { model: 'gemini-3-flash-preview', apiKey: '' };
  });
  
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
      if (isChatOpen && chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsChatOpen(false);
      }
      if (isGuideOpen && guideRef.current && !guideRef.current.contains(event.target as Node)) {
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

  const handleLoadReading = (item: any) => {
    setQuestion(item.question);
    const spread = Object.values(SPREADS).find(s => s.name === item.spreadType) || SPREADS.THREE_CARD;
    setActiveSpread(spread);
    setSelectedCards(item.cards);
    setInterpretation(item.interpretation);
    setIsReadingComplete(true);
    setIsHistoryOpen(false);
    
    // Refresh chat context
    try {
      chatSessionRef.current = getChatSession(item.interpretation, currentLang, { model: aiSettings.model, apiKey: aiSettings.apiKey });
      setChatMessages([]);
    } catch (e) {
      console.error("Chat refresh fail", e);
    }
  };

  const handlePrepareReading = () => {
    setSelectedCards([]);
    setInterpretation('');
    setIsReadingComplete(false);
    setIsInterpretationModalOpen(false);
  };

  const handleExecuteReading = async () => {
    setInterpretation('');
    setIsReadingComplete(false);
    setSelectedCards([]);
    
    // Skip Shuffling, go straight to Dealing
    setIsDealing(true);

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
    
    setSelectedCards(drawn);
    
    // Ritual Circle Animation (4 seconds)
    await new Promise(resolve => setTimeout(resolve, 4000));
    setIsDealing(false);

    // Pause to allow cards to land and be seen before AI interpretation starts
    await new Promise(resolve => setTimeout(resolve, 1500));

    setInterpretation(t('reading.analyzing'));
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
        setInterpretation(currentLang === 'vi' 
          ? '### Cần cấu nhập API Key\n\nĐể nhận lời giải từ Oracle trên Vercel, bạn cần thiết lập biến môi trường `VITE_GEMINI_API_KEY` trong Settings của Vercel project.' 
          : '### API Key Required\n\nTo receive an interpretation from the Oracle on Vercel, you must set the `VITE_GEMINI_API_KEY` environment variable in your Vercel project settings.');
        setIsReadingComplete(true);
        setIsInterpretationModalOpen(true);
      } else {
        setInterpretation(currentLang === 'vi' ? 'Xin lỗi, Oracle đang tạm nghỉ. Vui lòng thử lại sau.' : 'Sorry, the Oracle is resting. Please try again later.');
      }
    } finally {
      setIsInterpreting(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !chatSessionRef.current || isChatLoading) return;
    
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsChatLoading(true);

    try {
      const result = await chatSessionRef.current.sendMessage({ message: userMsg });
      const text = result.text;
      if (text) {
        setChatMessages(prev => [...prev, { role: 'model', content: text }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages(prev => [...prev, { role: 'model', content: currentLang === 'vi' ? "Rất tiếc, đã có lỗi khi kết nối với Oracle." : "Sorry, I encountered an error connecting to the Oracle." }]);
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
      await addDoc(collection(db, 'readings'), {
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
        timestamp: Date.now()
      });
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 3000);
      loadHistory();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'readings');
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
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b border-sepia/20 bg-surface-container/80 backdrop-blur-md z-[100] px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> 
            <h2 className="text-primary font-serif italic text-lg">{t('app.title')}</h2>
          </div>
          <div className="flex bg-surface-container-highest/30 border border-sepia/30 p-0.5 rounded-full scale-75 origin-left">
            <button 
              onClick={() => i18n.changeLanguage('en')}
              className={cn(
                "px-2 py-0.5 rounded-full text-[8px] font-bold transition-all",
                currentLang === 'en' ? "bg-primary text-white" : "text-outline"
              )}
            >
              EN
            </button>
            <button 
              onClick={() => i18n.changeLanguage('vi')}
              className={cn(
                "px-2 py-0.5 rounded-full text-[8px] font-bold transition-all",
                currentLang === 'vi' ? "bg-primary text-white" : "text-outline"
              )}
            >
              VI
            </button>
          </div>
        </div>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-outline">
          <Layers className="w-6 h-6" />
        </button>
      </div>

      {/* Floating Header (Right) */}
      <div className="fixed top-20 lg:top-6 right-6 z-50 flex items-center gap-3">
        {isReadingComplete && (
           <Button variant="tertiary" className="rounded-full w-10 h-10 p-0 shadow-lg border-primary/20 bg-surface-container/80 backdrop-blur-md" onClick={() => setIsInterpretationModalOpen(true)}>
              <Layers className="w-4 h-4 text-primary" />
           </Button>
        )}
      </div>

      {/* Sidebar Navigation */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarCollapsed ? 80 : 288 }}
        className="hidden lg:flex flex-col bg-surface-container border-r border-sepia pt-8 p-4 pb-8 z-40 fixed h-screen left-0 shadow-2xl transition-all duration-300 overflow-hidden"
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
                  <div className="flex bg-surface-container-highest/30 border border-sepia/30 p-0.5 rounded-full scale-90" onClick={e => e.stopPropagation()}>
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

          <div className="mt-auto pt-8 border-t border-sepia flex flex-col gap-1 w-full">
            <button 
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center gap-4 px-3 py-3 text-outline hover:text-secondary group transition-colors"
              title={currentLang === 'vi' ? 'Hướng dẫn' : 'Guide'}
            >
              <Info className="w-5 h-5 flex-shrink-0" />
              {!isSidebarCollapsed && <span className="text-xs uppercase tracking-tighter whitespace-nowrap">{currentLang === 'vi' ? 'Hướng dẫn' : 'Guide'}</span>}
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
              className="fixed left-0 top-0 h-screen w-4/5 max-w-[300px] bg-surface-container z-[111] lg:hidden flex flex-col p-6 shadow-2xl border-r border-sepia"
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

                 <div className="mt-auto border-t border-sepia pt-6 flex flex-col gap-2">
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
        <AnimatePresence mode="wait">
          {selectedCards.length === 0 && !isDealing && !isInterpreting && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center p-6 z-[100] bg-surface-dim/70 backdrop-blur-md"
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
          )}
        </AnimatePresence>

        {/* Persistent Chat Button */}
        <div className="fixed bottom-10 right-10 z-[230]">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsChatOpen(!isChatOpen)}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-14 h-14 bg-primary text-surface-dim rounded-full shadow-2xl flex items-center justify-center cursor-pointer relative group"
          >
            <AnimatePresence mode="wait">
              {isChatOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                  <MessageSquare className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
            {!isChatOpen && !isReadingComplete && (
               <motion.div 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-primary" 
              />
            )}
            
            {/* Tooltip */}
            {!isChatOpen && (
              <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-surface-container border border-sepia rounded text-[10px] uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden sm:block">
                {t('chat.title')}
              </div>
            )}
          </motion.button>
        </div>

        <div className="xl:col-span-12 flex justify-between items-center mb-4 border-b border-sepia pb-4">
           <div className="flex gap-6 text-[10px] uppercase tracking-widest text-outline">
              <div>{t('reading.status.spread')}: <span className="text-primary font-bold">{currentLang === 'vi' ? activeSpread.nameVi : activeSpread.name}</span></div>
              <div>{t('reading.status.phase')}: <span className="text-primary font-bold">
                 {isDealing ? t('reading.status.dealing', { defaultValue: 'Dealing...' }) :
                 isInterpreting ? t('reading.status.ascending') : 
                 t('reading.status.quiet')}
              </span></div>
           </div>
           <div className="flex gap-3">
              <Button variant="ghost" onClick={() => { setSelectedCards([]); setInterpretation(''); setIsReadingComplete(false); }} title={t('reading.reset')}><RefreshCcw className="w-3 h-3"/></Button>
           </div>
        </div>

        <div className="xl:col-span-12 flex flex-col gap-6">
          <div className="relative min-h-[600px] bg-surface-container-low/20 rounded-md p-8 flex flex-col items-center justify-center overflow-hidden border border-sepia">
            
            {/* Atmospheric Backgrounds */}
            <AnimatePresence>
              {(isDealing || isInterpreting) && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-0 atmosphere"
                />
              )}
            </AnimatePresence>

            <div className="text-center mb-16 opacity-80 uppercase tracking-[0.3em] relative z-10">
              <h1 className="text-2xl sm:text-3xl font-serif italic text-secondary mb-3 ritual-text gold-text-gradient">{currentLang === 'vi' ? activeSpread.nameVi : activeSpread.name}</h1>
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

            <div className="w-full h-full flex flex-wrap justify-center gap-6 sm:gap-10 tarot-card-container perspective-[2000px] relative z-10">
              <AnimatePresence mode="popLayout">
                {selectedCards.length > 0 ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Rotating Circle of Cards (Placeholders) during the dealing phase */}
                    {/* Ritual Circle - Shown while dealing or interpreting */}
                    {(isDealing || (isInterpreting && !isReadingComplete)) && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                        <motion.div 
                          animate={{ rotate: 720 }}
                          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
                          className="relative w-80 h-80 sm:w-[600px] sm:h-[600px]"
                        >
                          {[...Array(24)].map((_, i) => (
                            <div 
                              key={`ritual-circle-${i}`}
                              className="absolute inset-0 flex items-center justify-center"
                              style={{ transform: `rotate(${(i * 360) / 24}deg)` }}
                            >
                              <motion.div 
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 0.4, y: -220 }}
                                transition={{ duration: 1, delay: i * 0.05 }}
                                className="w-16 h-28 sm:w-24 sm:h-40 bg-surface-container-highest border border-primary/20 rounded-sm shadow-2xl tarot-card-back overflow-hidden relative"
                              >
                                <img src={CARD_IMAGES['card-back']} className="w-full h-full object-cover opacity-60" alt="card back" />
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-20" />
                              </motion.div>
                            </div>
                          ))}
                        </motion.div>
                        <div className="absolute z-20 ritual-text gold-text-gradient bg-surface-dim/80 px-8 py-3 rounded-full border border-primary/20 backdrop-blur-md animate-pulse">
                          {isDealing ? t('reading.status.dealing') : t('reading.analyzing')}
                        </div>
                      </div>
                    )}

                    <div className="relative w-full h-[500px] flex items-center justify-center overflow-visible">
                      {!isDealing && selectedCards.map((card, idx) => {
                        const total = selectedCards.length;
                        const layoutX = (idx - (total - 1) / 2) * (window.innerWidth < 640 ? 110 : 180);

                        return (
                          <motion.div
                            key={`${card.id}-${idx}`}
                            initial={{ opacity: 0, y: 100, rotateY: 180, scale: 0.8 }}
                            animate={{ 
                               opacity: 1, 
                               x: layoutX, 
                               y: 0, 
                               z: 0, 
                               rotateY: 0, 
                               rotateZ: card.isReversed ? 180 : 0, 
                               scale: 1,
                               rotateX: 0
                            }}
                            transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
                            whileHover={{ 
                              scale: 1.05, 
                              y: -10,
                              z: 50,
                              transition: { type: "spring", stiffness: 300, damping: 20 }
                            }}
                            onClick={() => isReadingComplete && setIsInterpretationModalOpen(true)}
                            className="absolute cursor-pointer preserve-3d"
                          >
                            <div className="absolute -top-12 left-0 right-0 text-center w-full z-20">
                              <motion.span 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-[9px] text-primary uppercase font-medium bg-surface-dim/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-primary/30 shadow-lg ritual-text whitespace-nowrap"
                                style={{ letterSpacing: '0.4em' }}
                              >
                                {card.positionName}
                              </motion.span>
                            </div>
                            
                            <div className="w-24 sm:w-36 aspect-[2/3.4] relative preserve-3d transition-transform duration-1000 group">
                              <div className="absolute inset-0 rounded-sm card-glow-refined pointer-events-none" />
                              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none -z-10" />
                              
                              {/* Front Side */}
                              <div className="absolute inset-0 backface-hidden bg-surface-container-highest rounded-sm overflow-hidden border border-sepia">
                                <img 
                                  src={card.imageUrl} 
                                  alt={card.name[currentLang]} 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = CARD_IMAGES['card-back'];
                                  }}
                                />
                                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                                   <p className="text-[8px] sm:text-[10px] text-primary-fixed font-serif italic text-center truncate gold-text-gradient">{card.name[currentLang]}</p>
                                </div>
                              </div>
                              
                              {/* Back Side */}
                              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-surface-container-highest rounded-sm overflow-hidden border border-sepia shadow-2xl flex items-center justify-center">
                                <img src={CARD_IMAGES['card-back']} className="w-full h-full object-cover" alt="card back" />
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-20" />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
              ) : (
                  <div className="text-center flex flex-col items-center gap-6 opacity-30">
                    <div className="w-40 h-64 border border-sepia rounded-sm flex items-center justify-center bg-surface-container-highest/10 relative overflow-hidden">
                      <motion.div 
                        animate={{ 
                          rotateY: [0, 10, -10, 0]
                        }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="w-32 h-56 border border-dashed border-primary/20 bg-primary/5 rounded-sm overflow-hidden"
                      >
                        <img src={CARD_IMAGES['card-back']} className="w-full h-full object-cover opacity-20 filter grayscale" alt="silent card" />
                      </motion.div>
                    </div>
                    <p className="text-outline text-xs uppercase tracking-widest italic">{t('reading.silence')}</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

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
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200]"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                className="fixed inset-2 sm:inset-10 lg:inset-x-24 lg:inset-y-12 z-[201] flex flex-col"
              >
                <div className="flex flex-col h-full bg-surface-container/95 glass-morphism border-primary/20 border-2 rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden relative">
                  {/* Decorative atmosphere */}
                  <div className="absolute inset-0 atmosphere opacity-5 pointer-events-none" />
                  
                  {/* Compact Header */}
                  <div className="flex justify-between items-center p-6 border-b border-primary/10 relative z-10 bg-surface-container/40">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/20 rounded-lg">
                        <Sparkles className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-serif italic text-secondary leading-none">{t('reading.oracle_interpretation')}</h2>
                        <p className="text-[10px] text-primary/60 font-bold uppercase tracking-[0.2em] mt-1">{t('reading.insight_title')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button 
                        onClick={saveToHistory} 
                        variant="primary" 
                        className="px-6 py-2 rounded-full flex items-center gap-2 text-sm shadow-lg whitespace-nowrap"
                      >
                        <Save className="w-4 h-4" />
                        {currentLang === 'vi' ? 'Lưu nhật ký' : 'Save Journal'}
                      </Button>
                      <button 
                        onClick={() => setIsInterpretationModalOpen(false)}
                        className="p-2 text-primary/60 hover:text-primary transition-all hover:bg-primary/10 rounded-full"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  {/* Enhanced Scroll Content */}
                  <div 
                    id="interpretation-panel"
                    className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10 relative z-10"
                  >
                    <div className="max-w-3xl mx-auto w-full">
                      <div className="prose prose-invert prose-sepia max-w-none text-secondary/90 font-serif leading-relaxed text-lg sm:text-xl italic">
                        <Markdown>{interpretation}</Markdown>
                        {isInterpreting && (
                          <span className="inline-block w-2 h-2 bg-primary rounded-full animate-ping ml-2 mb-1" />
                        )}
                      </div>
                      
                      {/* Optional: Simple Card Summary for context */}
                      <div className="mt-12 pt-8 border-t border-primary/5 grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {selectedCards.map((card, idx) => (
                           <div key={idx} className="flex gap-3 items-center opacity-60 hover:opacity-100 transition-opacity">
                             <img 
                               src={card.imageUrl} 
                               className={`w-8 h-12 object-cover rounded shadow-md ${card.isReversed ? 'rotate-180' : ''}`} 
                               onError={(e) => {
                                 const target = e.target as HTMLImageElement;
                                 target.src = CARD_IMAGES['card-back'];
                               }}
                             />
                             <div className="min-w-0">
                               <p className="text-[9px] text-primary font-bold truncate uppercase">{card.positionName}</p>
                               <p className="text-[11px] text-secondary font-serif italic truncate">{card.name[currentLang as 'vi' | 'en']}</p>
                             </div>
                           </div>
                        ))}
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
              className="fixed right-0 top-0 h-screen w-full max-w-md bg-surface-container shadow-2xl z-[101] p-8 border-l border-sepia"
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
                      className="bg-surface-container-highest/40 border border-sepia p-4 rounded-sm hover:bg-primary/5 transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-2 opacity-60">
                        <span className="text-[8px] text-primary uppercase font-bold tracking-widest">{t(`spreads.${item.spreadType.toLowerCase().replace(' ', '_')}`, { defaultValue: item.spreadType })}</span>
                        <span className="text-[8px] text-outline italic">{new Date(item.timestamp).toLocaleDateString(currentLang)}</span>
                      </div>
                      <p className="text-xs font-serif italic text-secondary group-hover:text-primary transition-colors line-clamp-1 mb-2">{item.question}</p>
                      <div className="flex gap-1.5 opacity-40 group-hover:opacity-70 transition-opacity">
                        {item.cards.map((c: any, i: number) => (
                          <div key={i} className="w-4 h-6 rounded-xs bg-surface-dim border border-sepia overflow-hidden">
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
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md bg-surface-container border border-sepia shadow-2xl z-[251] p-8 rounded-sm"
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
                    className="w-full bg-surface-dim border border-sepia p-3 text-secondary focus:border-primary outline-none transition-all rounded-xs"
                  >
                    <option value="gemini-3-flash-preview">Gemini 3 Flash (Fast)</option>
                    <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Deep insight)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-outline mb-2 block">API Key (Optional)</label>
                  <input 
                    type="password"
                    placeholder="Enter your Gemini API key"
                    value={aiSettings.apiKey}
                    onChange={(e) => setAiSettings({ ...aiSettings, apiKey: e.target.value })}
                    className="w-full bg-surface-dim border border-sepia p-3 text-secondary focus:border-primary outline-none transition-all rounded-xs"
                  />
                  <p className="text-[9px] text-outline/50 mt-2 italic">
                    {currentLang === 'vi' 
                      ? 'Ghi chú: Nếu để trống, hệ thống sẽ sử dụng key mặc định.' 
                      : 'Note: If left blank, the default system key will be used.'}
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
                      {currentLang === 'vi' ? 'Xóa bộ nhớ tạm' : 'Clear Cache'}
                    </Button>
                   ) : (
                     <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl space-y-3">
                       <p className="text-[11px] text-red-400 italic font-serif text-center">
                         {currentLang === 'vi' ? 'Bạn chắc chắn muốn xóa mọi dữ liệu cài đặt?' : 'Are you sure you want to clear all settings?'}
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
                           {currentLang === 'vi' ? 'Xóa' : 'Clear'}
                         </Button>
                         <Button 
                           variant="tertiary" 
                           className="flex-1"
                           onClick={() => setIsConfirmClearOpen(false)}
                         >
                           {currentLang === 'vi' ? 'Hủy' : 'Cancel'}
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
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-28 right-6 lg:right-10 w-[min(calc(100vw-48px),400px)] h-[500px] bg-surface-container border border-sepia shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-[225] flex flex-col rounded-2xl overflow-hidden backdrop-blur-xl"
          >
            <div className="p-4 bg-primary/10 border-b border-sepia/30 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <h3 className="text-sm font-serif italic text-primary">{t('chat.title')}</h3>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-outline hover:text-primary transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
              {!isReadingComplete && (
                <div className="text-center py-6 px-4 bg-primary/5 rounded-xl border border-primary/10 mb-4">
                  <Info className="w-5 h-5 text-primary mx-auto mb-2 opacity-50" />
                  <p className="text-[10px] uppercase tracking-wider text-primary font-bold mb-1">Oracle Guidance</p>
                  <p className="text-xs text-secondary/70 italic font-serif">
                    {currentLang === 'vi' 
                      ? 'Bạn có thể trò chuyện với Oracle bất cứ lúc nào, nhưng Oracle sẽ hiểu rõ bạn hơn nếu bạn đã thực hiện một trải bài.' 
                      : 'You can converse with the Oracle anytime, but insights are deepest when tied to a specific reading.'}
                  </p>
                </div>
              )}
              
              {chatMessages.length === 0 && (
                <div className="text-center py-12 opacity-30 italic font-serif">
                  <p className="text-sm">{currentLang === 'vi' ? 'Hãy hỏi tôi bất cứ điều gì...' : 'Ask me anything...'}</p>
                </div>
              )}
              
              {chatMessages.map((msg, i) => (
                <div key={i} className={cn(
                  "max-w-[85%] rounded-2xl p-4 text-xs font-serif italic leading-relaxed",
                  msg.role === 'user' 
                    ? "ml-auto bg-primary text-surface-dim shadow-md" 
                    : "mr-auto bg-surface-container-highest border border-sepia/30 text-secondary"
                )}>
                  {msg.content}
                </div>
              ))}
              {isChatLoading && (
                <div className="mr-auto bg-surface-container-highest border border-sepia/30 rounded-2xl p-4 flex gap-2">
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
              )}
            </div>

            <div className="p-4 bg-surface-dim border-t border-sepia/30">
              <div className="flex gap-2 p-1 bg-surface-container ml-auto rounded-full items-center border border-sepia focus-within:border-primary transition-colors">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={t('chat.placeholder')}
                  className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-xs text-secondary placeholder:text-outline/40"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={isChatLoading || !chatInput.trim()}
                  className="w-8 h-8 bg-primary text-surface-dim rounded-full flex items-center justify-center disabled:opacity-30 active:scale-90 transition-all cursor-pointer shadow-lg"
                >
                  <Send className="w-3 h-3" />
                </button>
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
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg bg-surface-container border border-sepia shadow-2xl z-[241] p-8 rounded-2xl flex flex-col max-h-[80vh] overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Info className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-serif italic text-secondary">
                    {currentLang === 'vi' ? 'Hướng dẫn sứ giả' : 'Messenger Guide'}
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
                  <h4 className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2">1. {currentLang === 'vi' ? 'Khởi đầu' : 'Initiation'}</h4>
                  <p>{currentLang === 'vi' ? 'Nhập câu hỏi của bạn hoặc điều bạn đang băn khoăn vào ô nhập liệu. Sau đó nhấn nút "Bốc bài" hoặc "Hỏi Oracle".' : 'Enter your question or what is on your mind in the input field. Then press the "Draw Card" or "Ask Oracle" button.'}</p>
                </section>

                <section>
                  <h4 className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2">2. {currentLang === 'vi' ? 'Nghi thức' : 'Ritual'}</h4>
                  <p>{currentLang === 'vi' ? 'Các lá bài sẽ được xáo và trải ra theo sơ đồ bạn đã chọn. Hãy tập trung vào câu hỏi của mình trong lúc này.' : 'The cards will be shuffled and spread according to your chosen layout. Focus on your question during this time.'}</p>
                </section>

                <section>
                  <h4 className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2">3. {currentLang === 'vi' ? 'Lời giải' : 'Interpretation'}</h4>
                  <p>{currentLang === 'vi' ? 'Oracle sẽ phân tích các lá bài và đưa ra lời giải đáp. Bạn có thể lưu lại vào Nhật ký nếu đã đăng nhập.' : 'The Oracle will analyze the cards and provide an interpretation. You can save it to your Journal if you are signed in.'}</p>
                </section>

                <section>
                  <h4 className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2">4. {currentLang === 'vi' ? 'Trò chuyện' : 'Conversation'}</h4>
                  <p>{currentLang === 'vi' ? 'Sử dụng biểu tượng tin nhắn ở góc dưới bên phải để trò chuyện thêm với Oracle về trải bài hoặc bất cứ điều gì bạn muốn.' : 'Use the message icon in the bottom right corner to further converse with the Oracle about the reading or anything you wish.'}</p>
                </section>
              </div>

              <div className="mt-8 pt-6 border-t border-sepia/30 text-center">
                <Button onClick={() => setIsGuideOpen(false)} variant="primary" className="px-8 py-2 rounded-full">
                  {currentLang === 'vi' ? 'Đã hiểu' : 'Understood'}
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

export default function App() {
  return (
    <FirebaseProvider>
      <TarotApp />
    </FirebaseProvider>
  );
}
