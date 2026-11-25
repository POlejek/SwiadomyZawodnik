// 3D view of a situation, "from the player's eyes": a dark stadium pitch, simple low-poly players,
// the camera behind "TY" looking the way they play. It draws exactly the same `world` as the 2D Pitch,
// so every situation works in both views without changes.
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { PITCH, TEAM_STYLE } from '../engine/pitch'

const TONE = { good: '#4ade80', bad: '#f87171', info: '#7dd3fc' }
const YOU = '#fde047'
const SKY = '#0a1310'
const SCALE = 1.2 // players a little larger than life, so they read well on a phone
const CX = PITCH.width / 2

// World metres (x across, y from the goal line at the top) → three.js (x, z), centred across the pitch.
const wx = (x) => x - CX
const wz = (y) => y

// ---------- pitch ----------

function canvasTexture(size, draw) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  draw(c.getContext('2d'), size)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

const blobTexture = () =>
  canvasTexture(64, (g, s) => {
    const r = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
    r.addColorStop(0, 'rgba(0,0,0,0.65)')
    r.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = r
    g.fillRect(0, 0, s, s)
  })

const glowTexture = () =>
  canvasTexture(64, (g, s) => {
    const r = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
    r.addColorStop(0, 'rgba(255,255,255,1)')
    r.addColorStop(0.35, 'rgba(255,255,255,0.35)')
    r.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = r
    g.fillRect(0, 0, s, s)
  })

function buildPitch(scene) {
  const P = PITCH
  // Ground: mown stripes across the pitch, fading into the dark.
  const stripes = canvasTexture(256, (g, s) => {
    const n = 16
    for (let i = 0; i < n; i++) {
      g.fillStyle = i % 2 ? '#173f2d' : '#1a4532'
      g.fillRect(0, (i * s) / n, s, s / n)
    }
  })
  stripes.wrapS = stripes.wrapT = THREE.RepeatWrapping
  stripes.repeat.set(1, 140 / 84)
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(140, 140), new THREE.MeshLambertMaterial({ map: stripes }))
  ground.rotation.x = -Math.PI / 2
  ground.position.set(0, 0, 30)
  scene.add(ground)

  const lineMat = new THREE.MeshBasicMaterial({ color: '#e8f1ec', transparent: true, opacity: 0.9 })
  const W = 0.14
  const seg = (x1, y1, x2, y2) => {
    const len = Math.hypot(x2 - x1, y2 - y1)
    const m = new THREE.Mesh(new THREE.PlaneGeometry(W, len), lineMat)
    m.rotation.x = -Math.PI / 2
    m.rotation.z = Math.atan2(x2 - x1, y2 - y1)
    m.position.set(wx((x1 + x2) / 2), 0.012, wz((y1 + y2) / 2))
    scene.add(m)
  }
  const arc = (cx, cy, r, from, to) => {
    const m = new THREE.Mesh(new THREE.RingGeometry(r - W / 2, r + W / 2, 64, 1, from, to - from), lineMat)
    m.rotation.x = -Math.PI / 2
    m.position.set(wx(cx), 0.012, wz(cy))
    scene.add(m)
  }
  const rect = (x, y, w, h) => {
    seg(x, y, x + w, y)
    seg(x + w, y, x + w, y + h)
    seg(x + w, y + h, x, y + h)
    seg(x, y + h, x, y)
  }
  // Touchlines and goal line run on past the halfway line into the other half.
  seg(0, 0, P.width, 0)
  seg(0, 0, 0, 2 * P.length)
  seg(P.width, 0, P.width, 2 * P.length)
  seg(0, P.length, P.width, P.length)
  rect(CX - P.boxWidth / 2, 0, P.boxWidth, P.boxDepth)
  rect(CX - P.sixWidth / 2, 0, P.sixWidth, P.sixDepth)
  // Arcs: the ring is in the x/-z plane after rotation, so angles are measured from +x towards -y (up the screen).
  const dy = P.boxDepth - P.penaltySpot
  const a = Math.acos(dy / P.circleRadius)
  arc(CX, P.penaltySpot, P.circleRadius, -Math.PI / 2 - a, -Math.PI / 2 + a)
  arc(CX, P.length, P.circleRadius, 0, Math.PI * 2)
  for (const [x, y] of [
    [CX, P.penaltySpot],
    [CX, P.length],
  ]) {
    const spot = new THREE.Mesh(new THREE.CircleGeometry(0.22, 16), lineMat)
    spot.rotation.x = -Math.PI / 2
    spot.position.set(wx(x), 0.013, wz(y))
    scene.add(spot)
  }

  // Goal: white posts and crossbar, a faint net.
  const postMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.4, emissive: '#3a4a44' })
  const r = 0.07
  const h = 2.44
  const half = P.goalWidth / 2
  const goal = new THREE.Group()
  for (const x of [-half, half]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 10), postMat)
    post.position.set(x, h / 2, 0)
    goal.add(post)
  }
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(r, r, P.goalWidth + 2 * r, 10), postMat)
  bar.rotation.z = Math.PI / 2
  bar.position.set(0, h, 0)
  goal.add(bar)
  const net = []
  const D = P.goalDepth
  for (let x = -half; x <= half + 0.01; x += 0.5) net.push(x, h, 0, x, h, -D, x, h, -D, x, 0, -D)
  for (let y = 0; y <= h + 0.01; y += 0.5) net.push(-half, y, -D, half, y, -D)
  for (let z = 0; z <= D + 0.01; z += 0.5) net.push(-half, h, -z, half, h, -z)
  for (const x of [-half, half]) {
    for (let y = 0; y <= h + 0.01; y += 0.5) net.push(x, y, 0, x, y, -D)
    for (let z = 0; z <= D + 0.01; z += 0.5) net.push(x, 0, -z, x, h, -z)
  }
  const netGeo = new THREE.BufferGeometry()
  netGeo.setAttribute('position', new THREE.Float32BufferAttribute(net, 3))
  goal.add(new THREE.LineSegments(netGeo, new THREE.LineBasicMaterial({ color: '#cbd5e1', transparent: true, opacity: 0.28 })))
  goal.position.set(0, 0, 0)
  scene.add(goal)
}

// ---------- players ----------

const darker = (hex, k) => new THREE.Color(hex).multiplyScalar(k)
const SKIN = ['#f1c9a5', '#e0b08a', '#c68a5e', '#8d5a3b', '#f3d2b3']

function numberTexture(n, fill, text) {
  return canvasTexture(64, (g, s) => {
    g.lineWidth = s * 0.08
    g.strokeStyle = fill
    g.fillStyle = text
    g.font = `900 ${s * 0.62}px system-ui, sans-serif`
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.strokeText(String(n), s / 2, s * 0.54)
    g.fillText(String(n), s / 2, s * 0.54)
  })
}

function makePlayer(entity, style, shared, index) {
  const shirt = new THREE.MeshStandardMaterial({ color: style.fill, roughness: 0.75 })
  const shorts = new THREE.MeshStandardMaterial({ color: darker(style.fill, 0.45), roughness: 0.8 })
  const skin = new THREE.MeshStandardMaterial({ color: SKIN[index % SKIN.length], roughness: 0.7 })
  const boots = new THREE.MeshStandardMaterial({ color: '#111827', roughness: 0.6 })

  const root = new THREE.Group() // position + heading
  const body = new THREE.Group() // lean / lying down
  root.add(body)

  const limb = (radius, length, mat) => {
    const pivot = new THREE.Group()
    const m = new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, 3, 8), mat)
    m.position.y = -length / 2 - radius
    pivot.add(m)
    return pivot
  }
  const legs = [-0.12, 0.12].map((x) => {
    const leg = limb(0.095, 0.62, shorts)
    leg.position.set(x, 0.92, 0)
    const boot = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.08, 0.26), boots)
    boot.position.set(0, -0.86, 0.06)
    leg.add(boot)
    body.add(leg)
    return leg
  })
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.21, 0.4, 4, 10), shirt)
  torso.position.y = 1.3
  torso.scale.z = 0.72
  body.add(torso)
  const arms = [-0.29, 0.29].map((x) => {
    const arm = limb(0.065, 0.48, shirt)
    arm.position.set(x, 1.53, 0)
    arm.rotation.z = x < 0 ? -0.12 : 0.12
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 6), skin)
    hand.position.y = -0.66
    arm.add(hand)
    body.add(arm)
    return arm
  })
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.135, 14, 10), skin)
  head.position.y = 1.78
  body.add(head)
  // Shirt number on the back (we mostly see teammates from behind).
  const num = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.26), new THREE.MeshBasicMaterial({ map: numberTexture(entity.number, style.fill, style.text), transparent: true, toneMapped: false }))
  num.position.set(0, 1.34, -0.16)
  num.rotation.y = Math.PI
  body.add(num)
  body.scale.setScalar(SCALE)

  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), shared.blobMat)
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = 0.015
  root.add(shadow)

  let ring = null
  let glow = null
  if (entity.you) {
    ring = new THREE.Mesh(new THREE.RingGeometry(0.95, 1.12, 48), new THREE.MeshBasicMaterial({ color: YOU, transparent: true, opacity: 0.95 }))
    ring.rotation.x = -Math.PI / 2
    ring.position.y = 0.02
    root.add(ring)
    const inner = new THREE.Mesh(new THREE.CircleGeometry(0.95, 48), new THREE.MeshBasicMaterial({ color: YOU, transparent: true, opacity: 0.12 }))
    inner.rotation.x = -Math.PI / 2
    inner.position.y = 0.018
    root.add(inner)
    glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: shared.glowTex, color: YOU, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false }))
    glow.scale.set(1.3, 1.3, 1)
    glow.position.y = 1.78 * SCALE
    root.add(glow)
  }

  return { root, body, legs, arms, ring, glow, heading: null, phase: Math.random() * 6, down: 0, prev: null, speed: 0 }
}

function makeBall() {
  const tex = canvasTexture(128, (g, s) => {
    g.fillStyle = '#ffffff'
    g.fillRect(0, 0, s, s)
    g.fillStyle = '#1f2937'
    for (const [x, y] of [
      [0.25, 0.3],
      [0.75, 0.3],
      [0.5, 0.7],
      [0.0, 0.75],
      [1.0, 0.75],
    ]) {
      g.beginPath()
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2
        g.lineTo(x * s + Math.cos(a) * s * 0.1, y * s + Math.sin(a) * s * 0.1)
      }
      g.fill()
    }
  })
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.26, 20, 14), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.45 }))
  return ball
}

// ---------- coaching drawings on the grass ----------

function ribbon(x1, z1, x2, z2, width, mat, y = 0.03) {
  const len = Math.hypot(x2 - x1, z2 - z1)
  const m = new THREE.Mesh(new THREE.PlaneGeometry(width, len), mat)
  m.rotation.x = -Math.PI / 2
  m.rotation.z = Math.atan2(x2 - x1, z2 - z1)
  m.position.set((x1 + x2) / 2, y, (z1 + z2) / 2)
  return m
}

function buildHighlight(h, world) {
  const color = TONE[h.tone ?? 'info']
  const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.92, depthWrite: false })
  const g = new THREE.Group()
  const pt = (ref) => (typeof ref === 'string' ? [world.players[ref].x, world.players[ref].y] : ref)
  if (h.type === 'circle') {
    const [x, y] = h.at
    const r = h.r ?? 2.5
    const ring = new THREE.Mesh(new THREE.RingGeometry(r - 0.12, r + 0.12, 48), mat)
    const fill = new THREE.Mesh(new THREE.CircleGeometry(r, 48), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.16, depthWrite: false }))
    for (const m of [ring, fill]) {
      m.rotation.x = -Math.PI / 2
      m.position.set(wx(x), 0.03, wz(y))
      g.add(m)
    }
    return { group: g, label: [wx(x), 0.4, wz(y) - r] }
  }
  const [x1, y1] = pt(h.from)
  const [x2, y2] = pt(h.to)
  const a = new THREE.Vector2(wx(x1), wz(y1))
  const b = new THREE.Vector2(wx(x2), wz(y2))
  const dir = b.clone().sub(a)
  const len = dir.length()
  dir.normalize()
  const head = h.type === 'arrow' ? Math.min(1.4, len * 0.4) : 0
  const end = b.clone().sub(dir.clone().multiplyScalar(head))
  const dashed = h.dashed || h.type === 'cross'
  if (dashed) {
    const step = 1.1
    for (let s = 0; s < end.clone().sub(a).length(); s += step * 1.8) {
      const p = a.clone().add(dir.clone().multiplyScalar(s))
      const q = a.clone().add(dir.clone().multiplyScalar(Math.min(s + step, end.clone().sub(a).length())))
      g.add(ribbon(p.x, p.y, q.x, q.y, 0.32, mat))
    }
  } else {
    g.add(ribbon(a.x, a.y, end.x, end.y, 0.32, mat))
  }
  if (head) {
    const shape = new THREE.Shape()
    shape.moveTo(0, head)
    shape.lineTo(-head * 0.55, 0)
    shape.lineTo(head * 0.55, 0)
    shape.closePath()
    const tip = new THREE.Mesh(new THREE.ShapeGeometry(shape), mat)
    tip.rotation.x = -Math.PI / 2
    tip.rotation.z = Math.atan2(dir.x, dir.y) + Math.PI
    tip.position.set(end.x, 0.031, end.y)
    g.add(tip)
  }
  if (h.type === 'cross') {
    const m = a.clone().add(b).multiplyScalar(0.5)
    g.add(ribbon(m.x - 0.9, m.y - 0.9, m.x + 0.9, m.y + 0.9, 0.4, mat, 0.035))
    g.add(ribbon(m.x - 0.9, m.y + 0.9, m.x + 0.9, m.y - 0.9, 0.4, mat, 0.035))
  }
  const mid = a.clone().add(b).multiplyScalar(0.5)
  return { group: g, label: [mid.x + (h.labelDx ?? 0) * 0.35, 0.4, mid.y + (h.labelDy ?? 0) * 0.35] }
}

// ---------- camera ----------

const probe = new THREE.PerspectiveCamera()
const tmp = new THREE.Vector3()

/**
 * Where the camera sits and looks: behind "TY", facing the way they play
 * (towards the top goal when we attack it, otherwise away from our goal).
 * It starts close, like a look over TY's shoulder, and pulls back and up only as far as needed
 * to keep TY, the ball and the players near the ball (and any coaching drawings) in the picture.
 */
export function cameraTarget(world, youId, facingUp, aspect, fov, extraPoints = [], goalkeepers = new Set()) {
  const dir = facingUp === 'home' ? -1 : 1 // +1: looking from our goal (top) towards halfway
  const you = world.players[youId] ?? { x: CX, y: 26 }
  const ball = world.ball
  const portrait = aspect < 1
  const side = ball.x - you.x
  const lookX = wx(you.x) + Math.max(-9, Math.min(9, side * 0.5))
  const camX = wx(you.x) - (lookX - wx(you.x)) * 0.3
  const along = (y) => y * dir
  const nearest = Math.min(along(you.y), along(ball.y))

  const points = [
    [you.x, you.y, 2.2],
    [ball.x, ball.y, 0.3],
  ]
  for (const [id, p] of Object.entries(world.players)) {
    const keeper = goalkeepers.has(id)
    const near = Math.min(Math.hypot(p.x - ball.x, p.y - ball.y), Math.hypot(p.x - you.x, p.y - you.y))
    if (near < (keeper ? 10 : 22)) points.push([p.x, p.y, 1.9])
  }
  for (const [x, y] of extraPoints) points.push([x, y, 0.2])

  probe.fov = fov
  probe.aspect = aspect
  probe.near = 0.5
  probe.updateProjectionMatrix()
  let pos
  let look
  for (let extra = 0; extra <= 24; extra += 2) {
    const back = (portrait ? 11 : 10) + extra
    const height = (portrait ? 7.5 : 6.2) + extra * 0.5
    const camZ = Math.max(nearest - back, along(dir > 0 ? -12 : 64)) * dir
    pos = new THREE.Vector3(camX, height, camZ)
    look = new THREE.Vector3(lookX, 0, camZ + dir * (back + 7))
    probe.position.copy(pos)
    probe.lookAt(look)
    probe.updateMatrixWorld()
    const fits = points.every(([x, y, h]) => {
      tmp.set(wx(x), h, wz(y)).project(probe)
      return tmp.z < 1 && Math.abs(tmp.x) < 0.88 && tmp.y < 0.8 && tmp.y > -0.92
    })
    if (fits) break
  }
  return { pos, look }
}

// ---------- component ----------

export default function Pitch3D({ entities, world, highlights = [], captions = [], className = '', label, homeShirt, youLabel = 'TY', facingUp }) {
  const mount = useRef(null)
  const youTag = useRef(null)
  const labelRefs = useRef([])
  const props = useRef({})
  props.current = { entities, world, highlights, homeShirt, facingUp }

  useEffect(() => {
    const el = mount.current
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    el.appendChild(renderer.domElement)
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(SKY)
    scene.fog = new THREE.Fog(SKY, 38, 95)
    scene.add(new THREE.HemisphereLight('#cfe8ff', '#0e2a1e', 1.25))
    const key = new THREE.DirectionalLight('#ffffff', 1.6)
    key.position.set(-20, 40, 25)
    scene.add(key)
    const rim = new THREE.DirectionalLight('#9cc8ff', 0.6)
    rim.position.set(25, 18, -30)
    scene.add(rim)
    buildPitch(scene)

    const shared = {
      blobMat: new THREE.MeshBasicMaterial({ map: blobTexture(), transparent: true, depthWrite: false }),
      glowTex: glowTexture(),
    }
    const camera = new THREE.PerspectiveCamera(52, 1, 0.5, 200)
    const players = new Map()
    let playersKey = ''
    const ball = makeBall()
    const ballShadow = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), shared.blobMat)
    ballShadow.rotation.x = -Math.PI / 2
    ballShadow.position.y = 0.016
    scene.add(ball, ballShadow)
    let hlGroup = null
    let hlKey = null
    let hlLabels = []
    let hlPoints = []
    let camPos = null
    let camLook = null
    let prevBall = null

    const resize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.fov = w / h < 1 ? 62 : 46
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null
    ro?.observe(el)

    const syncPlayers = () => {
      const { entities: ents, homeShirt: shirt } = props.current
      const k = ents.map((e) => `${e.id}:${e.team}:${e.number}:${e.you ? 1 : 0}`).join('|') + (shirt?.fill ?? '')
      if (k === playersKey) return
      playersKey = k
      for (const p of players.values()) scene.remove(p.root)
      players.clear()
      ents.forEach((e, i) => {
        const style = e.team === 'home' && shirt ? { fill: shirt.fill, text: shirt.text } : TEAM_STYLE[e.team]
        const p = makePlayer(e, style, shared, i)
        players.set(e.id, p)
        scene.add(p.root)
      })
      camPos = null
    }

    const project = (v, w, h) => {
      const p = v.clone().project(camera)
      return { x: ((p.x + 1) / 2) * w, y: ((1 - p.y) / 2) * h, visible: p.z < 1 && p.z > -1 }
    }

    let raf = 0
    let last = performance.now()
    const frame = (now) => {
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      syncPlayers()
      const { entities: ents, world: w, highlights: hls, facingUp: up } = props.current
      const you = ents.find((e) => e.you)
      const keepers = new Set(ents.filter((e) => e.team.endsWith('GK')).map((e) => e.id))

      // Players: position, heading (movement, else towards the ball), run cycle, lying down.
      for (const e of ents) {
        const p = players.get(e.id)
        const s = w.players[e.id]
        if (!p || !s) continue
        const x = wx(s.x)
        const z = wz(s.y)
        if (p.prev && dt > 0) {
          const v = Math.hypot(x - p.prev.x, z - p.prev.z) / dt
          p.speed += (Math.min(v, 9) - p.speed) * Math.min(1, dt * 10)
        }
        let target
        if (p.prev && p.speed > 0.6) target = Math.atan2(x - p.prev.x, z - p.prev.z)
        else target = Math.atan2(wx(w.ball.x) - x, wz(w.ball.y) - z)
        if (Math.hypot(wx(w.ball.x) - x, wz(w.ball.y) - z) < 0.3 && p.heading !== null && p.speed <= 0.6) target = p.heading
        if (p.heading === null) p.heading = target
        let d = target - p.heading
        d = Math.atan2(Math.sin(d), Math.cos(d))
        p.heading += d * Math.min(1, dt * 7)
        p.prev = { x, z }
        p.root.position.set(x, 0, z)
        p.root.rotation.y = p.heading
        const run = Math.min(1, p.speed / 5)
        p.phase += dt * (3 + p.speed * 1.6)
        const swing = Math.sin(p.phase) * 0.85 * run
        p.legs[0].rotation.x = swing
        p.legs[1].rotation.x = -swing
        p.arms[0].rotation.x = -swing * 0.9
        p.arms[1].rotation.x = swing * 0.9
        p.body.position.y = Math.abs(Math.cos(p.phase)) * 0.06 * run
        p.body.rotation.x = 0.12 * run
        const downTarget = s.pose === 'down' ? 1 : 0
        p.down += (downTarget - p.down) * Math.min(1, dt * 8)
        if (p.down > 0.01) {
          p.body.rotation.x = 0.12 * run + p.down * (Math.PI / 2 - 0.12 * run)
          p.body.position.y = p.down * 0.25
        }
        if (p.ring) {
          const pulse = 1 + Math.sin(now / 260) * 0.06
          p.ring.scale.setScalar(pulse)
          p.ring.visible = p.down < 0.5
          p.glow.material.opacity = 0.55 + Math.sin(now / 260) * 0.2
          p.glow.visible = p.down < 0.5
        }
      }

      // Ball: height from the flight arc, rolling as it moves.
      const bx = wx(w.ball.x)
      const bz = wz(w.ball.y)
      const bh = (w.ball.h ?? 0) * 0.9
      ball.position.set(bx, 0.26 + bh, bz)
      if (prevBall) {
        const dx = bx - prevBall.x
        const dz = bz - prevBall.z
        ball.rotation.x += dz / 0.26
        ball.rotation.z -= dx / 0.26
      }
      prevBall = { x: bx, z: bz }
      ballShadow.position.set(bx, 0.016, bz)
      ballShadow.scale.setScalar(1 / (1 + bh * 0.12))

      // Coaching drawings: rebuilt only when the set changes.
      const hk = JSON.stringify(hls)
      if (hk !== hlKey) {
        hlKey = hk
        if (hlGroup) scene.remove(hlGroup)
        hlGroup = new THREE.Group()
        hlLabels = hls.map((h) => {
          const built = buildHighlight(h, w)
          hlGroup.add(built.group)
          return new THREE.Vector3(...built.label)
        })
        scene.add(hlGroup)
        hlPoints = hls.flatMap((h) => {
          const pt = (r) => (typeof r === 'string' ? [w.players[r].x, w.players[r].y] : r)
          return h.type === 'circle' ? [h.at] : [pt(h.from), pt(h.to)]
        })
      }

      // Camera: eases towards its target so cuts never jump.
      const cw = el.clientWidth || 1
      const ch = el.clientHeight || 1
      const t = cameraTarget(w, you?.id, up, cw / ch, camera.fov, hlPoints, keepers)
      if (!camPos) {
        camPos = t.pos.clone()
        camLook = t.look.clone()
      } else {
        const k = Math.min(1, dt * 2.2)
        camPos.lerp(t.pos, k)
        camLook.lerp(t.look, k)
      }
      camera.position.copy(camPos)
      camera.lookAt(camLook)
      renderer.render(scene, camera)

      // HTML labels that follow the 3D scene: the "TY" tag over the head and the drawing labels.
      if (you && youTag.current) {
        const p = players.get(you.id)
        const s = project(new THREE.Vector3(p.root.position.x, 2.55 * SCALE - p.down * 1.6, p.root.position.z), cw, ch)
        youTag.current.style.transform = `translate(${s.x}px, ${s.y}px) translate(-50%, -100%)`
        youTag.current.style.opacity = s.visible ? '1' : '0'
      }
      hlLabels.forEach((v, i) => {
        const node = labelRefs.current[i]
        if (!node) return
        const s = project(v, cw, ch)
        node.style.transform = `translate(${s.x}px, ${s.y}px) translate(-50%, -50%)`
        node.style.opacity = s.visible ? '1' : '0'
      })
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      ro?.disconnect()
      scene.traverse((o) => {
        o.geometry?.dispose()
        const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : []
        for (const m of mats) {
          m.map?.dispose()
          m.dispose()
        }
      })
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return (
    <div className={`pitch3d relative ${className}`} role="img" aria-label={label ?? 'Boisko 3D z sytuacją meczową'} data-testid="pitch-3d">
      <div ref={mount} className="absolute inset-0" />
      <span ref={youTag} className="pitch3d-you" style={{ opacity: 0 }}>
        {youLabel}
      </span>
      {highlights.map((h, i) =>
        h.label ? (
          <span key={`${i}-${h.label}`} ref={(n) => (labelRefs.current[i] = n)} className="pitch3d-label" style={{ color: TONE[h.tone ?? 'info'], opacity: 0 }}>
            {h.label}
          </span>
        ) : null,
      )}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-col items-center gap-2 px-3 pt-3" aria-live="polite">
        {captions.map((c, i) => (
          <span key={`${c.text}-${i}`} className={`banner3d banner3d-${c.tone ?? 'info'} ${c.text === 'GOL' ? 'banner3d-goal' : ''}`}>
            {c.text}
          </span>
        ))}
      </div>
    </div>
  )
}
