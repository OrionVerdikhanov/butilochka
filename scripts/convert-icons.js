const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Папки для иконок
const iconsDir = path.join(__dirname, 'assets', 'icons');
const androidResDir = path.join(__dirname, 'android', 'app', 'src', 'main', 'res');

// Создаем папки для иконок разных разрешений
const mipmapDirs = [
  'mipmap-mdpi',    // 48x48
  'mipmap-hdpi',    // 72x72
  'mipmap-xhdpi',   // 96x96
  'mipmap-xxhdpi',  // 144x144
  'mipmap-xxxhdpi'  // 192x192
];

mipmapDirs.forEach(dir => {
  const dirPath = path.join(androidResDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Размеры иконок для Android
const iconSizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192
};

// Конвертируем SVG в PNG для каждого разрешения
async function convertIcons() {
  try {
    // Используем SVG иконку 192px как основу
    const svgIcon = path.join(iconsDir, 'icon-192.svg');
    
    if (!fs.existsSync(svgIcon)) {
      console.error('SVG icon not found:', svgIcon);
      return;
    }

    for (const [dir, size] of Object.entries(iconSizes)) {
      const outputPath = path.join(androidResDir, dir, 'ic_launcher.png');
      const outputPathRound = path.join(androidResDir, dir, 'ic_launcher_round.png');
      
      await sharp(svgIcon)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      await sharp(svgIcon)
        .resize(size, size)
        .png()
        .toFile(outputPathRound);
      
      console.log(`Created ${outputPath}`);
      console.log(`Created ${outputPathRound}`);
    }
    
    console.log('Icons converted successfully!');
  } catch (error) {
    console.error('Error converting icons:', error);
  }
}

convertIcons();

