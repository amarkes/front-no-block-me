import { useState, useEffect } from 'react';
import { usePomodoro } from '../../../hooks/usePomodoro';
import styles from './styles.module.css';
import { useTheme } from '../../../context/ThemeContext';

const PomodoroTimer = ({ onMenuClick }) => {
  const { 
    settings, 
    currentDay, 
    isRunning, 
    timeLeft, 
    timerType,
    startTimer, 
    pauseTimer, 
    stopTimer, 
    resetTimer,
    formatTime,
    getNextTimerType,
    completeTask,
    setCurrentDay,
    setTimerType,
    setTimeLeft,
    setIsRunning,
    createDay
  } = usePomodoro();
  
  const { isDark } = useTheme();
  const [showCreateDay, setShowCreateDay] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showCreateDayForm, setShowCreateDayForm] = useState(false);
  const [dayTasks, setDayTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    type: 'pomodoro',
    duration: settings.pomodoroDuration
  });
  const [dayFormData, setDayFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    workHours: settings.workHoursPerDay
  });

  // Iniciar criação de dia
  const handleStartCreateDay = () => {
    setShowCreateDayForm(true);
    setDayTasks([]);
    setDayFormData({
      date: new Date().toISOString().split('T')[0],
      workHours: settings.workHoursPerDay
    });
  };

  // Adicionar tarefa ao dia sendo criado
  const handleAddDayTask = () => {
    if (!newTask.title.trim()) return;
    
    const task = {
      title: newTask.title,
      description: newTask.description
    };

    setDayTasks(prev => [...prev, task]);
    setNewTask({
      title: '',
      description: '',
      type: 'pomodoro',
      duration: settings.pomodoroDuration
    });
  };

  // Remover tarefa do dia sendo criado
  const handleRemoveDayTask = (index) => {
    setDayTasks(prev => prev.filter((_, i) => i !== index));
  };

  // Criar dia final com tarefas distribuídas
  const handleCreateDayFinal = () => {
    createDay(dayFormData.date, dayFormData.workHours, dayTasks);
    setShowCreateDayForm(false);
    setDayTasks([]);
  };

  // Cancelar criação de dia
  const handleCancelCreateDay = () => {
    setShowCreateDayForm(false);
    setDayTasks([]);
  };

  // Adicionar nova tarefa
  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    
    const task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      type: newTask.type,
      duration: newTask.type === 'pomodoro' ? settings.pomodoroDuration : 
                newTask.type === 'shortBreak' ? settings.shortBreakDuration : 
                settings.longBreakDuration,
      completed: false,
      startTime: null,
      endTime: null
    };

    if (currentDay) {
      setCurrentDay(prev => ({
        ...prev,
        tasks: [...prev.tasks, task]
      }));
    }

    setNewTask({
      title: '',
      description: '',
      type: 'pomodoro',
      duration: settings.pomodoroDuration
    });
    setShowAddTask(false);
  };

  // Marcar tarefa como concluída
  const handleCompleteTask = (taskId) => {
    completeTask(taskId);
  };

  // Obter cor do timer baseado no tipo
  const getTimerColor = () => {
    switch (timerType) {
      case 'pomodoro':
        return 'from-red-500 to-red-600';
      case 'shortBreak':
        return 'from-green-500 to-green-600';
      case 'longBreak':
        return 'from-blue-500 to-blue-600';
      default:
        return 'from-purple-500 to-purple-600';
    }
  };

  // Obter ícone do timer
  const getTimerIcon = () => {
    switch (timerType) {
      case 'pomodoro':
        return '🍅';
      case 'shortBreak':
        return '☕';
      case 'longBreak':
        return '🏖️';
      default:
        return '⏰';
    }
  };

  // Obter texto do timer
  const getTimerText = () => {
    switch (timerType) {
      case 'pomodoro':
        return 'Foco';
      case 'shortBreak':
        return 'Pausa Curta';
      case 'longBreak':
        return 'Pausa Longa';
      default:
        return 'Timer';
    }
  };

  // Obter progresso do dia
  const getDayProgress = () => {
    if (!currentDay) return 0;
    return (currentDay.completedPomodoros / currentDay.totalPomodoros) * 100;
  };

  return (
    <div className={`${styles.timerContainer} ${isDark ? styles.dark : ''}`}>
      
      <div className={styles.mainContainer}>
        <div className={styles.contentWrapper}>
          {/* Header da página */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>
              Pomodoro Timer
            </h1>
            <p className={`${styles.pageSubtitle} ${isDark ? styles.dark : ''}`}>
              Gerencie seu tempo de forma eficiente
            </p>
          </div>


          {/* Timer principal */}
          <div className={styles.timerSection}>
            <div className={`${styles.timerCircle} ${isDark ? styles.dark : ''}`}>
              <div className={`${styles.timerIcon} ${isDark ? styles.dark : ''}`}>
                {getTimerIcon()}
              </div>
              <div className={`${styles.timerText} ${isDark ? styles.dark : ''}`}>
                {getTimerText()}
              </div>
              <div className={`${styles.timerDisplay} ${isDark ? styles.dark : ''}`}>
                {formatTime(timeLeft)}
              </div>
            </div>

            {/* Controles do timer */}
            <div className={styles.timerControls}>
              {!isRunning ? (
                <button
                  onClick={() => startTimer(timerType)}
                  className={`${styles.startButton} ${isDark ? styles.dark : ''}`}
                >
                  ▶️ Iniciar
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className={`${styles.pauseButton} ${isDark ? styles.dark : ''}`}
                >
                  ⏸️ Pausar
                </button>
              )}
              
              <button
                onClick={stopTimer}
                className={`${styles.stopButton} ${isDark ? styles.dark : ''}`}
              >
                ⏹️ Parar
              </button>
              
              <button
                onClick={resetTimer}
                className={`${styles.resetButton} ${isDark ? styles.dark : ''}`}
              >
                🔄 Resetar
              </button>
            </div>

            {/* Botões de tipo de timer */}
            <div className={styles.timerTypeButtons}>
              <button
                onClick={() => {
                  setTimerType('pomodoro');
                  setTimeLeft(settings.pomodoroDuration * 60);
                  setIsRunning(false); // Garante que não está rodando
                }}
                className={`${styles.typeButton} ${timerType === 'pomodoro' ? styles.active : ''} ${isDark ? styles.dark : ''}`}
              >
                🍅 Pomodoro ({settings.pomodoroDuration}min)
              </button>
              <button
                onClick={() => {
                  setTimerType('shortBreak');
                  setTimeLeft(settings.shortBreakDuration * 60);
                  setIsRunning(false); // Garante que não está rodando
                }}
                className={`${styles.typeButton} ${timerType === 'shortBreak' ? styles.active : ''} ${isDark ? styles.dark : ''}`}
              >
                ☕ Pausa Curta ({settings.shortBreakDuration}min)
              </button>
              <button
                onClick={() => {
                  setTimerType('longBreak');
                  setTimeLeft(settings.longBreakDuration * 60);
                  setIsRunning(false); // Garante que não está rodando
                }}
                className={`${styles.typeButton} ${timerType === 'longBreak' ? styles.active : ''} ${isDark ? styles.dark : ''}`}
              >
                🏖️ Pausa Longa ({settings.longBreakDuration}min)
              </button>
            </div>
          </div>

          
          {/* Controles do dia */}
          <div className={styles.dayControls}>
            {!currentDay ? (
              <button
                onClick={handleStartCreateDay}
                className={`${styles.createDayButton} ${isDark ? styles.dark : ''}`}
              >
                📅 Criar Dia de Trabalho
              </button>
            ) : (
              <div className={styles.dayInfo}>
                <div className={styles.dayHeader}>
                  <h3 className={`${styles.dayTitle} ${isDark ? styles.dark : ''}`}>
                    Dia: {currentDay.date}
                  </h3>
                  <button
                    onClick={() => setShowAddTask(true)}
                    className={`${styles.addTaskButton} ${isDark ? styles.dark : ''}`}
                  >
                    ➕ Adicionar Tarefa
                  </button>
                </div>
                
                <div className={styles.dayProgress}>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{ width: `${getDayProgress()}%` }}
                    ></div>
                  </div>
                  <span className={`${styles.progressText} ${isDark ? styles.dark : ''}`}>
                    {currentDay.completedPomodoros} / {currentDay.totalPomodoros} pomodoros
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Lista de tarefas do dia */}
          {currentDay && currentDay.tasks.length > 0 && (
            <div className={styles.tasksSection}>
              <h3 className={`${styles.tasksTitle} ${isDark ? styles.dark : ''}`}>
                📋 Cronograma do Dia - {currentDay.tasks.length} atividades
              </h3>
              <div className={styles.tasksList}>
                {currentDay.tasks.map((task, index) => (
                  <div
                    key={task.id}
                    className={`${styles.taskItem} ${task.completed ? styles.completed : ''} ${isDark ? styles.dark : ''}`}
                  >
                    <div className={styles.taskInfo}>
                      <div className={styles.taskHeader}>
                        <span className={`${styles.taskSequence} ${isDark ? styles.dark : ''}`}>
                          #{index + 1}
                        </span>
                        <span className={`${styles.taskType} ${isDark ? styles.dark : ''}`}>
                          {task.type === 'pomodoro' ? '🍅' : 
                           task.type === 'shortBreak' ? '☕' : '🏖️'}
                        </span>
                        <span className={`${styles.taskTypeLabel} ${isDark ? styles.dark : ''}`}>
                          {task.type === 'pomodoro' ? 'Pomodoro' : 
                           task.type === 'shortBreak' ? 'Pausa Curta' : 'Pausa Longa'}
                        </span>
                        <span className={`${styles.taskTitle} ${isDark ? styles.dark : ''}`}>
                          {task.title}
                        </span>
                        <span className={`${styles.taskDuration} ${isDark ? styles.dark : ''}`}>
                          {task.duration}min
                        </span>
                      </div>
                      {task.description && (
                        <p className={`${styles.taskDescription} ${isDark ? styles.dark : ''}`}>
                          {task.description}
                        </p>
                      )}
                    </div>
                    <div className={styles.taskActions}>
                      {!task.completed ? (
                        <button
                          onClick={() => handleCompleteTask(task.id)}
                          className={`${styles.completeButton} ${isDark ? styles.dark : ''}`}
                        >
                          ✅ Concluir
                        </button>
                      ) : (
                        <span className={`${styles.completedText} ${isDark ? styles.dark : ''}`}>
                          Concluído
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className={`${styles.distributionInfo} ${isDark ? styles.dark : ''}`}>
                <p>
                  💡 <strong>Distribuição automática:</strong> As tarefas foram organizadas seguindo a sequência padrão Pomodoro → Pausa Curta → Pomodoro → Pausa Curta → ... → Pausa Longa
                </p>
              </div>
            </div>
          )}

          {/* Modal para criar dia com tarefas */}
          {showCreateDayForm && (
            <div className={styles.modalOverlay}>
              <div className={`${styles.modal} ${styles.largeModal} ${isDark ? styles.dark : ''}`}>
                <h3 className={`${styles.modalTitle} ${isDark ? styles.dark : ''}`}>
                  Criar Novo Dia de Trabalho
                </h3>
                
                {/* Configurações do dia */}
                <div className={styles.dayFormSection}>
                  <h4 className={`${styles.sectionTitle} ${isDark ? styles.dark : ''}`}>
                    📅 Configurações do Dia
                  </h4>
                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label className={`${styles.fieldLabel} ${isDark ? styles.dark : ''}`}>
                        Data
                      </label>
                      <input
                        type="date"
                        value={dayFormData.date}
                        onChange={(e) => setDayFormData(prev => ({ ...prev, date: e.target.value }))}
                        className={`${styles.modalInput} ${isDark ? styles.dark : ''}`}
                      />
                    </div>
                    <div className={styles.formField}>
                      <label className={`${styles.fieldLabel} ${isDark ? styles.dark : ''}`}>
                        Horas de Trabalho
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={dayFormData.workHours}
                        onChange={(e) => setDayFormData(prev => ({ ...prev, workHours: parseInt(e.target.value) }))}
                        className={`${styles.modalInput} ${isDark ? styles.dark : ''}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Adicionar tarefas */}
                <div className={styles.tasksFormSection}>
                  <h4 className={`${styles.sectionTitle} ${isDark ? styles.dark : ''}`}>
                    📋 Adicionar Tarefas
                  </h4>
                  <div className={styles.addTaskForm}>
                    <input
                      type="text"
                      placeholder="Título da tarefa"
                      value={newTask.title}
                      onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      className={`${styles.modalInput} ${isDark ? styles.dark : ''}`}
                    />
                    <textarea
                      placeholder="Descrição (opcional)"
                      value={newTask.description}
                      onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                      className={`${styles.modalTextarea} ${isDark ? styles.dark : ''}`}
                    />
                    <button
                      onClick={handleAddDayTask}
                      className={`${styles.addTaskButton} ${isDark ? styles.dark : ''}`}
                    >
                      ➕ Adicionar Tarefa
                    </button>
                  </div>
                </div>

                {/* Lista de tarefas adicionadas */}
                {dayTasks.length > 0 && (
                  <div className={styles.tasksListSection}>
                    <h4 className={`${styles.sectionTitle} ${isDark ? styles.dark : ''}`}>
                      📝 Tarefas do Dia ({dayTasks.length})
                    </h4>
                    <div className={styles.tasksPreview}>
                      {dayTasks.map((task, index) => (
                        <div key={index} className={`${styles.taskPreviewItem} ${isDark ? styles.dark : ''}`}>
                          <div className={styles.taskPreviewInfo}>
                            <span className={`${styles.taskPreviewTitle} ${isDark ? styles.dark : ''}`}>
                              {task.title}
                            </span>
                            {task.description && (
                              <span className={`${styles.taskPreviewDescription} ${isDark ? styles.dark : ''}`}>
                                {task.description}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveDayTask(index)}
                            className={`${styles.removeTaskButton} ${isDark ? styles.dark : ''}`}
                          >
                            ❌
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className={`${styles.distributionNote} ${isDark ? styles.dark : ''}`}>
                      💡 As tarefas serão distribuídas automaticamente entre pomodoros e pausas seguindo a sequência padrão.
                    </p>
                  </div>
                )}

                <div className={styles.modalActions}>
                  <button
                    onClick={handleCancelCreateDay}
                    className={`${styles.cancelButton} ${isDark ? styles.dark : ''}`}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreateDayFinal}
                    className={`${styles.confirmButton} ${isDark ? styles.dark : ''}`}
                  >
                    Criar Dia com {dayTasks.length} Tarefas
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal para adicionar tarefa */}
          {showAddTask && (
            <div className={styles.modalOverlay}>
              <div className={`${styles.modal} ${isDark ? styles.dark : ''}`}>
                <h3 className={`${styles.modalTitle} ${isDark ? styles.dark : ''}`}>
                  Adicionar Tarefa
                </h3>
                <div className={styles.modalForm}>
                  <input
                    type="text"
                    placeholder="Título da tarefa"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    className={`${styles.modalInput} ${isDark ? styles.dark : ''}`}
                  />
                  <textarea
                    placeholder="Descrição (opcional)"
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    className={`${styles.modalTextarea} ${isDark ? styles.dark : ''}`}
                  />
                  <select
                    value={newTask.type}
                    onChange={(e) => setNewTask(prev => ({ ...prev, type: e.target.value }))}
                    className={`${styles.modalSelect} ${isDark ? styles.dark : ''}`}
                  >
                    <option value="pomodoro">🍅 Pomodoro</option>
                    <option value="shortBreak">☕ Pausa Curta</option>
                    <option value="longBreak">🏖️ Pausa Longa</option>
                  </select>
                </div>
                <div className={styles.modalActions}>
                  <button
                    onClick={() => setShowAddTask(false)}
                    className={`${styles.cancelButton} ${isDark ? styles.dark : ''}`}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddTask}
                    className={`${styles.confirmButton} ${isDark ? styles.dark : ''}`}
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
