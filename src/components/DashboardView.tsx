import { format, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, CheckSquare, Clock, Plus } from 'lucide-react';
import { AgendaEvent, AgendaTask } from '../types';

interface DashboardViewProps {
  events: AgendaEvent[];
  tasks: AgendaTask[];
  onAddTask: () => void;
  onAddEvent: () => void;
}

export default function DashboardView({ events, tasks, onAddTask, onAddEvent }: DashboardViewProps) {
  const todayEvents = events.filter(e => isToday(e.start.toDate()));
  const pendingTasks = tasks.filter(t => !t.completed).slice(0, 5);
  const now = new Date();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Oversized Number Background */}
      <div className="oversized-number select-none">
        {format(now, 'dd')}
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
        {/* Main Content: Timeline */}
        <div className="space-y-12">
          <header className="mb-16">
            <p className="text-xs font-bold text-muted uppercase tracking-[0.2em] mb-3">
              {format(now, "eeee, MMMM", { locale: ptBR })}
            </p>
            <h1 className="text-6xl font-serif text-ink leading-tight">
              Dia {format(now, 'dd')}
            </h1>
          </header>

          <section className="schedule space-y-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xs font-bold text-muted uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-3 h-3" /> Agenda de Hoje
              </h2>
              <button 
                onClick={onAddEvent}
                className="text-xs font-bold text-accent hover:underline uppercase tracking-widest"
              >
                + Adicionar
              </button>
            </div>

            <div className="timeline-line space-y-8">
              {todayEvents.length > 0 ? (
                todayEvents.map(event => (
                  <div key={event.id} className="relative grid grid-cols-[80px_1fr] items-start group">
                    {/* Time */}
                    <div className="font-mono text-xs font-bold text-ink pt-1">
                      {format(event.start.toDate(), 'HH:mm')}
                    </div>
                    {/* Card */}
                    <div className={cn(
                      "bg-white p-6 border-l-4 rounded-r-2xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]",
                      event.category === 'trabalho' ? "border-ink" : "border-accent"
                    )}>
                      <h4 className="font-bold text-lg text-ink mb-1">{event.title}</h4>
                      <p className="text-sm text-muted leading-relaxed">
                        {event.description || 'Nenhuma descrição detalhada.'}
                      </p>
                      {event.location && (
                        <p className="text-[10px] text-muted mt-3 uppercase tracking-wider font-bold">
                          📍 {event.location}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 pl-4">
                  <p className="text-muted italic font-serif text-lg leading-relaxed">
                    "O tempo é o que mais queremos, mas o que pior usamos."
                  </p>
                  <p className="text-xs text-muted mt-4 uppercase tracking-widest">— William Penn</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Sidebar: Tasks */}
        <aside className="lg:border-l lg:border-line lg:pl-10 space-y-12">
          <section className="tasks">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xs font-bold text-muted uppercase tracking-widest">Pendências</h2>
              <button 
                onClick={onAddTask}
                className="text-muted hover:text-ink transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {pendingTasks.length > 0 ? (
                pendingTasks.map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-1 group">
                    <div className="w-4 h-4 rounded border border-line group-hover:border-ink transition-colors" />
                    <span className="text-sm text-ink group-hover:translate-x-1 transition-transform">{task.title}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted italic">Lista limpa por hoje.</p>
              )}
            </div>
          </section>

          <div className="p-6 bg-white border border-line rounded-2xl">
            <h3 className="text-xs font-bold text-ink uppercase tracking-wider mb-2">Foco do Dia</h3>
            <p className="text-xs text-muted leading-relaxed italic">
              "Sua agenda deve refletir seus valores, não apenas suas obrigações."
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
