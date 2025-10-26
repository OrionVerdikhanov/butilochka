# 📝 Конвенции именования в проекте "Бутылочка"

## 🎯 Общие принципы

- **Ясность превыше всего** - имена должны быть понятными без дополнительных комментариев
- **Последовательность** - одинаковые подходы во всем проекте
- **Английский язык** - все названия на английском (кроме пользовательского текста)
- **Полнота** - избегаем сокращений,除非 они общепринятые

## 📁 Имена файлов и директорий

### Директории
```
src/
├── components/          # ПаскальКейс для компонентов
├── components/settings/ # Группировка связанных компонентов
├── screens/            # Экраны приложения
├── hooks/              # Кастомные React хуки
├── services/           # Бизнес-логика и API
├── utils/              # Утилиты и помощники
├── constants/          # Константы приложения
├── types/              # TypeScript типы
└── assets/             # Статические ресурсы
```

### Файлы
```typescript
// Компоненты - ПаскальКейс
BottleSpin.tsx
PlayerList.tsx
SettingsScreen.tsx

// Хуки - camelCase с префиксом use
useBottleSpin.ts
useGameSettings.ts
usePlayerManager.ts

// Утилиты - camelCase
storageHelpers.ts
dateUtils.ts
validationUtils.ts

// Типы - camelCase (или index.ts для группировки)
gameTypes.ts
playerTypes.ts

// Константы - camelCase
colors.ts
gameConfig.ts
```

## 🏷️ Переменные и функции

### Переменные
```typescript
// ✅ Хорошо - ясные, описательные имена
const currentPlayerIndex = 0;
const isSpinning = false;
const rotationAngle = 45;
const availableWishes = [];

// ❌ Плохо - неясные сокращения
const currIdx = 0;
const spin = false;
const ang = 45;
const wishes = [];
```

### Функции
```typescript
// ✅ Хорошо - глагол + существительное, описывают действие
function handleSpinComplete() { }
function validatePlayerData(player: Player) { }
function calculateRotationAngle(targetIndex: number) { }
function navigateToGameScreen() { }

// ❌ Плохо - неясные имена
function spin() { }
function check(player: Player) { }
function calc(idx: number) { }
function go() { }
```

### Обработчики событий
```typescript
// ✅ Хорошо - префикс handle
const handlePress = () => { };
const handleSpinBottle = () => { };
const handleSettingsChange = (settings: Settings) => { };

// ✅ Также хорошо - on + название
const onPress = () => { };
const onSpinComplete = () => { };
const onPlayerSelect = (player: Player) => { };
```

## 🏗️ Компоненты

### Названия компонентов
```typescript
// ✅ Хорошо - ПаскальКейс, описывают назначение
export function BottleSpinner() { }
export function PlayerCard() { }
export function GameSettings() { }
export function SettingsModal() { }

// ❌ Плохо - неясные названия
export function Comp() { }
export function Item() { }
export function Stuff() { }
```

### Props компонентов
```typescript
interface BottleSpinnerProps {
  // ✅ Хорошо - ясные, описательные имена
  players: Player[];
  isSpinning: boolean;
  onSpinComplete: (targetPlayer: Player) => void;
  spinDuration: number;
  theme: 'light' | 'dark';

  // ❌ Плохо - неясные имена
  p: Player[];
  sp: boolean;
  cb: (p: Player) => void;
  dur: number;
  t: string;
}
```

## 🎣 Хуки

### Названия хуков
```typescript
// ✅ Хорошо - camelCase с префиксом use
export function useBottleSpin() { }
export function useGameSettings() { }
export function usePlayerManager() { }
export function useAnimatedRotation() { }

// ❌ Плохо - без префикса use
export function bottleSpin() { }
export function gameSettings() { }
export function players() { }
```

### Возвращаемые значения хуков
```typescript
// ✅ Хорошо - группируем связанные значения
export function useBottleSpin() {
  return {
    isSpinning: boolean,
    currentSpinner: Player | null,
    targetPlayer: Player | null,
    spinBottle: () => void,
    resetSpin: () => void,
  };
}

// ❌ Плохо - много отдельных значений
export function useBottleSpin() {
  const isSpinning = boolean;
  const currentSpinner = Player | null;
  const targetPlayer = Player | null;
  const spinBottle = () => void;
  const resetSpin = () => void;
  return [isSpinning, currentSpinner, targetPlayer, spinBottle, resetSpin];
}
```

## 🏪 Сервисы и репозитории

### Сервисы
```typescript
// ✅ Хорошо - существительное + Service (если нужно)
export class GameService { }
export class PlayerService { }
export class SettingsService { }

// ✅ Также хорошо - просто существительное
export class Game { }
export class PlayerManager { }
export class SettingsManager { }
```

### Репозитории
```typescript
// ✅ Хорошо - существительное + Repository
export interface PlayerRepository { }
export class PlayerRepositoryImpl implements PlayerRepository { }
export class SettingsRepository { }
```

### Методы классов
```typescript
export class PlayerService {
  // ✅ Хорошо - ясные глаголы
  async createPlayer(playerData: CreatePlayerDto): Promise<Player> { }
  async updatePlayer(id: string, updates: UpdatePlayerDto): Promise<Player> { }
  async deletePlayer(id: string): Promise<void> { }
  async findPlayerById(id: string): Promise<Player | null> { }
  async findAllPlayers(): Promise<Player[]> { }

  // ❌ Плохо - неясные названия
  async add(p: any): Promise<any> { }
  async upd(id: string, d: any): Promise<any> { }
  async del(id: string): Promise<void> { }
  async get(id: string): Promise<any> { }
  async all(): Promise<any[]> { }
}
```

## 📊 Типы и интерфейсы

### Интерфейсы
```typescript
// ✅ Хорошо - ПаскальКейс, описывают сущность
interface Player {
  id: string;
  name: string;
  gender: 'M' | 'F';
}

interface GameSettings {
  spinDuration: number;
  vibrationEnabled: boolean;
}

// Для Props компонентов - добавляем суффикс Props
interface BottleSpinnerProps {
  players: Player[];
  onSpinComplete: (target: Player) => void;
}

// Для API запросов - суффикс Request/Dto
interface CreatePlayerRequest {
  name: string;
  gender: 'M' | 'F';
}

// Для ответов API - суффикс Response
interface PlayerResponse {
  id: string;
  name: string;
  gender: 'M' | 'F';
  createdAt: string;
}
```

### Типы
```typescript
// ✅ Хорошо - ПаскальКейс, описывают назначение
type GameMode = 'dating' | 'wishes';
type PlayerGender = 'M' | 'F';
type ThemeVariant = 'light' | 'dark' | 'auto';

// Для объединений - используем дескриптивные имена
type SpinnerState = 'idle' | 'spinning' | 'completed';
type NavigationScreen = 'Home' | 'Game' | 'Settings';
```

## 🔧 Константы

### Константы
```typescript
// ✅ Хорошо - UPPER_SNAKE_CASE
const SPIN_DURATION = 4000;
const MAX_PLAYERS_COUNT = 12;
const API_BASE_URL = 'https://api.example.com';

// Для связанных констант - группируем в объекты
const ANIMATION_CONFIG = {
  DURATION: 300,
  EASING: 'ease-in-out',
  DELAY: 100,
} as const;

const GAME_SETTINGS = {
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 12,
  DEFAULT_SPIN_DURATION: 4000,
} as const;
```

### Enum'ы
```typescript
// ✅ Хорошо - ПаскальКейс
enum GameMode {
  DATING = 'dating',
  WISHES = 'wishes',
}

enum PlayerGender {
  MALE = 'M',
  FEMALE = 'F',
}
```

## 📱 UI компоненты

### CSS классы и стили
```typescript
// ✅ Хорошо - kebab-case, BEM-подходный
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  'bottle-container': {
    alignItems: 'center',
  },
  'player-card': {
    padding: 16,
  },
  'player-card--selected': {
    backgroundColor: '#007AFF',
  },
  'player-card__name': {
    fontSize: 16,
  },
  'player-card__avatar': {
    width: 48,
    height: 48,
  },
});
```

## 🎨 Цвета и темы
```typescript
// ✅ Хорошо - группируем цвета
const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  background: '#F2F2F7',
  surface: '#FFFFFF',
  text: {
    primary: '#000000',
    secondary: '#8E8E93',
  },
} as const;

// Для градиентов - описываем назначение
const GRADIENTS = {
  primary: ['#007AFF', '#5856D6'],
  success: ['#34C759', '#30D158'],
  sunset: ['#FF9500', '#FF6B35'],
} as const;
```

## 🔀 Перечисления и состояния
```typescript
// ✅ Хорошо - описываем возможные состояния
type SpinState = 'idle' | 'spinning' | 'completed';
type LoadingState = 'idle' | 'loading' | 'success' | 'error';
type ScreenState = 'active' | 'inactive' | 'transitioning';

// Для булевых флагов используем префикс is/has/should
const isVisible = true;
const hasError = false;
const shouldShowLoading = true;
```

## 📝 Документация

### JSDoc комментарии
```typescript
/**
 * Кастомный хук для управления вращением бутылки
 * @param players - Массив игроков
 * @param options - Дополнительные опции
 * @returns Объект с состоянием и функциями управления
 *
 * @example
 * ```typescript
 * const { isSpinning, spinBottle } = useBottleSpin(players, {
 *   spinDuration: 4000,
 *   onComplete: handleComplete
 * });
 * ```
 */
export function useBottleSpin(
  players: Player[],
  options?: BottleSpinOptions
): BottleSpinResult {
  // реализация
}
```

---

## 🚀 Чеклист перед коммитом

- [ ] Все имена файлов соответствуют конвенциям
- [ ] Переменные имеют ясные, описательные имена
- [ ] Функции названы глаголами и описывают свои действия
- [ ] Компоненты используют ПаскальКейс
- [ ] Хуки имеют префикс `use`
- [ ] Константы используют UPPER_SNAKE_CASE
- [ ] Типы и интерфейсы используют ПаскальКейс
- [ ] Добавлены JSDoc комментарии для сложных функций
- [ ] Нет неоднозначных имен (data, info, item, etc.)
- [ ] Последовательное использование терминологии

Помни: **Хорошее имя - лучшая документация!** 🎯