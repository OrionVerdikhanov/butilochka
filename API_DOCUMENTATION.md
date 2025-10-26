# 📚 API Документация - Бутылочка v6.0

Полная документация по всем компонентам, хукам и утилитам проекта.

## 📑 Содержание

- [Игровые компоненты](#игровые-компоненты)
- [Компоненты настроек](#компоненты-настроек)
- [Основные компоненты](#основные-компоненты)
- [Хуки](#хуки)
- [Утилиты](#утилиты)
- [Типы](#типы)
- [Константы](#константы)

---

## 🎮 Игровые компоненты

Компоненты находятся в `src/components/game/`

### PlayerCircle

Отображает одного игрока на круге с анимацией и визуальными эффектами.

#### Props

```typescript
interface PlayerCircleProps {
  player: Player;                    // Объект игрока
  isSpinner: boolean;                // Крутит ли игрок сейчас
  isTarget: boolean;                 // Является ли целью
  pulseAnim?: Animated.Value;        // Анимация пульсации (опционально)
  spinnerBadgeEmoji?: string;        // Эмодзи для бейджа (по умолчанию '🎯')
  showLikes?: boolean;               // Показывать счетчик лайков (по умолчанию false)
}
```

#### Пример использования

```typescript
import { PlayerCircle } from '../components/game';

<PlayerCircle
  player={{
    id: '1',
    name: 'Иван',
    gender: 'M',
    likes: 5
  }}
  isSpinner={true}
  isTarget={false}
  pulseAnim={pulseAnimation}
  spinnerBadgeEmoji="🎯"
  showLikes={true}
/>
```

#### Особенности

- Автоматически меняет цвет в зависимости от роли (spinner/target/gender)
- Показывает анимированную светящуюся рамку для активного игрока
- Отображает бейдж с эмодзи для текущего игрока
- Может показывать счетчик лайков

---

### PlayersCircle

Рендерит всех игроков по кругу вокруг бутылки.

#### Props

```typescript
interface PlayersCircleProps {
  players: Player[];                  // Массив игроков
  currentSpinnerIndex: number;        // Индекс текущего крутящего
  targetPlayerIndex: number | null;   // Индекс цели (или null)
  pulseAnim?: Animated.Value;         // Анимация пульсации
  spinnerBadgeEmoji?: string;         // Эмодзи для бейджа
  showLikes?: boolean;                // Показывать лайки
}
```

#### Пример использования

```typescript
import { PlayersCircle } from '../components/game';

<PlayersCircle
  players={playersArray}
  currentSpinnerIndex={0}
  targetPlayerIndex={2}
  pulseAnim={pulseAnimation}
  spinnerBadgeEmoji="💕"
  showLikes={true}
/>
```

#### Математика позиционирования

```typescript
// Игроки позиционируются по кругу начиная с 12 часов (-90°)
const angle = (index * 360) / players.length - 90;
const x = centerX + radius * Math.cos((angle * Math.PI) / 180);
const y = centerY + radius * Math.sin((angle * Math.PI) / 180);
```

---

### SpinnerInfoPanel

Панель с информацией о текущем крутящем игроке.

#### Props

```typescript
interface SpinnerInfoPanelProps {
  player: Player;        // Текущий игрок
  emoji: string;         // Эмодзи-индикатор
  hint: string;          // Подсказка для игрока
  colors: string[];      // Цвета градиента
}
```

#### Пример использования

```typescript
import { SpinnerInfoPanel } from '../components/game';

<SpinnerInfoPanel
  player={currentPlayer}
  emoji="🎯"
  hint="Крутите бутылочку!"
  colors={['#ffd43b', '#fab005']}
/>
```

---

### GameHeader

Заголовок игрового экрана с кнопкой "Назад".

#### Props

```typescript
interface GameHeaderProps {
  title: string;         // Заголовок экрана
  colors: string[];      // Цвета градиента
  onBack: () => void;    // Callback при нажатии "Назад"
}
```

#### Пример использования

```typescript
import { GameHeader } from '../components/game';

<GameHeader
  title="🎯 Режим: Желания"
  colors={['#ff6b6b', '#ee5a6f']}
  onBack={() => navigation.goBack()}
/>
```

---

### WishesResultModal

Модальное окно с результатами для режима "Желания".

#### Props

```typescript
interface WishesResultModalProps {
  visible: boolean;              // Видимость модалки
  currentSpinner: Player;        // Крутивший игрок
  targetPlayer: Player | null;   // Целевой игрок
  wish: string | null;           // Текст желания
  showTimer: boolean;            // Показывать таймер
  timerDuration: number;         // Длительность таймера (мс)
  onTimerComplete: () => void;   // Callback по окончанию таймера
  onNextTurn: () => void;        // Callback для следующего хода
}
```

#### Пример использования

```typescript
import { WishesResultModal } from '../components/game';

<WishesResultModal
  visible={showResult}
  currentSpinner={spinner}
  targetPlayer={target}
  wish="Станцуй танец"
  showTimer={true}
  timerDuration={60000}
  onTimerComplete={() => console.log('Time!')}
  onNextTurn={handleNextTurn}
/>
```

---

### DatingResultModal

Модальное окно с результатами для режима "Знакомства".

#### Props

```typescript
interface DatingResultModalProps {
  visible: boolean;              // Видимость модалки
  currentSpinner: Player;        // Крутивший игрок
  targetPlayer: Player | null;   // Целевой игрок
  onKiss: () => void;            // Callback при "Поцелуй"
  onLike: () => void;            // Callback при "Лайк"
}
```

#### Пример использования

```typescript
import { DatingResultModal } from '../components/game';

<DatingResultModal
  visible={showResult}
  currentSpinner={spinner}
  targetPlayer={target}
  onKiss={handleKiss}
  onLike={handleLike}
/>
```

---

## ⚙️ Компоненты настроек

Компоненты находятся в `src/components/settings/`

### SettingSection

Секция настроек с заголовком и градиентом.

#### Props

```typescript
interface SettingSectionProps {
  title: string;                 // Заголовок секции
  emoji: string;                 // Эмодзи для заголовка
  colors: string[];              // Цвета градиента
  children: React.ReactNode;     // Содержимое секции
}
```

#### Пример использования

```typescript
import { SettingSection } from '../components/settings';

<SettingSection
  title="Настройки игры"
  emoji="🎮"
  colors={['#4ecdc4', '#44a3d9']}
>
  {/* Ваши настройки здесь */}
</SettingSection>
```

---

### CategoryToggle

Переключатель категории желаний.

#### Props

```typescript
interface CategoryToggleProps {
  category: WishCategory;        // ID категории
  name: string;                  // Название категории
  emoji: string;                 // Эмодзи категории
  colors: string[];              // Цвета градиента
  isEnabled: boolean;            // Включена ли категория
  onToggle: () => void;          // Callback при переключении
}
```

#### Пример использования

```typescript
import { CategoryToggle } from '../components/settings';

<CategoryToggle
  category="funny"
  name="Смешные"
  emoji="😂"
  colors={['#f093fb', '#f5576c']}
  isEnabled={true}
  onToggle={() => toggleCategory('funny')}
/>
```

---

### ToggleSetting

Переключатель настройки (Switch).

#### Props

```typescript
interface ToggleSettingProps {
  label: string;                        // Название настройки
  value: boolean;                       // Текущее значение
  onValueChange: (value: boolean) => void;  // Callback при изменении
}
```

#### Пример использования

```typescript
import { ToggleSetting } from '../components/settings';

<ToggleSetting
  label="Вибрация"
  value={vibrationEnabled}
  onValueChange={(val) => setVibrationEnabled(val)}
/>
```

---

### ColorSelector

Селектор цвета или варианта из списка.

#### Props

```typescript
interface ColorSelectorProps {
  label: string;                                    // Заголовок
  options: Array<{                                  // Список опций
    value: string;
    label: string;
    colors?: string[];
  }>;
  selectedValue: string;                            // Выбранное значение
  onSelect: (value: string) => void;                // Callback при выборе
  renderItem?: (item: any, isSelected: boolean) => React.ReactNode;  // Кастомный рендер
}
```

#### Пример использования

```typescript
import { ColorSelector } from '../components/settings';

<ColorSelector
  label="Скорость вращения"
  options={[
    { label: 'Медленно', value: '6000' },
    { label: 'Нормально', value: '4000' },
    { label: 'Быстро', value: '2000' },
  ]}
  selectedValue={spinDuration}
  onSelect={(value) => setSpinDuration(value)}
/>
```

---

## 🎨 Основные компоненты

### GradientButton

Кнопка с градиентным фоном.

#### Props

```typescript
interface GradientButtonProps {
  title: string;               // Текст кнопки
  onPress: () => void;         // Callback при нажатии
  colors: string[];            // Цвета градиента
  disabled?: boolean;          // Заблокирована ли кнопка
  style?: any;                 // Дополнительные стили
}
```

#### Пример использования

```typescript
import GradientButton from '../components/GradientButton';

<GradientButton
  title="Начать игру"
  onPress={startGame}
  colors={['#51cf66', '#37b24d']}
  disabled={false}
/>
```

---

### Bottle3D

3D бутылка с анимацией вращения.

#### Props

```typescript
interface Bottle3DProps {
  rotation: Animated.Value;    // Значение вращения
  isSpinning: boolean;         // Крутится ли сейчас
  size: number;                // Размер бутылки
  color: string;               // Цвет бутылки
}
```

#### Пример использования

```typescript
import Bottle3D from '../components/Bottle3D';

<Bottle3D
  rotation={rotationValue}
  isSpinning={isSpinning}
  size={200}
  color="#8B4513"
/>
```

---

### ConfettiExplosion

Эффект конфетти.

#### Props

```typescript
interface ConfettiExplosionProps {
  count?: number;         // Количество частиц (по умолчанию 60)
  duration?: number;      // Длительность анимации в мс (по умолчанию 3000)
}
```

#### Пример использования

```typescript
import ConfettiExplosion from '../components/ConfettiExplosion';

{showConfetti && <ConfettiExplosion count={80} duration={3000} />}
```

---

### AnimatedBackground

Анимированный фон с выбором темы.

#### Props

```typescript
interface AnimatedBackgroundProps {
  theme: string;                // ID темы
  children: React.ReactNode;    // Содержимое
}
```

#### Пример использования

```typescript
import AnimatedBackground from '../components/AnimatedBackground';

<AnimatedBackground theme="sunset">
  {/* Ваш контент */}
</AnimatedBackground>
```

---

## 🪝 Хуки

Хуки находятся в `src/hooks/`

### useBottleSpin

Хук для управления вращением бутылки и анимациями.

#### Возвращаемое значение

```typescript
{
  rotationValue: Animated.Value;    // Значение вращения бутылки
  pulseAnim: Animated.Value;        // Значение пульсации активного игрока
  spinToPlayer: (
    targetIndex: number,            // Индекс целевого игрока
    playersCount: number,           // Общее количество игроков
    duration: number,               // Длительность вращения (мс)
    onComplete: () => void          // Callback по завершению
  ) => void;
  resetRotation: () => void;        // Сброс вращения в 0
}
```

#### Пример использования

```typescript
import { useBottleSpin } from '../hooks';

function GameScreen() {
  const { rotationValue, pulseAnim, spinToPlayer, resetRotation } = useBottleSpin();

  const handleSpin = () => {
    const targetIndex = 3;  // Выбранный игрок
    spinToPlayer(targetIndex, players.length, 4000, () => {
      console.log('Вращение завершено!');
      setShowResult(true);
    });
  };

  const handleNextTurn = () => {
    resetRotation();
    // ... другая логика
  };

  return (
    <>
      <Bottle3D rotation={rotationValue} />
      <PlayersCircle pulseAnim={pulseAnim} />
    </>
  );
}
```

#### Детали реализации

```typescript
// Автоматическая пульсация (1.0 → 1.15 → 1.0)
useEffect(() => {
  const pulse = Animated.loop(
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.15,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ])
  );
  pulse.start();
  return () => pulse.stop();
}, []);

// Расчет угла для игрока
const anglePerPlayer = 360 / playersCount;
const targetAngle = targetIndex * anglePerPlayer - 90;  // -90° = 12 часов
const randomRotations = 4 + Math.random() * 6;
const totalRotation = randomRotations * 360 + targetAngle;
```

---

## 🛠️ Утилиты

Утилиты находятся в `src/utils/`

### Storage (storage.ts)

Функции для работы с AsyncStorage.

#### Типы

```typescript
interface Settings {
  vibrationEnabled: boolean;
  spinDuration: number;
  showTimer: boolean;
  timerDuration: number;
  enabledCategories: WishCategory[];
  useCustomWishes: boolean;
  theme: string;
  bottleColor: string;
}

interface Player {
  id: string;
  name: string;
  gender: 'M' | 'F';
  likes: number;
}
```

#### API

```typescript
// Сохранение настроек
await saveSettings(settings: Settings): Promise<void>

// Загрузка настроек
await loadSettings(): Promise<Settings>

// Сохранение игроков
await savePlayers(players: Player[]): Promise<void>

// Загрузка игроков
await loadPlayers(): Promise<Player[]>

// Очистка всех данных
await clearAllData(): Promise<void>

// Дефолтные настройки
DEFAULT_SETTINGS: Settings
```

#### Пример использования

```typescript
import { saveSettings, loadSettings, DEFAULT_SETTINGS } from '../utils/storage';

// Загрузить настройки
const settings = await loadSettings();

// Изменить настройки
const newSettings = {
  ...settings,
  vibrationEnabled: true,
  spinDuration: 3000,
};

// Сохранить настройки
await saveSettings(newSettings);
```

---

## 📝 Типы

Типы находятся в `src/types/index.ts`

### Player

```typescript
interface Player {
  id: string;           // Уникальный ID
  name: string;         // Имя игрока
  gender: 'M' | 'F';    // Пол (M - мужской, F - женский)
  likes: number;        // Количество лайков
}
```

### GameMode

```typescript
type GameMode = 'wishes' | 'dating';
```

### Gender

```typescript
type Gender = 'M' | 'F';
```

### WishCategory

```typescript
type WishCategory = 'all' | 'funny' | 'romantic' | 'extreme' | 'creative' | 'social';
```

---

## 📊 Константы

### Цвета (colors.ts)

```typescript
export const COLORS = {
  primary: '#ff6b6b',
  secondary: '#4ecdc4',
  success: '#51cf66',
  warning: '#ffd43b',
  error: '#ff6b6b',
  background: '#f8f9fa',
  white: '#ffffff',
  text: '#2d3436',
  textLight: '#636e72',
  border: '#dfe6e9',
  male: '#4a90e2',
  female: '#ff69b4',
};
```

### Желания (wishes.ts)

```typescript
// Названия категорий
export const CATEGORY_NAMES: Record<WishCategory, string> = {
  all: 'Все',
  funny: 'Смешные',
  romantic: 'Романтические',
  extreme: 'Экстремальные',
  creative: 'Творческие',
  social: 'Социальные',
};

// Эмодзи категорий
export const CATEGORY_EMOJIS: Record<WishCategory, string> = {
  all: '🎯',
  funny: '😂',
  romantic: '💕',
  extreme: '🔥',
  creative: '🎨',
  social: '🎭',
};

// Получить желания по категориям
export function getWishesByCategories(categories: WishCategory[]): string[];
```

---

## 🎯 Примеры использования

### Создание нового игрового режима

```typescript
import { PlayersCircle, GameHeader, SpinnerInfoPanel } from '../components/game';
import { useBottleSpin } from '../hooks';
import Bottle3D from '../components/Bottle3D';

function MyCustomGameMode({ players, onBack, settings }) {
  const [currentSpinnerIndex, setCurrentSpinnerIndex] = useState(0);
  const [targetPlayerIndex, setTargetPlayerIndex] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const { rotationValue, pulseAnim, spinToPlayer, resetRotation } = useBottleSpin();

  const handleSpin = () => {
    setIsSpinning(true);

    // Выбираем случайного игрока
    const targetIndex = Math.floor(Math.random() * players.length);

    // Крутим бутылку
    spinToPlayer(targetIndex, players.length, settings.spinDuration, () => {
      setIsSpinning(false);
      setTargetPlayerIndex(targetIndex);
      // Показываем результат
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <GameHeader
        title="🎮 Мой режим"
        colors={['#667eea', '#764ba2']}
        onBack={onBack}
      />

      <SpinnerInfoPanel
        player={players[currentSpinnerIndex]}
        emoji="🎮"
        hint="Крутите!"
        colors={['#ffd43b', '#fab005']}
      />

      <PlayersCircle
        players={players}
        currentSpinnerIndex={currentSpinnerIndex}
        targetPlayerIndex={targetPlayerIndex}
        pulseAnim={pulseAnim}
      />

      <Bottle3D
        rotation={rotationValue}
        isSpinning={isSpinning}
        size={200}
        color={settings.bottleColor}
      />

      <GradientButton
        title={isSpinning ? 'КРУТИТСЯ...' : 'КРУТИТЬ'}
        onPress={handleSpin}
        disabled={isSpinning}
        colors={['#51cf66', '#37b24d']}
      />
    </View>
  );
}
```

---

## 📚 Дополнительные ресурсы

- [React Native Animated API](https://reactnative.dev/docs/animated)
- [React Hooks](https://reactjs.org/docs/hooks-intro.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

---

**Документация обновлена для версии 6.0** 📖✨
