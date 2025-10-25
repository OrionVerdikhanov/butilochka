# 🍾 Бутылочка - Мобильная игра для вечеринок v2.0

Обновленная версия классической игры для компаний с улучшенным дизайном, градиентами и новым функционалом!

## ✨ Что нового в версии 2.0

### Технические улучшения:
- ✅ Перенесено на React Native CLI (вместо Expo)
- ✅ Сборка через Gradle для Android
- ✅ SVG иконки с градиентами
- ✅ Улучшенный дизайн с градиентными фонами
- ✅ Тактильная обратная связь (вибрация)
- ✅ Автосохранение игроков
- ✅ AsyncStorage для локального хранения

### Функциональные улучшения:
- 🎨 Новый дизайн с градиентами
- 📱 Тактильная обратная связь при действиях
- 💾 Автосохранение списка игроков
- 🔄 Улучшенная анимация бутылочки (SVG с градиентами)
- 🎯 Более реалистичная физика вращения
- ⚙️ Система настроек

## 🚀 Быстрый старт

### Требования:
- Node.js 18+
- JDK 11 или выше
- Android SDK
- Android Studio (для эмулятора или сборки)

### Установка:

```bash
# 1. Клонировать репозиторий
git clone <your-repo>
cd butilochka

# 2. Установить зависимости
npm install

# 3. Установить Pods для iOS (если нужно)
cd ios && pod install && cd ..
```

### Запуск для разработки:

#### Android:

```bash
# Убедитесь что эмулятор запущен или устройство подключено
npm run android
```

Или вручную:
```bash
# В первом терминале запустите Metro bundler
npm start

# Во втором терминале запустите приложение
npm run android
```

#### iOS (только на macOS):

```bash
npm run ios
```

## 📦 Сборка релизной версии

### Android APK:

```bash
# Собрать релизный APK
npm run build:android

# APK будет в: android/app/build/outputs/apk/release/app-release.apk
```

### Android AAB (для Google Play):

```bash
# Собрать релизный bundle
npm run build:android:bundle

# AAB будет в: android/app/build/outputs/bundle/release/app-release.aab
```

### Подписание APK/AAB для продакшн:

1. Создайте keystore:
```bash
cd android/app
keytool -genkey -v -keystore butilochka-release.keystore -alias butilochka -keyalg RSA -keysize 2048 -validity 10000
```

2. Добавьте в `android/gradle.properties`:
```properties
BUTILOCHKA_UPLOAD_STORE_FILE=butilochka-release.keystore
BUTILOCHKA_UPLOAD_KEY_ALIAS=butilochka
BUTILOCHKA_UPLOAD_STORE_PASSWORD=<your_password>
BUTILOCHKA_UPLOAD_KEY_PASSWORD=<your_password>
```

3. Обновите `android/app/build.gradle`:
```gradle
signingConfigs {
    release {
        storeFile file(BUTILOCHKA_UPLOAD_STORE_FILE)
        storePassword BUTILOCHKA_UPLOAD_STORE_PASSWORD
        keyAlias BUTILOCHKA_UPLOAD_KEY_ALIAS
        keyPassword BUTILOCHKA_UPLOAD_KEY_PASSWORD
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        // ...
    }
}
```

4. Соберите подписанный APK:
```bash
cd android && ./gradlew assembleRelease
```

## 🎮 Функциональность

### Режимы игры:

#### 1. Режим "Желания" 🎯
- Крутящий загадывает случайное желание
- 30+ готовых желаний
- Возможность добавить свои желания (в настройках)
- Для любого состава игроков

#### 2. Режим "Знакомства" 💕
- Только для противоположных полов
- Три действия: поцелуй, лайк, пропустить
- Счетчик взаимных лайков
- Автоматическое чередование М/Ж

### Дополнительные функции:

- **Автосохранение игроков**: Ваш список игроков сохраняется автоматически
- **Тактильная обратная связь**: Вибрация при нажатиях и важных событиях
- **Градиентный дизайн**: Современный UI с плавными переходами цветов
- **SVG анимации**: Плавная анимация бутылочки с градиентами

## 📁 Структура проекта

```
butilochka/
├── android/                    # Android нативный код
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── java/com/butilochka/
│   │   │   ├── res/
│   │   │   └── AndroidManifest.xml
│   │   └── build.gradle
│   ├── gradle/
│   ├── build.gradle
│   └── settings.gradle
├── src/
│   ├── components/
│   │   ├── Bottle.tsx          # SVG компонент бутылочки
│   │   ├── GradientBackground.tsx
│   │   └── GradientButton.tsx
│   ├── screens/
│   │   ├── PlayersScreen.tsx
│   │   ├── ModeSelectionScreen.tsx
│   │   ├── WishesGameScreen.tsx
│   │   └── DatingGameScreen.tsx
│   ├── types/
│   │   └── index.ts
│   ├── constants/
│   │   ├── colors.ts
│   │   └── wishes.ts
│   └── utils/
│       └── storage.ts          # AsyncStorage утилиты
├── App.tsx
├── index.js                    # Entry point
├── package.json
├── metro.config.js
├── babel.config.js
└── README.md
```

## 🔧 Отладка

### Проблемы со сборкой:

```bash
# Очистить кэш Metro bundler
npm start -- --reset-cache

# Очистить Gradle cache
cd android && ./gradlew clean

# Переустановить зависимости
rm -rf node_modules && npm install
```

### Логи Android:

```bash
# Просмотр логов в реальном времени
adb logcat | grep ReactNative

# Или через Android Studio:
# View -> Tool Windows -> Logcat
```

## 🎨 Кастомизация

### Изменение цветов:

Редактируйте `src/constants/colors.ts`:
```typescript
export const COLORS = {
  primary: '#ff6b6b',      // Основной цвет
  secondary: '#4ecdc4',    // Вторичный цвет
  male: '#4a90e2',         // Мужской цвет
  female: '#ff69b4',       // Женский цвет
  // ...
};
```

### Добавление желаний:

Редактируйте `src/constants/wishes.ts`:
```typescript
export const WISHES = [
  "Ваше новое желание",
  // ...
];
```

### Изменение иконки:

1. Замените SVG файлы в `assets/icons/`
2. Для Android mipmap иконок используйте Android Asset Studio:
   https://romannurik.github.io/AndroidAssetStudio/

## 📱 Тестирование на устройстве

### Через USB отладку:

1. Включите режим разработчика на Android устройстве
2. Включите отладку по USB
3. Подключите устройство к компьютеру
4. Проверьте подключение: `adb devices`
5. Запустите: `npm run android`

### Установка APK напрямую:

```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

## 🐛 Известные проблемы

- **Haptic feedback не работает на эмуляторе**: Нормально, работает только на реальных устройствах
- **Gradle build timeout**: Увеличьте heap size в `android/gradle.properties`:
  ```
  org.gradle.jvmargs=-Xmx4096m
  ```

## 📄 Лицензия

MIT License - используйте свободно для личных и коммерческих целей

## 🤝 Вклад в развитие

Pull requests приветствуются! Для больших изменений сначала откройте issue для обсуждения.

## 📧 Поддержка

Если возникли проблемы:
1. Проверьте раздел "Отладка" в этом README
2. Поищите похожие issues в репозитории
3. Создайте новый issue с описанием проблемы

---

**Разработано с ❤️ и Claude Code**

Приятной игры! 🍾🎉
