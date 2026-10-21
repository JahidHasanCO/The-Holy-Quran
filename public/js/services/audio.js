/** Ayah-by-ayah recitation audio (EveryAyah.com). */
const pad = (n) => String(n).padStart(3, '0');

export const RECITERS = [
  { id: 'alafasy', name: 'Mishary Rashid Alafasy', folder: 'Alafasy_128kbps' },
  { id: 'husary', name: 'Mahmoud Khalil Al-Husary', folder: 'Husary_128kbps' },
  { id: 'minshawi', name: 'Mohamed Siddiq Al-Minshawi', folder: 'Minshawy_Murattal_128kbps' },
  { id: 'abdulbasit', name: 'Abdul Basit (Murattal)', folder: 'Abdul_Basit_Murattal_64kbps' },
  { id: 'sudais', name: 'Abdur-Rahman As-Sudais', folder: 'Abdurrahmaan_As-Sudais_192kbps' },
];

export const SPEEDS = [1, 1.25, 1.5, 0.75];

export function ayahAudioUrl(reciterId, key) {
  const reciter = RECITERS.find((r) => r.id === reciterId) ?? RECITERS[0];
  const [surah, ayah] = key.split(':');
  return `https://everyayah.com/data/${reciter.folder}/${pad(surah)}${pad(ayah)}.mp3`;
}

export class AyahAudio {
  #el = new Audio();

  /** @param {{ onPlaying(playing: boolean): void, onProgress(fraction: number): void, onEnded(): void, onError(): void }} handlers */
  constructor({ onPlaying, onProgress, onEnded, onError }) {
    this.#el.preload = 'auto';
    this.#el.addEventListener('play', () => onPlaying(true));
    this.#el.addEventListener('pause', () => onPlaying(false));
    this.#el.addEventListener('timeupdate', () => {
      if (this.#el.duration > 0) onProgress(this.#el.currentTime / this.#el.duration);
    });
    this.#el.addEventListener('ended', onEnded);
    this.#el.addEventListener('error', onError);
  }

  load({ reciter, key, speed }) {
    this.#el.src = ayahAudioUrl(reciter, key);
    this.#el.playbackRate = speed;
    return this.#el.play().catch(() => {});
  }

  resume() { return this.#el.play().catch(() => {}); }
  pause() { this.#el.pause(); }
  setSpeed(speed) { this.#el.playbackRate = speed; }

  stop() {
    this.#el.pause();
    this.#el.removeAttribute('src');
    this.#el.load();
  }
}
