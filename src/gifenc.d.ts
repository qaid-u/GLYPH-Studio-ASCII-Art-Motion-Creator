declare module 'gifenc' {
 export function GIFEncoder(): unknown;
 export function quantize(pixels: Uint8ClampedArray, colors: number): number[][];
 export function applyPalette(pixels: Uint8ClampedArray, palette: number[][]): Uint8Array;
}
