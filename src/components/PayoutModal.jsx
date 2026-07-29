export default function PayoutModal({ showPayoutModal, setShowPayoutModal, payoutAmount, setPayoutAmount, handlePayout }) {
  if (!showPayoutModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto max-w-xs w-full shadow-2xl space-y-4 text-center">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
          💵
        </div>
        <div>
          <h3 className="font-extrabold text-slate-800 text-base">Registrar Pago a {showPayoutModal.name}</h3>
          <p className="text-xs text-slate-400 mt-1">Saldo acumulado actual: {Number(showPayoutModal.balance || 0).toFixed(2)}€</p>
        </div>
        <form onSubmit={handlePayout} className="space-y-3">
          <input
            type="number"
            step="0.10"
            value={payoutAmount}
            onChange={(e) => setPayoutAmount(e.target.value)}
            placeholder="Cantidad entregada en metálico"
            className="w-full p-3 text-center text-lg font-bold border border-slate-200 rounded-xl"
          />
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => { setShowPayoutModal(null); setPayoutAmount(''); }}
              className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold text-xs rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
            >
              Descontar Saldo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
