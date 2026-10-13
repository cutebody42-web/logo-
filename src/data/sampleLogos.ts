import { SampleLogo } from '../types/mockup';

export const SAMPLE_LOGOS: SampleLogo[] = [
  {
    id: 'apex-labs',
    name: 'Apex Labs',
    category: 'Tech & Modern',
    svg: `<svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="apexGrad" x1="20" y1="20" x2="220" y2="220" gradientUnits="userSpaceOnUse">
          <stop stop-color="#3B82F6"/>
          <stop offset="1" stop-color="#8B5CF6"/>
        </linearGradient>
      </defs>
      <rect width="240" height="240" rx="36" fill="transparent"/>
      <path d="M120 35L200 80V160L120 205L40 160V80L120 35Z" stroke="url(#apexGrad)" stroke-width="14" stroke-linejoin="round"/>
      <path d="M120 75L160 100V140L120 165L80 140V100L120 75Z" fill="url(#apexGrad)"/>
      <path d="M120 35V75M200 160L160 140M40 160L80 140" stroke="url(#apexGrad)" stroke-width="8" stroke-linecap="round"/>
      <circle cx="120" cy="120" r="14" fill="#FFFFFF"/>
    </svg>`,
  },
  {
    id: 'roast-craft',
    name: 'Roast & Co.',
    category: 'Café & Artisan',
    svg: `<svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="coffeeGrad" x1="40" y1="40" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop stop-color="#D97706"/>
          <stop offset="1" stop-color="#78350F"/>
        </linearGradient>
      </defs>
      <circle cx="120" cy="120" r="95" stroke="url(#coffeeGrad)" stroke-width="8" stroke-dasharray="8 6"/>
      <circle cx="120" cy="120" r="82" stroke="url(#coffeeGrad)" stroke-width="3"/>
      <path d="M75 110C75 145 95 165 120 165C145 165 165 145 165 110H75Z" fill="url(#coffeeGrad)"/>
      <path d="M165 115C178 115 186 122 186 132C186 142 178 148 165 148" stroke="url(#coffeeGrad)" stroke-width="8" stroke-linecap="round"/>
      <path d="M95 85C95 85 92 72 102 65C112 58 108 45 108 45" stroke="url(#coffeeGrad)" stroke-width="5" stroke-linecap="round"/>
      <path d="M120 85C120 85 117 72 127 65C137 58 133 45 133 45" stroke="url(#coffeeGrad)" stroke-width="5" stroke-linecap="round"/>
      <path d="M145 85C145 85 142 72 152 65C162 58 158 45 158 45" stroke="url(#coffeeGrad)" stroke-width="5" stroke-linecap="round"/>
      <rect x="70" y="172" width="100" height="8" rx="4" fill="url(#coffeeGrad)"/>
      <text x="120" y="208" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="16" letter-spacing="4" fill="url(#coffeeGrad)">ROAST &amp; CO</text>
    </svg>`,
  },
  {
    id: 'tokyo-drift',
    name: 'Neo Streetwear',
    category: 'Streetwear & Apparel',
    svg: `<svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="neonGrad" x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse">
          <stop stop-color="#EC4899"/>
          <stop offset="0.5" stop-color="#F43F5E"/>
          <stop offset="1" stop-color="#F59E0B"/>
        </linearGradient>
      </defs>
      <rect x="25" y="25" width="190" height="190" rx="20" stroke="url(#neonGrad)" stroke-width="8"/>
      <path d="M50 140L100 65H140L90 140H145L125 185H70L95 140H50Z" fill="url(#neonGrad)"/>
      <text x="120" y="222" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="15" letter-spacing="5" fill="url(#neonGrad)">OVERDRIVE</text>
    </svg>`,
  },
  {
    id: 'verdant-botanical',
    name: 'Verdant Flora',
    category: 'Minimal Organic',
    svg: `<svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="leafGrad" x1="50" y1="50" x2="190" y2="190" gradientUnits="userSpaceOnUse">
          <stop stop-color="#10B981"/>
          <stop offset="1" stop-color="#047857"/>
        </linearGradient>
      </defs>
      <circle cx="120" cy="120" r="90" stroke="url(#leafGrad)" stroke-width="6"/>
      <path d="M120 40C120 40 180 85 180 140C180 175 155 195 120 195C85 195 60 175 60 140C60 85 120 40 120 40Z" stroke="url(#leafGrad)" stroke-width="7" fill="none"/>
      <path d="M120 60V180" stroke="url(#leafGrad)" stroke-width="5" stroke-linecap="round"/>
      <path d="M120 95L150 80M120 125L155 110M120 155L145 145" stroke="url(#leafGrad)" stroke-width="5" stroke-linecap="round"/>
      <path d="M120 110L90 95M120 140L85 125M120 170L95 160" stroke="url(#leafGrad)" stroke-width="5" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'summit-outdoors',
    name: 'Summit Co.',
    category: 'Outdoor & Adventure',
    svg: `<svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="summitGrad" x1="30" y1="30" x2="210" y2="210" gradientUnits="userSpaceOnUse">
          <stop stop-color="#0284C7"/>
          <stop offset="1" stop-color="#0F172A"/>
        </linearGradient>
      </defs>
      <polygon points="120,30 215,195 25,195" stroke="url(#summitGrad)" stroke-width="10" stroke-linejoin="round" fill="none"/>
      <polygon points="120,65 170,165 70,165" fill="url(#summitGrad)"/>
      <polygon points="120,65 100,105 140,105" fill="#FFFFFF"/>
      <path d="M60 195L95 140L125 175L145 150L180 195" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
      <text x="120" y="224" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="14" letter-spacing="4" fill="url(#summitGrad)">WILDERNESS</text>
    </svg>`,
  },
  {
    id: 'zenith-geometric',
    name: 'Zenith Studio',
    category: 'Geometric Emblem',
    svg: `<svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="120" cy="120" r="90" fill="#18181B"/>
      <circle cx="120" cy="120" r="82" stroke="#F59E0B" stroke-width="4"/>
      <polygon points="120,55 175,150 65,150" stroke="#F59E0B" stroke-width="6" stroke-linejoin="round" fill="none"/>
      <polygon points="120,185 65,90 175,90" stroke="#F59E0B" stroke-width="6" stroke-linejoin="round" fill="none"/>
      <circle cx="120" cy="120" r="16" fill="#F59E0B"/>
    </svg>`,
  },
];

export function svgToDataUrl(svg: string): string {
  const cleanSvg = svg.trim();
  return `data:image/svg+xml;utf8,${encodeURIComponent(cleanSvg)}`;
}
