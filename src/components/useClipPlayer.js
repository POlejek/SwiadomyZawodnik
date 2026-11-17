import { useEffect, useRef, useState } from 'react'

/**
 * Plays a clip in real time and returns the current clip time.
 * `playKey` restarts playback; `hold` keeps the last frame (and its captions) on screen before `onEnd`.
 */
export function useClipPlayer(clip, { active, playKey, speed = 1, hold = 0, onEnd }) {
  const [t, setT] = useState(0)
  const onEndRef = useRef(onEnd)
  onEndRef.current = onEnd
  const skipRef = useRef(() => {})

  useEffect(() => {
    if (!active) return undefined
    if (!clip) {
      onEndRef.current?.()
      return undefined
    }
    let raf = 0
    let start = null
    let done = false
    setT(0)
    const finish = () => {
      if (done) return
      done = true
      cancelAnimationFrame(raf)
      setT(clip.duration)
      onEndRef.current?.()
    }
    skipRef.current = finish
    const tick = (now) => {
      if (done) return
      if (start === null) start = now
      const time = ((now - start) / 1000) * speed
      if (time >= clip.duration + hold) {
        finish()
        return
      }
      setT(time)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      done = true
      cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, playKey])

  return { t, skip: () => skipRef.current() }
}
