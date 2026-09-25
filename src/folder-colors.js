export const folderPalette = [
  ['Blue', '#72a7ff'], ['Purple', '#ac91ff'], ['Pink', '#ec8ac2'],
  ['Coral', '#ed9487'], ['Orange', '#eab16e'], ['Yellow', '#dfce72'],
  ['Green', '#8fca9e'], ['Teal', '#76c7cc']
];
export const isFolderColor = value => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);
export function randomFolderColor() {
  return folderPalette[Math.floor(Math.random() * folderPalette.length)][1];
}
const segments = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
export function folderInitial(title) {
  const initial = [...segments.segment((title || '').trim())][0]?.segment || '?';
  return [...segments.segment(initial.toLocaleUpperCase())][0].segment;
}
export function folderColorBackground(color) {
  // Give both light and dark custom initials a contrasting, softly tinted tile.
  const channels = color.slice(1).match(/../g).map(hex => {
    const value = parseInt(hex, 16) / 255;
    return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
  });
  const luminance = channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
  return `color-mix(in srgb, ${color} 50%, ${luminance > .179 ? '#151515' : '#f4f4f4'})`;
}
