import { motion } from 'motion/react';
import { LogIn, Calendar, CheckSquare, FileText, Sparkles } from 'lucide-react';
import { loginWithGoogle } from '../lib/firebase';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg text-ink overflow-hidden font-sans">
      <nav className="relative z-10 flex justify-between items-center px-10 py-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="font-serif italic text-3xl tracking-tight">Agenda.</span>
        </div>
        <button
          onClick={loginWithGoogle}
          className="text-xs font-bold uppercase tracking-widest border-b border-ink pb-1 hover:text-accent hover:border-accent transition-all"
        >
          Acessar
        </button>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-10 pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-[10vw] lg:text-[8rem] font-serif leading-[0.85] tracking-tighter mb-12">
              Domine seu <br /> <span className="italic">Tempo.</span>
            </h1>
            <p className="text-xl text-muted max-w-md mb-12 leading-relaxed font-serif">
              Uma abordagem editorial para a produtividade pessoal. Simples, elegante e focado no que importa.
            </p>
            
            <button
              onClick={loginWithGoogle}
              className="px-10 py-5 bg-ink text-bg rounded-full font-bold text-sm uppercase tracking-widest hover:bg-accent transition-all shadow-xl"
            >
              Começar Agora
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="bg-white border border-line p-12 rounded-[2rem] shadow-2xl rotate-3 relative z-10">
              <div className="oversized-number opacity-10 !text-6xl !top-4 !right-4">14</div>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Maio, Quarta-feira</p>
              <h2 className="text-4xl font-serif mb-8 text-ink">Dia 14</h2>
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <div className="flex-1 border-b border-line pb-2">
                    <p className="text-sm font-bold text-ink">Reunião de Design</p>
                    <p className="text-[10px] text-muted">09:00 — 10:30</p>
                  </div>
                </div>
                <div className="flex gap-4 items-center opacity-40">
                  <div className="w-2 h-2 rounded-full bg-line" />
                  <div className="flex-1 border-b border-line pb-2">
                    <p className="text-sm font-bold text-ink">Almoço</p>
                    <p className="text-[10px] text-muted">12:30 — 13:30</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent/5 rounded-full blur-[100px] -z-10" />
          </motion.div>
        </div>
      </main>

      <footer className="px-10 py-12 border-t border-line text-center text-muted text-[10px] uppercase tracking-widest font-bold">
        <p>© 2026 Agenda Pessoal Pro — Design Editorial</p>
      </footer>
    </div>
  );
}
