'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, HardDrive, Monitor, Gamepad2, Usb, Server, Keyboard, Wifi, X, Trophy } from 'lucide-react';

const icons = [Cpu, HardDrive, Monitor, Gamepad2, Usb, Server, Keyboard, Wifi];

type Card = {
  id: number;
  iconIdx: number;
  isFlipped: boolean;
  isMatched: boolean;
};

type EasterEggGameProps = {
  onClose: () => void;
};

const generateDeck = () => {
  const deck = [...icons, ...icons].map((_, idx) => ({
    id: idx,
    iconIdx: idx % icons.length,
    isFlipped: false,
    isMatched: false,
  }));
  
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  
  return deck;
};

export default function EasterEggGame({ onClose }: EasterEggGameProps) {
  const [cards, setCards] = useState<Card[]>(generateDeck);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const handleCardClick = (index: number) => {
    // Prevent clicking if 2 cards are already flipped, or if clicking an already flipped/matched card
    if (flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    // Flip the card
    setCards(prev => prev.map((card, idx) => 
      idx === index ? { ...card, isFlipped: true } : card
    ));
    
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);
    
    if (newFlipped.length === 1) {
      setMoves(m => m + 1);
    } else if (newFlipped.length === 2) {
      const [firstIdx, secondIdx] = newFlipped;
      
      if (cards[firstIdx].iconIdx === cards[secondIdx].iconIdx) {
        // Match found
        setCards(prev => prev.map((card, idx) => 
          idx === firstIdx || idx === secondIdx ? { ...card, isMatched: true } : card
        ));
        setFlippedIndices([]);
        
        // Check win condition
        if (cards.filter(c => c.isMatched).length === cards.length - 2) {
          setTimeout(() => setIsWon(true), 500);
        }
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          setCards(prev => prev.map((card, idx) => 
            idx === firstIdx || idx === secondIdx ? { ...card, isFlipped: false } : card
          ));
          setFlippedIndices([]);
        }, 800);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-navy-950/80"
    >
      <div className="relative w-full max-w-2xl mx-auto glass-panel border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/20 rounded-full blur-[80px] -z-10" />

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Cpu className="text-cyan-400" /> System Override
            </h2>
            <p className="text-slate-400 font-mono text-xs mt-1">Moves: {moves}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Victory Screen */}
        <AnimatePresence>
          {isWon && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-navy-950/90 backdrop-blur-sm rounded-2xl"
            >
              <Trophy size={64} className="text-cyan-400 mb-6 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
              <h3 className="text-4xl font-bold text-white mb-2">You Win!</h3>
              <p className="text-slate-400 mb-8 font-mono">Completed in {moves} moves.</p>
              <button 
                onClick={onClose}
                className="px-8 py-3 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-50 transition-all hover:scale-105"
              >
                Close Game
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Grid */}
        <div className="grid grid-cols-4 gap-3 md:gap-4 [perspective:1000px]">
          {cards.map((card, idx) => {
            const Icon = icons[card.iconIdx];
            return (
              <motion.div
                key={card.id}
                onClick={() => handleCardClick(idx)}
                className="relative w-full aspect-square cursor-pointer [transform-style:preserve-3d]"
                animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                {/* Back of Card (Hidden when flipped) */}
                <div className="absolute inset-0 [backface-visibility:hidden] bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
                  <span className="text-cyan-400/30 font-mono text-2xl font-bold select-none">&lt;/&gt;</span>
                </div>

                {/* Front of Card (Visible when flipped) */}
                <div className="absolute inset-0 [backface-visibility:hidden] bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 rounded-xl flex items-center justify-center [transform:rotateY(180deg)]">
                  <Icon size={32} className={`text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] ${card.isMatched ? 'opacity-50' : 'opacity-100'}`} />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </motion.div>
  );
}
