import sharp from 'sharp'

// SVG assets with brand correct design:
// - dark warm background #0c0a09, rounded corners
// - "AI" in serif with color #f2ede8
// - red dot #e84a2e as accent

const svg192 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
  <rect width="192" height="192" rx="40" fill="#0c0a09"/>
  <text x="96" y="105" font-family="Georgia, serif" font-size="64" font-weight="700" fill="#f2ede8" text-anchor="middle" dominant-baseline="middle">AI</text>
  <circle cx="150" cy="50" r="14" fill="#e84a2e"/>
</svg>`

const svg512 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="100" fill="#0c0a09"/>
  <text x="256" y="275" font-family="Georgia, serif" font-size="170" font-weight="700" fill="#f2ede8" text-anchor="middle" dominant-baseline="middle">AI</text>
  <circle cx="400" cy="130" r="38" fill="#e84a2e"/>
</svg>`

const svgApple = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
  <rect width="180" height="180" rx="36" fill="#0c0a09"/>
  <text x="90" y="98" font-family="Georgia, serif" font-size="60" font-weight="700" fill="#f2ede8" text-anchor="middle" dominant-baseline="middle">AI</text>
  <circle cx="140" cy="46" r="13" fill="#e84a2e"/>
</svg>`

async function gen() {
  await sharp(Buffer.from(svg192)).resize(192, 192).png().toFile('public/icon-192.png')
  console.log('Generated public/icon-192.png')
  await sharp(Buffer.from(svg512)).resize(512, 512).png().toFile('public/icon-512.png')
  console.log('Generated public/icon-512.png')
  await sharp(Buffer.from(svgApple)).resize(180, 180).png().toFile('public/apple-touch-icon.png')
  console.log('Generated public/apple-touch-icon.png')
  console.log('Icons generated ✓')
}

gen().catch(err => { console.error(err); process.exit(1) })
