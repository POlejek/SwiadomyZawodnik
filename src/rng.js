// Seeded randomness, so a challenge link replays exactly the same version of a situation
// (same cue variants, same side of the pitch, same order of answers).

/** Mulberry32: a tiny, fast PRNG — the same seed always gives the same sequence. */
export function seeded(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const randomSeed = () => Math.floor(Math.random() * 2 ** 31)

export function shuffleWith(list, rand) {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
