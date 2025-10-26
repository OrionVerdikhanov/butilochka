const fs = require('fs');
const path = require('path');

// Создаем профессиональную SVG иконку бутылочки
const createPremiumBottleIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ff8787;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#ff6b6b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#d63447;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="bottle${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.95" />
      <stop offset="50%" style="stop-color:#ffe8e8;stop-opacity:0.9" />
      <stop offset="100%" style="stop-color:#ffd4d4;stop-opacity:0.85" />
    </linearGradient>
    <radialGradient id="glow${size}" cx="50%" cy="50%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.6" />
      <stop offset="70%" style="stop-color:#ffffff;stop-opacity:0.2" />
      <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0" />
    </radialGradient>
  </defs>

  <!-- Фон -->
  <rect width="${size}" height="${size}" fill="url(#bg${size})" rx="${size * 0.22}"/>

  <!-- Свечение -->
  <circle cx="${size/2}" cy="${size/2}" r="${size * 0.4}" fill="url(#glow${size})"/>

  <!-- Бутылочка -->
  <g transform="translate(${size/2},${size/2})">
    <!-- Горлышко -->
    <rect x="-${size*0.08}" y="-${size*0.35}" width="${size*0.16}" height="${size*0.3}"
          fill="url(#bottle${size})" rx="${size*0.08}"/>
    <!-- Тело -->
    <ellipse cx="0" cy="${size*0.05}" rx="${size*0.18}" ry="${size*0.3}"
             fill="url(#bottle${size})"/>
    <!-- Блик 1 -->
    <ellipse cx="${size*0.08}" cy="-${size*0.1}" rx="${size*0.06}" ry="${size*0.15}"
             fill="#ffffff" opacity="0.6"/>
    <!-- Блик 2 -->
    <circle cx="-${size*0.05}" cy="${size*0.08}" r="${size*0.04}"
            fill="#ffffff" opacity="0.5"/>
    <!-- Блик 3 -->
    <circle cx="${size*0.1}" cy="${size*0.12}" r="${size*0.03}"
            fill="#ffffff" opacity="0.7"/>
  </g>
</svg>
`;

// Создаем папку для иконок
const iconsDir = path.join(__dirname, 'assets', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Генерируем иконки разных размеров
const sizes = {
  'icon-premium-1024.svg': 1024,
  'icon-premium-512.svg': 512,
  'icon-premium-256.svg': 256,
  'icon-premium-192.svg': 192,
  'icon-premium-144.svg': 144,
  'icon-premium-96.svg': 96,
  'icon-premium-72.svg': 72,
  'icon-premium-48.svg': 48,
};

Object.entries(sizes).forEach(([filename, size]) => {
  const svg = createPremiumBottleIcon(size);
  fs.writeFileSync(path.join(iconsDir, filename), svg);
  console.log(`Created ${filename}`);
});

console.log('\n✨ Premium icons generated successfully!');
console.log('\nNext steps:');
console.log('1. Use https://cloudconvert.com/svg-to-png to convert SVG to PNG');
console.log('2. Or use ImageMagick: convert icon-premium-1024.svg icon.png');
console.log('3. Place PNG icons in android/app/src/main/res/mipmap-* folders');
