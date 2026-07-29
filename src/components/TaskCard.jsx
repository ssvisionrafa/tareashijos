import { CheckCircle, Clock, Zap, Camera, Volume2, Loader2, Wand2, X, Flame, Sparkles } from 'lucide-react';

export default function TaskCard({
  task,
  currentKid,
  role,
  isParentUnlocked,
  onMarkCompleted,
  onPhotoUpload,
  onSpeakCheer,
  onEdit,
  onDelete,
  inspectingTaskId,
  aiInspectingTask,
  speakingTaskId,
  getCategoryIcon,
  getCategoryStyle,
  readonly = false
}) {
  const isDone = task.status === 'completed';
  const isApproved = task.status === 'approved';

  return (
    <div
      className={`p-4 rounded-2xl border transition flex flex-col justify-between space-y-3 ${
        isApproved
          ? 'bg-emerald-50/70 border-emerald-200'
          : isDone
          ? 'bg-sky-50/70 border-sky-200'
          : task.isExtra
          ? 'bg-indigo-50/70 border-indigo-200 hover:border-indigo-300'
          : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-3xl p-2 bg-slate-100 rounded-xl">{task.icon || getCategoryIcon(task.category)}</span>
          <div>
            <h3 className={`font-bold text-slate-800 text-sm ${isApproved ? 'line-through text-slate-500' : ''}`}>
              {task.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`text-[10px] px-2 py-0.5 font-semibold rounded-md border ${getCategoryStyle(task.category)}`}>
                {task.category}
              </span>
              {task.isExtra && (
                <span className="text-[10px] px-2 py-0.5 bg-indigo-100 text-indigo-700 font-bold rounded-md flex items-center gap-1">
                  <Flame className="w-3 h-3 text-indigo-500" /> BONO EXTRA
                </span>
              )}
              {task.requiresPhoto && (
                <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 font-bold rounded-md flex items-center gap-1">
                  <Camera className="w-3 h-3 text-amber-600" /> FOTO
                </span>
              )}
              {task.timerMinutes > 0 && (
                <span className="text-[10px] px-2 py-0.5 bg-sky-100 text-sky-700 font-bold rounded-md flex items-center gap-1">
                  <Clock className="w-3 h-3 text-sky-600" /> {task.timerMinutes} min
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-base font-black ${task.isExtra ? 'text-indigo-600' : 'text-emerald-600'}`}>
            +{Number(task.reward).toFixed(2)}€
          </span>
          {(role === 'parent' || isParentUnlocked) && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onEdit(task)}
                className="px-2 py-1 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition flex items-center gap-1"
                title="Editar tarea"
                data-testid="edit-task"
              >
                <Wand2 className="w-3.5 h-3.5" /> Editar
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="px-2 py-1 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition flex items-center gap-1"
                title="Eliminar tarea"
              >
                <X className="w-3.5 h-3.5" /> Eliminar
              </button>
            </div>
          )}
        </div>
      </div>

      {task.description && (
        <p className="text-[11px] text-slate-500 leading-relaxed">{task.description}</p>
      )}

      {task.aiFeedback && (
        <div className="bg-sky-100/70 p-2.5 rounded-xl text-xs space-y-1 text-slate-700">
          <p className="font-bold text-sky-900 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" /> Comentario IA:
          </p>
          <p>{task.aiFeedback}</p>
        </div>
      )}

      {task.photoUrl && (
        <div className="flex items-start space-x-3 bg-white/70 p-3 rounded-xl">
          <img src={task.photoUrl} alt="Prueba tarea" className="w-16 h-16 object-cover rounded-lg border border-sky-200 shrink-0" />
        </div>
      )}

      <div className="pt-1 flex items-center space-x-2">
        {isApproved ? (
          <div className="w-full py-2 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> ¡Completada y Sumada!
          </div>
        ) : isDone ? (
          <div className="w-full py-2 bg-sky-100 text-sky-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5">
            <Clock className="w-4 h-4 text-sky-600 animate-pulse" /> Esperando aprobación de los papás
          </div>
        ) : readonly ? null : (
          <>
            <button
              onClick={() => onMarkCompleted(task.id)}
              className={`flex-1 py-3 font-black text-xs uppercase tracking-wider rounded-xl shadow-sm flex items-center justify-center gap-2 transition active:scale-95 min-h-[48px] ${
                task.isExtra
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white'
              }`}
            >
              <Zap className="w-4 h-4 fill-current" /> Hecho
            </button>

            <label className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer transition flex items-center justify-center min-h-[48px] min-w-[48px]" title="Subir foto comprobante con IA">
              {inspectingTaskId === task.id && aiInspectingTask ? (
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onPhotoUpload(task.id, e.target.files[0])}
                disabled={aiInspectingTask}
              />
            </label>
          </>
        )}

        {!readonly && (
          <button
            onClick={() => onSpeakCheer(task.id, `¡Muy bien ${currentKid?.name || ''}! ¡Sigue así completando la tarea ${task.title} para ganar tu recompensa!`)}
            className="p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition flex items-center justify-center min-h-[48px] min-w-[48px]"
            title="Escuchar voz de ánimo IA"
            disabled={speakingTaskId === task.id}
          >
            {speakingTaskId === task.id ? (
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
