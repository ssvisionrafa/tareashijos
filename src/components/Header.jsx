import { Users, User, Shield, Lock, Moon, Sun } from 'lucide-react';

export default function Header({ role, familyId, syncStatus, isParentUnlocked, toggleRole, setShowFamilyModal, kids, darkMode, setDarkMode }) {
  const kidsNames = kids?.map(k => k.name).filter(Boolean).join(' y ') || 'Tu familia';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-sm shrink-0">
            💶
          </div>
          <div className="min-w-0">
            <h1 className="font-extrabold text-base text-slate-800 leading-tight truncate">KidCoins</h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">{kidsNames}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowFamilyModal(true)}
            className="px-2.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition border border-indigo-200 min-h-[40px]"
            title="Sincronizar entre varios teléfonos/dispositivos"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Familia:</span>
            <span className="font-mono bg-indigo-200 text-indigo-900 px-1.5 py-0.5 rounded text-[11px]">{familyId}</span>
            {syncStatus === 'synced' && <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 ml-1" title="Sincronizado con la nube">●</span>}
            {syncStatus === 'offline' && <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-100 text-rose-600 ml-1" title="Sin conexión con la nube">●</span>}
            {syncStatus === 'connecting' && <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-600 ml-1 animate-pulse" title="Conectando...">●</span>}
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition min-h-[40px] min-w-[40px] flex items-center justify-center"
            title={darkMode ? 'Modo claro' : 'Modo oscuro'}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1">
            <button
              onClick={() => toggleRole('child')}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition min-h-[40px] ${
                role === 'child' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>Niños</span>
            </button>

            <button
              onClick={() => toggleRole('parent')}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition min-h-[40px] ${
                role === 'parent' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Padres</span>
              {!isParentUnlocked && <Lock className="w-3 h-3 text-slate-400 ml-0.5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
