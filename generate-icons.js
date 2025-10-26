const fs = require('fs');
const path = require('path');

// Создаем простой SVG для иконки бутылочки
const createBottleIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bottleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ee5a6f;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="url(#bottleGradient)"/>
  <g transform="translate(${size/2},${size/2})">
    <!-- Горлышко бутылки -->
    <rect x="-${size*0.08}" y="-${size*0.35}" width="${size*0.16}" height="${size*0.3}"
          fill="#ffffff" rx="${size*0.08}"/>
    <!-- Тело бутылки -->
    <ellipse cx="0" cy="${size*0.05}" rx="${size*0.18}" ry="${size*0.3}"
             fill="#ffffff"/>
    <!-- Блик -->
    <ellipse cx="${size*0.08}" cy="-${size*0.1}" rx="${size*0.06}" ry="${size*0.15}"
             fill="#ffffff" opacity="0.5"/>
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
  'icon-1024.svg': 1024,
  'icon-512.svg': 512,
  'icon-192.svg': 192,
  'icon-48.svg': 48
};

Object.entries(sizes).forEach(([filename, size]) => {
  const svg = createBottleIcon(size);
  fs.writeFileSync(path.join(iconsDir, filename), svg);
  console.log(`Created ${filename}`);
});

console.log('Icons generated successfully!');
