import { cn } from '@/lib/utils';

type DividerShape = 'wave' | 'diagonal' | 'curve';
type DividerColor = 'gold' | 'navy' | 'off-white' | 'white' | 'burgundy';

// Combined transition variants map to { color, flip }
type CombinedVariant =
  | 'navy-to-white'
  | 'navy-to-offwhite'
  | 'white-to-navy'
  | 'white-to-offwhite'
  | 'offwhite-to-navy'
  | 'offwhite-to-white'
  | 'white-to-burgundy'
  | 'burgundy-to-white'
  | 'burgundy-to-offwhite';

type DividerVariant = DividerShape | CombinedVariant;

interface SectionDividerProps {
  variant?: DividerVariant;
  color?: DividerColor;
  flip?: boolean;
  className?: string;
}

const colorMap: Record<DividerColor, string> = {
  gold: 'text-gold/10',
  navy: 'text-[#1A2B45]',
  'off-white': 'text-[#F8F9FA]',
  white: 'text-white',
  burgundy: 'text-[#80182A]',
};

const combinedVariantMap: Record<CombinedVariant, { color: DividerColor; flip: boolean }> = {
  'navy-to-white': { color: 'white', flip: false },
  'navy-to-offwhite': { color: 'off-white', flip: false },
  'white-to-navy': { color: 'navy', flip: false },
  'white-to-offwhite': { color: 'off-white', flip: false },
  'offwhite-to-navy': { color: 'navy', flip: false },
  'offwhite-to-white': { color: 'white', flip: false },
  'white-to-burgundy': { color: 'burgundy', flip: false },
  'burgundy-to-white': { color: 'white', flip: false },
  'burgundy-to-offwhite': { color: 'off-white', flip: false },
};

const isCombinedVariant = (v: DividerVariant): v is CombinedVariant =>
  v in combinedVariantMap;

export default function SectionDivider({
  variant = 'wave',
  color: colorProp = 'off-white',
  flip: flipProp = false,
  className,
}: SectionDividerProps) {
  let shape: DividerShape = 'wave';
  let color = colorProp;
  let flip = flipProp;

  if (isCombinedVariant(variant)) {
    const mapped = combinedVariantMap[variant];
    color = mapped.color;
    flip = mapped.flip;
    shape = 'wave';
  } else {
    shape = variant;
  }

  return (
    <div className={cn('w-full overflow-hidden leading-none -mt-1', flip && 'rotate-180', className)}>
      <svg
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        className={cn('w-full h-10 md:h-14 lg:h-20', colorMap[color])}
        aria-hidden="true"
      >
        {shape === 'wave' && (
          <path
            d="M0,40 C200,80 400,0 600,40 C800,80 1000,0 1200,40 L1200,80 L0,80 Z"
            fill="currentColor"
          />
        )}
        {shape === 'curve' && (
          <path
            d="M0,60 Q600,0 1200,60 L1200,80 L0,80 Z"
            fill="currentColor"
          />
        )}
        {shape === 'diagonal' && (
          <path
            d="M0,0 L1200,60 L1200,80 L0,80 Z"
            fill="currentColor"
          />
        )}
      </svg>
    </div>
  );
}
