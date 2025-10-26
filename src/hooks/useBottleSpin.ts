import { useState, useRef, useCallback } from 'react';
import { Animated, Easing } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Player } from '../types';
import { Settings, DEFAULT_SETTINGS } from '../utils/storage';

/**
 * Параметры для хука useBottleSpin
 */
export interface UseBottleSpinProps {
  /** Массив игроков */
  players: Player[];
  /** Настройки игры */
  settings?: Settings;
  /** Дополнительная логика после завершения вращения */
  onSpinComplete?: (result: SpinResult) => void;
  /** Фильтр доступных целей для вращения */
  targetFilter?: (spinner: Player, players: Player[]) => Player[];
}

/**
 * Результат вращения бутылки
 */
export interface SpinResult {
  /** Игрок, который крутил */
  spinner: Player;
  /** Целевой игрок */
  target: Player;
  /** Индекс целевого игрока */
  targetIndex: number;
  /** Дополнительные данные (например, желание) */
  extraData?: any;
}

/**
 * Возвращаемое значение хука useBottleSpin
 */
export interface UseBottleSpinReturn {
  /** Происходит ли вращение в данный момент */
  isSpinning: boolean;
  /** Индекс текущего игрока, который крутит */
  currentSpinnerIndex: number;
  /** Индекс целевого игрока (после вращения) */
  targetPlayerIndex: number | null;
  /** Анимированное значение вращения */
  rotationValue: Animated.Value;
  /** Функция запуска вращения */
  spinBottle: (extraData?: any) => void;
  /** Функция перехода к следующему ходу */
  nextTurn: () => void;
  /** Сброс состояния вращения */
  resetSpin: () => void;
  /** Текущий игрок, который крутит */
  currentSpinner: Player;
  /** Целевой игрок (после вращения) */
  targetPlayer: Player | null;
}

/**
 * Кастомный хук для управления логикой вращения бутылки
 *
 * @param props - Параметры хука
 * @returns Объект с состоянием и функциями управления вращением
 *
 * @example
 * ```typescript
 * const {
 *   isSpinning,
 *   currentSpinner,
 *   targetPlayer,
 *   rotationValue,
 *   spinBottle,
 *   nextTurn
 * } = useBottleSpin({
 *   players,
 *   settings,
 *   onSpinComplete: (result) => {
 *     console.log(`${result.spinner.name} выбрал ${result.target.name}`);
 *   }
 * });
 * ```
 */
export function useBottleSpin({
  players,
  settings = DEFAULT_SETTINGS,
  onSpinComplete,
  targetFilter
}: UseBottleSpinProps): UseBottleSpinReturn {
  // Состояния
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSpinnerIndex, setCurrentSpinnerIndex] = useState(0);
  const [targetPlayerIndex, setTargetPlayerIndex] = useState<number | null>(null);

  // Анимация
  const rotationValue = useRef(new Animated.Value(0)).current;
  // Храним текущий угол поворота бутылки между вращениями
  const currentRotation = useRef(0);

  // Синхронизируем rotationValue с currentRotation при инициализации
  rotationValue.setValue(currentRotation.current);

  /**
   * Получить текущего игрока
   */
  const currentSpinner = players[currentSpinnerIndex];

  /**
   * Получить целевого игрока
   */
  const targetPlayer = targetPlayerIndex !== null ? players[targetPlayerIndex] : null;

  /**
   * Функция запуска вращения бутылки
   */
  const spinBottle = useCallback((extraData?: any) => {
    if (isSpinning || players.length < 2) return;

    // Тактильная обратная связь
    if (settings.vibrationEnabled) {
      ReactNativeHapticFeedback.trigger('impactHeavy');
    }

    setIsSpinning(true);
    setTargetPlayerIndex(null);

    // Генерируем случайный конечный угол
    const randomAngle = Math.random() * 360;
    const randomRotations = 4 + Math.random() * 6; // 4-10 полных оборотов

    // Получаем текущее значение вращения и добавляем новое вращение
    const startRotation = currentRotation.current;
    const totalRotation = startRotation + randomRotations * 360 + randomAngle;

    // Сохраняем новое значение
    currentRotation.current = totalRotation;

    // Запускаем анимацию
    Animated.timing(rotationValue, {
      toValue: totalRotation,
      duration: settings.spinDuration,
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
      useNativeDriver: true,
    }).start(() => {
      // Завершение вращения
      if (settings.vibrationEnabled) {
        ReactNativeHapticFeedback.trigger('notificationSuccess');
      }

      // Вычисляем конечный угол (нормализованный 0-360)
      const finalAngle = totalRotation % 360;
      const anglePerPlayer = 360 / players.length;

      // Вычисляем угол направления от горлышка бутылки
      // Горлышко всегда направлено вверх при rotation=0 (270 градусов)
      // finalAngle - это угол поворота бутылки, но направление идет от горлышка
      const neckDirection = (finalAngle + 270) % 360; // Направление от горлышка

      // Вычисляем угол каждого игрока в системе координат бутылки
      // Игроки располагаются начиная с -90 градусов (верх экрана)
      const playerAngles = players.map((_, idx) => {
        // Углы игроков начинаются с -90 градусов (верх экрана)
        return ((idx * anglePerPlayer - 90 + 360) % 360);
      });

      // Находим ближайшего игрока с учетом направления от горлышка
      let nearestIndex = 0;
      let minDistance = 360;

      for (let i = 0; i < playerAngles.length; i++) {
        // Вычисляем кратчайшую угловую дистанцию от направления горлышка до игрока
        const distance = Math.min(
          Math.abs(neckDirection - playerAngles[i]),
          360 - Math.abs(neckDirection - playerAngles[i])
        );

        // Применяем фильтр цели (например, противоположный пол в режиме знакомств)
        if (targetFilter) {
          const availableTargets = targetFilter(currentSpinner, players);
          const isValidTarget = availableTargets.some(t => t.id === players[i].id);
          
          if (isValidTarget && distance < minDistance) {
            minDistance = distance;
            nearestIndex = i;
          }
        } else {
          if (distance < minDistance) {
            minDistance = distance;
            nearestIndex = i;
          }
        }
      }

      // Если с фильтром не нашли никого (не должно случиться в нормальной игре),
      // находим ближайшего валидного игрока по часовой стрелке
      if (targetFilter && minDistance === 360) {
        const availableTargets = targetFilter(currentSpinner, players);
        if (availableTargets.length > 0) {
          nearestIndex = players.findIndex(p => p.id === availableTargets[0].id);
        }
      }

      const targetIndex = nearestIndex;

      setIsSpinning(false);
      setTargetPlayerIndex(targetIndex);

      // Вызываем колбэк с результатом
      if (onSpinComplete) {
        const result: SpinResult = {
          spinner: currentSpinner,
          target: players[targetIndex],
          targetIndex,
          extraData
        };
        onSpinComplete(result);
      }
    });
  }, [isSpinning, players, currentSpinner, currentSpinnerIndex, settings, targetFilter, onSpinComplete, rotationValue]);

  /**
   * Переход к следующему ходу
   */
  const nextTurn = useCallback(() => {
    if (settings.vibrationEnabled) {
      ReactNativeHapticFeedback.trigger('impactMedium');
    }

    setTargetPlayerIndex(null);
    setCurrentSpinnerIndex((prev) => (prev + 1) % players.length);
    // НЕ сбрасываем позицию бутылки - она остается на месте
  }, [players.length, settings.vibrationEnabled]);

  /**
   * Сброс состояния вращения
   */
  const resetSpin = useCallback(() => {
    setIsSpinning(false);
    setTargetPlayerIndex(null);
    setCurrentSpinnerIndex(0);
    rotationValue.setValue(0);
    currentRotation.current = 0; // Сбрасываем и сохраненное значение
  }, [rotationValue]);

  return {
    isSpinning,
    currentSpinnerIndex,
    targetPlayerIndex,
    rotationValue,
    spinBottle,
    nextTurn,
    resetSpin,
    currentSpinner,
    targetPlayer,
  };
}