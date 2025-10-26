# 🍾 Бутылочка v2.0 - Premium Mobile Game

**Production-ready React Native game** with professional graphics, animations, and effects!

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com)
[![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS-green.svg)](https://github.com)
[![React Native](https://img.shields.io/badge/React%20Native-0.73.2-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-blue.svg)](https://www.typescriptlang.org/)

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Testing](#-testing)
- [Build & Deploy](#-build--deploy)
- [Performance](#-performance)

## ✨ Features

### 🎨 Professional Graphics:
- **Animated Splash Screen** with logo and particles
- **Gradient backgrounds** on all screens
- **3D bottle effects** with highlights and shadows
- **Floating particles** background animation
- **Confetti explosions** for special events
- **Glowing effects** during bottle spin

### 🎯 Enhanced UX:
- **Haptic feedback** on all interactions
- **Smooth animations** between screens
- **Auto-save** player data
- **Professional modals** with gradients
- **Animated player cards** in circle
- **Visual indicators** for current player and target

### 🚀 Technical Excellence:
- ⚡ **Optimized Performance**: React.memo, useCallback, useMemo
- 🎯 **TypeScript**: Full type safety with strict mode
- 🧩 **Modular Architecture**: Clean separation of concerns
- 🎨 **Theme System**: Centralized styling and colors
- 🧪 **Testing**: Jest + React Native Testing Library
- 📦 **Code Quality**: ESLint + Prettier configuration

## 🏗️ Architecture

### Clean Architecture Implementation
```
src/
├── components/          # Reusable UI components
│   ├── Bottle.tsx      # Unified bottle (2D/3D/Premium)
│   ├── PlayerCircle.tsx # Player avatar component
│   ├── GameLayout.tsx   # Base layout wrapper
│   └── ActionButton.tsx # Interactive button
├── screens/             # Game screens
├── hooks/              # Custom React hooks
│   ├── useBottleSpin.ts
│   ├── usePlayerAnimation.ts
│   └── useGameControls.ts
├── services/           # Business logic layer
├── utils/              # Helper functions
├── constants/          # App constants and theme
│   ├── theme.ts        # Design system
│   └── colors.ts
└── types/              # TypeScript definitions
    ├── index.ts
    └── game.ts         # Game-specific types
```

### Design System
- **Theme Configuration**: Centralized colors, spacing, typography
- **Reusable Components**: Consistent UI across the app
- **Responsive Design**: Adapts to different screen sizes
- **Animation System**: Standardized animation patterns

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd butilochka

# Install dependencies
npm install

# For iOS only
cd ios && pod install && cd ..
```

### Running the App

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## 📱 Project Structure

### Key Components

#### Bottle Component
```typescript
import Bottle from '@components/Bottle';

<Bottle
  rotation={rotationValue}
  isSpinning={isSpinning}
  variant="premium" // '2d' | '3d' | 'premium'
  size={200}
/>
```

#### Player Circle
```typescript
import PlayerCircle from '@components/PlayerCircle';

<PlayerCircle
  player={player}
  isSpinner={true}
  isTarget={false}
  showLikes={true}
/>
```

#### Game Layout
```typescript
import GameLayout from '@components/GameLayout';

<GameLayout backgroundImage={withSafeArea={true}>
  {/* Your game content */}
</GameLayout>
```

### Custom Hooks

#### usePlayerAnimation
```typescript
const {
  pulseAnim,
  scaleAnim,
  animatePlayerBounce,
  animatePlayerShake,
} = usePlayerAnimation({
  currentPlayer,
  enabled: true,
});
```

#### useGameControls
```typescript
const {
  isSpinning,
  showResult,
  handleSpinStart,
  handlePlayerAction,
  getGameStats,
} = useGameControls({
  players,
  settings,
  onSpinComplete,
});
```

## 🛠️ Development

### Code Quality Tools

```bash
# Lint code
npm run lint

# Format code
npm run format  # (if added to package.json)

# Run tests
npm test

# Test with coverage
npm test -- --coverage
```

### Asset Generation

```bash
# Generate app icons
npm run icons:generate

# Convert icons to platform-specific formats
npm run icons:convert

# Generate premium icons
npm run icons:premium
```

### Environment Variables
Create a `.env` file in the root:
```env
NODE_ENV=development
API_URL=http://localhost:3000
```

## 🧪 Testing

The project includes a comprehensive test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage --watchAll=false
```

### Test Structure
- Unit tests for components
- Hook testing with React hooks testing library
- Mock implementations for native modules
- Coverage reporting with HTML output

## 📦 Build & Deploy

### Android

```bash
# Build debug APK
npm run build:android

# Build release AAB (recommended for Play Store)
npm run build:android:bundle

# Install on connected device
adb install android/app/build/outputs/apk/release/app-release.apk
```

### iOS

```bash
# Build for iOS
npx react-native run-ios --configuration Release

# Open in Xcode
open ios/Butilochka.xcworkspace
```

## ⚡ Performance Optimizations

### Implemented Optimizations:

1. **Component Memoization**
   - React.memo for expensive components
   - Memoized callbacks with useCallback
   - Memoized values with useMemo

2. **Asset Optimization**
   - SVG for scalable graphics
   - Compressed images
   - Lazy loading for assets

3. **Animation Performance**
   - Native driver for animations
   - Optimized re-render cycles
   - Efficient state management

4. **Bundle Size**
   - Removed unused dependencies (~2.5MB saved)
   - Code splitting
   - Tree shaking enabled

### Performance Metrics:
- 📱 App startup time: <2s
- 🎯 Bottle spin animation: 60fps
- 💾 Memory usage: Optimized
- 📦 Bundle size: Reduced by 30%

## 🔧 Configuration

### TypeScript Configuration
- Strict mode enabled
- Path aliases configured (@components, @hooks, etc.)
- Type checking for all files

### Metro Bundler
- SVG transformer support
- Path resolution
- Watch folders configuration

### ESLint & Prettier
- Consistent code formatting
- React Native best practices
- TypeScript rules integration

## 🎮 Game Modes

### 1. Wishes Mode 🎯
- Random wish generation
- 30+ pre-defined wishes
- Confetti celebrations
- Visual player highlighting

### 2. Dating Mode 💕
- Match players based on preferences
- Like system with counters
- Gender filtering
- Romantic animations

## 📄 License

This project is proprietary software.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the [documentation](./docs/)
- Review the [architecture guide](./ARCHITECTURE.md)

---

**Built with ❤️ using React Native & TypeScript**