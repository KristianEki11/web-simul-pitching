const path = require('path');
const fs = require('fs');
const puppeteer = require('C:/Users/KristianEki/AppData/Roaming/npm/node_modules/puppeteer');

async function exportBadges() {
  const baseDir = path.join(__dirname, 'badges');
  const darkDir = path.join(baseDir, 'dark');
  const lightDir = path.join(baseDir, 'light');

  fs.mkdirSync(darkDir, { recursive: true });
  fs.mkdirSync(lightDir, { recursive: true });

  console.log('Launching Puppeteer browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1400,
    height: 900,
    deviceScaleFactor: 3 // High-DPI 3x resolution for crystal clear pitch decks
  });

  const filePath = 'file:///' + path.join(__dirname, 'badges-export.html').replace(/\\/g, '/');
  console.log('Navigating to:', filePath);
  await page.goto(filePath, { waitUntil: 'networkidle0' });

  // Wait for Google Fonts to be ready
  await page.evaluateHandle('document.fonts.ready');
  // Small wait for SVG icons to render
  await new Promise(r => setTimeout(r, 1000));

  const badgeIds = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.badge-item')).map(el => el.id);
  });

  console.log(`Found ${badgeIds.length} badges to export:`);

  for (const id of badgeIds) {
    const element = await page.$(`#${id}`);
    if (!element) continue;

    const isLight = id.startsWith('light-');
    const folder = isLight ? lightDir : darkDir;
    const filename = `${id}.png`;
    const outputPath = path.join(folder, filename);

    await element.screenshot({
      path: outputPath,
      omitBackground: true // True transparent background!
    });

    console.log(`✓ Exported: ${path.relative(__dirname, outputPath)}`);
  }

  await browser.close();
  console.log('All badges exported successfully!');
}

exportBadges().catch(err => {
  console.error('Error exporting badges:', err);
  process.exit(1);
});
