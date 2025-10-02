import { useState } from 'react';
import { usePomodoro } from '../../../hooks/usePomodoro';
import styles from './styles.module.css';
import { useTheme } from '../../../context/ThemeContext';

const PomodoroSettings = ({ onMenuClick }) => {
  const { settings, updateSettings } = usePomodoro();
  const { isDark } = useTheme();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleInputChange = (field, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    updateSettings(localSettings);
    // Aqui você pode adicionar uma notificação de sucesso
  };

  const handleReset = () => {
    setLocalSettings(settings);
  };

  return (
    <div className={`${styles.settingsContainer} ${isDark ? styles.dark : ''}`}>
      
      <div className={styles.mainContainer}>
        <div className={styles.contentWrapper}>
          {/* Header da página */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>
              Configurações do Pomodoro
            </h1>
            <p className={`${styles.pageSubtitle} ${isDark ? styles.dark : ''}`}>
              Personalize seus tempos de trabalho e descanso
            </p>
          </div>

          {/* Formulário de configurações */}
          <div className={styles.settingsForm}>
            {/* Durações */}
            <div className={styles.settingsSection}>
              <h2 className={`${styles.sectionTitle} ${isDark ? styles.dark : ''}`}>
                ⏱️ Durações
              </h2>
              
              <div className={styles.settingsGrid}>
                <div className={styles.settingItem}>
                  <label className={`${styles.settingLabel} ${isDark ? styles.dark : ''}`}>
                    Pomodoro (minutos)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={localSettings.pomodoroDuration}
                    onChange={(e) => handleInputChange('pomodoroDuration', parseInt(e.target.value))}
                    className={`${styles.settingInput} ${isDark ? styles.dark : ''}`}
                  />
                </div>

                <div className={styles.settingItem}>
                  <label className={`${styles.settingLabel} ${isDark ? styles.dark : ''}`}>
                    Pausa Curta (minutos)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={localSettings.shortBreakDuration}
                    onChange={(e) => handleInputChange('shortBreakDuration', parseInt(e.target.value))}
                    className={`${styles.settingInput} ${isDark ? styles.dark : ''}`}
                  />
                </div>

                <div className={styles.settingItem}>
                  <label className={`${styles.settingLabel} ${isDark ? styles.dark : ''}`}>
                    Pausa Longa (minutos)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={localSettings.longBreakDuration}
                    onChange={(e) => handleInputChange('longBreakDuration', parseInt(e.target.value))}
                    className={`${styles.settingInput} ${isDark ? styles.dark : ''}`}
                  />
                </div>

                <div className={styles.settingItem}>
                  <label className={`${styles.settingLabel} ${isDark ? styles.dark : ''}`}>
                    Intervalo para Pausa Longa
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    value={localSettings.longBreakInterval}
                    onChange={(e) => handleInputChange('longBreakInterval', parseInt(e.target.value))}
                    className={`${styles.settingInput} ${isDark ? styles.dark : ''}`}
                  />
                  <span className={`${styles.settingHelp} ${isDark ? styles.dark : ''}`}>
                    Pomodoros até a próxima pausa longa
                  </span>
                </div>
              </div>
            </div>

            {/* Configurações de Trabalho */}
            <div className={styles.settingsSection}>
              <h2 className={`${styles.sectionTitle} ${isDark ? styles.dark : ''}`}>
                💼 Trabalho Diário
              </h2>
              
              <div className={styles.settingsGrid}>
                <div className={styles.settingItem}>
                  <label className={`${styles.settingLabel} ${isDark ? styles.dark : ''}`}>
                    Horas de Trabalho por Dia
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={localSettings.workHoursPerDay}
                    onChange={(e) => handleInputChange('workHoursPerDay', parseInt(e.target.value))}
                    className={`${styles.settingInput} ${isDark ? styles.dark : ''}`}
                  />
                </div>
              </div>
            </div>

            {/* Configurações Automáticas */}
            <div className={styles.settingsSection}>
              <h2 className={`${styles.sectionTitle} ${isDark ? styles.dark : ''}`}>
                🤖 Automação
              </h2>
              
              <div className={styles.settingsGrid}>
                <div className={styles.settingItem}>
                  <label className={`${styles.settingLabel} ${isDark ? styles.dark : ''}`}>
                    <input
                      type="checkbox"
                      checked={localSettings.autoStartBreaks}
                      onChange={(e) => handleInputChange('autoStartBreaks', e.target.checked)}
                      className={styles.checkbox}
                    />
                    Iniciar pausas automaticamente
                  </label>
                </div>

                <div className={styles.settingItem}>
                  <label className={`${styles.settingLabel} ${isDark ? styles.dark : ''}`}>
                    <input
                      type="checkbox"
                      checked={localSettings.autoStartPomodoros}
                      onChange={(e) => handleInputChange('autoStartPomodoros', e.target.checked)}
                      className={styles.checkbox}
                    />
                    Iniciar pomodoros automaticamente
                  </label>
                </div>
              </div>
            </div>

            {/* Configurações de Notificação */}
            <div className={styles.settingsSection}>
              <h2 className={`${styles.sectionTitle} ${isDark ? styles.dark : ''}`}>
                🔔 Notificações
              </h2>
              
              <div className={styles.settingsGrid}>
                <div className={styles.settingItem}>
                  <label className={`${styles.settingLabel} ${isDark ? styles.dark : ''}`}>
                    <input
                      type="checkbox"
                      checked={localSettings.soundEnabled}
                      onChange={(e) => handleInputChange('soundEnabled', e.target.checked)}
                      className={styles.checkbox}
                    />
                    Ativar sons
                  </label>
                </div>

                <div className={styles.settingItem}>
                  <label className={`${styles.settingLabel} ${isDark ? styles.dark : ''}`}>
                    <input
                      type="checkbox"
                      checked={localSettings.notificationsEnabled}
                      onChange={(e) => handleInputChange('notificationsEnabled', e.target.checked)}
                      className={styles.checkbox}
                    />
                    Ativar notificações
                  </label>
                </div>
              </div>
            </div>

            {/* Botões de ação */}
            <div className={styles.actionButtons}>
              <button
                onClick={handleReset}
                className={`${styles.resetButton} ${isDark ? styles.dark : ''}`}
              >
                Resetar
              </button>
              <button
                onClick={handleSave}
                className={`${styles.saveButton} ${isDark ? styles.dark : ''}`}
              >
                Salvar Configurações
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroSettings;
