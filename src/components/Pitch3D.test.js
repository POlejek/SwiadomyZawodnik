import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import { cameraTarget } from './Pitch3D'
import { SCENARIOS } from '../scenarios'
import { initialState } from '../engine/animation'
import { canDraw3D } from './PitchView'

const onScreen = (target, x, y, aspect, fov) => {
  const cam = new THREE.PerspectiveCamera(fov, aspect, 0.5, 200)
  cam.position.copy(target.pos)
  cam.lookAt(target.look)
  cam.updateMatrixWorld()
  const p = new THREE.Vector3(x - 34, 1, y).project(cam)
  return p.z < 1 && Math.abs(p.x) <= 1 && Math.abs(p.y) <= 1
}

describe('3D camera', () => {
  for (const sc of SCENARIOS) {
    it(`keeps TY and the ball in the picture at the start of "${sc.title}"`, () => {
      const world = initialState(sc)
      const you = sc.entities.find((e) => e.you)
      for (const [aspect, fov] of [
        [74 / 60, 46],
        [0.8, 62],
      ]) {
        const t = cameraTarget(world, you.id, sc.facingUp, aspect, fov)
        expect(onScreen(t, world.players[you.id].x, world.players[you.id].y, aspect, fov)).toBe(true)
        expect(onScreen(t, world.ball.x, world.ball.y, aspect, fov)).toBe(true)
      }
    })
  }

  it('looks towards the goal we attack, and away from our goal when defending', () => {
    const world = { players: { ty: { x: 34, y: 25 } }, ball: { x: 34, y: 25 } }
    const attack = cameraTarget(world, 'ty', 'home', 1.2, 46)
    expect(attack.look.z).toBeLessThan(attack.pos.z)
    const defend = cameraTarget(world, 'ty', undefined, 1.2, 46)
    expect(defend.look.z).toBeGreaterThan(defend.pos.z)
  })

  it('falls back to the 2D board where the browser cannot draw 3D', () => {
    expect(canDraw3D()).toBe(false) // jsdom has no WebGL
  })
})
