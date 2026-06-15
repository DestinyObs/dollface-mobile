import { Dimensions, Platform } from 'react-native';

/**
 * Responsive scaling against a 393pt baseline (iPhone 14 Pro).
 * On web the preview is locked to 393, so rs() is identity there;
 * on native it scales fixed dimensions to the real device width
 * so layouts don't clip on smaller phones or look tiny on larger ones.
 */
const BASE_W = 393;

const screenW = Platform.OS === 'web' ? BASE_W : Dimensions.get('window').width;

// Clamp the scale so very large/small devices stay reasonable.
const factor = Math.min(Math.max(screenW / BASE_W, 0.85), 1.15);

export function rs(size: number) {
  return Math.round(size * factor * 100) / 100;
}

export const SCREEN_W = screenW;
