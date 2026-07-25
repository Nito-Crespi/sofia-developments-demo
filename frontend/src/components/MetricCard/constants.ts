export const AmountColor={
    Sofia: '#907232',
    Black: '#000000',
    Green: '#17A588',
    Red: '#D4463B',
} as const;
export type AmountColor = typeof AmountColor[keyof typeof AmountColor];

export const PercentageColor={
    Green: '#17A588',
    Red: '#D4463B',
} as const;
export type PercentageColor = typeof PercentageColor[keyof typeof PercentageColor];

export const DotColor ={
    Sofia: '#907232',
    Green: '#17A588',
    Red: '#D4463B',
} as const;
export type DotColor = typeof DotColor[keyof typeof DotColor];
