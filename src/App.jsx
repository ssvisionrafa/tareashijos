import React, { useState, useEffect, useMemo, useRef } from 'react';
import { initializeApp } from 'firebase/app';

import { 
  getFirestore, 
  doc, 
  setDoc, 
  updateDoc, 
  collection, 
  onSnapshot,
  increment,
  writeBatch,
  enableNetwork
} from 'firebase/firestore';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  Plus, 
  Sparkles, 
  PiggyBank, 
  Gift, 
  RefreshCw, 
  Check, 
  X,
  Coins,
  Calendar,
  CheckCheck,
  Flame,
  LayoutGrid,
  ListFilter,
  Wand2,
  Image as ImageIcon,
  Loader2,
  BrainCircuit,
  Users,
  Copy,
  Smartphone,
  Wifi
} from 'lucide-react';

import Notification from './components/Notification';
import Header from './components/Header';
import TaskCard from './components/TaskCard';
import PinModal from './components/PinModal';
import PayoutModal from './components/PayoutModal';
import RewardStoreModal from './components/RewardStoreModal';
import ManageRewardsModal from './components/ManageRewardsModal';
import PenaltyModal from './components/PenaltyModal';
import OnboardingModal from './components/OnboardingModal';

const firebaseConfig = {
  apiKey: "AIzaSyAMnUHvpRcnI_X_R5j0HZf4KhGox39a-mg",
  authDomain: "tareashijos-77042.firebaseapp.com",
  projectId: "tareashijos-77042",
  storageBucket: "tareashijos-77042.firebasestorage.app",
  messagingSenderId: "844564314852",
  appId: "1:844564314852:web:8a25d1486732c9bacdcaf1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const appId = "1:844564314852:web:8a25d1486732c9bacdcaf1";

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const KID_COLORS = [
  { id: 'indigo', label: 'Índigo', bg: 'bg-indigo-500', text: 'text-indigo-600', light: 'bg-indigo-50', border: 'border-indigo-200' },
  { id: 'rose', label: 'Rosa', bg: 'bg-rose-500', text: 'text-rose-600', light: 'bg-rose-50', border: 'border-rose-200' },
  { id: 'emerald', label: 'Esmeralda', bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-200' },
  { id: 'amber', label: 'Ámbar', bg: 'bg-amber-500', text: 'text-amber-600', light: 'bg-amber-50', border: 'border-amber-200' },
  { id: 'sky', label: 'Cielo', bg: 'bg-sky-500', text: 'text-sky-600', light: 'bg-sky-50', border: 'border-sky-200' },
  { id: 'violet', label: 'Violeta', bg: 'bg-violet-500', text: 'text-violet-600', light: 'bg-violet-50', border: 'border-rose-200' },
  { id: 'orange', label: 'Naranja', bg: 'bg-orange-500', text: 'text-orange-600', light: 'bg-orange-50', border: 'border-orange-200' },
  { id: 'teal', label: 'Verde azulado', bg: 'bg-teal-500', text: 'text-teal-600', light: 'bg-teal-50', border: 'border-teal-200' }
];

const AVATAR_OPTIONS = ['👧', '👦', '👶', '👩', '👨', '🧒', '🧑', '🦄', '🐶', '🐱', '🦁', '🐯', '🐼', '🐨', '🦊', '🐰', '🐹', '🐭', '🐻', '🐸', '🐙', '🦖', '🚀', '⭐', '🌈', '🎸', '🎨', '⚽', '🏀', '🎮', '📚', '🔬', '🎭', '🎪'];

const CATEGORIES = [
  { id: 'Dormitorio', label: 'Dormitorio', icon: '🛏️', color: 'bg-violet-100 text-violet-700 border-violet-200' },
  { id: 'Cocina', label: 'Cocina', icon: '🍽️', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: 'Baño', label: 'Baño', icon: '🚿', color: 'bg-sky-100 text-sky-700 border-sky-200' },
  { id: 'Salón', label: 'Salón', icon: '🛋️', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { id: 'Jardín', label: 'Jardín', icon: '🌳', color: 'bg-green-100 text-green-700 border-green-200' },
  { id: 'Mascotas', label: 'Mascotas', icon: '🐾', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { id: 'Estudio', label: 'Estudio', icon: '📚', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { id: 'Deporte', label: 'Deporte', icon: '⚽', color: 'bg-rose-100 text-rose-700 border-rose-200' },
  { id: 'Extra', label: 'Extra / Bono', icon: '🔥', color: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200' },
  { id: 'General', label: 'General', icon: '⭐', color: 'bg-slate-100 text-slate-700 border-slate-200' }
];

const REWARD_ICONS = ['🎁', '🧸', '🎮', '📚', '🍦', '🍕', '🎬', '⚽', '🎨', '🎸', '🏖️', '💎', '⭐', '🚀', '🦄'];

const REWARD_CATEGORIES = [
  { id: 'toys', label: 'Juguetes', icon: '🧸' },
  { id: 'games', label: 'Videojuegos', icon: '🎮' },
  { id: 'books', label: 'Libros', icon: '📚' },
  { id: 'treats', label: 'Golosinas', icon: '🍦' },
  { id: 'experiences', label: 'Experiencias', icon: '🏖️' },
  { id: 'money', label: 'Dinero', icon: '💎' },
  { id: 'other', label: 'Otros', icon: '⭐' }
];

const RECURRENCE_OPTIONS = [
  { id: 'weekly', label: 'Semanal', desc: 'Se repite cada semana en el día asignado' },
  { id: 'daily', label: 'Diaria', desc: 'Disponible todos los días' },
  { id: 'once', label: 'Una sola vez', desc: 'No se repite tras completarse' }
];

const TASK_TEMPLATES = [
  { title: 'Hacer la cama y ordenar habitación', reward: 0.50, category: 'Dormitorio', icon: '🛏️', description: ' tender la cama, recoger juguetes y dejar la habitación ordenada.' },
  { title: 'Organizar ropa y zapatos', reward: 0.30, category: 'Dormitorio', icon: '👟', description: 'Guardar la ropa limpia y los zapatos en su lugar.' },
  { title: 'Pasar la escoba en la habitación', reward: 0.20, category: 'Dormitorio', icon: '🧹', description: 'Barrer el suelo de la habitación retirando polvo y pelusas.' },
  { title: 'Poner/quitar la mesa y fregar platos', reward: 0.43, category: 'Cocina', icon: '🍽️', description: 'Ayudar a poner la mesa y lavar los platos después de comer.' },
  { title: 'Entrenamiento Gimnasio (>30 min)', reward: 1.00, category: 'Deporte', icon: '🏋️‍♂️', description: 'Hacer ejercicio físico durante al menos 30 minutos.', isExtra: true, timerMinutes: 30 },
  { title: 'Leer 20 minutos', reward: 0.40, category: 'Estudio', icon: '📖', description: 'Leer un libro durante 20 minutos en voz alta o en silencio.', timerMinutes: 20 },
  { title: 'Recoger el jardín', reward: 0.50, category: 'Jardín', icon: '🍂', description: 'Recoger hojas, juguetes y dejar el jardín ordenado.' },
  { title: 'Pasear / alimentar a la mascota', reward: 0.35, category: 'Mascotas', icon: '🐕', description: 'Dar de comer o pasear a la mascota según corresponda.' },
  { title: 'Recoger la mesa del salón', reward: 0.25, category: 'Salón', icon: '🧺', description: 'Recoger juguetes y objetos del salón y dejarlo ordenado.' },
  { title: 'Lavar los dientes correctamente', reward: 0.20, category: 'Baño', icon: '🪥', description: 'Cepillarse los dientes al menos 2 minutos.', timerMinutes: 2 }
];

const sanitizeDocId = (str) => {
  return str
    .normalize('NFKC')
    .replace(/[/\\.]/g, '_')
    .replace(/^__/, '_')
    .replace(/^\.$/g, '_')
    .replace(/^\.{2,}$/g, '_')
    .slice(0, 100);
};

const createDefaultKid = (name = 'Niño', index = 1) => ({
  id: `kid_${Date.now()}_${index}`,
  name,
  avatar: index === 1 ? '👧' : '👦',
  color: KID_COLORS[(index - 1) % KID_COLORS.length].id,
  age: 8,
  balance: 0,
  goalName: '',
  goalAmount: 15,
  weeklyGoal: 10,
  goalImage: null,
  photoUrl: null,
  createdAt: new Date().toISOString()
});

const DEFAULT_KIDS = [
  { id: 'kid_enma', name: 'Enma', avatar: '👧', color: 'rose', age: 8, balance: 0, goalName: 'Set de Magia y Manualidades', goalAmount: 15, weeklyGoal: 10, goalImage: null, photoUrl: null, createdAt: new Date().toISOString() },
  { id: 'kid_matias', name: 'Matías', avatar: '👦', color: 'indigo', age: 6, balance: 0, goalName: 'Pista de Carreras', goalAmount: 15, weeklyGoal: 10, goalImage: null, photoUrl: null, createdAt: new Date().toISOString() }
];

const generateInitialTasksForKid = (kid, templates = TASK_TEMPLATES) => {
  const tasks = [];
  DAYS.forEach(day => {
    templates.forEach(tmpl => {
      const titleSlug = sanitizeDocId(tmpl.title.slice(0, 12).replace(/\s+/g, '_').toLowerCase());
      tasks.push({
        id: `task_${kid.id}_${day}_${titleSlug}`,
        title: tmpl.title,
        description: tmpl.description || '',
        reward: tmpl.reward,
        assignedTo: kid.id,
        day: day,
        status: 'pending',
        category: tmpl.category,
        icon: tmpl.icon,
        isExtra: !!tmpl.isExtra,
        requiresPhoto: !!tmpl.requiresPhoto,
        timerMinutes: tmpl.timerMinutes || 0,
        recurrence: tmpl.isExtra ? 'daily' : 'weekly',
        aiFeedback: null,
        photoUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });
  });
  return tasks;
};

const generateInitialTasks = () => {
  const tasks = [];
  DEFAULT_KIDS.forEach(kid => {
    tasks.push(...generateInitialTasksForKid(kid));
  });
  return tasks;
};

function pcm16ToWavBlob(pcmData, sampleRate = 24000) {
  const buffer = new ArrayBuffer(44 + pcmData.length * 2);
  const view = new DataView(buffer);
  const writeString = (v, offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + pcmData.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, pcmData.length * 2, true);

  let offset = 44;
  for (let i = 0; i < pcmData.length; i++, offset += 2) {
    view.setInt16(offset, pcmData[i], true);
  }
  return new Blob([buffer], { type: 'audio/wav' });
}

export default function App() {
  const [role, setRole] = useState('child');
  const [activeKidId, setActiveKidId] = useState('kid_enma');
  const [selectedDay, setSelectedDay] = useState('Lunes');
  const [viewMode, setViewMode] = useState('day');

  const [familyId, setFamilyId] = useState(() => {
    const saved = localStorage.getItem('kid_reward_family_id');
    if (saved) return saved;
    const newId = 'FAM-' + Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem('kid_reward_family_id', newId);
    return newId;
  });
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [inputFamilyId, setInputFamilyId] = useState('');
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const [pinInput, setPinInput] = useState('');
  const [isParentUnlocked, setIsParentUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(null);
  const [showAiGenModal, setShowAiGenModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showManageKidsModal, setShowManageKidsModal] = useState(false);
  const [editingKid, setEditingKid] = useState(null);

  const [aiGeneratingTasks, setAiGeneratingTasks] = useState(false);
  const [aiThemePrompt, setAiThemePrompt] = useState('Hábitos de Orden y Lectura');
  const [aiGeneratedTasksList, setAiGeneratedTasksList] = useState([]);
  const [aiGoalPrompt, setAiGoalPrompt] = useState('');
  const [aiGeneratingGoalImg, setAiGeneratingGoalImg] = useState(false);
  
  const [inspectingTaskId, setInspectingTaskId] = useState(null);
  const [aiInspectingTask, setAiInspectingTask] = useState(false);
  const [speakingTaskId, setSpeakingTaskId] = useState(null);

  const [kids, setKids] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [syncStatus, setSyncStatus] = useState('connecting');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('kid_reward_dark_mode');
    return saved ? saved === 'true' : false;
  });

  const [newTask, setNewTask] = useState({ title: '', description: '', reward: '1.00', assignedTo: 'kid_enma', day: 'Lunes', category: 'General', icon: '⭐', isExtra: false, requiresPhoto: false, timerMinutes: 0, recurrence: 'weekly' });
  const [editingTask, setEditingTask] = useState(null);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [editingWeeklyGoal, setEditingWeeklyGoal] = useState(false);
  const [weeklyGoalInput, setWeeklyGoalInput] = useState('10');

  const [rewards, setRewards] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [showRewardStoreModal, setShowRewardStoreModal] = useState(false);
  const [showManageRewardsModal, setShowManageRewardsModal] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [newReward, setNewReward] = useState({ name: '', description: '', price: '5.00', icon: '🎁', category: 'toys', stock: '' });
  const [showPenaltyModal, setShowPenaltyModal] = useState(null);
  const [penaltyAmount, setPenaltyAmount] = useState('');
  const [penaltyReason, setPenaltyReason] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);

  const tasksInitialLoadDoneRef = useRef(false);
  const tasksSeedDoneRef = useRef(false);
  const kidsSeedDoneRef = useRef(false);

  const notify = (msg, type = 'info') => {
    setNotification({ msg, type });
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('KidCoins', { body: msg, icon: '/favicon.svg' });
      } catch (e) {
        console.warn('Native notification failed', e);
      }
    }
    setTimeout(() => setNotification(null), 3800);
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          notify('🔔 Notificaciones activadas', 'success');
        }
      });
    }
  };

  useEffect(() => {
    localStorage.setItem('kid_reward_dark_mode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const onboardingSeen = localStorage.getItem('kid_reward_onboarding_seen');
    if (!onboardingSeen && kids.length === 0 && tasks.length === 0) {
      setShowOnboarding(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const savedKids = localStorage.getItem(`kid_reward_kids_${familyId}`);
    if (savedKids) {
      try { setKids(JSON.parse(savedKids)); } catch { setKids(DEFAULT_KIDS); }
    } else {
      setKids(DEFAULT_KIDS);
      localStorage.setItem(`kid_reward_kids_${familyId}`, JSON.stringify(DEFAULT_KIDS));
    }
    const savedTasks = localStorage.getItem(`kid_reward_tasks_${familyId}`);
    if (savedTasks) {
      try { setTasks(JSON.parse(savedTasks)); } catch { setTasks(generateInitialTasks()); }
    } else {
      const initialTasks = generateInitialTasks();
      setTasks(initialTasks);
      localStorage.setItem(`kid_reward_tasks_${familyId}`, JSON.stringify(initialTasks));
    }
    setLoading(false);
  }, [familyId]);

  useEffect(() => {
    tasksInitialLoadDoneRef.current = false;
    tasksSeedDoneRef.current = false;
    kidsSeedDoneRef.current = false;
  }, [familyId]);

  useEffect(() => {
    setLoading(true);
    setSyncStatus('connecting');

    const loadLocalData = () => {
      const onboardingSeen = localStorage.getItem('kid_reward_onboarding_seen') === 'true';

      const savedKids = localStorage.getItem(`kid_reward_kids_${familyId}`);
      if (savedKids) {
        try { setKids(JSON.parse(savedKids)); } catch { setKids(onboardingSeen ? DEFAULT_KIDS : []); }
      } else if (onboardingSeen) {
        setKids(DEFAULT_KIDS);
        localStorage.setItem(`kid_reward_kids_${familyId}`, JSON.stringify(DEFAULT_KIDS));
      } else {
        setKids([]);
      }

      const savedTasks = localStorage.getItem(`kid_reward_tasks_${familyId}`);
      if (savedTasks) {
        try { setTasks(JSON.parse(savedTasks)); } catch { setTasks(onboardingSeen ? generateInitialTasks() : []); }
      } else if (onboardingSeen) {
        const initialTasks = generateInitialTasks();
        setTasks(initialTasks);
        localStorage.setItem(`kid_reward_tasks_${familyId}`, JSON.stringify(initialTasks));
      } else {
        setTasks([]);
      }

      const savedRewards = localStorage.getItem(`kid_reward_rewards_${familyId}`);
      if (savedRewards) {
        try { setRewards(JSON.parse(savedRewards)); } catch { setRewards([]); }
      }

      const savedPurchases = localStorage.getItem(`kid_reward_purchases_${familyId}`);
      if (savedPurchases) {
        try { setPurchases(JSON.parse(savedPurchases)); } catch { setPurchases([]); }
      }
      setLoading(false);
    };

    // Load local data immediately while Firestore connects
    loadLocalData();

    requestNotificationPermission();

    enableNetwork(db).catch((e) => console.warn('Could not enable Firestore network:', e));

      const kidsRef = collection(db, 'artifacts', appId, 'families', familyId, 'kids');
      const unsubKids = onSnapshot(kidsRef,
        (snapshot) => {
          const fetchedKids = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          const fromServer = !snapshot.metadata.fromCache;

          const onboardingSeen = localStorage.getItem('kid_reward_onboarding_seen') === 'true';
          if (fetchedKids.length === 0 && fromServer && !kidsSeedDoneRef.current && onboardingSeen) {
          kidsSeedDoneRef.current = true;
          const savedKids = localStorage.getItem(`kid_reward_kids_${familyId}`);
          const kidsToUse = savedKids ? JSON.parse(savedKids) : DEFAULT_KIDS;
          const batch = writeBatch(db);
          kidsToUse.forEach(k => {
            const kidRef = doc(kidsRef, k.id);
            batch.set(kidRef, k);
          });
          batch.commit().catch((e) => console.warn('Initial kids batch write failed:', e));
          setKids(kidsToUse);
          localStorage.setItem(`kid_reward_kids_${familyId}`, JSON.stringify(kidsToUse));
          if (!activeKidId || !kidsToUse.find(k => k.id === activeKidId)) {
            setActiveKidId(kidsToUse[0]?.id || 'kid_enma');
          }
        } else if (fetchedKids.length > 0) {
          setKids(fetchedKids);
          localStorage.setItem(`kid_reward_kids_${familyId}`, JSON.stringify(fetchedKids));
          if (!activeKidId || !fetchedKids.find(k => k.id === activeKidId)) {
            setActiveKidId(fetchedKids[0]?.id || 'kid_enma');
          }
        }

        setSyncStatus('synced');
      },
      (err) => {
        console.warn("Firestore permission issue for kids, loading local storage:", err.message);
        setSyncStatus('offline');
      }
    );

      const tasksRef = collection(db, 'artifacts', appId, 'families', familyId, 'tasks');
      const unsubTasks = onSnapshot(tasksRef,
        (snapshot) => {
          const fetchedTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          const fromServer = !snapshot.metadata.fromCache;

          if (fetchedTasks.length > 0) {
          setTasks(fetchedTasks);
          localStorage.setItem(`kid_reward_tasks_${familyId}`, JSON.stringify(fetchedTasks));
          tasksInitialLoadDoneRef.current = true;
          tasksSeedDoneRef.current = true;
        } else if (fromServer && !tasksSeedDoneRef.current) {
          const onboardingSeen = localStorage.getItem('kid_reward_onboarding_seen') === 'true';
          tasksSeedDoneRef.current = true;
          if (!onboardingSeen) return;
          const savedTasks = localStorage.getItem(`kid_reward_tasks_${familyId}`);
          let initialTasks;
          if (savedTasks) {
            initialTasks = JSON.parse(savedTasks);
          } else {
            const savedKids = localStorage.getItem(`kid_reward_kids_${familyId}`);
            const kidsToUse = savedKids ? JSON.parse(savedKids) : DEFAULT_KIDS;
            initialTasks = [];
            kidsToUse.forEach(k => initialTasks.push(...generateInitialTasksForKid(k)));
          }
          const batch = writeBatch(db);
          initialTasks.forEach(t => {
            const taskRef = doc(tasksRef, t.id);
            batch.set(taskRef, t);
          });
          batch.commit().catch((e) => console.warn('Initial tasks batch write failed:', e));
          setTasks(initialTasks);
          localStorage.setItem(`kid_reward_tasks_${familyId}`, JSON.stringify(initialTasks));
          tasksInitialLoadDoneRef.current = true;
        }

        setSyncStatus('synced');
      },
      (err) => {
        console.warn("Firestore permission issue for tasks, loading local storage:", err.message);
        setSyncStatus('offline');
      }
    );

    setLoading(false);

      const rewardsRef = collection(db, 'artifacts', appId, 'families', familyId, 'rewards');
      const unsubRewards = onSnapshot(rewardsRef,
        (snapshot) => {
          const fetchedRewards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          if (fetchedRewards.length > 0) {
            setRewards(fetchedRewards);
            localStorage.setItem(`kid_reward_rewards_${familyId}`, JSON.stringify(fetchedRewards));
          }
          setSyncStatus('synced');
        },
        (err) => {
          console.warn("Firestore permission issue for rewards, loading local storage:", err.message);
          setSyncStatus('offline');
        }
      );

      const purchasesRef = collection(db, 'artifacts', appId, 'families', familyId, 'purchases');
      const unsubPurchases = onSnapshot(purchasesRef,
        (snapshot) => {
          const fetchedPurchases = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          if (fetchedPurchases.length > 0) {
            setPurchases(fetchedPurchases);
            localStorage.setItem(`kid_reward_purchases_${familyId}`, JSON.stringify(fetchedPurchases));
          }
          setSyncStatus('synced');
        },
        (err) => {
          console.warn("Firestore permission issue for purchases, loading local storage:", err.message);
          setSyncStatus('offline');
        }
      );

    return () => {
      unsubKids();
      unsubTasks();
      unsubRewards();
      unsubPurchases();
    };
    // activeKidId is intentionally omitted to avoid re-subscribing on profile switches.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [familyId]);

  const persistKids = (updatedKids) => {
    setKids(updatedKids);
    localStorage.setItem(`kid_reward_kids_${familyId}`, JSON.stringify(updatedKids));
  };

  const persistTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    localStorage.setItem(`kid_reward_tasks_${familyId}`, JSON.stringify(updatedTasks));
  };

  const persistRewards = (updatedRewards) => {
    setRewards(updatedRewards);
    localStorage.setItem(`kid_reward_rewards_${familyId}`, JSON.stringify(updatedRewards));
  };

  const persistPurchases = (updatedPurchases) => {
    setPurchases(updatedPurchases);
    localStorage.setItem(`kid_reward_purchases_${familyId}`, JSON.stringify(updatedPurchases));
  };

  const currentKid = useMemo(() => kids.find(k => k.id === activeKidId) || kids[0], [kids, activeKidId]);

  const getCategory = (categoryId) => CATEGORIES.find(c => c.id === categoryId) || CATEGORIES.find(c => c.id === 'General');
  const getCategoryStyle = (categoryId) => {
    const cat = getCategory(categoryId);
    return cat ? cat.color : 'bg-slate-100 text-slate-700 border-slate-200';
  };
  const getCategoryIcon = (categoryId) => {
    const cat = getCategory(categoryId);
    return cat ? cat.icon : '⭐';
  };

  const parentStats = useMemo(() => {
    const pendingApprovalCount = tasks.filter(t => t.status === 'completed').length;
    const totalPendingPayout = tasks.filter(t => t.status === 'completed').reduce((sum, t) => sum + Number(t.reward || 0), 0);
    const totalKidsBalance = kids.reduce((sum, k) => sum + Number(k.balance || 0), 0);
    return { pendingApprovalCount, totalPendingPayout, totalKidsBalance };
  }, [tasks, kids]);

  const weeklyEarnedApproved = useMemo(() => {
    return tasks
      .filter(t => t.assignedTo === activeKidId && t.status === 'approved')
      .reduce((sum, t) => sum + Number(t.reward || 0), 0);
  }, [tasks, activeKidId]);

  const pendingReviewAmount = useMemo(() => {
    return tasks
      .filter(t => t.assignedTo === activeKidId && t.status === 'completed')
      .reduce((sum, t) => sum + Number(t.reward || 0), 0);
  }, [tasks, activeKidId]);

  const kidStats = useMemo(() => {
    const kidTasks = tasks.filter(t => t.assignedTo === activeKidId);
    const approvedTasks = kidTasks.filter(t => t.status === 'approved');
    const totalEarned = approvedTasks.reduce((sum, t) => sum + Number(t.reward || 0), 0);
    const completedCount = approvedTasks.length;

    const dayOrder = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    let streak = 0;
    const reversedDays = [...dayOrder].reverse();
    for (const day of reversedDays) {
      const dayTasks = kidTasks.filter(t => t.day === day);
      if (dayTasks.length === 0) continue;
      const allDone = dayTasks.every(t => t.status === 'approved');
      if (allDone) {
        streak += 1;
      } else {
        break;
      }
    }

    return { totalEarned, completedCount, streak };
  }, [tasks, activeKidId]);

  const familyHistory = useMemo(() => {
    const history = [];
    tasks.filter(t => t.status === 'approved').forEach(t => {
      const kid = kids.find(k => k.id === t.assignedTo);
      history.push({
        id: `task_${t.id}`,
        type: 'task',
        title: `Tarea completada: ${t.title}`,
        kidName: kid?.name || 'Desconocido',
        amount: Number(t.reward || 0),
        date: t.updatedAt || t.createdAt,
        icon: t.icon || '⭐'
      });
    });
    purchases.filter(p => p.status === 'approved').forEach(p => {
      history.push({
        id: `purchase_${p.id}`,
        type: 'purchase',
        title: `Compra aprobada: ${p.rewardName}`,
        kidName: p.kidName,
        amount: -Number(p.price || 0),
        date: p.approvedAt || p.requestedAt,
        icon: p.rewardIcon || '🎁'
      });
    });
    return history.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 50);
  }, [tasks, purchases, kids]);

  const handleJoinFamily = (e) => {
    e.preventDefault();
    const cleanId = inputFamilyId.trim().toUpperCase();
    if (!cleanId) return;
    localStorage.setItem('kid_reward_family_id', cleanId);
    localStorage.setItem('kid_reward_onboarding_seen', 'true');
    setFamilyId(cleanId);
    setShowFamilyModal(false);
    setInputFamilyId('');
    notify(`👨‍👩‍👧‍👦 Sincronizado con la familia ${cleanId}`, 'success');
  };

  const handleOnboardingComplete = async (name, newKids) => {
    localStorage.setItem('kid_reward_onboarding_seen', 'true');
    kidsSeedDoneRef.current = true;
    tasksSeedDoneRef.current = true;
    setShowOnboarding(false);

    if (newKids.length > 0) {
      const initialTasks = [];
      newKids.forEach(k => initialTasks.push(...generateInitialTasksForKid(k)));

      persistKids(newKids);
      persistTasks(initialTasks);
      setActiveKidId(newKids[0].id);
      notify('🎉 ¡Familia creada! Ahora añade tareas y recompensas.', 'success');

      try {
        const batch = writeBatch(db);
        for (const k of newKids) {
          const kidRef = doc(db, 'artifacts', appId, 'families', familyId, 'kids', k.id);
          batch.set(kidRef, k);
        }
        for (const t of initialTasks) {
          const taskRef = doc(db, 'artifacts', appId, 'families', familyId, 'tasks', t.id);
          batch.set(taskRef, t);
        }
        await batch.commit();
      } catch (err) {
        console.warn('Firestore onboarding save failed', err);
      }
    }
  };

  const handleCopyFamilyCode = () => {
    navigator.clipboard.writeText(familyId);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
    notify('📋 Código copiado al portapapeles', 'info');
  };

  const handleSaveKid = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const age = parseInt(form.age.value) || 6;
    const weeklyGoal = Math.round((parseFloat(form.weeklyGoal.value) || 10) * 100) / 100;
    const avatar = form.avatar.value;
    const color = form.color.value;
    if (!name) return;

    let updatedKids;
    if (editingKid) {
      updatedKids = kids.map(k => k.id === editingKid.id ? { ...k, name, age, weeklyGoal, avatar, color, updatedAt: new Date().toISOString() } : k);
    } else {
      const newKid = createDefaultKid(name, kids.length + 1);
      newKid.age = age;
      newKid.weeklyGoal = weeklyGoal;
      newKid.avatar = avatar;
      newKid.color = color;
      updatedKids = [...kids, newKid];
    }
    persistKids(updatedKids);

    try {
      const batch = writeBatch(db);
      if (editingKid) {
        const kidRef = doc(db, 'artifacts', appId, 'families', familyId, 'kids', editingKid.id);
        batch.update(kidRef, { name, age, weeklyGoal, avatar, color, updatedAt: new Date().toISOString() });
      } else {
        const newKid = updatedKids[updatedKids.length - 1];
        const kidRef = doc(db, 'artifacts', appId, 'families', familyId, 'kids', newKid.id);
        batch.set(kidRef, newKid);
        const generatedTasks = generateInitialTasksForKid(newKid);
        generatedTasks.forEach(t => {
          const taskRef = doc(db, 'artifacts', appId, 'families', familyId, 'tasks', t.id);
          batch.set(taskRef, t);
        });
      }
      await batch.commit();
      notify(editingKid ? '👤 Perfil actualizado' : '👤 Hijo añadido', 'success');
    } catch (err) {
      console.warn('Firestore kid save failed', err);
      notify('No se pudo sincronizar el cambio con la nube. Se guardó localmente.', 'error');
    }

    setEditingKid(null);
    setShowManageKidsModal(false);
  };

  const handleDeleteKid = async (kidId) => {
    if (!window.confirm('¿Eliminar este perfil? Se borrarán también sus tareas.')) return;
    const updatedKids = kids.filter(k => k.id !== kidId);
    const updatedTasks = tasks.filter(t => t.assignedTo !== kidId);
    persistKids(updatedKids);
    persistTasks(updatedTasks);
    if (activeKidId === kidId) {
      setActiveKidId(updatedKids[0]?.id || null);
    }

    try {
      const batch = writeBatch(db);
      const kidRef = doc(db, 'artifacts', appId, 'families', familyId, 'kids', kidId);
      batch.delete(kidRef);
      const tasksToDelete = tasks.filter(t => t.assignedTo === kidId);
      tasksToDelete.forEach(t => {
        const taskRef = doc(db, 'artifacts', appId, 'families', familyId, 'tasks', t.id);
        batch.delete(taskRef);
      });
      await batch.commit();
      notify('Perfil eliminado', 'info');
    } catch (err) {
      console.warn('Firestore kid delete failed', err);
      notify('No se pudo sincronizar la eliminación con la nube. Se guardó localmente.', 'error');
    }
  };

  const handleRegenerateFamilyCode = () => {
    if (!window.confirm('¿Generar un nuevo código de familia? Los otros dispositivos deberán usar el nuevo código.')) return;
    const newId = 'FAM-' + Math.floor(1000 + Math.random() * 9000);
    setFamilyId(newId);
    localStorage.setItem('kid_reward_family_id', newId);
    notify(`Nuevo código de familia: ${newId}`, 'success');
  };

  const handleSaveWeeklyGoal = async () => {
    if (!currentKid) return;
    const value = parseFloat(weeklyGoalInput.replace(',', '.'));
    if (isNaN(value) || value <= 0) {
      notify('Introduce un objetivo semanal válido', 'error');
      return;
    }
    const rounded = Math.round(value * 100) / 100;
    const updatedKid = { ...currentKid, weeklyGoal: rounded, updatedAt: new Date().toISOString() };
    const updatedKids = kids.map(k => k.id === currentKid.id ? updatedKid : k);
    persistKids(updatedKids);
    setEditingWeeklyGoal(false);
    try {
      const kidRef = doc(db, 'artifacts', appId, 'families', familyId, 'kids', currentKid.id);
      await updateDoc(kidRef, { weeklyGoal: rounded, updatedAt: new Date().toISOString() });
    } catch (err) {
      console.warn('Firestore weekly goal update skipped', err);
      notify('No se pudo sincronizar el objetivo con la nube. Se guardó en este dispositivo.', 'error');
    }
    notify('Objetivo semanal actualizado', 'success');
  };

  const handleSpeakCheer = async (taskId, textToSpeak) => {
    setSpeakingTaskId(taskId);
    try {
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Di con tono súper entusiasmado y amigable para un niño: ${textToSpeak}` }] }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } }
            }
          }
        })
      });

      const result = await response.json();
      const part = result?.candidates?.[0]?.content?.parts?.[0];
      const audioData = part?.inlineData?.data;
      const mimeType = part?.inlineData?.mimeType || '';

      if (audioData) {
        let sampleRate = 24000;
        const match = mimeType.match(/rate=(\d+)/);
        if (match) sampleRate = parseInt(match[1], 10);

        const binaryStr = atob(audioData);
        const len = binaryStr.length;
        const pcm16 = new Int16Array(len / 2);
        const dataView = new DataView(new ArrayBuffer(len));
        for (let i = 0; i < len; i++) dataView.setUint8(i, binaryStr.charCodeAt(i));
        for (let i = 0; i < pcm16.length; i++) pcm16[i] = dataView.getInt16(i * 2, true);

        const wavBlob = pcm16ToWavBlob(pcm16, sampleRate);
        const audioUrl = URL.createObjectURL(wavBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      } else {
        notify('No se pudo generar el audio.', 'error');
      }
    } catch (err) {
      console.error(err);
      notify('Error al reproducir audio IA.', 'error');
    } finally {
      setSpeakingTaskId(null);
    }
  };

  const handlePhotoUploadAndInspect = async (taskId, file) => {
    if (!file) return;
    setInspectingTaskId(taskId);
    setAiInspectingTask(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result;
        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview:generateContent?key=${apiKey}`;
        
        const pureBase64 = base64Data.split(',')[1];
        const payload = {
          contents: [{
            parts: [
              { text: "Analiza esta foto de un niño realizando o habiendo completado su tarea del hogar. Da un comentario breve, entusiasta y motivador (máximo 2 frases) para confirmarle que lo ha hecho genial." },
              { inlineData: { mimeType: file.type || "image/jpeg", data: pureBase64 } }
            ]
          }]
        };

        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        const feedback = result?.candidates?.[0]?.content?.parts?.[0]?.text || "¡Excelente trabajo completando la tarea!";

        try {
          const taskRef = doc(db, 'artifacts', appId, 'families', familyId, 'tasks', taskId);
          await updateDoc(taskRef, {
            status: 'completed',
            photoUrl: base64Data,
            aiFeedback: feedback
          });
        } catch (e) {
          console.warn('Firestore update skipped (using local storage fallback)', e);
          notify('No se pudo sincronizar la foto con la nube. Se guardó en este dispositivo.', 'error');
        }

        const newTasks = tasks.map(t => t.id === taskId ? { ...t, status: 'completed', photoUrl: base64Data, aiFeedback: feedback } : t);
        persistTasks(newTasks);

        notify('📸 Foto subida e inspeccionada por la IA.', 'success');
        setAiInspectingTask(false);
        setInspectingTaskId(null);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      notify('Error al procesar la foto.', 'error');
      setAiInspectingTask(false);
      setInspectingTaskId(null);
    }
  };

  const handleGenerateAiTasks = async () => {
    if (!aiThemePrompt.trim()) return;
    setAiGeneratingTasks(true);

    try {
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      const payload = {
        contents: [{
          parts: [{ text: `Genera 4 tareas del hogar divertidas, educativas y bien pensadas para niños en español sobre la temática: "${aiThemePrompt}". Asigna días de la semana (Lunes a Domingo), recompensas razonables en Euros entre 0.30€ y 1.50€, una breve descripción de máximo 15 palabras, y si aplica un temporizador en minutos. Usa categorías reales como: Dormitorio, Cocina, Baño, Salón, Jardín, Mascotas, Estudio, Deporte, Extra.` }]
        }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                title: { type: "STRING" },
                description: { type: "STRING" },
                reward: { type: "NUMBER" },
                category: { type: "STRING" },
                day: { type: "STRING" },
                icon: { type: "STRING" },
                timerMinutes: { type: "INTEGER" },
                isExtra: { type: "BOOLEAN" }
              },
              propertyOrdering: ["title", "description", "reward", "category", "day", "icon", "timerMinutes", "isExtra"]
            }
          }
        }
      };

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      const rawJson = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawJson) {
        const parsedTasks = JSON.parse(rawJson);
        setAiGeneratedTasksList(parsedTasks);
      }
    } catch (err) {
      console.error(err);
      notify('Error al generar tareas con IA.', 'error');
    } finally {
      setAiGeneratingTasks(false);
    }
  };

  const handleAddAiTasksToKid = async (kidId) => {
    if (aiGeneratedTasksList.length === 0) return;
    try {
      const newTasksList = [...tasks];
      for (const t of aiGeneratedTasksList) {
        const taskId = `ai_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
        const newTaskObj = {
          id: taskId,
          title: t.title,
          description: t.description || '',
          reward: parseFloat(t.reward) || 0.50,
          assignedTo: kidId,
          day: t.day || 'Lunes',
          status: 'pending',
          category: t.category || 'IA Especial',
          icon: t.icon || '✨',
          isExtra: t.category === 'Extra' || !!t.isExtra,
          requiresPhoto: false,
          timerMinutes: parseInt(t.timerMinutes) || 0,
          recurrence: 'weekly',
          aiFeedback: null,
          photoUrl: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        try {
          await setDoc(doc(db, 'artifacts', appId, 'families', familyId, 'tasks', taskId), newTaskObj);
        } catch (e) {
          console.warn('Firestore setDoc skipped (using local storage fallback)', e);
          notify('No se pudo sincronizar una tarea IA con la nube. Se guardó en este dispositivo.', 'error');
        }
        newTasksList.push(newTaskObj);
      }
      persistTasks(newTasksList);
      notify(`✨ Tareas IA agregadas para ${kids.find(k => k.id === kidId)?.name}.`, 'success');
      setShowAiGenModal(false);
      setAiGeneratedTasksList([]);
    } catch {
      notify('Error al guardar tareas IA.', 'error');
    }
  };

  const handleGenerateGoalImage = async () => {
    if (!aiGoalPrompt.trim() || !currentKid) return;
    setAiGeneratingGoalImg(true);

    try {
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`;

      const payload = {
        instances: [{ prompt: `A vibrant, joyful 3D Pixar-style render of a dream reward toy for kids: ${aiGoalPrompt}. Bright colors, clean background, inspiring.` }],
        parameters: { sampleCount: 1 }
      };

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (result.predictions && result.predictions[0]?.bytesBase64Encoded) {
        const imageUrl = `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
        try {
          const kidRef = doc(db, 'artifacts', appId, 'families', familyId, 'kids', currentKid.id);
          await updateDoc(kidRef, {
            goalName: aiGoalPrompt,
            goalImage: imageUrl
          });
        } catch (e) {
          console.warn('Firestore update skipped (using local storage fallback)', e);
          notify('No se pudo sincronizar la meta con la nube. Se guardó en este dispositivo.', 'error');
        }

        const newKids = kids.map(k => k.id === currentKid.id ? { ...k, goalName: aiGoalPrompt, goalImage: imageUrl } : k);
        persistKids(newKids);

        notify('🎨 ¡Imagen del objetivo generada con éxito!', 'success');
        setShowGoalModal(false);
      } else {
        notify('No se pudo generar la imagen del objetivo.', 'error');
      }
    } catch (err) {
      console.error(err);
      notify('Error al generar imagen con Imagen 4.0.', 'error');
    } finally {
      setAiGeneratingGoalImg(false);
    }
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput === '') {
      setIsParentUnlocked(true);
      setRole('parent');
      setShowPinModal(false);
      setPinInput('');
      setPinError(false);
      notify('¡Modo Padres activado!', 'success');
    } else {
      setPinError(true);
    }
  };

  const toggleRole = (targetRole) => {
    if (targetRole === 'parent' && !isParentUnlocked) {
      setShowPinModal(true);
    } else {
      setRole(targetRole);
    }
  };

  const handleMarkTaskCompleted = async (taskId) => {
    const newTasks = tasks.map(t => t.id === taskId ? { ...t, status: 'completed' } : t);
    persistTasks(newTasks);

    try {
      const taskRef = doc(db, 'artifacts', appId, 'families', familyId, 'tasks', taskId);
      await updateDoc(taskRef, { status: 'completed' });
    } catch (e) {
      console.warn('Firestore sync skipped, using local storage', e);
      notify('No se pudo sincronizar la tarea con la nube. Se guardó en este dispositivo.', 'error');
    }

    notify('🎉 ¡Tarea enviada a los papás para revisión!', 'success');
  };

  const handleApproveTask = async (task) => {
    const reward = Number(task.reward);
    const newTasks = tasks.map(t => t.id === task.id ? { ...t, status: 'approved' } : t);
    persistTasks(newTasks);

    const newKids = kids.map(k => k.id === task.assignedTo ? { ...k, balance: (k.balance || 0) + reward } : k);
    persistKids(newKids);

    try {
      const taskRef = doc(db, 'artifacts', appId, 'families', familyId, 'tasks', task.id);
      const kidRef = doc(db, 'artifacts', appId, 'families', familyId, 'kids', task.assignedTo);
      await updateDoc(taskRef, { status: 'approved' });
      await updateDoc(kidRef, { balance: increment(reward) });
    } catch (e) {
      console.warn('Firestore approve sync skipped, using local storage', e);
      notify('No se pudo sincronizar la aprobación con la nube. Se guardó localmente.', 'error');
    }

    notify(`✅ Aprobada. Se han añadido ${reward.toFixed(2)}€ a ${kids.find(k=>k.id===task.assignedTo)?.name}.`, 'success');
  };

  const handleRejectTask = async (taskId) => {
    const newTasks = tasks.map(t => t.id === taskId ? { ...t, status: 'pending' } : t);
    persistTasks(newTasks);

    try {
      const taskRef = doc(db, 'artifacts', appId, 'families', familyId, 'tasks', taskId);
      await updateDoc(taskRef, { status: 'pending' });
    } catch (e) {
      console.warn('Firestore reject sync skipped, using local storage', e);
      notify('No se pudo sincronizar el rechazo con la nube. Se guardó en este dispositivo.', 'error');
    }

    notify('Tarea devuelta a pendiente.', 'info');
  };

  const handleResetWeek = async () => {
    if (!window.confirm("¿Reiniciar todas las tareas de la semana a pendientes para Enma y Matías?")) return;
    
    const newTasks = tasks.map(t => ({ ...t, status: 'pending', photoUrl: null, aiFeedback: null }));
    persistTasks(newTasks);
    notify('🔄 Semana reiniciada para un nuevo ciclo de tareas.', 'success');

    try {
      const batch = writeBatch(db);
      for (const t of tasks) {
        const taskRef = doc(db, 'artifacts', appId, 'families', familyId, 'tasks', t.id);
        batch.update(taskRef, { status: 'pending', photoUrl: null, aiFeedback: null });
      }
      await batch.commit();
    } catch (err) {
      console.warn('Firestore reset sync skipped, using local storage', err);
      notify('No se pudo sincronizar el reinicio con la nube. Se guardó localmente.', 'error');
    }
  };

  const resetNewTaskForm = () => {
    setEditingTask(null);
    setNewTask({ title: '', description: '', reward: '1.00', assignedTo: activeKidId || 'kid_enma', day: selectedDay, category: 'General', icon: '⭐', isExtra: false, requiresPhoto: false, timerMinutes: 0, recurrence: 'weekly' });
  };

  const openAddTaskModal = (taskToEdit = null) => {
    if (taskToEdit) {
      setEditingTask(taskToEdit);
      setNewTask({
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        reward: String(taskToEdit.reward || '1.00'),
        assignedTo: taskToEdit.assignedTo || activeKidId,
        day: taskToEdit.day || selectedDay,
        category: taskToEdit.category || 'General',
        icon: taskToEdit.icon || '⭐',
        isExtra: !!taskToEdit.isExtra,
        requiresPhoto: !!taskToEdit.requiresPhoto,
        timerMinutes: taskToEdit.timerMinutes || 0,
        recurrence: taskToEdit.recurrence || 'weekly'
      });
    } else {
      resetNewTaskForm();
      setNewTask(prev => ({ ...prev, assignedTo: activeKidId || 'kid_enma', day: selectedDay }));
    }
    setShowAddTaskModal(true);
  };

  const handleCreateTask = async (e) => {
    e?.preventDefault();
    if (!newTask.title.trim()) return;

    const taskData = {
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      reward: parseFloat(newTask.reward) || 0.50,
      assignedTo: newTask.assignedTo,
      day: newTask.day,
      status: 'pending',
      category: newTask.category,
      icon: newTask.icon || getCategoryIcon(newTask.category),
      isExtra: newTask.category === 'Extra' || newTask.isExtra,
      requiresPhoto: !!newTask.requiresPhoto,
      timerMinutes: parseInt(newTask.timerMinutes) || 0,
      recurrence: newTask.recurrence || 'weekly',
      updatedAt: new Date().toISOString()
    };

    try {
      let updatedTasks;
      let updatedTask;
      if (editingTask) {
        updatedTask = { ...editingTask, ...taskData };
        updatedTasks = tasks.map(t => t.id === editingTask.id ? updatedTask : t);
        notify('✏️ Tarea actualizada.', 'success');
      } else {
        const taskId = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
        updatedTask = { id: taskId, ...taskData, aiFeedback: null, photoUrl: null, createdAt: new Date().toISOString() };
        updatedTasks = [...tasks, updatedTask];
        notify('⭐ Nueva tarea añadida al horario.', 'success');
      }

      persistTasks(updatedTasks);
      setShowAddTaskModal(false);
      resetNewTaskForm();

      try {
        const taskRef = doc(db, 'artifacts', appId, 'families', familyId, 'tasks', updatedTask.id);
        if (editingTask) {
          await updateDoc(taskRef, taskData);
        } else {
          await setDoc(taskRef, updatedTask);
        }
      } catch (err) {
        console.warn('Firestore task save skipped (using local storage fallback)', err);
        notify('No se pudo sincronizar la tarea con la nube. Se guardó en este dispositivo.', 'error');
      }
    } catch {
      notify('Error al guardar la tarea.', 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('¿Eliminar esta tarea?')) return;
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    persistTasks(updatedTasks);

    try {
      const taskRef = doc(db, 'artifacts', appId, 'families', familyId, 'tasks', taskId);
      await setDoc(taskRef, { deleted: true, updatedAt: new Date().toISOString() });
    } catch (err) {
      console.warn('Firestore delete sync skipped', err);
      notify('No se pudo sincronizar la eliminación con la nube. Se guardó localmente.', 'error');
    }

    notify('🗑️ Tarea eliminada.', 'info');
  };

  const resetNewRewardForm = () => {
    setEditingReward(null);
    setNewReward({ name: '', description: '', price: '5.00', icon: '🎁', category: 'toys', stock: '' });
  };

  const openManageRewards = () => {
    resetNewRewardForm();
    setShowManageRewardsModal(true);
  };

  const handleSaveReward = async (e) => {
    e.preventDefault();
    const name = newReward.name.trim();
    const price = parseFloat(newReward.price);
    if (!name || isNaN(price) || price <= 0) return;

    const rewardData = {
      name,
      description: newReward.description.trim(),
      price,
      icon: newReward.icon || '🎁',
      category: newReward.category || 'other',
      stock: newReward.stock === '' ? null : parseInt(newReward.stock),
      updatedAt: new Date().toISOString()
    };

    try {
      let updatedReward;
      let updatedRewards;
      if (editingReward) {
        updatedReward = { ...editingReward, ...rewardData };
        updatedRewards = rewards.map(r => r.id === editingReward.id ? updatedReward : r);
        notify('🎁 Recompensa actualizada.', 'success');
      } else {
        const rewardId = `reward_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
        updatedReward = { id: rewardId, ...rewardData, createdAt: new Date().toISOString() };
        updatedRewards = [...rewards, updatedReward];
        notify('🎁 Recompensa añadida a la tienda.', 'success');
      }
      persistRewards(updatedRewards);
      resetNewRewardForm();

      try {
        const rewardRef = doc(db, 'artifacts', appId, 'families', familyId, 'rewards', updatedReward.id);
        if (editingReward) {
          await updateDoc(rewardRef, rewardData);
        } else {
          await setDoc(rewardRef, updatedReward);
        }
      } catch (err) {
        console.warn('Firestore reward save skipped', err);
        notify('No se pudo sincronizar la recompensa con la nube. Se guardó localmente.', 'error');
      }
    } catch {
      notify('Error al guardar la recompensa.', 'error');
    }
  };

  const handleDeleteReward = async (rewardId) => {
    if (!window.confirm('¿Eliminar esta recompensa?')) return;
    const updatedRewards = rewards.filter(r => r.id !== rewardId);
    persistRewards(updatedRewards);
    try {
      const rewardRef = doc(db, 'artifacts', appId, 'families', familyId, 'rewards', rewardId);
      await setDoc(rewardRef, { deleted: true, updatedAt: new Date().toISOString() });
    } catch (err) {
      console.warn('Firestore reward delete skipped', err);
    }
    notify('🗑️ Recompensa eliminada.', 'info');
  };

  const handleRequestReward = async (reward) => {
    if (!currentKid) return;
    if (currentKid.balance < reward.price) {
      notify('No tienes suficiente saldo para esta recompensa.', 'error');
      return;
    }

    const purchaseId = `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const purchase = {
      id: purchaseId,
      rewardId: reward.id,
      rewardName: reward.name,
      rewardIcon: reward.icon,
      price: reward.price,
      kidId: currentKid.id,
      kidName: currentKid.name,
      status: 'pending',
      requestedAt: new Date().toISOString()
    };

    persistPurchases([...purchases, purchase]);
    notify(`🛒 Has pedido: ${reward.name}. Espera a que los papás lo aprueben.`, 'success');
    setShowRewardStoreModal(false);

    try {
      const purchaseRef = doc(db, 'artifacts', appId, 'families', familyId, 'purchases', purchaseId);
      await setDoc(purchaseRef, purchase);
    } catch (err) {
      console.warn('Firestore purchase setDoc skipped', err);
      notify('No se pudo sincronizar la solicitud con la nube. Se guardó localmente.', 'error');
    }
  };

  const handleApprovePurchase = async (purchase) => {
    const kid = kids.find(k => k.id === purchase.kidId);
    if (!kid) return;
    if (kid.balance < purchase.price) {
      notify(`${kid.name} no tiene suficiente saldo.`, 'error');
      return;
    }

    const updatedPurchases = purchases.map(p => p.id === purchase.id ? { ...p, status: 'approved', approvedAt: new Date().toISOString() } : p);
    const updatedKids = kids.map(k => k.id === purchase.kidId ? { ...k, balance: Math.max(0, k.balance - purchase.price) } : k);
    persistPurchases(updatedPurchases);
    persistKids(updatedKids);

    try {
      const purchaseRef = doc(db, 'artifacts', appId, 'families', familyId, 'purchases', purchase.id);
      const kidRef = doc(db, 'artifacts', appId, 'families', familyId, 'kids', purchase.kidId);
      await updateDoc(purchaseRef, { status: 'approved', approvedAt: new Date().toISOString() });
      await updateDoc(kidRef, { balance: Math.max(0, kid.balance - purchase.price) });
    } catch (err) {
      console.warn('Firestore purchase approval skipped', err);
      notify('No se pudo sincronizar la aprobación con la nube. Se guardó localmente.', 'error');
    }

    notify(`✅ Compra aprobada. Se descontaron ${purchase.price.toFixed(2)}€.`, 'success');
  };

  const handleRejectPurchase = async (purchase) => {
    const updatedPurchases = purchases.map(p => p.id === purchase.id ? { ...p, status: 'rejected', rejectedAt: new Date().toISOString() } : p);
    persistPurchases(updatedPurchases);

    try {
      const purchaseRef = doc(db, 'artifacts', appId, 'families', familyId, 'purchases', purchase.id);
      await updateDoc(purchaseRef, { status: 'rejected', rejectedAt: new Date().toISOString() });
    } catch (err) {
      console.warn('Firestore purchase rejection skipped', err);
    }

    notify('❌ Compra rechazada.', 'info');
  };

  const handlePayout = async (e) => {
    e.preventDefault();
    if (!showPayoutModal) return;

    const amountToPay = parseFloat(payoutAmount);
    if (isNaN(amountToPay) || amountToPay <= 0) return;

    try {
      const newBalance = Math.max(0, (showPayoutModal.balance || 0) - amountToPay);
      
      try {
        const kidRef = doc(db, 'artifacts', appId, 'families', familyId, 'kids', showPayoutModal.id);
        await updateDoc(kidRef, { balance: newBalance });
      } catch (err) {
        console.warn('Firestore payout update skipped (using local storage fallback)', err);
        notify('No se pudo sincronizar el pago con la nube. Se guardó en este dispositivo.', 'error');
      }

      const updatedKids = kids.map(k => k.id === showPayoutModal.id ? { ...k, balance: newBalance } : k);
      persistKids(updatedKids);

      notify(`💵 Entrega de ${amountToPay.toFixed(2)}€ registrada para ${showPayoutModal.name}.`, 'success');
      setShowPayoutModal(null);
      setPayoutAmount('');
    } catch {
      notify('Error al procesar pago.', 'error');
    }
  };

  const handleApplyPenalty = async (e) => {
    e.preventDefault();
    if (!showPenaltyModal) return;

    const amount = parseFloat(penaltyAmount);
    if (isNaN(amount) || amount <= 0) return;

    const newBalance = Math.max(0, (showPenaltyModal.balance || 0) - amount);

    try {
      const kidRef = doc(db, 'artifacts', appId, 'families', familyId, 'kids', showPenaltyModal.id);
      await updateDoc(kidRef, { balance: newBalance });
    } catch (err) {
      console.warn('Firestore penalty update skipped', err);
      notify('No se pudo sincronizar la penalización con la nube. Se guardó localmente.', 'error');
    }

    const updatedKids = kids.map(k => k.id === showPenaltyModal.id ? { ...k, balance: newBalance } : k);
    persistKids(updatedKids);

    notify(`⚠️ Penalización de ${amount.toFixed(2)}€ aplicada a ${showPenaltyModal.name}.`, 'info');
    setShowPenaltyModal(null);
    setPenaltyAmount('');
    setPenaltyReason('');
  };

  const renderParentDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-sky-100 text-sky-600 rounded-xl">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Por Aprobar</p>
            <p className="text-2xl font-bold text-slate-800">{parentStats.pendingApprovalCount} tareas</p>
            <p className="text-xs text-sky-600 font-medium mt-0.5">{parentStats.totalPendingPayout.toFixed(2)}€ por liberar</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
            <Coins className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Hucha Acumulada</p>
            <p className="text-2xl font-bold text-slate-800">{parentStats.totalKidsBalance.toFixed(2)}€</p>
            <p className="text-xs text-emerald-600 font-medium mt-0.5">Total Enma + Matías</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Paga Semanal</p>
            <p className="text-2xl font-bold text-slate-800">{Number(kids[0]?.weeklyGoal || 10).toFixed(2)} € / sem</p>
            <button 
              onClick={handleResetWeek}
              className="text-xs text-indigo-600 hover:underline font-bold flex items-center gap-1 mt-0.5"
            >
              <RefreshCw className="w-3 h-3" /> Reiniciar semana
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-teal-600 rounded-2xl p-5 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-teal-200">
            <BrainCircuit className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-extrabold text-base">Generador de Tareas y Retos con IA Gemini</h3>
            <p className="text-xs text-indigo-100 mt-0.5">Crea de forma rápida paquetes de tareas educativas según valores o hábitos.</p>
          </div>
        </div>
        <button
          onClick={() => setShowAiGenModal(true)}
          className="px-4 py-2.5 bg-teal-400 hover:bg-teal-300 text-slate-900 font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-2 transition shrink-0"
        >
          <Wand2 className="w-4 h-4" /> Probar Creador IA
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-sky-500" />
            <h2 className="text-lg font-bold text-slate-800">Tareas pendientes de tu revisión</h2>
          </div>
          <span className="bg-sky-100 text-sky-800 text-xs font-semibold px-2.5 py-1 rounded-full">
            {tasks.filter(t => t.status === 'completed').length} para validar
          </span>
        </div>

        {tasks.filter(t => t.status === 'completed').length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <CheckCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-500">¡Todo revisado! Ni Enma ni Matías tienen tareas pendientes de validar.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.filter(t => t.status === 'completed').map(task => {
              const kid = kids.find(k => k.id === task.assignedTo);
              return (
                <div key={task.id} className="flex flex-col p-4 bg-sky-50/60 rounded-xl border border-sky-100 gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{task.icon || getCategoryIcon(task.category)}</span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-slate-800">{task.title}</h4>
                          <span className="text-xs bg-sky-200 text-sky-900 px-2 py-0.5 rounded-md font-bold">{task.day}</span>
                          <span className={`text-[10px] px-2 py-0.5 font-semibold rounded-md border ${getCategoryStyle(task.category)}`}>{task.category}</span>
                          {task.timerMinutes > 0 && (
                            <span className="text-[10px] px-2 py-0.5 bg-sky-100 text-sky-700 font-bold rounded-md flex items-center gap-1">
                              <Clock className="w-3 h-3 text-sky-600" /> {task.timerMinutes} min
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>Realizado por: <strong>{kid?.name} {kid?.avatar}</strong></span>
                          <span>•</span>
                          <span className="font-bold text-emerald-600">+{Number(task.reward).toFixed(2)}€</span>
                        </p>
                        {task.description && (
                          <p className="text-[11px] text-slate-500 mt-1">{task.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 self-end sm:self-center">
                      <button 
                        onClick={() => handleRejectTask(task.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Devolver a incompleto"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleApproveTask(task)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg shadow-sm flex items-center gap-1.5 transition"
                      >
                        <Check className="w-4 h-4" /> Aprobar y Abonar
                      </button>
                    </div>
                  </div>

                  {task.photoUrl && (
                    <div className="mt-2 pt-2 border-t border-sky-200/60 flex items-start space-x-3 bg-white/70 p-3 rounded-xl">
                      <img src={task.photoUrl} alt="Prueba tarea" className="w-16 h-16 object-cover rounded-lg border border-sky-200 shrink-0" />
                      <div className="text-xs space-y-1">
                        <span className="font-bold text-indigo-700 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> Revisión IA Gemini Vision:
                        </span>
                        <p className="text-slate-600 italic">"{task.aiFeedback}"</p>
                      </div>
              </div>
            )}

          </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Gift className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-800">Compras pendientes</h2>
          </div>
          <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full">
            {purchases.filter(p => p.status === 'pending').length} por revisar
          </span>
        </div>

        {purchases.filter(p => p.status === 'pending').length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Gift className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-500">No hay compras pendientes de aprobación.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {purchases.filter(p => p.status === 'pending').map(purchase => (
              <div key={purchase.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-amber-50/60 rounded-xl border border-amber-100 gap-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{purchase.rewardIcon || '🎁'}</span>
                  <div>
                    <h4 className="font-semibold text-slate-800">{purchase.rewardName}</h4>
                    <p className="text-xs text-slate-500">Pedido por: <strong>{purchase.kidName}</strong> • {Number(purchase.price || 0).toFixed(2)}€</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <button
                    onClick={() => handleRejectPurchase(purchase)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Rechazar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleApprovePurchase(purchase)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg shadow-sm flex items-center gap-1.5 transition"
                  >
                    <Check className="w-4 h-4" /> Aprobar compra
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Saldo y Paga acumulada</h2>
            <p className="text-xs text-slate-500">Entrega de dinero físico y control de huchas.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openManageRewards()}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition min-h-[44px]"
            >
              <Gift className="w-4 h-4" /> Recompensas
            </button>
            <button 
              onClick={() => openAddTaskModal()}
              data-testid="open-add-task"
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition min-h-[44px]"
            >
              <Plus className="w-4 h-4" /> Añadir Tarea
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {kids.map(kid => {
            const kidTasks = tasks.filter(t => t.assignedTo === kid.id && t.status === 'approved');
            const earned = kidTasks.reduce((sum, t) => sum + Number(t.reward || 0), 0);
            const completed = kidTasks.length;
            const dayOrder = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
            let streak = 0;
            for (const day of [...dayOrder].reverse()) {
              const dayTasks = tasks.filter(t => t.assignedTo === kid.id && t.day === day);
              if (dayTasks.length === 0) continue;
              if (dayTasks.every(t => t.status === 'approved')) streak++; else break;
            }

            return (
              <div key={kid.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{kid.avatar}</span>
                    <div>
                      <p className="font-bold text-slate-800">{kid.name}</p>
                      <p className="text-xs text-emerald-600 font-bold">{Number(kid.balance || 0).toFixed(2)}€ ahorrados</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setShowPenaltyModal(kid); setPenaltyAmount(''); setPenaltyReason(''); }}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold rounded-xl shadow-sm transition min-h-[44px]"
                    >
                      Penalizar
                    </button>
                    <button 
                      onClick={() => { setShowPayoutModal(kid); setPayoutAmount((kid.balance || 0).toFixed(2)); }}
                      className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold rounded-xl shadow-sm transition min-h-[44px]"
                    >
                      Pagar
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                  <span className="px-2 py-1 bg-white rounded-lg border border-slate-200">{completed} tareas</span>
                  <span className="px-2 py-1 bg-white rounded-lg border border-slate-200">{earned.toFixed(2)}€ ganados</span>
                  <span className="px-2 py-1 bg-white rounded-lg border border-slate-200">{streak}🔥 racha</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="w-5 h-5 text-indigo-500" />
          <h2 className="text-lg font-bold text-slate-800">Historial de actividad</h2>
        </div>
        {familyHistory.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-500">Aún no hay actividad registrada.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {familyHistory.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="font-bold text-slate-800">{item.title}</p>
                    <p className="text-[10px] text-slate-500">{item.kidName} • {new Date(item.date).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <span className={`font-black ${item.amount >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {item.amount >= 0 ? '+' : ''}{item.amount.toFixed(2)}€
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderChildDashboard = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 rounded-2xl shadow-sm border border-slate-100 gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Seleccionar Perfil:</span>
        <div className="flex flex-wrap items-center gap-2">
          {kids.map(kid => {
            const color = KID_COLORS.find(c => c.id === kid.color) || KID_COLORS[0];
            return (
              <button
                key={kid.id}
                onClick={() => setActiveKidId(kid.id)}
                className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center space-x-2 transition border-2 ${
                  activeKidId === kid.id
                    ? `${color.bg} text-white shadow-md scale-105 border-transparent`
                    : `bg-white text-slate-600 hover:${color.light} ${color.border}`
                }`}
              >
                <span className="text-base">{kid.avatar}</span>
                <span>{kid.name}</span>
              </button>
            );
          })}
          <button
            onClick={() => { setEditingKid(null); setShowManageKidsModal(true); }}
            className="px-3 py-2 rounded-xl font-bold text-xs flex items-center space-x-1 transition bg-slate-100 text-slate-500 hover:bg-slate-200 border border-dashed border-slate-300"
            title="Gestionar hijos"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Gestionar</span>
          </button>
        </div>
      </div>

      {currentKid && (
        <>
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-teal-800 rounded-3xl p-6 text-white shadow-xl shadow-indigo-950/20">
            <div className="absolute -right-6 -bottom-6 opacity-15 text-9xl select-none">
              🐷
            </div>
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl p-2 bg-white/10 rounded-2xl backdrop-blur-sm border-2 border-white/20">{currentKid.avatar}</span>
                  <div>
                    <h1 className="text-2xl font-black tracking-tight">¡Hola, {currentKid.name}! 👋</h1>
                    <p className="text-indigo-200 text-xs font-semibold" data-testid="weekly-goal-display">Objetivo semanal: {Number(currentKid.weeklyGoal || 10).toFixed(2)} € completando tus tareas</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  {currentKid.goalImage ? (
                    <img src={currentKid.goalImage} alt="Objetivo IA" className="w-14 h-14 object-cover rounded-xl border border-white/30 shadow-sm" />
                  ) : (
                    <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center text-2xl">
                      🎁
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] uppercase font-bold text-indigo-200">Meta de Ahorro:</p>
                    <p className="font-extrabold text-sm text-white">{currentKid.goalName || 'Sin objetivo aún'}</p>
                    <p className="text-xs text-indigo-200 mt-0.5">Llevas {Number(currentKid.balance || 0).toFixed(2)}€ ahorrados</p>
                  </div>
                </div>

                <button
                  onClick={() => { setAiGoalPrompt(currentKid.goalName || ''); setShowGoalModal(true); }}
                  className="px-3.5 py-2 bg-teal-400 hover:bg-teal-300 text-slate-900 font-extrabold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 self-start sm:self-center shrink-0"
                >
                  <ImageIcon className="w-4 h-4 text-slate-900" />
                  <span>Visualizar Meta con IA</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                  <div className="flex items-center space-x-2 text-indigo-200 text-xs font-semibold mb-1">
                    <PiggyBank className="w-4 h-4 text-teal-300" />
                    <span>Hucha acumulada</span>
                  </div>
                  <div className="text-3xl font-extrabold text-white">
                    {Number(currentKid.balance || 0).toFixed(2)}€
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                  <div className="flex items-center space-x-2 text-indigo-200 text-xs font-semibold mb-1">
                    <CheckCircle className="w-4 h-4 text-emerald-300" />
                    <span>Ganado esta semana</span>
                  </div>
                  <div className="text-3xl font-extrabold text-emerald-300">
                    {weeklyEarnedApproved.toFixed(2)}€ / {Number(currentKid.weeklyGoal || 10).toFixed(2)}€
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                  <div className="flex items-center space-x-2 text-indigo-200 text-xs font-semibold mb-1">
                    <Clock className="w-4 h-4 text-sky-300" />
                    <span>En revisión por los papás</span>
                  </div>
                  <div className="text-3xl font-extrabold text-sky-300">
                    +{pendingReviewAmount.toFixed(2)}€
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                  <div className="flex items-center space-x-2 text-indigo-200 text-xs font-semibold mb-1">
                    <Flame className="w-4 h-4 text-orange-300" />
                    <span>Racha de días</span>
                  </div>
                  <div className="text-3xl font-extrabold text-orange-300">
                    {kidStats.streak} 🔥
                  </div>
                </div>
              </div>

              <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-indigo-200">
                    <Gift className="w-4 h-4 text-teal-300" /> Objetivo Semanal: {Number(currentKid.weeklyGoal || 10).toFixed(2)} €
                    {!editingWeeklyGoal ? (
                      <button
                        onClick={() => { setEditingWeeklyGoal(true); setWeeklyGoalInput(String(currentKid.weeklyGoal || 10)); }}
                        className="text-[10px] underline text-teal-300 hover:text-teal-200 ml-1"
                        data-testid="edit-weekly-goal"
                      >
                        Editar
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 ml-1">
                        <input
                          type="number"
                          step="0.50"
                          min="1"
                          value={weeklyGoalInput}
                          onChange={(e) => setWeeklyGoalInput(e.target.value)}
                          onBlur={handleSaveWeeklyGoal}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleSaveWeeklyGoal(); }}
                          className="w-16 px-1.5 py-0.5 text-[10px] rounded text-slate-800 border border-slate-200"
                          autoFocus
                          data-testid="weekly-goal-input"
                        />
                        <span className="text-teal-300">€</span>
                      </span>
                    )}
                  </span>
                  <span>
                    {Math.round((weeklyEarnedApproved / (currentKid.weeklyGoal || 10)) * 100)}% Completado
                  </span>
                </div>
                <div className="w-full bg-black/30 h-3.5 rounded-full overflow-hidden p-0.5">
                  <div 
                    className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
                    style={{ 
                      width: `${Math.min(100, Math.max(0, (weeklyEarnedApproved / (currentKid.weeklyGoal || 10)) * 100))}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Planificador de Tareas Diarias 📋</h2>
                <p className="text-xs text-slate-400 mt-0.5">Revisa tus tareas o añade una foto comprobante con la IA.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
                <button
                  onClick={() => setViewMode('day')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1 transition min-h-[40px] ${
                    viewMode === 'day' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  <span className="hidden sm:block">Día a día</span>
                  <span className="block sm:hidden">Día</span>
                </button>
                <button
                  onClick={() => setViewMode('weekly')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1 transition min-h-[40px] ${
                    viewMode === 'weekly' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:block">Semana</span>
                  <span className="block sm:hidden">Sem.</span>
                </button>
                <button
                  onClick={() => setViewMode('completed')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1 transition min-h-[40px] ${
                    viewMode === 'completed' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:block">Completadas</span>
                  <span className="block sm:hidden">Hechas</span>
                </button>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                <button
                  onClick={() => setShowRewardStoreModal(true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition min-h-[44px]"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>Tienda</span>
                </button>
                <button 
                  onClick={() => openAddTaskModal()}
                  data-testid="open-add-task"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition min-h-[44px]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Tarea</span>
                </button>
              </div>
            </div>

            {viewMode === 'day' && (
              <>
                <div className="relative">
                  <div className="flex space-x-1.5 overflow-x-auto pb-3 pt-1 px-1 -mx-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                    {DAYS.map(day => {
                      const dayTasks = tasks.filter(t => t.assignedTo === activeKidId && t.day === day);
                      const doneCount = dayTasks.filter(t => t.status === 'approved' || t.status === 'completed').length;
                      const totalCount = dayTasks.length;

                      return (
                        <button
                          key={day}
                          onClick={() => setSelectedDay(day)}
                          className={`flex-shrink-0 min-w-[76px] sm:min-w-[90px] py-3 px-3 rounded-2xl text-xs font-bold transition flex flex-col items-center justify-center space-y-1 min-h-[60px] ${
                            selectedDay === day 
                              ? 'bg-indigo-600 text-white shadow-sm scale-[1.02]' 
                              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          <span>{day.substring(0, 3)}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                            selectedDay === day ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {doneCount}/{totalCount}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="pointer-events-none absolute right-0 top-0 bottom-3 w-8 bg-gradient-to-l from-white to-transparent sm:hidden"></div>
                </div>

                <div className="pt-2 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
                    <span>Tareas de {selectedDay} para {currentKid.name}</span>
                    <span>Puedes subir foto o activar la voz IA</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tasks
                      .filter(t => t.assignedTo === activeKidId && t.day === selectedDay)
                      .sort((a, b) => {
                        const aExtra = a.isExtra || a.category === 'Extra' || a.title.includes('Gimnasio');
                        const bExtra = b.isExtra || b.category === 'Extra' || b.title.includes('Gimnasio');
                        return (aExtra ? 1 : 0) - (bExtra ? 1 : 0);
                      })
                      .map(task => {
                        return (
                          <TaskCard
                            key={task.id}
                            task={task}
                            currentKid={currentKid}
                            role={role}
                            isParentUnlocked={isParentUnlocked}
                            onMarkCompleted={handleMarkTaskCompleted}
                            onPhotoUpload={handlePhotoUploadAndInspect}
                            onSpeakCheer={handleSpeakCheer}
                            onEdit={openAddTaskModal}
                            onDelete={handleDeleteTask}
                            inspectingTaskId={inspectingTaskId}
                            aiInspectingTask={aiInspectingTask}
                            speakingTaskId={speakingTaskId}
                            getCategoryIcon={getCategoryIcon}
                            getCategoryStyle={getCategoryStyle}
                          />
                        );
                      })}
                  </div>
                </div>
              </>
            )}

            {viewMode === 'weekly' && (
              <div className="space-y-4 pt-2">
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs text-indigo-900 flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span><strong>Vista semanal:</strong> Todas las tareas de {currentKid?.name} organizadas por día.</span>
                </div>

                {(() => {
                  const kidTasks = tasks.filter(t => t.assignedTo === activeKidId);
                  const groups = {};
                  kidTasks.forEach(t => {
                    const key = `${t.title}|${t.category}|${t.isExtra ? 1 : 0}`;
                    if (!groups[key]) {
                      groups[key] = {
                        title: t.title,
                        icon: t.icon || getCategoryIcon(t.category),
                        category: t.category,
                        reward: t.reward,
                        isExtra: t.isExtra,
                        tasksByDay: {}
                      };
                    }
                    groups[key].tasksByDay[t.day] = t;
                  });
                  const rows = Object.values(groups).sort((a, b) => (a.isExtra ? 1 : 0) - (b.isExtra ? 1 : 0));

                  return rows.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <LayoutGrid className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-slate-500">No hay tareas para esta semana.</p>
                    </div>
                  ) : (
                    <>
                      <div className="md:hidden space-y-4">
                        {rows.map((row, idx) => (
                          <div key={idx} className={`p-4 rounded-2xl border shadow-sm ${row.isExtra ? 'bg-gradient-to-br from-indigo-50 to-white border-indigo-200' : 'bg-white border-slate-200'}`}>
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-2 font-semibold text-slate-800">
                                <span className="text-2xl bg-slate-100 p-1.5 rounded-xl">{row.icon}</span>
                                <div className="flex flex-col">
                                  <span className="text-sm">{row.title}</span>
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold w-fit border ${getCategoryStyle(row.category)}`}>{row.category}</span>
                                </div>
                              </div>
                              <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg text-sm">{Number(row.reward).toFixed(2)}€</span>
                            </div>
                            <div className="flex items-center justify-between gap-1">
                              {DAYS.map(day => {
                                const task = row.tasksByDay[day];
                                const isApproved = task?.status === 'approved';
                                const isDone = task?.status === 'completed';

                                return (
                                  <div key={day} className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">{day.substring(0, 3)}</span>
                                    {task ? (
                                      <button
                                        onClick={() => { if (task.status === 'pending') handleMarkTaskCompleted(task.id); }}
                                        className={`w-full aspect-square max-w-[44px] rounded-xl font-bold flex items-center justify-center transition shadow-sm ${
                                          isApproved
                                            ? 'bg-emerald-500 text-white shadow-emerald-200'
                                            : isDone
                                            ? 'bg-sky-400 text-white shadow-sky-200 animate-pulse'
                                            : 'bg-slate-100 text-slate-400 hover:bg-indigo-200 hover:text-indigo-900'
                                        }`}
                                        title={`${day}: ${task.title}`}
                                      >
                                        {isApproved ? <Check className="w-5 h-5" /> : isDone ? <Clock className="w-5 h-5" /> : <Circle className="w-4 h-4 text-slate-300" />}
                                      </button>
                                    ) : (
                                      <span className="w-full aspect-square max-w-[44px] rounded-xl flex items-center justify-center text-slate-300 bg-slate-50">-</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100 text-slate-700 font-bold">
                            <tr>
                              <th className="p-3 border-b">Tarea</th>
                              <th className="p-3 border-b text-center">Valor</th>
                              {DAYS.map(day => (
                                <th key={day} className="p-3 border-b text-center min-w-[70px]">{day.substring(0, 3)}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {rows.map((row, idx) => (
                              <tr key={idx} className={row.isExtra ? 'bg-indigo-50/50 font-medium' : 'hover:bg-slate-50'}>
                                <td className="p-3 font-semibold text-slate-800">
                                  <div className="flex items-center space-x-2">
                                    <span>{row.icon}</span>
                                    <span>{row.title}</span>
                                    {row.isExtra && <span className="text-[10px] bg-indigo-200 text-indigo-800 px-1.5 py-0.5 rounded font-bold">EXTRA</span>}
                                  </div>
                                </td>
                                <td className="p-3 text-center font-bold text-emerald-600">
                                  {Number(row.reward).toFixed(2)}€
                                </td>
                                {DAYS.map(day => {
                                  const task = row.tasksByDay[day];
                                  const isApproved = task?.status === 'approved';
                                  const isDone = task?.status === 'completed';

                                  return (
                                    <td key={day} className="p-2 text-center">
                                      {task ? (
                                        <button
                                          onClick={() => { if (task.status === 'pending') handleMarkTaskCompleted(task.id); }}
                                          className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center mx-auto transition ${
                                            isApproved 
                                              ? 'bg-emerald-500 text-white' 
                                              : isDone 
                                              ? 'bg-sky-400 text-white animate-pulse' 
                                              : 'bg-slate-100 text-slate-400 hover:bg-indigo-200 hover:text-indigo-900'
                                          }`}
                                          title={`${day}: ${task.title}`}
                                        >
                                          {isApproved ? <Check className="w-5 h-5" /> : isDone ? <Clock className="w-5 h-5" /> : <Circle className="w-4 h-4 text-slate-300" />}
                                        </button>
                                      ) : (
                                        <span className="text-slate-300">-</span>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {viewMode === 'completed' && (
              <div className="pt-2 space-y-4">
                {tasks
                  .filter(t => t.assignedTo === activeKidId && (t.status === 'completed' || t.status === 'approved'))
                  .sort((a, b) => {
                    const statusOrder = { approved: 0, completed: 1 };
                    return (statusOrder[a.status] || 2) - (statusOrder[b.status] || 2);
                  })
                  .length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <CheckCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-500">¡No hay tareas completadas aún!</p>
                    <p className="text-xs text-slate-400 mt-1">Marca tus tareas como "Hecho" para verlas aquí.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tasks
                      .filter(t => t.assignedTo === activeKidId && (t.status === 'completed' || t.status === 'approved'))
                      .sort((a, b) => {
                        const statusOrder = { approved: 0, completed: 1 };
                        return (statusOrder[a.status] || 2) - (statusOrder[b.status] || 2);
                      })
                      .map(task => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          currentKid={currentKid}
                          role={role}
                          readonly
                          getCategoryIcon={getCategoryIcon}
                          getCategoryStyle={getCategoryStyle}
                        />
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  if (showOnboarding) {
    return (
      <div className={`min-h-screen bg-slate-900 transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
        <OnboardingModal
          show={showOnboarding}
          kids={kids}
          onComplete={handleOnboardingComplete}
          avatarOptions={AVATAR_OPTIONS}
          kidColors={KID_COLORS}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans pb-12 transition-colors duration-300 ${darkMode ? 'dark bg-slate-900 text-slate-100' : ''}`}>
      <Notification notification={notification} />

      <Header
        role={role}
        familyId={familyId}
        syncStatus={syncStatus}
        isParentUnlocked={isParentUnlocked}
        toggleRole={toggleRole}
        setShowFamilyModal={setShowFamilyModal}
        kids={kids}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main className="max-w-5xl mx-auto px-4 pt-6">
        {role === 'parent' ? renderParentDashboard() : renderChildDashboard()}
      </main>

      {showFamilyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto max-w-md w-full shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center space-x-2 text-indigo-600 font-extrabold text-base">
                <Users className="w-5 h-5" />
                <h3 className="text-slate-800">Sincronización Familiar</h3>
              </div>
              <button onClick={() => setShowFamilyModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs space-y-2 text-emerald-950">
              <div className="flex items-center space-x-2 font-bold text-emerald-800">
                <Wifi className="w-4 h-4 text-emerald-600" />
                <span>Sincronización en tiempo real activa</span>
              </div>
              <p className="text-slate-600">
                Tu familia está conectada a la sala virtual. Cualquier cambio realizado desde este u otro móvil se actualizará al instante.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Tu Código de Familia actual:</label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-slate-100 p-3 rounded-xl font-mono text-center font-extrabold text-indigo-700 text-lg tracking-widest border border-slate-200">
                  {familyId}
                </div>
                <button
                  onClick={handleCopyFamilyCode}
                  className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shrink-0"
                >
                  {copiedSuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSuccess ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
              <button
                type="button"
                onClick={handleRegenerateFamilyCode}
                className="w-full py-2 text-xs font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Generar nuevo código de familia
              </button>
            </div>

            <form onSubmit={handleJoinFamily} className="pt-3 border-t space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Conectarte a otro teléfono / Código de Familia existente:</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Ej: FAM-1234"
                  value={inputFamilyId}
                  onChange={(e) => setInputFamilyId(e.target.value)}
                  className="flex-1 p-2.5 text-xs font-mono uppercase border border-slate-200 rounded-xl"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-xl"
                >
                  Unirse
                </button>
              </div>
            </form>

            <div className="pt-3 border-t space-y-2 text-xs text-slate-600">
              <div className="flex items-center space-x-2 font-bold text-slate-800">
                <Smartphone className="w-4 h-4 text-indigo-600" />
                <span>Instalar en la pantalla de inicio del móvil:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-500">
                <li><strong>Android (Chrome):</strong> Pulsa los tres puntos <strong>⋮</strong> arriba a la derecha ➔ <em>"Añadir a pantalla de inicio"</em>.</li>
                <li><strong>iPhone (Safari):</strong> Pulsa el botón Compartir <strong>⎋</strong> abajo al centro ➔ <em>"Añadir a la pantalla de inicio"</em>.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <PinModal
        showPinModal={showPinModal}
        setShowPinModal={setShowPinModal}
        pinInput={pinInput}
        setPinInput={setPinInput}
        pinError={pinError}
        setPinError={setPinError}
        handlePinSubmit={handlePinSubmit}
      />

      {showAddTaskModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto max-w-lg w-full shadow-2xl space-y-4 my-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-slate-800 text-base">{editingTask ? 'Editar Tarea' : 'Crear Nueva Tarea'}</h3>
              <button onClick={() => { setShowAddTaskModal(false); resetNewTaskForm(); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!editingTask && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Plantillas rápidas:</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {TASK_TEMPLATES.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewTask({
                        ...newTask,
                        title: tmpl.title,
                        description: tmpl.description,
                        reward: String(tmpl.reward),
                        category: tmpl.category,
                        icon: tmpl.icon,
                        isExtra: !!tmpl.isExtra,
                        timerMinutes: tmpl.timerMinutes || 0
                      })}
                      className="px-2.5 py-1.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 flex items-center gap-1.5 transition"
                    >
                      <span>{tmpl.icon}</span>
                      <span>{tmpl.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Título de la tarea:</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Ej: Leer 20 minutos"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Descripción:</label>
                <textarea
                  placeholder="Describe en qué consiste la tarea..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 border border-slate-200 rounded-xl resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Recompensa (€):</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    required
                    value={newTask.reward}
                    onChange={(e) => setNewTask({ ...newTask, reward: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Asignar a:</label>
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  >
                    {kids.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Día de la semana:</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setNewTask({ ...newTask, day: d })}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition min-h-[40px] ${
                        newTask.day === d
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                      title={d}
                    >
                      {d.substring(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Recurrencia:</label>
                <select
                  value={newTask.recurrence}
                  onChange={(e) => setNewTask({ ...newTask, recurrence: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                >
                  {RECURRENCE_OPTIONS.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Categoría:</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setNewTask({ ...newTask, category: cat.id, icon: cat.icon })}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition flex items-center gap-1 ${
                        newTask.category === cat.id ? cat.color + ' ring-2 ring-offset-1 ring-slate-300' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Icono / Emoji:</label>
                  <input
                    type="text"
                    value={newTask.icon}
                    onChange={(e) => setNewTask({ ...newTask, icon: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Temporizador (min):</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={newTask.timerMinutes}
                    onChange={(e) => setNewTask({ ...newTask, timerMinutes: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newTask.requiresPhoto}
                    onChange={(e) => setNewTask({ ...newTask, requiresPhoto: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Requiere foto</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newTask.isExtra}
                    onChange={(e) => setNewTask({ ...newTask, isExtra: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Bono extra</span>
                </label>
              </div>
            </form>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => { setShowAddTaskModal(false); resetNewTaskForm(); }}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCreateTask}
                data-testid="submit-task"
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition"
              >
                {editingTask ? 'Guardar cambios' : 'Añadir Tarea'}
              </button>
            </div>
          </div>
        </div>
      )}

      <PayoutModal
        showPayoutModal={showPayoutModal}
        setShowPayoutModal={setShowPayoutModal}
        payoutAmount={payoutAmount}
        setPayoutAmount={setPayoutAmount}
        handlePayout={handlePayout}
      />

      <PenaltyModal
        showPenaltyModal={showPenaltyModal}
        setShowPenaltyModal={setShowPenaltyModal}
        penaltyAmount={penaltyAmount}
        setPenaltyAmount={setPenaltyAmount}
        penaltyReason={penaltyReason}
        setPenaltyReason={setPenaltyReason}
        handleApplyPenalty={handleApplyPenalty}
      />

      {showAiGenModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center space-x-2 text-indigo-600 font-extrabold text-base">
                <BrainCircuit className="w-5 h-5" />
                <h3 className="text-slate-800">Generador de Tareas Gemini IA</h3>
              </div>
              <button onClick={() => setShowAiGenModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">Ingresa un tema o hábito que quieras reforzar:</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={aiThemePrompt}
                  onChange={(e) => setAiThemePrompt(e.target.value)}
                  placeholder="Ej: Ayudar en el jardín, Responsabilidad académica..."
                  className="flex-1 p-2.5 text-xs border border-slate-200 rounded-xl"
                />
                <button
                  onClick={handleGenerateAiTasks}
                  disabled={aiGeneratingTasks}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
                >
                  {aiGeneratingTasks ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  <span>Generar</span>
                </button>
              </div>
            </div>

            {aiGeneratedTasksList.length > 0 && (
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold text-slate-700">Sugerencias propuestas por la IA:</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {aiGeneratedTasksList.map((t, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between text-xs">
                      <div className="flex items-start space-x-2">
                        <span className="text-lg">{t.icon}</span>
                        <div>
                          <p className="font-bold text-slate-800">{t.title}</p>
                          <p className="text-[10px] text-slate-400">{t.day} • {t.category}{t.timerMinutes ? ` • ⏱ ${t.timerMinutes}min` : ''}</p>
                          {t.description && <p className="text-[10px] text-slate-500 mt-0.5">{t.description}</p>}
                        </div>
                      </div>
                      <span className="font-bold text-emerald-600 shrink-0">+{t.reward}€</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex space-x-2">
                  {kids.map(kid => (
                    <button
                      key={kid.id}
                      onClick={() => handleAddAiTasksToKid(kid.id)}
                      className="flex-1 py-2 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-xl transition"
                    >
                      Añadir a {kid.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showGoalModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center space-x-2 text-teal-600 font-extrabold text-base">
                <ImageIcon className="w-5 h-5" />
                <h3 className="text-slate-800">Visualizador de Metas Imagen 4.0</h3>
              </div>
              <button onClick={() => setShowGoalModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">¿Qué regalo u objetivo deseas visualizar en 3D?</label>
              <input
                type="text"
                value={aiGoalPrompt}
                onChange={(e) => setAiGoalPrompt(e.target.value)}
                placeholder="Ej: Set de Magia y Manualidades, Pista de Carreras..."
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl"
              />
              <button
                onClick={handleGenerateGoalImage}
                disabled={aiGeneratingGoalImg}
                className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
              >
                {aiGeneratingGoalImg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Generar Ilustración 3D Pixar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showManageKidsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto max-w-lg w-full shadow-2xl space-y-4 my-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center space-x-2 text-indigo-600 font-extrabold text-base">
                <Users className="w-5 h-5" />
                <h3 className="text-slate-800">Gestionar Hijos</h3>
              </div>
              <button onClick={() => setShowManageKidsModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {kids.map(kid => {
                const color = KID_COLORS.find(c => c.id === kid.color) || KID_COLORS[0];
                return (
                  <div key={kid.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl p-2 bg-white rounded-xl shadow-sm">{kid.avatar}</span>
                      <div>
                        <p className="font-bold text-sm text-slate-800">{kid.name}</p>
                        <p className="text-xs text-slate-500">{kid.age} años • {color.label}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => { setEditingKid(kid); }}
                        className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        title="Editar"
                      >
                        <Wand2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteKid(kid.id)}
                        className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Eliminar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={() => { setEditingKid(null); }}
                className="w-full py-2.5 border border-dashed border-slate-300 rounded-xl text-slate-600 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition"
              >
                <Plus className="w-4 h-4" /> Añadir nuevo hijo
              </button>
            </div>

            {(editingKid === null || editingKid) && (
              <form onSubmit={handleSaveKid} className="space-y-3 border-t pt-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase">
                  {editingKid ? 'Editar hijo' : 'Añadir hijo'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Nombre</label>
                    <input
                      name="name"
                      type="text"
                      defaultValue={editingKid?.name || ''}
                      placeholder="Nombre"
                      required
                      className="w-full p-2.5 text-xs border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Edad</label>
                    <input
                      name="age"
                      type="number"
                      min="1"
                      max="18"
                      defaultValue={editingKid?.age || 8}
                      required
                      className="w-full p-2.5 text-xs border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Objetivo semanal (€)</label>
                    <input
                      name="weeklyGoal"
                      type="number"
                      step="0.50"
                      min="1"
                      defaultValue={editingKid?.weeklyGoal || 10}
                      required
                      className="w-full p-2.5 text-xs border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Avatar</label>
                  <div className="flex gap-2 justify-center max-h-40 overflow-y-auto overflow-x-hidden p-2 bg-slate-50 rounded-xl border border-slate-200" style={{ flexWrap: 'wrap' }}>
                    {AVATAR_OPTIONS.map(av => (
                      <label key={av} className="cursor-pointer flex-shrink-0" title={`Avatar ${av}`}>
                        <input
                          type="radio"
                          name="avatar"
                          value={av}
                          defaultChecked={editingKid ? editingKid.avatar === av : av === '👧'}
                          className="hidden peer"
                        />
                        <span className="text-xl w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center peer-checked:bg-indigo-100 peer-checked:border-indigo-500 peer-checked:scale-110 transition z-10 hover:bg-slate-50">
                          {av}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Color del perfil</label>
                  <div className="flex flex-wrap gap-2">
                    {KID_COLORS.map(c => (
                      <label key={c.id} className="cursor-pointer">
                        <input
                          type="radio"
                          name="color"
                          value={c.id}
                          defaultChecked={editingKid ? editingKid.color === c.id : c.id === 'indigo'}
                          className="hidden peer"
                        />
                        <span className={`px-3 py-2 rounded-xl text-xs font-bold text-white ${c.bg} border-2 border-transparent peer-checked:ring-2 peer-checked:ring-offset-1 peer-checked:ring-slate-400 transition`}>
                          {c.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition"
                  >
                    {editingKid ? 'Guardar cambios' : 'Añadir hijo'}
                  </button>
                  {editingKid && (
                    <button
                      type="button"
                      onClick={() => setEditingKid(null)}
                      className="px-4 py-2.5 bg-slate-100 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-200 transition"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <RewardStoreModal
        show={showRewardStoreModal}
        onClose={() => setShowRewardStoreModal(false)}
        rewards={rewards}
        currentKid={currentKid}
        onRequest={handleRequestReward}
      />

      <ManageRewardsModal
        show={showManageRewardsModal}
        onClose={() => { setShowManageRewardsModal(false); setEditingReward(null); setNewReward({ name: '', description: '', price: '5.00', icon: '🎁', category: 'toys', stock: '' }); }}
        rewards={rewards}
        newReward={newReward}
        setNewReward={setNewReward}
        editingReward={editingReward}
        setEditingReward={setEditingReward}
        onSave={handleSaveReward}
        onDelete={handleDeleteReward}
        rewardIcons={REWARD_ICONS}
        rewardCategories={REWARD_CATEGORIES}
      />
    </div>
  );
}
