import { Gift, Plus, X, Wand2 } from 'lucide-react';

export default function ManageRewardsModal({
  show,
  onClose,
  rewards,
  newReward,
  setNewReward,
  editingReward,
  setEditingReward,
  onSave,
  onDelete,
  rewardIcons,
  rewardCategories
}) {
  if (!show) return null;

  const startEdit = (reward) => {
    setEditingReward(reward);
    setNewReward({
      name: reward.name,
      description: reward.description || '',
      price: String(reward.price),
      icon: reward.icon || '🎁',
      category: reward.category || 'other',
      stock: reward.stock === null || reward.stock === undefined ? '' : String(reward.stock)
    });
  };

  const reset = () => {
    setEditingReward(null);
    setNewReward({ name: '', description: '', price: '5.00', icon: '🎁', category: 'toys', stock: '' });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto max-w-2xl w-full shadow-2xl space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <div className="flex items-center space-x-2 text-amber-600 font-extrabold text-base">
            <Gift className="w-5 h-5" />
            <h3 className="text-slate-800">Gestionar Recompensas</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {rewards.map(reward => (
            <div key={reward.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{reward.icon}</span>
                <div>
                  <p className="font-bold text-sm text-slate-800">{reward.name}</p>
                  <p className="text-xs text-slate-500">{Number(reward.price).toFixed(2)}€ • {rewardCategories.find(c => c.id === reward.category)?.label || reward.category}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button onClick={() => startEdit(reward)} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="Editar">
                  <Wand2 className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(reward.id)} className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Eliminar">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <button onClick={reset} className="w-full py-2.5 border border-dashed border-slate-300 rounded-xl text-slate-600 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition">
            <Plus className="w-4 h-4" /> Añadir recompensa
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-3 border-t pt-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase">{editingReward ? 'Editar recompensa' : 'Nueva recompensa'}</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Nombre</label>
              <input
                type="text"
                value={newReward.name}
                onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
                placeholder="Ej: Helado"
                required
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Precio (€)</label>
              <input
                type="number"
                step="0.05"
                min="0.05"
                value={newReward.price}
                onChange={(e) => setNewReward({ ...newReward, price: e.target.value })}
                required
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Descripción</label>
            <input
              type="text"
              value={newReward.description}
              onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
              placeholder="Breve descripción"
              className="w-full p-2.5 text-xs border border-slate-200 rounded-xl"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Categoría</label>
              <select
                value={newReward.category}
                onChange={(e) => setNewReward({ ...newReward, category: e.target.value })}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl"
              >
                {rewardCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Stock (opcional)</label>
              <input
                type="number"
                min="0"
                value={newReward.stock}
                onChange={(e) => setNewReward({ ...newReward, stock: e.target.value })}
                placeholder="Sin límite"
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Icono</label>
            <div className="flex flex-wrap gap-2">
              {rewardIcons.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setNewReward({ ...newReward, icon })}
                  className={`text-xl p-2 rounded-xl border transition ${newReward.icon === icon ? 'bg-amber-100 border-amber-500 scale-110' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={reset} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition">Cancelar</button>
            <button type="submit" className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition">{editingReward ? 'Guardar cambios' : 'Añadir recompensa'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
