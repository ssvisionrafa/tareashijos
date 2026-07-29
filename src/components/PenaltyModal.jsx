import { AlertTriangle } from 'lucide-react';

export default function PenaltyModal({ showPenaltyModal, setShowPenaltyModal, penaltyAmount, setPenaltyAmount, penaltyReason, setPenaltyReason, handleApplyPenalty }) {
  if (!showPenaltyModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto max-w-xs w-full shadow-2xl space-y-4 text-center">
        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-extrabold text-slate-800 text-base">Penalizar a {showPenaltyModal.name}</h3>
          <p className="text-xs text-slate-400 mt-1">Saldo actual: {Number(showPenaltyModal.balance || 0).toFixed(2)}€</p>
        </div>
        <form onSubmit={handleApplyPenalty} className="space-y-3">
          <input
            type="number"
            step="0.10"
            min="0.10"
            value={penaltyAmount}
            onChange={(e) => setPenaltyAmount(e.target.value)}
            placeholder="Cantidad a descontar"
            className="w-full p-3 text-center text-lg font-bold border border-slate-200 rounded-xl"
            required
          />
          <input
            type="text"
            value={penaltyReason}
            onChange={(e) => setPenaltyReason(e.target.value)}
            placeholder="Motivo (opcional)"
            className="w-full p-2.5 text-xs border border-slate-200 rounded-xl"
          />
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => { setShowPenaltyModal(null); setPenaltyAmount(''); setPenaltyReason(''); }}
              className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold text-xs rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl"
            >
              Aplicar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
