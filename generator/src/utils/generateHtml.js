export function generateHTML(templateStr, state) {
  let html = templateStr;
  
  const themeColors = {
    rose: {
      blush: {
        50: '#fdf2f8', 100: '#fce7f3', 200: '#fbcfe8', 300: '#f9a8d4', 400: '#f472b6',
        500: '#ec4899', 600: '#db2777', 700: '#be185d', 800: '#9d174d', 900: '#831843'
      },
      gold: {
        300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309'
      }
    },
    emerald: {
      blush: { 
        50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399',
        500: '#10b981', 600: '#059669', 700: '#047857', 800: '#065f46', 900: '#064e3b'
      },
      gold: {
        300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309'
      }
    },
    sapphire: {
      blush: {
        50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa',
        500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a'
      },
      gold: {
        300: '#e5e7eb', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151'
      }
    }
  };

  function hexToRgb(h) {
    h = h || '#000000';
    const hex = h.replace('#', '');
    const r = parseInt(hex.length === 3 ? hex[0]+hex[0] : hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.length === 3 ? hex[1]+hex[1] : hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.length === 3 ? hex[2]+hex[2] : hex.substring(4, 6), 16) || 0;
    return {r, g, b};
  }

  function mix(c1, c2, weight) {
    const w = weight / 100;
    const r = Math.round(c1.r * w + c2.r * (1 - w));
    const g = Math.round(c1.g * w + c2.g * (1 - w));
    const b = Math.round(c1.b * w + c2.b * (1 - w));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  function getPalette(hex) {
    const rgb = hexToRgb(hex);
    const white = {r: 255, g: 255, b: 255};
    const black = {r: 0, g: 0, b: 0};
    return {
      50: mix(rgb, white, 10),
      100: mix(rgb, white, 20),
      200: mix(rgb, white, 40),
      300: mix(rgb, white, 60),
      400: mix(rgb, white, 80),
      500: hex,
      600: mix(rgb, black, 80),
      700: mix(rgb, black, 60),
      800: mix(rgb, black, 40),
      900: mix(rgb, black, 20),
    };
  }

  let selectedTheme = themeColors[state.theme] || themeColors.rose;
  if (state.theme === 'custom') {
      selectedTheme = {
          blush: getPalette(state.customPrimary || '#ec4899'),
          gold: getPalette(state.customSecondary || '#f59e0b')
      };
  }

  // Replace hardcoded colors in HTML string for SVG and CSS
  // The new template is based on the Sapphire theme, so its base colors are:
  // Blush: #3b82f6 (500), #60a5fa (400), #1d4ed8 (700), #1e40af (800)
  // Gold: #6b7280 (500), #4b5563 (600)
  html = html.replaceAll('#3b82f6', selectedTheme.blush[500]);
  html = html.replaceAll('#60a5fa', selectedTheme.blush[400]);
  html = html.replaceAll('#1d4ed8', selectedTheme.blush[700]);
  html = html.replaceAll('#1e40af', selectedTheme.blush[800]);
  html = html.replaceAll('#6b7280', selectedTheme.gold[500]);
  html = html.replaceAll('#4b5563', selectedTheme.gold[600]);

  const fontFamily = state.fontFamily || 'Amiri';
  const tailwindOverride = `
    <link href="https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script>
        if(window.tailwind) {
            window.tailwind.config.theme.extend.colors.blush = ${JSON.stringify(selectedTheme.blush)};
            window.tailwind.config.theme.extend.colors.gold = ${JSON.stringify(selectedTheme.gold)};
            window.tailwind.config.theme.extend.fontFamily = {
                serif: ['"${fontFamily}"', 'serif'],
                sans: ['"${fontFamily}"', 'sans-serif'],
            };
        }
    </script>
  `;
  
  html = html.replace('</head>', `${tailwindOverride}\n</head>`);

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const nameEls = doc.querySelectorAll('h1.font-serif');
  if(nameEls.length > 0) {
      nameEls[0].innerHTML = state.names.join(' <span class="text-gold-500 mx-2">&amp;</span> ');
      
      if (nameEls[0].previousElementSibling && state.heroTopText) {
          nameEls[0].previousElementSibling.textContent = state.heroTopText;
      }
      
      if (nameEls[0].nextElementSibling && state.heroBottomText) {
          nameEls[0].nextElementSibling.textContent = state.heroBottomText;
      }
      
      const dateCard = nameEls[0].nextElementSibling?.nextElementSibling;
      if (dateCard && state.eventDate) {
          const dateObj = new Date(state.eventDate);
          if (!isNaN(dateObj.getTime())) {
              const daysAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
              const monthsAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
              
              const spans = dateCard.querySelectorAll('span');
              if (spans.length >= 3) {
                  spans[0].textContent = daysAr[dateObj.getDay()];
                  spans[2].textContent = `${dateObj.getDate()} ${monthsAr[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
              }
          }
      }
  }
  
  doc.title = `دعوة ${state.names.join(' و ')}`;

  // Hero Icon
  const heroIconContainer = doc.querySelector('.animate-float');
  if (heroIconContainer && state.heroIcon) {
      const iconVal = state.heroIcon.trim();
      if (iconVal.startsWith('http') || iconVal.startsWith('data:')) {
          heroIconContainer.innerHTML = `<img src="${iconVal}" class="w-20 h-20 opacity-80 object-contain" />`;
      } else if (iconVal.startsWith('<svg')) {
          heroIconContainer.innerHTML = iconVal;
      } else {
          heroIconContainer.innerHTML = `<span class="text-6xl inline-block opacity-80">${iconVal}</span>`;
      }
  }

  const scripts = doc.querySelectorAll('script');
  scripts.forEach(script => {
      if(script.textContent.includes("const targetDate =") || script.textContent.includes("const weddingDate =")) {
          // Replace countdown date
          script.textContent = script.textContent.replace(
              /const (targetDate|weddingDate) = new Date\('.*?'\)\.getTime\(\);/,
              `const $1 = new Date('${state.eventDate}').getTime();`
          );
      }
  });

  if (state.heroBgImage) {
      const heroSec = doc.querySelector('#main-content section:nth-of-type(1) .hero-bg-pan');
      if (heroSec) heroSec.style.backgroundImage = `url('${state.heroBgImage}')`;
  }
  if (state.countdownBgImage) {
      const countdownSec = doc.querySelector('#main-content section:nth-of-type(2) .hero-bg-pan');
      if (countdownSec) countdownSec.style.backgroundImage = `url('${state.countdownBgImage}')`;
  }
  if (state.timelineBgImage) {
      const timelineSec = doc.querySelector('#main-content section:nth-of-type(3) .hero-bg-pan');
      if (timelineSec) timelineSec.style.backgroundImage = `url('${state.timelineBgImage}')`;
  }

  if (state.envelopeLeft) {
      const leftPanel = doc.querySelector('.left-panel');
      if (leftPanel) leftPanel.src = state.envelopeLeft;
  }
  if (state.envelopeRight) {
      const rightPanel = doc.querySelector('.right-panel');
      if (rightPanel) rightPanel.src = state.envelopeRight;
  }
  if (state.seal) {
      const sealImg = doc.querySelector('.seal-container img');
      if (sealImg) {
          sealImg.src = state.seal;
      }
  }

  // Timeline Section Title
  const timelineTitleEl = doc.querySelector('#timeline h2');
  if (timelineTitleEl && state.timelineSectionTitle) {
      timelineTitleEl.textContent = state.timelineSectionTitle;
  }

  // Timeline Events
  const timelineContainer = doc.querySelector('#timeline .border-r-2.border-gold-200');
  if (timelineContainer && state.events && state.events.length > 0) {
      // Find all direct child event blocks (they have class 'relative pr-8...')
      const eventBlocks = timelineContainer.querySelectorAll(':scope > div.relative');
      
      if (eventBlocks.length >= 2) {
          // Keep references to the original first and second blocks as templates
          const oddTemplate = eventBlocks[0].cloneNode(true);
          const evenTemplate = eventBlocks[1].cloneNode(true);
          
          // Clear out the existing hardcoded events
          timelineContainer.innerHTML = '';
          
          state.events.forEach((evt, idx) => {
              // Alternate block styles (left / right on the timeline)
              const block = idx % 2 === 0 ? oddTemplate.cloneNode(true) : evenTemplate.cloneNode(true);
              
              // Time Text — lives in a <span> with class text-blush-400
              const timeEl = block.querySelector('span.text-blush-400') || block.querySelector('span');
              if (timeEl) timeEl.textContent = evt.timeText;

              // Icon
              const iconContainer = block.querySelector('.text-gold-500');
              if (iconContainer && evt.icon) {
                  const iconVal = evt.icon.trim();
                  if (iconVal.startsWith('http') || iconVal.startsWith('data:')) {
                      iconContainer.innerHTML = `<img src="${iconVal}" class="w-12 h-12 object-contain" />`;
                  } else if (iconVal.startsWith('<svg')) {
                      iconContainer.innerHTML = iconVal;
                  } else {
                      iconContainer.innerHTML = `<span class="text-4xl inline-block">${iconVal}</span>`;
                  }
              }

              
              // Title — in an <h3>
              const titleEl = block.querySelector('h3');
              if (titleEl) titleEl.textContent = evt.title;
              
              // Location Name — in a <p>
              const locEl = block.querySelector('p');
              if (locEl) locEl.textContent = evt.location;
              
              // Map Button
              const mapBtn = block.querySelector('button[onclick^="openMap"]');
              if (mapBtn) {
                  mapBtn.setAttribute('onclick', `openMap('${evt.title.replace(/'/g, "\\'")}', ${evt.lat}, ${evt.lng})`);
              }
              
              timelineContainer.appendChild(block);
          });
      }
  }

  // Countdown Section
  const countdownTitleEl = doc.querySelector('#countdown h2');
  if (countdownTitleEl && state.countdownTitle) {
      countdownTitleEl.textContent = state.countdownTitle;
  }
  const countdownTextEl = doc.querySelector('#countdown p');
  if (countdownTextEl && state.countdownText) {
      countdownTextEl.textContent = state.countdownText;
  }

  // Closing Section
  const closingTitleEl = doc.querySelector('section.bg-blush-50 h2');
  if (closingTitleEl && state.closingTitle) {
      closingTitleEl.textContent = state.closingTitle;
  }
  const closingTextEls = doc.querySelectorAll('section.bg-blush-50 p');
  if (closingTextEls.length > 0 && state.closingText) {
      closingTextEls[0].textContent = state.closingText;
  }
  if (closingTextEls.length > 1 && state.footerText) {
      closingTextEls[1].textContent = state.footerText;
  }

  // Closing Icon
  const closingImg = doc.querySelector('.animate-pulse-slow');
  if (closingImg && state.closingIcon) {
      const parent = closingImg.parentElement;
      const iconVal = state.closingIcon.trim();
      if (iconVal.startsWith('http') || iconVal.startsWith('data:')) {
          parent.innerHTML = `<img src="${iconVal}" class="w-12 h-12 opacity-80 animate-pulse-slow object-contain" />`;
      } else if (iconVal.startsWith('<svg')) {
          parent.innerHTML = `<div class="animate-pulse-slow opacity-80">${iconVal}</div>`;
      } else {
          parent.innerHTML = `<span class="text-5xl inline-block animate-pulse-slow opacity-80">${iconVal}</span>`;
      }
  }

  if (state.closingBgImage) {
      const closingSec = doc.querySelector('section.bg-blush-50');
      if (closingSec) {
          closingSec.style.backgroundImage = `url('${state.closingBgImage}')`;
          closingSec.style.backgroundSize = 'cover';
          closingSec.style.backgroundPosition = 'center';
      }
  }

  return "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
}
