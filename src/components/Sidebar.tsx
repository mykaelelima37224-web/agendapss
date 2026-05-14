import { motion } from 'motion/react';
import { Calendar, CheckSquare, FileText, Home, LogOut, User, Menu, X } from 'lucide-react';
import { auth, logout } from '../lib/firebase';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Início', icon: Home },
    { id: 'calendar', label: 'Agenda', icon: Calendar },
    { id: 'tasks', label: 'Tarefas', icon: CheckSquare },
    { id: 'notes', label: 'Notas', icon: FileText },
  ];

  const user = auth.currentUser;

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-sm"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar container */}
      <motion.aside 
        initial={false}
        animate={{ x: isOpen ? 0 : -300 }}
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-bg border-r border-line z-40 transition-all duration-300 ease-in-out lg:translate-x-0",
          !isOpen && "lg:block"
        )}
      >
        <div className="flex flex-col h-full py-12 px-8">
          {/* Logo */}
          <div className="mb-16">
            <span className="font-serif italic text-3xl tracking-tight text-ink">Agenda.</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between py-4 text-sm font-medium border-b border-line transition-all duration-200 group truncate",
                  activeTab === item.id 
                    ? "text-ink" 
                    : "text-muted hover:text-ink"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn(
                    "w-4 h-4",
                    activeTab === item.id ? "text-accent" : "text-muted"
                  )} />
                  <span>{item.label}</span>
                </div>
                {activeTab === item.id && (
                  <motion.div layoutId="nav-indicator" className="w-1.5 h-1.5 rounded-full bg-accent" />
                )}
              </button>
            ))}
          </nav>

          {/* User Profile & Logout */}
          <div className="mt-auto pt-8 border-t border-line">
            <div className="flex items-center gap-3 mb-6">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full grayfilter grayscale" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-line flex items-center justify-center">
                  <User className="w-4 h-4 text-muted" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-ink truncate uppercase tracking-wider">{user?.displayName?.split(' ')[0] || 'User'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-xs font-bold text-muted hover:text-ink transition-colors uppercase tracking-widest"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30" 
        />
      )}
    </>
  );
}
