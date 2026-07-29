import { useState } from 'react';
import { Users, ArrowRight, Sparkles } from 'lucide-react';

export default function OnboardingModal({ show, kids, onComplete, avatarOptions, kidColors }) {
  const [step, setStep] = useState(1);
  const [familyName, setFamilyName] = useState('');
  const [kidName, setKidName] = useState('');
  const [kidAge, setKidAge] = useState(8);
  const [kidWeeklyGoal, setKidWeeklyGoal] = useState(10);
  const [kidAvatar, setKidAvatar] = useState('👧');
  const [kidColor, setKidColor] = useState('indigo');
  const [addedKids, setAddedKids] = useState([]);

  const handleAddKid = () => {
    if (!kidName.trim()) return;
    const newKid = {
      id: `kid_${Date.now()}`,
      name: kidName.trim(),
      age: kidAge,
      avatar: kidAvatar,
      color: kidColor,
      balance: 0,
      goalName: '',
      goalAmount: 15,
      weeklyGoal: Math.round(kidWeeklyGoal * 100) / 100,
      goalImage: null,
      photoUrl: null,
      createdAt: new Date().toISOString()
    };
    setAddedKids([...addedKids, newKid]);
    setKidName('');
    setKidAge(8);
    setKidWeeklyGoal(10);
  };

  const handleFinish = () => {
    onComplete(familyName.trim() || 'Mi Familia', addedKids.length > 0 ? addedKids : kids);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-center my-auto max-h-[90vh] overflow-y-auto">
        {step === 1 && (
          <>
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto text-3xl">
              💶
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Bienvenido a KidCoins</h2>
              <p className="text-sm text-slate-500 mt-2">La app donde tus hijos aprenden responsabilidad y el valor del esfuerzo completando tareas y ahorrando para sus metas.</p>
            </div>
            <div className="space-y-3 text-left">
              <label className="text-xs font-bold text-slate-700 block">Nombre de tu familia:</label>
              <input
                type="text"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                placeholder="Ej: Familia Aguilar"
                className="w-full p-3 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition"
            >
              Siguiente <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Añade a tus hijos</h2>
              <p className="text-sm text-slate-500 mt-2">Puedes añadir tantos como necesites. Más tarde podrás gestionarlos desde el panel.</p>
            </div>

            <div className="space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nombre del hijo/a</label>
                <input
                  type="text"
                  name="name"
                  value={kidName}
                  onChange={(e) => setKidName(e.target.value)}
                  placeholder="Ej: Lucía"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Edad</label>
                  <input
                    type="number"
                    name="age"
                    min="1"
                    max="18"
                    value={kidAge}
                    onChange={(e) => setKidAge(parseInt(e.target.value) || 1)}
                    placeholder="Ej: 8"
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Objetivo semanal (€)</label>
                  <input
                    type="number"
                    name="weeklyGoal"
                    step="0.50"
                    min="1"
                    value={kidWeeklyGoal}
                    onChange={(e) => setKidWeeklyGoal(parseFloat(e.target.value) || 0)}
                    placeholder="Ej: 10"
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Avatar</label>
                <div className="flex gap-2 justify-center max-h-40 overflow-y-auto overflow-x-hidden p-2 bg-slate-50 rounded-xl border border-slate-200" style={{ flexWrap: 'wrap' }}>
                  {avatarOptions.map(av => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setKidAvatar(av)}
                      className={`text-2xl w-12 h-12 flex items-center justify-center rounded-xl border transition flex-shrink-0 ${kidAvatar === av ? 'bg-indigo-100 border-indigo-500 scale-110 z-10' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                      title={`Avatar ${av}`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Color</label>
                <div className="flex gap-2 justify-center" style={{ flexWrap: 'wrap' }}>
                  {kidColors.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setKidColor(c.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold text-white ${c.bg} border-2 flex-shrink-0 ${kidColor === c.id ? 'border-slate-800 scale-110' : 'border-transparent'}`}
                      title={`Color ${c.label}`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleAddKid}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                Añadir hijo
              </button>
            </div>

            {addedKids.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700">Hijos añadidos:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {addedKids.map(k => (
                    <span key={k.id} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">{k.avatar} {k.name} • {k.weeklyGoal.toFixed(2)}€/sem</span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleFinish}
              disabled={addedKids.length === 0 && kids.length === 0}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4" /> Comenzar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
