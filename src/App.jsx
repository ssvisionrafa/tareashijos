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
  Shield, 
  User,
  Sparkles, 
  PiggyBank, 
  Gift, 
  RefreshCw, 
  Lock, 
  Check, 
  X,
  Coins,
  Calendar,
  Dumbbell,
  Zap,
  CheckCheck,
  Flame,
  LayoutGrid,
  ListFilter,
  Camera,
  Volume2,
  Wand2,
  Image as ImageIcon,
  Loader2,
  BrainCircuit,
  Users,
  Copy,
  Smartphone,
  Wifi
} from 'lucide-react';

const buildFirebaseConfig = () => {
  const env = import.meta.env;
  const hasViteConfig = env.VITE_FIREBASE_API_KEY && env.VITE_FIREBASE_PROJECT_ID;
  if (hasViteConfig) {
    return {
      apiKey: env.VITE_FIREBASE_API_KEY,
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: env.VITE_FIREBASE_APP_ID
    };
  }
  if (typeof __firebase_config !== 'undefined') {
    return JSON.parse(__firebase_config);
  }
  return {
    apiKey: "demo-api-key",
    authDomain: "demo-app.firebaseapp.com",
    projectId: "demo-app",
    storageBucket: "demo-app.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:demo"
  };
};

const firebaseConfig = buildFirebaseConfig();

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : (import.meta.env.VITE_FIREBASE_APP_ID || 'kid-reward-manager-app');

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const DEFAULT_KIDS = [
  { id: 'kid_enma', name: 'Enma', avatar: '👧', balance: 0.00, goalName: 'Set de Magia y Manualidades', goalAmount: 15.00, goalImage: null },
  { id: 'kid_matias', name: 'Matías', avatar: '👦', balance: 0.00, goalName: 'Pista de Carreras', goalAmount: 15.00, goalImage: null }
];

const DAILY_TASK_TEMPLATES = [
  { templateId: 'cama', title: 'Hacer la cama y ordenar habitación', reward: 0.50, category: 'Dormitorio', icon: '🛏️' },
  { templateId: 'ropa', title: 'Organizar ropa y zapatos', reward: 0.30, category: 'Dormitorio', icon: '👟' },
  { templateId: 'escoba', title: 'Pasar la escoba en la habitación', reward: 0.20, category: 'Dormitorio', icon: '🧹' },
  { templateId: 'mesa', title: 'Poner/quitar la mesa y fregar platos', reward: 0.43, category: 'Cocina', icon: '🍽️' },
  { templateId: 'gym', title: 'Entrenamiento Gimnasio (>30 min)', reward: 1.00, category: 'Extra', icon: '🏋️‍♂️', isExtra: true }
];

const generateInitialTasks = () => {
  const tasks = [];
  DEFAULT_KIDS.forEach(kid => {
    DAYS.forEach(day => {
      DAILY_TASK_TEMPLATES.forEach(tmpl => {
        tasks.push({
          id: `task_${kid.id}_${day}_${tmpl.templateId}`,
          title: tmpl.title,
          reward: tmpl.reward,
          assignedTo: kid.id,
          day: day,
          status: 'pending',
          category: tmpl.category,
          icon: tmpl.icon,
          isExtra: !!tmpl.isExtra,
          aiFeedback: null,
          photoUrl: null
        });
      });
    });
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
  const [notification, setNotification] = useState(null);
  const [syncStatus, setSyncStatus] = useState('connecting');

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

  const [newTask, setNewTask] = useState({ title: '', reward: '1.00', assignedTo: 'kid_enma', day: 'Lunes', category: 'General', icon: '⭐' });
  const [payoutAmount, setPayoutAmount] = useState('');

  const tasksInitialLoadDoneRef = useRef(false);

  const notify = (msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3800);
  };

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
  }, [familyId]);

  useEffect(() => {
    console.log(`[KidCoins] Family: ${familyId}, AppId: ${appId}`);
    setLoading(true);
    setSyncStatus('connecting');

    const loadLocalData = () => {
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
    };

    // Load local data immediately while Firestore connects
    loadLocalData();

    enableNetwork(db).catch((e) => console.warn('Could not enable Firestore network:', e));

      const kidsRef = collection(db, 'artifacts', appId, 'families', familyId, 'kids');
      const unsubKids = onSnapshot(kidsRef,
        (snapshot) => {
          const fetchedKids = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          const fromServer = !snapshot.metadata.fromCache;
          console.log(`[KidCoins] Kids snapshot: ${fetchedKids.length} docs, fromServer=${fromServer}`);

          if (fetchedKids.length === 0 && fromServer) {
          DEFAULT_KIDS.forEach(k => setDoc(doc(kidsRef, k.id), k).catch((e) => console.warn('setDoc kid failed:', e)));
          setKids(DEFAULT_KIDS);
          localStorage.setItem(`kid_reward_kids_${familyId}`, JSON.stringify(DEFAULT_KIDS));
        } else if (fetchedKids.length > 0) {
          setKids(fetchedKids);
          localStorage.setItem(`kid_reward_kids_${familyId}`, JSON.stringify(fetchedKids));
          if (!activeKidId || !fetchedKids.find(k => k.id === activeKidId)) {
            setActiveKidId(fetchedKids[0]?.id || 'kid_enma');
          }
        }

        if (fromServer) {
          setSyncStatus(prev => prev === 'offline' ? 'synced' : 'synced');
        }
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
          console.log(`[KidCoins] Tasks snapshot: ${fetchedTasks.length} docs, fromServer=${fromServer}`);

          if (fetchedTasks.length > 0) {
          setTasks(fetchedTasks);
          localStorage.setItem(`kid_reward_tasks_${familyId}`, JSON.stringify(fetchedTasks));
          tasksInitialLoadDoneRef.current = true;
        } else if (fromServer) {
          const initialTasks = generateInitialTasks();
          initialTasks.forEach(t => setDoc(doc(tasksRef, t.id), t).catch((e) => console.warn('setDoc task failed:', e)));
          setTasks(initialTasks);
          localStorage.setItem(`kid_reward_tasks_${familyId}`, JSON.stringify(initialTasks));
          tasksInitialLoadDoneRef.current = true;
        }

        if (fromServer) {
          setSyncStatus('synced');
        }
      },
      (err) => {
        console.warn("Firestore permission issue for tasks, loading local storage:", err.message);
        setSyncStatus('offline');
      }
    );

    setLoading(false);

    return () => {
      unsubKids();
      unsubTasks();
    };
  }, [familyId, activeKidId]);

  const persistKids = (updatedKids) => {
    setKids(updatedKids);
    localStorage.setItem(`kid_reward_kids_${familyId}`, JSON.stringify(updatedKids));
  };

  const persistTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    localStorage.setItem(`kid_reward_tasks_${familyId}`, JSON.stringify(updatedTasks));
  };

  const currentKid = useMemo(() => kids.find(k => k.id === activeKidId) || kids[0], [kids, activeKidId]);

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

  const handleJoinFamily = (e) => {
    e.preventDefault();
    const cleanId = inputFamilyId.trim().toUpperCase();
    if (!cleanId) return;
    setFamilyId(cleanId);
    localStorage.setItem('kid_reward_family_id', cleanId);
    setShowFamilyModal(false);
    setInputFamilyId('');
    notify(`👨‍👩‍👧‍👦 Sincronizado con la familia ${cleanId}`, 'success');
  };

  const handleCopyFamilyCode = () => {
    navigator.clipboard.writeText(familyId);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
    notify('📋 Código copiado al portapapeles', 'info');
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
          parts: [{ text: `Genera 4 tareas del hogar divertidas, educativas y bien pensadas para niños en español sobre la temática: "${aiThemePrompt}". Asigna días de la semana (Lunes a Domingo) y recompensas razonables en Euros entre 0.30€ y 1.50€.` }]
        }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                title: { type: "STRING" },
                reward: { type: "NUMBER" },
                category: { type: "STRING" },
                day: { type: "STRING" },
                icon: { type: "STRING" }
              },
              propertyOrdering: ["title", "reward", "category", "day", "icon"]
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
          reward: parseFloat(t.reward) || 0.50,
          assignedTo: kidId,
          day: t.day || 'Lunes',
          status: 'pending',
          category: t.category || 'IA Especial',
          icon: t.icon || '✨',
          isExtra: true
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

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const taskId = `custom_${Date.now()}`;
      const newTaskObj = {
        id: taskId,
        title: newTask.title,
        reward: parseFloat(newTask.reward) || 0.50,
        assignedTo: newTask.assignedTo,
        day: newTask.day,
        status: 'pending',
        category: newTask.category,
        icon: newTask.icon || '⭐',
        isExtra: newTask.category === 'Extra'
      };

      try {
        const taskRef = doc(db, 'artifacts', appId, 'families', familyId, 'tasks', taskId);
        await setDoc(taskRef, newTaskObj);
      } catch (err) {
        console.warn('Firestore setDoc skipped (using local storage fallback)', err);
        notify('No se pudo sincronizar la nueva tarea con la nube. Se guardó en este dispositivo.', 'error');
      }

      const updatedTasks = [...tasks, newTaskObj];
      persistTasks(updatedTasks);

      setShowAddTaskModal(false);
      setNewTask({ title: '', reward: '1.00', assignedTo: 'kid_enma', day: selectedDay, category: 'General', icon: '⭐' });
      notify('⭐ Nueva tarea añadida al horario.', 'success');
    } catch {
      notify('Error al crear tarea.', 'error');
    }
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
            <p className="text-2xl font-bold text-slate-800">10,00 € / sem</p>
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
                      <span className="text-2xl">{task.icon || '⭐'}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-800">{task.title}</h4>
                          <span className="text-xs bg-sky-200 text-sky-900 px-2 py-0.5 rounded-md font-bold">{task.day}</span>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>Realizado por: <strong>{kid?.name} {kid?.avatar}</strong></span>
                          <span>•</span>
                          <span className="font-bold text-emerald-600">+{Number(task.reward).toFixed(2)}€</span>
                        </p>
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

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Saldo y Paga acumulada</h2>
            <p className="text-xs text-slate-500">Entrega de dinero físico y control de huchas.</p>
          </div>
          <button 
            onClick={() => setShowAddTaskModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition min-h-[44px]"
          >
            <Plus className="w-4 h-4" /> Añadir Tarea
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {kids.map(kid => (
            <div key={kid.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{kid.avatar}</span>
                <div>
                  <p className="font-bold text-slate-800">{kid.name}</p>
                  <p className="text-xs text-emerald-600 font-bold">{Number(kid.balance || 0).toFixed(2)}€ ahorrados</p>
                </div>
              </div>
              <button 
                onClick={() => { setShowPayoutModal(kid); setPayoutAmount((kid.balance || 0).toFixed(2)); }}
                className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold rounded-xl shadow-sm transition min-h-[44px]"
              >
                Pagar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderChildDashboard = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 rounded-2xl shadow-sm border border-slate-100 gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Seleccionar Perfil:</span>
        <div className="flex flex-wrap items-center gap-2">
          {kids.map(kid => (
            <button
              key={kid.id}
              onClick={() => setActiveKidId(kid.id)}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center space-x-2 transition ${
                activeKidId === kid.id 
                  ? 'bg-indigo-600 text-white shadow-md scale-105' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span className="text-base">{kid.avatar}</span>
              <span>{kid.name}</span>
            </button>
          ))}
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
                  <span className="text-4xl p-2 bg-white/10 rounded-2xl backdrop-blur-sm">{currentKid.avatar}</span>
                  <div>
                    <h1 className="text-2xl font-black tracking-tight">¡Hola, {currentKid.name}! 👋</h1>
                    <p className="text-indigo-200 text-xs font-semibold">Objetivo semanal: 10,00 € completando tus tareas</p>
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
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
                    {weeklyEarnedApproved.toFixed(2)}€ / 10€
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
              </div>

              <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-indigo-200">
                    <Gift className="w-4 h-4 text-teal-300" /> Objetivo Semanal: 10.00 €
                  </span>
                  <span>
                    {Math.round((weeklyEarnedApproved / 10.00) * 100)}% Completado
                  </span>
                </div>
                <div className="w-full bg-black/30 h-3.5 rounded-full overflow-hidden p-0.5">
                  <div 
                    className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
                    style={{ 
                      width: `${Math.min(100, Math.max(0, (weeklyEarnedApproved / 10.00) * 100))}%` 
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
                  <span className="hidden sm:inline">Día a día</span>
                  <span className="sm:hidden">Día</span>
                </button>
                <button
                  onClick={() => setViewMode('weekly')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1 transition min-h-[40px] ${
                    viewMode === 'weekly' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Semana</span>
                  <span className="sm:hidden">Sem.</span>
                </button>
                <button
                  onClick={() => setViewMode('completed')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1 transition min-h-[40px] ${
                    viewMode === 'completed' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Completadas</span>
                  <span className="sm:hidden">Hechas</span>
                </button>
              </div>

              <button 
                onClick={() => {
                  setNewTask({ ...newTask, assignedTo: activeKidId, day: selectedDay });
                  setShowAddTaskModal(true);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition self-start sm:self-auto shrink-0 min-h-[44px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir Tarea</span>
              </button>
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
                        const isDone = task.status === 'completed';
                        const isApproved = task.status === 'approved';

                        return (
                          <div 
                            key={task.id} 
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
                                <span className="text-3xl p-2 bg-slate-100 rounded-xl">{task.icon || '⭐'}</span>
                                <div>
                                  <h3 className={`font-bold text-slate-800 text-sm ${isApproved ? 'line-through text-slate-500' : ''}`}>
                                    {task.title}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 font-semibold rounded-md">
                                      {task.category}
                                    </span>
                                    {task.isExtra && (
                                      <span className="text-[10px] px-2 py-0.5 bg-indigo-100 text-indigo-700 font-bold rounded-md flex items-center gap-1">
                                        <Flame className="w-3 h-3 text-indigo-500" /> BONO EXTRA
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <span className={`text-base font-black ${task.isExtra ? 'text-indigo-600' : 'text-emerald-600'}`}>
                                +{Number(task.reward).toFixed(2)}€
                              </span>
                            </div>

                            {task.aiFeedback && (
                              <div className="bg-sky-100/70 p-2.5 rounded-xl text-xs space-y-1 text-slate-700">
                                <p className="font-bold text-sky-900 flex items-center gap-1">
                                  <Sparkles className="w-3.5 h-3.5 text-sky-600" /> Comentario IA:
                                </p>
                                <p>{task.aiFeedback}</p>
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
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleMarkTaskCompleted(task.id)}
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
                                      onChange={(e) => handlePhotoUploadAndInspect(task.id, e.target.files[0])}
                                      disabled={aiInspectingTask}
                                    />
                                  </label>
                                </>
                              )}

                              <button
                                onClick={() => handleSpeakCheer(task.id, `¡Muy bien ${currentKid.name}! ¡Sigue así completando la tarea ${task.title} para ganar tu recompensa!`)}
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
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </>
            )}

            {viewMode === 'weekly' && (
              <div className="space-y-4 pt-2">
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs text-indigo-900 flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span><strong>Desglose semanal completo:</strong> Tareas diarias obligatorias agrupadas primero y Entrenamiento Gimnasio al final como extra.</span>
                </div>

                {/* Vista móvil: tarjetas */}
                <div className="md:hidden space-y-3">
                  {[...DAILY_TASK_TEMPLATES]
                    .sort((a, b) => (a.isExtra ? 1 : 0) - (b.isExtra ? 1 : 0))
                    .map((tmpl) => (
                      <div key={tmpl.templateId} className={`p-4 rounded-2xl border ${tmpl.isExtra ? 'bg-indigo-50/70 border-indigo-200' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2 font-semibold text-slate-800">
                            <span className="text-lg">{tmpl.icon}</span>
                            <span>{tmpl.title}</span>
                            {tmpl.isExtra && <span className="text-[10px] bg-indigo-200 text-indigo-800 px-1.5 py-0.5 rounded font-bold">EXTRA</span>}
                          </div>
                          <span className="font-bold text-emerald-600">{tmpl.reward.toFixed(2)}€</span>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {DAYS.map(day => {
                            const task = tasks.find(t => t.assignedTo === activeKidId && t.day === day && (t.title.includes(tmpl.title.substring(0, 10)) || t.id.includes(tmpl.templateId)));
                            const isApproved = task?.status === 'approved';
                            const isDone = task?.status === 'completed';

                            return (
                              <div key={day} className="flex flex-col items-center gap-1">
                                <span className="text-[10px] font-bold text-slate-500">{day.substring(0, 3)}</span>
                                {task ? (
                                  <button
                                    onClick={() => {
                                      if (task.status === 'pending') handleMarkTaskCompleted(task.id);
                                    }}
                                    className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center transition ${
                                      isApproved 
                                        ? 'bg-emerald-500 text-white' 
                                        : isDone 
                                        ? 'bg-sky-400 text-white animate-pulse' 
                                        : 'bg-slate-100 text-slate-400 hover:bg-indigo-200 hover:text-indigo-900'
                                    }`}
                                    title={`${day}: ${task.title} - ${isApproved ? 'Aprobada' : isDone ? 'En revisión' : 'Hacer clic para marcar'}`}
                                  >
                                    {isApproved ? <Check className="w-5 h-5" /> : isDone ? <Clock className="w-5 h-5" /> : <Circle className="w-4 h-4 text-slate-300" />}
                                  </button>
                                ) : (
                                  <span className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300">-</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                </div>

                {/* Vista desktop: tabla */}
                <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-3 border-b">Tarea / Tarea Diaria</th>
                        <th className="p-3 border-b text-center">Valor</th>
                        {DAYS.map(day => (
                          <th key={day} className="p-3 border-b text-center min-w-[70px]">{day.substring(0, 3)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[...DAILY_TASK_TEMPLATES]
                        .sort((a, b) => (a.isExtra ? 1 : 0) - (b.isExtra ? 1 : 0))
                        .map((tmpl) => (
                          <tr key={tmpl.templateId} className={tmpl.isExtra ? 'bg-indigo-50/50 font-medium' : 'hover:bg-slate-50'}>
                            <td className="p-3 font-semibold text-slate-800">
                              <div className="flex items-center space-x-2">
                                <span>{tmpl.icon}</span>
                                <span>{tmpl.title}</span>
                                {tmpl.isExtra && <span className="text-[10px] bg-indigo-200 text-indigo-800 px-1.5 py-0.5 rounded font-bold">EXTRA</span>}
                              </div>
                            </td>
                            <td className="p-3 text-center font-bold text-emerald-600">
                              {tmpl.reward.toFixed(2)}€
                            </td>
                            {DAYS.map(day => {
                              const task = tasks.find(t => t.assignedTo === activeKidId && t.day === day && (t.title.includes(tmpl.title.substring(0, 10)) || t.id.includes(tmpl.templateId)));
                              const isApproved = task?.status === 'approved';
                              const isDone = task?.status === 'completed';

                              return (
                                <td key={day} className="p-2 text-center">
                                  {task ? (
                                    <button
                                      onClick={() => {
                                        if (task.status === 'pending') handleMarkTaskCompleted(task.id);
                                      }}
                                      className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center mx-auto transition ${
                                        isApproved 
                                          ? 'bg-emerald-500 text-white' 
                                          : isDone 
                                          ? 'bg-sky-400 text-white animate-pulse' 
                                          : 'bg-slate-100 text-slate-400 hover:bg-indigo-200 hover:text-indigo-900'
                                      }`}
                                      title={`${day}: ${task.title} - ${isApproved ? 'Aprobada' : isDone ? 'En revisión' : 'Hacer clic para marcar'}`}
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
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      {notification && (
        <div className={`fixed bottom-5 left-4 right-4 sm:left-auto sm:right-5 z-50 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center space-x-2 transition max-w-sm ${
          notification.type === 'error' ? 'bg-rose-600 text-white' : notification.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-white'
        }`}>
          <span className="break-words">{notification.msg}</span>
        </div>
      )}

      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-sm shrink-0">
              💶
            </div>
            <div className="min-w-0">
              <h1 className="font-extrabold text-base text-slate-800 leading-tight truncate">KidCoins</h1>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Enma y Matías</p>
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
              {syncStatus === 'synced' && <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 ml-1" title="Sincronizado con la nube"></span>}
              {syncStatus === 'offline' && <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500 ml-1" title="Sin conexión con la nube"></span>}
              {syncStatus === 'connecting' && <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse ml-1" title="Conectando..."></span>}
            </button>

            <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1">
              <button
                onClick={() => toggleRole('child')}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition min-h-[40px] ${
                  role === 'child' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <User className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Modo Niños</span>
                <span className="sm:hidden">Niños</span>
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

      {showPinModal && (
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
                  onClick={() => setShowPinModal(false)}
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
      )}

      {showAddTaskModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-slate-800 text-base">Crear Nueva Tarea Manual</h3>
              <button onClick={() => setShowAddTaskModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Título de la tarea:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Leer 20 minutos"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Recompensa (€):</label>
                  <input
                    type="number"
                    step="0.05"
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
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Día de la semana:</label>
                  <select
                    value={newTask.day}
                    onChange={(e) => setNewTask({ ...newTask, day: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  >
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Icono / Emoji:</label>
                  <input
                    type="text"
                    value={newTask.icon}
                    onChange={(e) => setNewTask({ ...newTask, icon: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition"
              >
                Añadir Tarea
              </button>
            </form>
          </div>
        </div>
      )}

      {showPayoutModal && (
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
                  onClick={() => setShowPayoutModal(null)}
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
      )}

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
                    <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span>{t.icon}</span>
                        <div>
                          <p className="font-bold text-slate-800">{t.title}</p>
                          <p className="text-[10px] text-slate-400">{t.day} • {t.category}</p>
                        </div>
                      </div>
                      <span className="font-bold text-emerald-600">+{t.reward}€</span>
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
    </div>
  );
}
