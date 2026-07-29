import { Lock } from 'lucide-react';

export default function PinModal({ showPinModal, setShowPinModal, pinInput, setPinInput, pinError, setPinError, handlePinSubmit }) {
  if (!showPinModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto max-w-xs w-full shadow-2xl space-y-4 text-center">
        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-extrabold text-slate-800 text-lg">Acceso Padres</h3>
          <p className="text-xs text-slate-400 mt-1">Introduce el PIN (Predeterminado: 1234 o déjalo en blanco)</p>
        </div>
        <form onSubmit={handlePinSubmit} className="space-y-3">
          <input
            type="password"
            maxLength={4}
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder="1234"
            className="w-full p-3 text-center text-xl font-mono tracking-widest border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
          {pinError && <p className="text-xs text-rose-500 font-bold">PIN Incorrecto</p>}
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => { setShowPinModal(false); setPinInput(''); setPinError(false); }}
              className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold text-xs rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
