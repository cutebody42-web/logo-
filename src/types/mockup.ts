export type ProductType = 
  | 'mug' 
  | 'tshirt' 
  | 'hat'
  | 'tote' 
  | 'phonecase' 
  | 'sticker'
  | 'hoodie'
  | 'tumbler';

export type ProductAngle = 'front' | 'perspective' | 'hanger' | 'flatlay';

export type LightingCondition = 'studio' | 'natural' | 'dramatic' | 'warm';

export type BackgroundScene = 
  | 'white' 
  | 'dark_studio' 
  | 'warm_studio' 
  | 'office_desk' 
  | 'outdoor_sun' 
  | 'urban_concrete' 
  | 'transparent';

export interface ProductColor {
  name: string;
  hex: string;
  textColor: 'light' | 'dark';
}

export interface ProductConfig {
  id: ProductType;
  name: string;
  category: 'Drinkware' | 'Apparel' | 'Headwear' | 'Accessories' | 'Stationery';
  description: string;
  defaultColor: string;
  availableAngles: ProductAngle[];
  availableLighting: LightingCondition[];
  colors: ProductColor[];
  printZone: {
    x: number; // percentage 0-100 center
    y: number; // percentage 0-100 center
    width: number; // percentage
    height: number; // percentage
    curvature?: number; // for cylindrical warping (mugs, tumblers, caps)
  };
}

export type BlendMode = 'normal' | 'multiply' | 'overlay' | 'screen';
export type LogoColorTint = 'original' | 'white' | 'black' | 'gold' | 'silver' | 'custom';

export interface LogoSettings {
  x: number; // offset in px (-150 to 150)
  y: number; // offset in px (-150 to 150)
  scale: number; // 0.15 to 2.5
  rotation: number; // -180 to 180 degrees
  opacity: number; // 0.1 to 1.0
  saturation: number; // 0 to 2.0 (1 = normal, 0 = grayscale, 2 = vibrant)
  brightness: number; // 0.5 to 1.5 (1 = normal)
  contrast: number; // 0.5 to 1.5 (1 = normal)
  blendMode: BlendMode;
  colorTint: LogoColorTint;
  customTintColor?: string;
  removeBgTolerance: number; // 0 to 100 (0 = disabled)
  removeBgColor: 'white' | 'black';
}

export interface SampleLogo {
  id: string;
  name: string;
  category: string;
  svg: string;
}

export interface SavedMockup {
  id: string;
  title: string;
  productType: ProductType;
  productName: string;
  color: string;
  angle: ProductAngle;
  scene: BackgroundScene;
  dataUrl: string;
  createdAt: string;
}

export type ImageResolution = '1K' | '2K' | '4K';
export type AspectRatio = '1:1' | '3:4' | '4:3' | '16:9' | '9:16';
