import { Component, Suspense, createContext, lazy, useContext } from 'react'
import Pitch from './Pitch'

const Pitch3D = lazy(() => import('./Pitch3D'))

/** Which view the player picked ('3d' | '2d') and how to change it. Provided by App. */
export const ViewContext = createContext({ view: '2d', setView: () => {} })

let webgl
/** True when the browser can draw 3D (WebGL). Checked once. */
export function canDraw3D() {
  if (webgl !== undefined) return webgl
  try {
    if (typeof window === 'undefined' || typeof WebGLRenderingContext === 'undefined') return (webgl = false)
    const c = document.createElement('canvas')
    webgl = Boolean(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    webgl = false
  }
  return webgl
}

/** If the 3D view fails for any reason, the 2D board takes over. */
class Fallback extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/** The pitch in the view the player picked, with a switch between "3D: your eyes" and "2D: from above". */
export default function PitchView(props) {
  const { view, setView } = useContext(ViewContext)
  const can3d = canDraw3D()
  const use3d = can3d && view === '3d'
  const flat = <Pitch {...props} />
  return (
    <div className="relative">
      {use3d ? (
        <Fallback fallback={flat}>
          <Suspense fallback={<div className={`pitch3d ${props.className ?? ''}`} />}>
            <Pitch3D {...props} />
          </Suspense>
        </Fallback>
      ) : (
        flat
      )}
      {can3d && (
        <button
          type="button"
          className="view-switch"
          onClick={() => setView(use3d ? '2d' : '3d')}
          aria-label={use3d ? 'Pokaż boisko z góry' : 'Pokaż boisko z oczu zawodnika'}
        >
          {use3d ? '2D' : '3D'}
        </button>
      )}
    </div>
  )
}
