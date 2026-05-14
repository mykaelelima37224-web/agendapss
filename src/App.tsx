import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import { auth } from './lib/firebase';
import LandingPage from './components/LandingPage';
import DashboardView from './components/DashboardView';
import Sidebar from './components/Sidebar';
import Modal from './components/Modal';
import { useAgendaData } from './hooks/useAgendaData';
import { Calendar, CheckSquare, FileText, Plus, Trash2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(true);

  // Modal states
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);

  const { events, tasks, notes, addEvent, addTask, addNote, updateTask, deleteEvent, deleteTask, deleteNote } = useAgendaData();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsRefreshing(false);
    });
    return unsub;
  }, []);

  if (isRefreshing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            events={events} 
            tasks={tasks} 
            onAddTask={() => setIsAddTaskOpen(true)}
            onAddEvent={() => setIsAddEventOpen(true)}
          />
        );
      case 'calendar':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Agenda Completa</h1>
              <button 
                onClick={() => setIsAddEventOpen(true)}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" /> Novo Compromisso
              </button>
            </div>
            <div className="grid gap-4">
              {events.map(event => (
                <div key={event.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex justify-between items-center group">
                  <div className="flex gap-6">
                    <div className="text-center min-w-[80px]">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                        {event.start?.toDate().toLocaleDateString('pt-BR', { weekday: 'short' })}
                      </p>
                      <p className="text-2xl font-black text-gray-900 leading-none">
                        {event.start?.toDate().getDate()}
                      </p>
                    </div>
                    <div className="border-l border-gray-100 pl-6">
                      <h3 className="font-bold text-lg text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{event.description || 'Sem descrição'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteEvent(event.id)}
                    className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {events.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum compromisso agendado ainda.</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'tasks':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Minhas Tarefas</h1>
              <button 
                onClick={() => setIsAddTaskOpen(true)}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" /> Nova Tarefa
              </button>
            </div>
            <div className="grid gap-3">
              {tasks.map(task => (
                <div key={task.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => updateTask(task.id, { completed: !task.completed })}
                      className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-200 hover:border-black'}`}
                    >
                      {task.completed && <CheckSquare className="w-4 h-4 text-white" />}
                    </button>
                    <span className={`font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                      {task.title}
                    </span>
                  </div>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {tasks.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Sua lista de tarefas está vazia.</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'notes':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Notas Pessoais</h1>
              <button 
                onClick={() => setIsAddNoteOpen(true)}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" /> Nova Nota
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map(note => (
                <div key={note.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col group">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-gray-900">{note.title}</h3>
                    <button 
                      onClick={() => deleteNote(note.id)}
                      className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm whitespace-pre-wrap flex-1">{note.content}</p>
                  <p className="text-xs text-gray-400 mt-4">
                    Editado em {note.updatedAt?.toDate().toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
              {notes.length === 0 && (
                <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Capture suas ideias em notas rápidas.</p>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="lg:ml-64 p-4 md:p-8 pt-20 lg:pt-8 min-h-screen">
        <div className="max-w-5xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* Feature Navigation for Mobile */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button 
          onClick={() => {
            if (activeTab === 'calendar') setIsAddEventOpen(true);
            else if (activeTab === 'tasks') setIsAddTaskOpen(true);
            else if (activeTab === 'notes') setIsAddNoteOpen(true);
            else setIsAddEventOpen(true);
          }}
          className="w-14 h-14 bg-black text-white rounded-full shadow-xl flex items-center justify-center transform active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* MODALS */}
      <Modal isOpen={isAddEventOpen} onClose={() => setIsAddEventOpen(false)} title="Novo Compromisso">
        <EventForm onClose={() => setIsAddEventOpen(false)} onSave={addEvent} />
      </Modal>

      <Modal isOpen={isAddTaskOpen} onClose={() => setIsAddTaskOpen(false)} title="Nova Tarefa">
        <TaskForm onClose={() => setIsAddTaskOpen(false)} onSave={addTask} />
      </Modal>

      <Modal isOpen={isAddNoteOpen} onClose={() => setIsAddNoteOpen(false)} title="Nova Nota">
        <NoteForm onClose={() => setIsAddNoteOpen(false)} onSave={addNote} />
      </Modal>
    </div>
  );
}

// Helper Forms
function EventForm({ onClose, onSave }: any) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState('12:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const start = new Date(`${date}T${time}`);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // Default 1 hour
    onSave({ 
      title, 
      description, 
      start: Timestamp.fromDate(start), 
      end: Timestamp.fromDate(end) 
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
        <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
        <input type="time" required value={time} onChange={(e) => setTime(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black h-20" />
      </div>
      <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">Criar Evento</button>
    </form>
  );
}

function TaskForm({ onClose, onSave }: any) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, completed: false, priority });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">O que precisa ser feito?</label>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black">
          <option value="low">Baixa</option>
          <option value="medium">Média</option>
          <option value="high">Alta</option>
        </select>
      </div>
      <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">Adicionar Tarefa</button>
    </form>
  );
}

function NoteForm({ onClose, onSave }: any) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, content });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo</label>
        <textarea required value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black h-40" />
      </div>
      <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">Salvar Nota</button>
    </form>
  );
}

function format(date: Date, formatStr: string) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return formatStr.replace('yyyy', String(yyyy)).replace('MM', mm).replace('dd', dd);
}
