import { useState, useEffect, useCallback } from 'react';
import pomodoroData from '../data/pomodoroData.json';

export const usePomodoro = () => {
  const [settings, setSettings] = useState(pomodoroData.settings);
  const [days, setDays] = useState(pomodoroData.days);
  const [templates, setTemplates] = useState(pomodoroData.templates);
  const [statistics, setStatistics] = useState(pomodoroData.statistics);
  const [currentDay, setCurrentDay] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerType, setTimerType] = useState('pomodoro'); // 'pomodoro', 'shortBreak', 'longBreak'

  // Atualizar configurações
  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Distribuir tarefas automaticamente seguindo a sequência padrão
  const distributeTasksAutomatically = useCallback((tasks, totalPomodoros) => {
    if (!tasks || tasks.length === 0) return [];

    const distributedTasks = [];
    let taskIndex = 0;
    let pomodoroCount = 0;

    // Sequência padrão: Pomodoro -> Pausa Curta -> Pomodoro -> Pausa Curta -> ... -> Pausa Longa
    for (let i = 0; i < totalPomodoros * 2; i++) { // *2 porque inclui pomodoros e pausas
      if (taskIndex >= tasks.length) break;

      const currentTask = tasks[taskIndex];
      
      if (i % 2 === 0) {
        // Posição par = Pomodoro
        distributedTasks.push({
          id: `task-${Date.now()}-${i}`,
          title: currentTask.title,
          description: currentTask.description || '',
          type: 'pomodoro',
          duration: settings.pomodoroDuration,
          completed: false,
          startTime: null,
          endTime: null,
          originalIndex: taskIndex
        });
        pomodoroCount++;
      } else {
        // Posição ímpar = Pausa Curta (exceto quando é hora da pausa longa)
        const isLongBreakTime = pomodoroCount > 0 && pomodoroCount % settings.longBreakInterval === 0;
        
        distributedTasks.push({
          id: `task-${Date.now()}-${i}`,
          title: currentTask.title,
          description: currentTask.description || '',
          type: isLongBreakTime ? 'longBreak' : 'shortBreak',
          duration: isLongBreakTime ? settings.longBreakDuration : settings.shortBreakDuration,
          completed: false,
          startTime: null,
          endTime: null,
          originalIndex: taskIndex
        });
      }
      
      taskIndex++;
    }

    return distributedTasks;
  }, [settings]);

  // Criar novo dia
  const createDay = useCallback((date, workHours = settings.workHoursPerDay, tasks = []) => {
    const dayId = date;
    const totalPomodoros = Math.floor((workHours * 60) / (settings.pomodoroDuration + settings.shortBreakDuration));
    
    // Distribuir tarefas automaticamente
    const distributedTasks = distributeTasksAutomatically(tasks, totalPomodoros);
    
    const newDay = {
      id: dayId,
      date: date,
      totalWorkHours: workHours,
      totalPomodoros: totalPomodoros,
      completedPomodoros: 0,
      status: 'active',
      tasks: distributedTasks
    };

    setDays(prev => [...prev, newDay]);
    setCurrentDay(newDay);
    return newDay;
  }, [settings, distributeTasksAutomatically]);

  // Adicionar tarefa ao dia atual
  const addTask = useCallback((taskData) => {
    if (!currentDay) return;

    const newTask = {
      id: `task-${Date.now()}`,
      title: taskData.title,
      description: taskData.description || '',
      type: taskData.type,
      duration: taskData.duration || settings.pomodoroDuration,
      completed: false,
      startTime: null,
      endTime: null
    };

    setDays(prev => prev.map(day => 
      day.id === currentDay.id 
        ? { ...day, tasks: [...day.tasks, newTask] }
        : day
    ));

    setCurrentDay(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }));

    return newTask;
  }, [currentDay, settings]);

  // Marcar tarefa como concluída
  const completeTask = useCallback((taskId) => {
    if (!currentDay) return;

    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5);

    setDays(prev => prev.map(day => 
      day.id === currentDay.id 
        ? {
            ...day,
            tasks: day.tasks.map(task => 
              task.id === taskId 
                ? { ...task, completed: true, endTime: timeString }
                : task
            ),
            completedPomodoros: day.completedPomodoros + 1
          }
        : day
    ));

    setCurrentDay(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: true, endTime: timeString }
          : task
      ),
      completedPomodoros: prev.completedPomodoros + 1
    }));
  }, [currentDay]);

  // Iniciar timer
  const startTimer = useCallback((type = 'pomodoro') => {
    let duration = 0;
    
    switch (type) {
      case 'pomodoro':
        duration = settings.pomodoroDuration * 60;
        break;
      case 'shortBreak':
        duration = settings.shortBreakDuration * 60;
        break;
      case 'longBreak':
        duration = settings.longBreakDuration * 60;
        break;
      default:
        duration = settings.pomodoroDuration * 60;
    }

    setTimerType(type);
    setTimeLeft(duration);
    setIsRunning(true);
  }, [settings]);

  // Pausar timer
  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Parar timer
  const stopTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(0);
  }, []);

  // Resetar timer
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(0);
  }, []);

  // Aplicar template a um dia
  const applyTemplate = useCallback((templateId, dayId) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    const day = days.find(d => d.id === dayId);
    if (!day) return;

    const tasksWithIds = template.tasks.map(task => ({
      ...task,
      id: `task-${Date.now()}-${Math.random()}`,
      completed: false,
      startTime: null,
      endTime: null
    }));

    setDays(prev => prev.map(d => 
      d.id === dayId 
        ? { ...d, tasks: tasksWithIds }
        : d
    ));

    if (currentDay && currentDay.id === dayId) {
      setCurrentDay(prev => ({ ...prev, tasks: tasksWithIds }));
    }
  }, [templates, days, currentDay]);

  // Obter dia atual por data
  const getDayByDate = useCallback((date) => {
    return days.find(day => day.date === date);
  }, [days]);

  // Obter estatísticas do dia
  const getDayStatistics = useCallback((dayId) => {
    const day = days.find(d => d.id === dayId);
    if (!day) return null;

    const completedTasks = day.tasks.filter(task => task.completed);
    const pomodorosCompleted = completedTasks.filter(task => task.type === 'pomodoro').length;
    const breaksCompleted = completedTasks.filter(task => task.type !== 'pomodoro').length;

    return {
      totalTasks: day.tasks.length,
      completedTasks: completedTasks.length,
      pomodorosCompleted,
      breaksCompleted,
      completionRate: day.tasks.length > 0 ? (completedTasks.length / day.tasks.length) * 100 : 0
    };
  }, [days]);

  // Timer countdown effect
  useEffect(() => {
    let interval = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Timer terminou
      setIsRunning(false);
      // Aqui você pode adicionar lógica para tocar som, mostrar notificação, etc.
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeLeft]);

  // Formatar tempo para exibição
  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // Obter próximo tipo de timer
  const getNextTimerType = useCallback(() => {
    if (!currentDay) return 'pomodoro';

    const completedPomodoros = currentDay.completedPomodoros;
    const longBreakInterval = settings.longBreakInterval;

    if (completedPomodoros > 0 && completedPomodoros % longBreakInterval === 0) {
      return 'longBreak';
    } else if (timerType === 'pomodoro') {
      return 'shortBreak';
    } else {
      return 'pomodoro';
    }
  }, [currentDay, settings, timerType]);

  return {
    // Estado
    settings,
    days,
    templates,
    statistics,
    currentDay,
    currentTask,
    isRunning,
    timeLeft,
    timerType,

    // Ações
    updateSettings,
    createDay,
    addTask,
    completeTask,
    startTimer,
    pauseTimer,
    stopTimer,
    resetTimer,
    applyTemplate,
    getDayByDate,
    getDayStatistics,
    getNextTimerType,
    formatTime,
    setCurrentDay,
    setCurrentTask,
    setTimerType,
    setTimeLeft,
    setIsRunning
  };
};
