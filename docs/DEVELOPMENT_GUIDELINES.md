# 📖 Руководство по разработке проекта "Бутылочка"

## 🎯 Введение

Этот документ содержит лучшие практики, правила и рекомендации для разработки проекта "Бутылочка". Следование этим рекомендациям поможет поддерживать код чистым, масштабируемым и легко поддерживаемым.

## 🏗️ Архитектурные принципы

### 1. Разделение ответственности (Single Responsibility Principle)
```typescript
// ✅ Хорошо - каждый компонент имеет одну ответственность
export function BottleSpinner() { // Только вращение бутылки
  // логика вращения
}

export function PlayerCard() { // Только отображение игрока
  // логика отображения игрока
}

// ❌ Плохо - компонент делает слишком много
export function GameScreen() {
  // вращение бутылки
  // управление игроками
  // настройки игры
  // сохранение данных
  // анимации
  // навигация
}
```

### 2. Композиция вместо наследования
```typescript
// ✅ Хорошо - используем композицию
export function GameBoard() {
  return (
    <View>
      <BottleSpinner />
      <PlayerCircle />
      <GameControls />
    </View>
  );
}

// ❌ Плохо - глубокое наследование
export class SpecialBottleSpinner extends BottleSpinner {
  // много переопределенного кода
}
```

### 3. Dependency Inversion
```typescript
// ✅ Хорошо - зависимость от абстракции
export function PlayerManager({ repository }: { repository: PlayerRepository }) {
  // работаем с абстракцией
}

// ❌ Плохо - прямая зависимость от реализации
export function PlayerManager() {
  // напрямую используем AsyncStorage
}
```

## 🧩 Компоненты

### Структура компонента
```typescript
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 1. Интерфейсы Props
interface ComponentProps {
  title: string;
  onPress: () => void;
}

/**
 * Краткое описание компонента
 * @param props - параметры компонента
 * @returns JSX элемент
 */
export function Component({ title, onPress }: ComponentProps) {
  // 2. Состояния (useState)
  const [isLoading, setIsLoading] = useState(false);

  // 3. Сайд-эффекты (useEffect)
  useEffect(() => {
    // эффекты
  }, []);

  // 4. Обработчики событий (useCallback)
  const handlePress = useCallback(() => {
    setIsLoading(true);
    onPress();
  }, [onPress]);

  // 5. Рендер
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  );
}

// 6. Стили
const styles = StyleSheet.create({
  container: {
    // стили
  },
});
```

### Правила компонентов
1. **Одна ответственность** - компонент должен делать что-то одно
2. **Чистые props** - не мутировать props
3. **Локальное состояние** - хранить только то, что нужно компоненту
4. **Мемоизация** - использовать для оптимизации рендеров

## 🎣 Кастомные хуки

### Структура хука
```typescript
import { useState, useCallback, useEffect } from 'react';

// 1. Интерфейсы
interface UseHookProps {
  // параметры хука
}

interface UseHookReturn {
  // возвращаемые значения
}

/**
 * Описание хука
 */
export function useHook(props: UseHookProps): UseHookReturn {
  // 2. Состояния
  const [state, setState] = useState();

  // 3. Обработчики
  const handler = useCallback(() => {
    // логика
  }, []);

  // 4. Сайд-эффекты
  useEffect(() => {
    // эффекты
  }, []);

  // 5. Возвращаемое значение
  return {
    state,
    handler,
  };
}
```

### Принципы хуков
1. **Переиспользуемость** - хук должен быть полезен в разных контекстах
2. **Инкапсуляция логики** - скрывать сложную логику внутри хука
3. **Чистые функции** - не вызывать хуки условно

## 🏪 Сервисный слой

### Структура сервиса
```typescript
export class GameService {
  constructor(private repository: GameRepository) {}

  /**
   * Публичные методы - бизнес-логика
   */
  async startGame(players: Player[]): Promise<Game> {
    // валидация
    this.validatePlayers(players);

    // создание игры
    const game = await this.createGame(players);

    // сохранение
    await this.repository.saveGame(game);

    return game;
  }

  /**
   * Приватные методы - внутренняя логика
   */
  private validatePlayers(players: Player[]): void {
    if (players.length < 2) {
      throw new Error('Minimum 2 players required');
    }
  }
}
```

## 🔧 Управление состоянием

### Локальное состояние
```typescript
// Для простого состояния компонента
const [isVisible, setIsVisible] = useState(false);
```

### Глобальное состояние
```typescript
// Для сложного состояния между компонентами
export function useGameState() {
  const [game, setGame] = useState<Game | null>(null);

  // методы для управления состоянием
  const startGame = useCallback((players: Player[]) => {
    // логика
  }, []);

  return { game, startGame };
}
```

### Контекст
```typescript
// Для состояния, нужного многим компонентам
const GameContext = createContext<GameContextValue>({
  game: null,
  startGame: () => {},
});

export function GameProvider({ children }: { children: React.ReactNode }) {
  const value = useGameState();

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}
```

## 🎨 Стили и UI

### Организация стилей
```typescript
const styles = StyleSheet.create({
  // Контейнеры
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // Компоненты
  card: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },

  // Модификаторы
  'card--selected': {
    backgroundColor: '#007AFF',
  },

  // Элементы
  'card__title': {
    fontSize: 16,
    fontWeight: 'bold',
  },

  'card__content': {
    fontSize: 14,
  },
});
```

### Темы
```typescript
export const lightTheme = {
  colors: {
    primary: '#007AFF',
    background: '#FFFFFF',
    text: '#000000',
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
};

export const darkTheme = {
  colors: {
    primary: '#0A84FF',
    background: '#000000',
    text: '#FFFFFF',
  },
  spacing: lightTheme.spacing,
};
```

## 📱 Оптимизация производительности

### React.memo
```typescript
// Для компонентов, которые часто рендерятся с одинаковыми props
export const PlayerCard = React.memo<PlayerCardProps>(({ player, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(player.id)}>
      <Text>{player.name}</Text>
    </TouchableOpacity>
  );
});
```

### useCallback
```typescript
// Для функций, которые передаются в дочерние компоненты
const handlePlayerPress = useCallback((playerId: string) => {
  navigateToPlayer(playerId);
}, [navigateToPlayer]);
```

### useMemo
```typescript
// Для дорогих вычислений
const sortedPlayers = useMemo(() => {
  return players.sort((a, b) => a.name.localeCompare(b.name));
}, [players]);
```

### FlatList
```typescript
// Для больших списков вместо map
<FlatList
  data={players}
  renderItem={({ item }) => <PlayerCard player={item} />}
  keyExtractor={item => item.id}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

## 🧪 Тестирование

### Unit тесты
```typescript
describe('useBottleSpin', () => {
  it('should spin to random player', () => {
    const { result } = renderHook(() => useBottleSpin(players));

    act(() => {
      result.current.spinBottle();
    });

    expect(result.current.isSpinning).toBe(true);
  });
});
```

### Component тесты
```typescript
describe('PlayerCard', () => {
  it('should render player name', () => {
    const player = { id: '1', name: 'John' };

    const { getByText } = render(<PlayerCard player={player} />);

    expect(getByText('John')).toBeTruthy();
  });
});
```

## 🔄 Работа с асинхронностью

### Async/await
```typescript
const loadData = async () => {
  try {
    setIsLoading(true);
    const data = await api.fetchData();
    setData(data);
  } catch (error) {
    setError(error);
  } finally {
    setIsLoading(false);
  }
};
```

### Обработка ошибок
```typescript
const safeAsyncOperation = async () => {
  try {
    await riskyOperation();
  } catch (error) {
    // Логируем ошибку
    console.error('Operation failed:', error);

    // Показываем пользователю
    showToast('Something went wrong');

    // Перебрасываем если нужно
    throw error;
  }
};
```

## 📏 Качество кода

### ESLint и Prettier
```json
{
  "extends": [
    "@react-native-community",
    "prettier"
  ],
  "rules": {
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

### TypeScript
```typescript
// Строгая типизация
interface StrictProps {
  required: string;
  optional?: string;
  literal: 'option1' | 'option2';
}

// Избегаем any
const badFunction = (data: any) => any;

// Используем конкретные типы
const goodFunction = (data: UserData) => ProcessedData;
```

## 📦 Структура проекта

```
src/
├── components/          # Переиспользуемые компоненты
│   ├── common/         # Общие компоненты
│   ├── forms/          # Формы
│   └── settings/       # Компоненты настроек
├── screens/            # Экраны приложения
├── navigation/         # Навигация
├── hooks/              # Кастомные хуки
├── services/           # Бизнес-логика
│   ├── api/           # API клиенты
│   └── repositories/   # Репозитории
├── store/              # Управление состоянием
├── utils/              # Утилиты
├── constants/          # Константы
├── types/              # Типы TypeScript
└── assets/             # Ресурсы
```

## 🚀 Проверка перед коммитом

### Technical checklist
- [ ] Код проходит ESLint проверку
- [ ] Все функции имеют типы
- [ ] Нет console.log в продакшен коде
- [ ] Асинхронные операции имеют обработку ошибок
- [ ] Сложные компоненты имеют мемоизацию
- [ ] Нет жестко закодированных значений

### Functional checklist
- [ ] Функциональность работает как ожидается
- [ ] Edge cases обработаны
- [ ] UI корректно отображается на разных размерах экранов
- [ ] Производительность приемлема
- [ ] Доступность (accessibility) учтена

## 📚 Дополнительные ресурсы

- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Hooks Rules](https://reactjs.org/docs/hooks-rules.html)
- [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350884)

---

Помни: **Код читается чаще, чем пишется!** 💻✨