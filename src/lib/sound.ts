import type { VocabWord } from "@/types/vocabulary";

/**
 * Web Audio Context singleton (lazy-initialized upon first user interaction)
 */
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    void audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a crystal-clear pleasant success chime (major triad chord: C5 -> E5 -> G5)
 */
export function playSuccessSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [
    { freq: 523.25, start: 0, dur: 0.2 }, // C5
    { freq: 659.25, start: 0.08, dur: 0.22 }, // E5
    { freq: 783.99, start: 0.16, dur: 0.35 }, // G5
    { freq: 1046.5, start: 0.22, dur: 0.45 }, // C6
  ];

  notes.forEach(({ freq, start, dur }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + start);

    gain.gain.setValueAtTime(0, now + start);
    gain.gain.linearRampToValueAtTime(0.18, now + start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + start);
    osc.stop(now + start + dur);
  });
}

/**
 * Play a clear, gentle incorrect buzzer tone (low two-step descent)
 */
export function playErrorSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [
    { freq: 240, start: 0, dur: 0.15 },
    { freq: 180, start: 0.14, dur: 0.25 },
  ];

  notes.forEach(({ freq, start, dur }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now + start);

    gain.gain.setValueAtTime(0, now + start);
    gain.gain.linearRampToValueAtTime(0.2, now + start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + start);
    osc.stop(now + start + dur);
  });
}

/**
 * Pronounce an English text using browser Web Speech API (fallback if no audio URL)
 */
export function speakWithTTS(text: string, accent: "us" | "uk" = "us") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = accent === "uk" ? "en-GB" : "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  } catch {
    // ignore
  }
}

/**
 * Pronounce a vocabulary word, prioritizing audio URL and falling back to Web Speech API
 */
export function pronounceWord(
  word: Pick<VocabWord, "headword" | "audioUsUrl" | "audioUkUrl">,
  accent: "us" | "uk" = "us",
) {
  if (typeof window === "undefined") return;

  const url =
    accent === "uk"
      ? word.audioUkUrl || word.audioUsUrl
      : word.audioUsUrl || word.audioUkUrl;

  if (url) {
    const audio = new Audio(url);
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        speakWithTTS(word.headword, accent);
      });
    }
  } else {
    speakWithTTS(word.headword, accent);
  }
}

/**
 * Play feedback sound (correct/incorrect) followed by word pronunciation after a short delay
 */
export function playResultFeedback(
  word: Pick<VocabWord, "headword" | "audioUsUrl" | "audioUkUrl">,
  correct: boolean,
  accent: "us" | "uk" = "us",
  delayMs = 420,
) {
  if (correct) {
    playSuccessSound();
  } else {
    playErrorSound();
  }

  // Pronounce the word right after the notification sound completes
  setTimeout(() => {
    pronounceWord(word, accent);
  }, delayMs);
}
