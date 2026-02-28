import { useNotifications } from '@/src/contexts/NotificationContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Award, Settings, ShieldCheck, BellOff, CheckCircle2, Trash2 } from 'lucide-react';
import { Notification } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';

const NotificationIcon = ({ tipo }: { tipo: Notification['tipo'] }) => {
  const icons = {
    evento: <Calendar className="w-6 h-6 text-blue-600" />,
    certificado: <Award className="w-6 h-6 text-green-600" />,
    sistema: <Settings className="w-6 h-6 text-gray-600" />,
    vinculo: <ShieldCheck className="w-6 h-6 text-purple-600" />,
  };
  const bgColors = {
    evento: 'bg-blue-50',
    certificado: 'bg-green-50',
    sistema: 'bg-gray-50',
    vinculo: 'bg-purple-50',
  };
  return (
    <div className={`w-14 h-14 rounded-2xl ${bgColors[tipo]} flex items-center justify-center flex-shrink-0`}>
        {icons[tipo]}
    </div>
  );
};

const TimeAgo = ({ date }: { date: Date }) => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `Há ${Math.floor(interval)} anos`;
    interval = seconds / 2592000;
    if (interval > 1) return `Há ${Math.floor(interval)} meses`;
    interval = seconds / 86400;
    if (interval > 1) return `Há ${Math.floor(interval)} dias`;
    interval = seconds / 3600;
    if (interval > 1) return `Há ${Math.floor(interval)} horas`;
    interval = seconds / 60;
    if (interval > 1) return `Há ${Math.floor(interval)} min`;
    return 'Agora mesmo';
}

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(Number(notification.id));
    if (notification.referenciaId) {
        if (notification.tipo === 'evento') {
            navigate(`/evento/${notification.referenciaId}`);
        }
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <header className="flex justify-between items-center mb-10">
        <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900 font-bold group">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 mr-3 group-hover:scale-110 transition-transform">
            <ArrowLeft className="w-5 h-5" />
          </div>
          Voltar
        </Link>
        {notifications.length > 0 && (
            <button 
                onClick={markAllAsRead} 
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors"
            >
                <CheckCircle2 className="w-4 h-4" />
                Marcar todas
            </button>
        )}
      </header>

      <div className="space-y-6">
        <div className="flex items-baseline justify-between px-2">
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Notificações</h1>
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                {notifications.filter(n => !n.lida).length} não lidas
            </span>
        </div>

        <AnimatePresence mode="popLayout">
            {notifications.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-24 bg-white rounded-[3rem] border border-gray-100 shadow-sm"
                >
                    <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                        <BellOff className="w-12 h-12 text-gray-200" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Tudo em dia!</h2>
                    <p className="mt-2 text-gray-500 font-bold max-w-xs mx-auto">Você não possui novas notificações no momento.</p>
                </motion.div>
            ) : (
                <div className="space-y-3">
                    {notifications.map(notification => (
                        <motion.div 
                            layout
                            key={notification.id} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`group relative flex items-start gap-5 p-5 rounded-[2rem] border transition-all cursor-pointer ${
                                notification.lida 
                                ? 'bg-white border-gray-100 opacity-70' 
                                : 'bg-white border-indigo-100 shadow-lg shadow-indigo-500/5'
                            }`}
                            onClick={() => handleNotificationClick(notification)}
                        >
                            {!notification.lida && (
                                <span className='absolute top-6 right-6 w-3 h-3 bg-indigo-600 rounded-full ring-4 ring-indigo-50'></span>
                            )}
                            
                            <NotificationIcon tipo={notification.tipo} />
                            
                            <div className='flex-grow pr-6'>
                                <div className="flex justify-between items-start">
                                    <p className={`font-black text-lg tracking-tight leading-tight ${notification.lida ? 'text-gray-600' : 'text-gray-900'}`}>
                                        {notification.titulo}
                                    </p>
                                </div>
                                <p className={`text-sm font-medium mt-1 ${notification.lida ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {notification.mensagem}
                                </p>
                                <div className="flex items-center gap-3 mt-3">
                                    <span className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>
                                        <TimeAgo date={new Date(notification.created_at)} />
                                    </span>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); deleteNotification(Number(notification.id)); }}
                                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}