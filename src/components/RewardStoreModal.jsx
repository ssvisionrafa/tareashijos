import { Gift, Coins, X } from 'lucide-react';

export default function RewardStoreModal({
  show,
  onClose,
  rewards,
  currentKid,
  onRequest
}) {
  if (!show) return null;

  const canAfford = (price) => (currentKid?.balance || 0) >= price;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto max-w-2xl w-full shadow-2xl space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <div className="flex items-center space-x-2 text-amber-600 font-extrabold text-base">
            <Gift className="w-5 h-5" />
            <h3 className="text-slate-800">Tienda de Recompensas</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-800 uppercase">Tu saldo disponible</p>
            <p className="text-2xl font-black text-amber-600">{Number(currentKid?.balance || 0).toFixed(2)}€</p>
          </div>
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl">
            🐷
          </div>
        </div>

        {rewards.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Gift className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-500">La tienda está vacía.</p>
            <p className="text-xs text-slate-400 mt-1">Pide a tus papás que añadan recompensas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rewards.map(reward => (
              <div key={reward.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-4xl">{reward.icon}</span>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{reward.name}</h4>
                      <p className="text-[10px] text-slate-500">{reward.description}</p>
                    </div>
                  </div>
                  <span className="font-black text-emerald-600">{Number(reward.price).toFixed(2)}€</span>
                </div>
                <button
                  onClick={() => onRequest(reward)}
                  disabled={!canAfford(reward.price)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                    canAfford(reward.price)
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Coins className="w-4 h-4" />
                  {canAfford(reward.price) ? 'Pedir recompensa' : 'Saldo insuficiente'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
