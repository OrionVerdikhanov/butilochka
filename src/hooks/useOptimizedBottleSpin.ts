import { useState, useRef, useCallback, useMemo } from 'react';
import { Animated, Easing } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Player } from '../types';
import { Settings, DEFAULT_SETTINGS } from '../utils/storage';

/**
 * Оптимизированные параметры с строгой типизацией
 */
export interface UseOptimizedBottleSpinProps {
  players: Player[];
  settings?: Settings;
  onSpinComplete?: (result: SpinResult) => void;
  targetFilter?: (spinner: Player, players: Player[]) => Player[];
}

/**
 * Результат вращения с дополнительными метаданными
 */
export interface SpinResult {
  spinner: Player;
  target: Player;
  targetIndex: number;
  rotationAngle: number;
  spinDuration: number;
  timestamp: number;
  extraData?: any;
}

/**
 * Возвращаемое значение с мемоизированными функциями
 */
export interface UseOptimizedBottleSpinReturn {
  isSpinning: boolean;
  currentSpinnerIndex: number;
  targetPlayerIndex: number | null;
  rotationValue: Animated.Value;
  spinHistory: SpinResult[];
  spinBottle: (extraData?: any) => Promise<void>;
  nextTurn: () => void;
  resetSpin: () => void;
  clearHistory: () => void;
  currentSpinner: Player | null;
  targetPlayer: Player | null;
  canSpin: boolean;
  averageSpinDuration: number;
}

/**
 * Оптимизированный хук для управления вращением бутылки
 *
 * Улучшения:
 * - Мемоизация вычислений
 * - История вращений
 * - Предотвращение двойных нажатий
 * - Оптимизированная анимация
 * - Метрики производительности
 */
export function useOptimizedBottleSpin({
  players,
  settings = DEFAULT_SETTINGS,
  onSpinComplete,
  targetFilter
}: UseOptimizedBottleSpinProps): UseOptimizedBottleSpinReturn {
  // Состояния
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSpinnerIndex, setCurrentSpinnerIndex] = useState(0);
  const [targetPlayerIndex, setTargetPlayerIndex] = useState<number | null>(null);
  const [spinHistory, setSpinHistory] = useState<SpinResult[]>([]);

  // Рефы для оптимизации
  const rotationValue = useRef(new Animated.Value(0)).current;
  const isSpinningRef = useRef(false);
  const lastSpinTime = useRef(0);
  // Храним текущий угол поворота бутылки между вращениями
  const currentRotation = useRef(0);

  // Синхронизируем rotationValue с currentRotation при инициализации
  rotationValue.setValue(currentRotation.current);

  // Мемоизированные вычисления
  const currentSpinner = useMemo(() => {
    return players[currentSpinnerIndex] || null;
  }, [players, currentSpinnerIndex]);

  const targetPlayer = useMemo(() => {
    return targetPlayerIndex !== null ? players[targetPlayerIndex] : null;
  }, [players, targetPlayerIndex]);

  const canSpin = useMemo(() => {
    return !isSpinning && players.length >= 2 && !isSpinningRef.current;
  }, [isSpinning, players.length]);

  const averageSpinDuration = useMemo(() => {
    if (spinHistory.length === 0) return 0;
    const total = spinHistory.reduce((sum, spin) => sum + spin.spinDuration, 0);
    return total / spinHistory.length;
  }, [spinHistory]);

  /**
   * Оптимизированная функция выбора цели
   */
  const selectTargetPlayer = useCallback((spinner: Player): Player | null => {
    if (targetFilter) {
      const availableTargets = targetFilter(spinner, players);
      if (availableTargets.length === 0) return null;
      return availableTargets[Math.floor(Math.random() * availableTargets.length)];
    }

    // Оптимизированный выбор случайного игрока
    const availableIndices = players
      .map((_, index) => index)
      .filter(index => index !== players.indexOf(spinner));

    if (availableIndices.length === 0) return null;

    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    return players[randomIndex];
  }, [players, targetFilter]);

  /**
   * Оптимизированная функция вращения с защитой от двойных нажатий
   */
  const spinBottle = useCallback(async (extraData?: any) => {
    // Проверяем возможность вращения
    if (!canSpin || isSpinningRef.current) {
      return;
    }

    // Предотвращаем двойные нажатия
    const now = Date.now();
    if (now - lastSpinTime.current < 1000) {
      return;
    }

    const spinner = currentSpinner;
    if (!spinner) return;

    const target = selectTargetPlayer(spinner);
    if (!target) return;

    // Устанавливаем флаги
    setIsSpinning(true);
    isSpinningRef.current = true;
    lastSpinTime.current = now;
    setTargetPlayerIndex(null);

    // Тактильная обратная связь
    if (settings.vibrationEnabled) {
      ReactNativeHapticFeedback.trigger('impactHeavy');
    }

    // Вычисляем оптимальные параметры анимации
    const targetIndex = players.indexOf(target);
    const anglePerPlayer = 360 / players.length;
    const targetAngle = targetIndex * anglePerPlayer;
    const minRotations = 5; // Минимум 5 оборотов
    const maxRotations = 8; // Максимум 8 оборотов
    const randomRotations = minRotations + Math.random() * (maxRotations - minRotations);

    // Получаем текущее значение вращения и добавляем новое вращение
    const startRotation = currentRotation.current;
    const totalRotation = startRotation + randomRotations * 360 + targetAngle;

    // Сохраняем новое значение
    currentRotation.current = totalRotation;

    const startTime = Date.now();

    // Запускаем анимацию с оптимизированными настройками
    Animated.timing(rotationValue, {
      toValue: totalRotation,
      duration: settings.spinDuration,
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
      useNativeDriver: true,
    }).start(() => {
      const spinDuration = Date.now() - startTime;

      // Завершение вращения
      setIsSpinning(false);
      isSpinningRef.current = false;
      setTargetPlayerIndex(targetIndex);

      // Тактильная обратная связь
      if (settings.vibrationEnabled) {
        ReactNativeHapticFeedback.trigger('notificationSuccess');
      }

      // Создаем результат вращения
      const result: SpinResult = {
        spinner,
        target,
        targetIndex,
        rotationAngle: totalRotation % 360,
        spinDuration,
        timestamp: Date.now(),
        extraData,
      };

      // Обновляем историю (ограничиваем размер)
      setSpinHistory(prev => {
        const newHistory = [...prev, result];
        return newHistory.slice(-10); // Храним только последние 10 вращений
      });

      // Вызываем колбэк
      if (onSpinComplete) {
        onSpinComplete(result);
      }
    });
  }, [canSpin, currentSpinner, selectTargetPlayer, players, settings, rotationValue, onSpinComplete]);

  /**
   * Оптимизированный переход к следующему ходу
   */
  const nextTurn = useCallback(() => {
    if (isSpinningRef.current) return;

    setTargetPlayerIndex(null);
    setCurrentSpinnerIndex(prev => (prev + 1) % players.length);
    // НЕ сбрасываем позицию бутылки - она остается на месте

    if (settings.vibrationEnabled) {
      ReactNativeHapticFeedback.trigger('impactMedium');
    }
  }, [players.length, settings.vibrationEnabled]);

  /**
   * Сброс состояния вращения
   */
  const resetSpin = useCallback(() => {
    setIsSpinning(false);
    isSpinningRef.current = false;
    setTargetPlayerIndex(null);
    setCurrentSpinnerIndex(0);
    rotationValue.setValue(0);
    currentRotation.current = 0; // Сбрасываем и сохраненное значение
  }, [rotationValue]);

  /**
   * Очистка истории вращений
   */
  const clearHistory = useCallback(() => {
    setSpinHistory([]);
  }, []);

  return {
    isSpinning,
    currentSpinnerIndex,
    targetPlayerIndex,
    rotationValue,
    spinHistory,
    spinBottle,
    nextTurn,
    resetSpin,
    clearHistory,
    currentSpinner,
    targetPlayer,
    canSpin,
    averageSpinDuration,
  };
}