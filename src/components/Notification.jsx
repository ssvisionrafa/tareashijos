export default function Notification({ notification }) {
  if (!notification) return null;

  return (
    <div className={`fixed bottom-5 left-4 right-4 sm:left-auto sm:right-5 z-50 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center space-x-2 transition max-w-sm ${
      notification.type === 'error' ? 'bg-rose-600 text-white' : notification.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-white'
    }`}>
      <span className="break-words">{notification.msg}</span>
    </div>
  );
}
