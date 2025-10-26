# 🏗️ Архитектура проекта "Бутылочка"

## 📋 Обзор
React Native приложение для игры в "правду или желание" и "исполняй желания" с вращением бутылки.

## 🎯 Технологический стек
- **React Native 0.73.2** - мобильная платформа
- **TypeScript 5.0.4** - статическая типизация
- **React 18.2.0** - UI фреймворк
- **React Navigation 6.x** - навигация
- **React Native Reanimated 3.6.1** - анимации
- **Async Storage** - локальное хранилище

## 📁 Структура проекта

```
src/
├── components/          # Переиспользуемые UI компоненты
│   ├── Bottle.tsx              # 3D модель бутылки
│   ├── Bottle3D.tsx            # 3D анимация бутылки
│   ├── BottlePremium.tsx       # Премиум бутылка
│   ├── GradientButton.tsx      # Градиентная кнопка
│   ├── GradientBackground.tsx  # Градиентный фон
│   ├── AnimatedBackground.tsx  # Анимированный фон
│   ├── FloatingParticles.tsx   # Плавающие частицы
│   ├── ConfettiExplosion.tsx   # Конфетти-взрыв
│   ├── CountdownTimer.tsx      # Таймер обратного отсчета
│   ├── DecorativeElements.tsx  # Декоративные элементы
│   └── BackgroundPattern.tsx   # Фоновые паттерны
├── screens/            # Экраны приложения
│   ├── App.tsx                 # Главный экран
│   ├── SplashScreen.tsx        # Заставка
│   ├── PlayersScreen.tsx       # Экран управления игроками
│   ├── SettingsScreen.tsx      # Настройки приложения
│   ├── ModeSelectionScreen.tsx # Выбор режима игры
│   ├── WishesGameScreen.tsx    # Экран игры "исполняй желания"
│   └── DatingGameScreen.tsx    # Экран игры "правда или желание"
├── types/              # TypeScript типы
│   └── index.ts                # Основные типы данных
├── constants/          # Константы приложения
│   ├── colors.ts              # Цветовая палитра
│   └── wishes.ts              # База желаний
├── utils/              # Утилиты
│   └── storage.ts             # Работа с хранилищем
├── hooks/              # Кастомные хуки (будет создано при рефакторинге)
└── services/           # Сервисный слой (будет создано при рефакторинге)
```

## 🔄 Потоки данных

### Текущая архитектура (до рефакторинга)
```
Component → useState → AsyncStorage
    ↓
UI смешан с бизнес-логикой
```

### Целевая архитектура (после рефакторинга)
```
Screen → Custom Hook → Service → Repository → Storage
    ↓
UI отделен от бизнес-логики
```

## 🎮 Основные сущности

### Player (Игрок)
```typescript
interface Player {
  id: string;
  name: string;
  avatar?: string;
  isPremium?: boolean;
}
```

### Settings (Настройки)
```typescript
interface Settings {
  spinDuration: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  showParticles: boolean;
  theme: 'light' | 'dark';
}
```

### Game Modes (Режимы игры)
- **Dating Game** - "Правда или желание"
- **Wishes Game** - "Исполняй желания"

## 🧩 Компоненты высокой сложности (требуют рефакторинга)

### SettingsScreen (625 строк)
**Проблемы:**
- Слишком много ответственности
- Смешение UI и логики
- Длинные функции

**Решение:** Разделить на 4 компонента:
- `PlayerSettings`
- `GameSettings`
- `AppearanceSettings`
- `DataManagement`

### DatingGameScreen & WishesGameScreen
**Проблемы:**
- 90% дублирования кода
- Одинаковая логика вращения

**Решение:** Создать хук `useBottleSpin`

## 📊 План рефакторинга

### ✅ Этап 1: Очистка
- [x] Удалить устаревшие файлы
- [ ] Создать документацию

### 🔄 Этап 2: Устранение дублирования
- [ ] Создать хук `useBottleSpin`
- [ ] Рефакторить игровые экраны

### 🧩 Этап 3: Декомпозиция
- [ ] Разделить SettingsScreen
- [ ] Создать кастомные хуки

### 🏗️ Этап 4: Архитектура
- [ ] Внедрить Repository паттерн
- [ ] Улучшить документацию

### ⚡ Этап 5: Оптимизация
- [ ] Добавить memoization
- [ ] Улучшить производительность

## 🎨 Цветовая схема
- **Основной:** `#6B46C1` (Deep Purple)
- **Акцентный:** `#EC4899` (Pink)
- **Фон:** Градиент от фиолетового к розовому
- **Текст:** Белый с полупрозрачностью

## 📝 Конвенции именования (после рефакторинга)
- **Компоненты:** PascalCase (`BottleSpin`)
- **Хуки:** camelCase с префиксом `use` (`useBottleSpin`)
- **Функции:** camelCase, глагол + существительное (`handleSpinComplete`)
- **Переменные:** camelCase, осмысленные имена (`isSpinning`)
- **Константы:** UPPER_SNAKE_CASE (`SPIN_DURATION`)

## 🔧 Принципы разработки
1. **Single Responsibility** - каждый компонент имеет одну обязанность
2. **Don't Repeat Yourself** - нет дублирования кода
3. **Separation of Concerns** - логика отделена от UI
4. **Type Safety** - строгая TypeScript типизация
5. **Performance First** - оптимизация рендеров

---
*Документация обновляется в процессе рефакторинга*