// Sounds synthesised with the Web Audio API (no audio files to download) and read-aloud via speech synthesis.
// Everything fails silently: no audio support, or a browser that blocks it, must never break the game.

let ctx = null
let enabled = true

export function setSoundEnabled(on) {
  enabled = on
  if (!on) stopSpeaking()
}

/** Call from a click/tap: browsers (iOS above all) only allow audio started by the player. */
export function unlockAudio() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    if (!ctx) ctx = new AC()
    if (ctx.state === 'suspended') ctx.resume()
  } catch {
    /* no audio */
  }
}

function tone(c, { type = 'sine', from, to = from, start = 0, dur, gain = 0.2, vibrato = 0 }) {
  const t0 = c.currentTime + start
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(from, t0)
  osc.frequency.exponentialRampToValueAtTime(to, t0 + dur)
  if (vibrato) {
    const lfo = c.createOscillator()
    const depth = c.createGain()
    lfo.frequency.value = 28
    depth.gain.value = vibrato
    lfo.connect(depth).connect(osc.frequency)
    lfo.start(t0)
    lfo.stop(t0 + dur)
  }
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g).connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

function noise(c, { start = 0, dur, freq, q = 0.7, gain = 0.3, attack = 0.25, type = 'bandpass' }) {
  const t0 = c.currentTime + start
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const src = c.createBufferSource()
  src.buffer = buf
  const f = c.createBiquadFilter()
  f.type = type
  f.frequency.value = freq
  f.Q.value = q
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  src.connect(f).connect(g).connect(c.destination)
  src.start(t0)
}

const SOUNDS = {
  whistle: (c) => tone(c, { type: 'sine', from: 2900, dur: 0.45, gain: 0.12, vibrato: 140 }),
  goalFor: (c) => {
    noise(c, { dur: 2.2, freq: 1000, gain: 0.35, attack: 0.3 })
    tone(c, { from: 523, start: 0.05, dur: 0.18, gain: 0.12 })
    tone(c, { from: 784, start: 0.2, dur: 0.3, gain: 0.12 })
  },
  goalAgainst: (c) => {
    noise(c, { dur: 1.2, freq: 450, gain: 0.25, attack: 0.15, type: 'lowpass' })
    tone(c, { type: 'triangle', from: 330, to: 140, dur: 0.7, gain: 0.15 })
  },
  good: (c) => {
    tone(c, { from: 880, dur: 0.14, gain: 0.12 })
    tone(c, { from: 1320, start: 0.12, dur: 0.22, gain: 0.12 })
  },
  mid: (c) => tone(c, { type: 'triangle', from: 520, to: 440, dur: 0.3, gain: 0.12 }),
  bad: (c) => tone(c, { type: 'triangle', from: 180, to: 110, dur: 0.35, gain: 0.18 }),
}

export function playSound(name) {
  if (!enabled || !ctx || !SOUNDS[name]) return
  try {
    if (ctx.state === 'suspended') ctx.resume()
    SOUNDS[name](ctx)
  } catch {
    /* ignore */
  }
}

/** A short buzz on phones that support it (Android). */
export function buzz(ms = 60) {
  if (!enabled) return
  try {
    navigator.vibrate?.(ms)
  } catch {
    /* ignore */
  }
}

export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window

export function speak(text) {
  if (!canSpeak()) return
  try {
    window.speechSynthesis.cancel()
    const u = new window.SpeechSynthesisUtterance(text)
    u.lang = 'pl-PL'
    u.rate = 0.95
    const voice = window.speechSynthesis.getVoices().find((v) => v.lang?.toLowerCase().startsWith('pl'))
    if (voice) u.voice = voice
    window.speechSynthesis.speak(u)
  } catch {
    /* ignore */
  }
}

export function stopSpeaking() {
  try {
    if (canSpeak()) window.speechSynthesis.cancel()
  } catch {
    /* ignore */
  }
}
