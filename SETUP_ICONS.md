# Настройка иконок для Android

## Автоматическая генерация (уже выполнено)

SVG иконки уже сгенерированы в `assets/icons/`. Теперь нужно конвертировать их в PNG для Android.

## Метод 1: Онлайн конвертация (рекомендуется)

1. Используйте https://cloudconvert.com/svg-to-png
2. Загрузите `assets/icons/icon-1024.svg`
3. Скачайте PNG
4. Используйте https://appicon.co/ для генерации всех размеров Android иконок
5. Скачайте результат и поместите в `android/app/src/main/res/`

## Метод 2: Использование Android Asset Studio

1. Откройте https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html
2. Загрузите `assets/icons/icon-1024.svg`
3. Настройте параметры (trim, padding)
4. Скачайте zip с иконками
5. Распакуйте в `android/app/src/main/res/`

## Метод 3: Вручную (ImageMagick)

Если у вас установлен ImageMagick:

```bash
# Конвертировать SVG в PNG разных размеров
convert assets/icons/icon-1024.svg -resize 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher.png
convert assets/icons/icon-1024.svg -resize 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher.png
convert assets/icons/icon-1024.svg -resize 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
convert assets/icons/icon-1024.svg -resize 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
convert assets/icons/icon-1024.svg -resize 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png

# Round иконки
convert assets/icons/icon-1024.svg -resize 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png
convert assets/icons/icon-1024.svg -resize 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png
convert assets/icons/icon-1024.svg -resize 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png
convert assets/icons/icon-1024.svg -resize 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png
convert assets/icons/icon-1024.svg -resize 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png
```

## Проверка

После установки иконок:

1. Пересоберите приложение: `npm run android`
2. Проверьте иконку в лаунчере Android

## Примечание

Приложение будет работать и без кастомных иконок - Android покажет дефолтную иконку.
