import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Obtener la raíz del proyecto (un nivel arriba de scripts/)
const projectRoot = path.resolve(__dirname, '..');

// Leer el index.html compilado
const staticIndexPath = path.join(projectRoot, 'src/main/resources/static/index.html');
const templatePath = path.join(projectRoot, 'src/main/resources/templates/view/react-app.html');

if (!fs.existsSync(staticIndexPath)) {
  console.log('⚠️  No se encontró index.html compilado. Ejecuta: npm run build');
  process.exit(0);
}

const staticHtml = fs.readFileSync(staticIndexPath, 'utf-8');

// Extraer las referencias CSS y JS
const cssMatch = staticHtml.match(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/);
const jsMatch = staticHtml.match(/<script[^>]*type="module"[^>]*src="([^"]+)"/);

if (!cssMatch || !jsMatch) {
  console.log('⚠️  No se encontraron referencias CSS o JS en index.html');
  process.exit(1);
}

const cssPath = cssMatch[1];
const jsPath = jsMatch[1];

// Leer el template actual
let template = fs.readFileSync(templatePath, 'utf-8');

// Actualizar las referencias
template = template.replace(
  /<link[^>]*rel="stylesheet"[^>]*href="[^"]*"[^>]*>/,
  `<link rel="stylesheet" crossorigin href="${cssPath}" th:href="@{${cssPath}}">`
);

template = template.replace(
  /<script[^>]*type="module"[^>]*src="[^"]*"[^>]*><\/script>/,
  `<script type="module" crossorigin src="${jsPath}" th:src="@{${jsPath}}"></script>`
);

// Guardar el template actualizado
fs.writeFileSync(templatePath, template, 'utf-8');

console.log('✅ Template actualizado correctamente:');
console.log(`   CSS: ${cssPath}`);
console.log(`   JS: ${jsPath}`);

