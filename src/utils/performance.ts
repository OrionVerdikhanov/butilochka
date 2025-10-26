import { useCallback, useRef } from 'react';

/**
 * Утилиты для оптимизации производительности
 */

/**
 * Дебаунсинг функции
 * @param func - функция для дебаунсинга
 * @param delay - задержка в мс
 * @returns дебаунсированная функция
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Троттлинг функции
 * @param func - функция для троттлинга
 * @param delay - задержка в мс
 * @returns троттлированная функция
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let isThrottled = false;
  let lastArgs: Parameters<T> | null = null;

  return (...args: Parameters<T>) => {
    lastArgs = args;

    if (!isThrottled) {
      func(...args);
      isThrottled = true;

      setTimeout(() => {
        isThrottled = false;
        if (lastArgs && lastArgs !== args) {
          func(...lastArgs);
        }
      }, delay);
    }
  };
}

/**
 * Хук для дебаунсинга
 * @param callback - колбэк
 * @param delay - задержка
 * @returns [debouncedCallback, cancel]
 */
export function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): [T, () => void] {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback((...args: Parameters<T>) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  }, [callback, delay]);

  const cancel = useCallback(() => {
    clearTimeout(timeoutRef.current);
  }, []);

  return [debouncedCallback as T, cancel];
}

/**
 * Хук для троттлинга
 * @param callback - колбэк
 * @param delay - задержка
 * @returns троттлированный колбэк
 */
export function useThrottle<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now());

  return useCallback((...args: Parameters<T>) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]) as T;
}

/**
 * Мемоизация тяжелых вычислений
 * @param fn - функция для мемоизации
 * @returns мемоизированная функция
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);

    // Ограничиваем размер кэша
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    return result;
  }) as T;
}

/**
 * Проверка, является ли объект "пустым"
 * @param obj - объект для проверки
 * @returns true если объект пустой
 */
export function isEmpty(obj: any): boolean {
  if (obj == null) return true;
  if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
}

/**
 * Глубокое сравнение объектов
 * @param obj1 - первый объект
 * @param obj2 - второй объект
 * @returns true если объекты равны
 */
export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;

  if (typeof obj1 !== typeof obj2) return false;
  if (obj1 == null || obj2 == null) return false;

  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false;
    return obj1.every((val, index) => deepEqual(val, obj2[index]));
  }

  if (typeof obj1 === 'object') {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    return keys1.every(key => deepEqual(obj1[key], obj2[key]));
  }

  return false;
}

/**
 * Batch обновления состояния
 * @param updates - массив функций обновления
 */
export function batchUpdates(updates: (() => void)[]): void {
  // В React Native можно использовать unstable_batchedUpdates
  // для группировки обновлений состояния
  if ('unstable_batchedUpdates' in require('react-native')) {
    const { unstable_batchedUpdates } = require('react-native');
    unstable_batchedUpdates(() => {
      updates.forEach(update => update());
    });
  } else {
    updates.forEach(update => update());
  }
}

/**
 * Измерение производительности функции
 * @param fn - функция для измерения
 * @param name - название метрики
 * @returns результат функции
 */
export function measurePerformance<T extends (...args: any[]) => any>(
  fn: T,
  name: string
): T {
  return ((...args: Parameters<T>) => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();

    console.log(`[Performance] ${name}: ${end - start}ms`);
    return result;
  }) as T;
}

/**
 * Ленивая загрузка компонента
 * @param importFn - функция импорта
 * @returns лениво загружаемый компонент
 */
export function lazyLoad<T>(importFn: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    importFn()
      .then(resolve)
      .catch(error => {
        console.error('Failed to lazy load:', error);
        reject(error);
      });
  });
}

/**
 * Оптимизированный обработчик скролла
 * @param onScroll - колбэк скролла
 * @returns оптимизированный обработчик
 */
export function createOptimizedScrollHandler(onScroll: (event: any) => void) {
  let ticking = false;

  return (event: any) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        onScroll(event);
        ticking = false;
      });
      ticking = true;
    }
  };
}

/**
 * Получить размер кэша на основе возможностей устройства
 * @returns размер кэша
 */
export function getCacheSize(): number {
  // Определяем размер кэша на основе памяти устройства
  // В реальном приложении здесь можно использовать react-native-device-info
  return 50; // Количество элементов для кэширования
}

/**
 * Очистка памяти
 * @param caches - массив кэшей для очистки
 */
export function clearMemory(caches: Map<any, any>[]): void {
  caches.forEach(cache => cache.clear());

  // Вызываем garbage collector если доступно
  if (global.gc) {
    global.gc();
  }
}