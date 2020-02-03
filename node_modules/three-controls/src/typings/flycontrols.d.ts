import { Camera, Object3D, Quaternion, Vector3 } from "three";

export class FlyControls {
  constructor(object: Camera, domElement?: HTMLElement)

  object: Object3D
  domElement: HTMLElement | HTMLCanvasElement
  movementSpeed: number
  rollSpeed: number
  dragToLook: boolean
  autoForward: boolean
  tmpQuaternion: Quaternion
  mouseStatus: number
  moveState: { up: number, down: number, left: number, right: number, forward: number, back: number, pitchUp: number, pitchDown: number, yawLeft: number, yawRight: number, rollLeft: number, rollRight: number }
  moveVector: Vector3
  rotationVector: Vector3

  keydown(event: Event): void
  keyup(event: Event): void
  mousedown(event: Event): void
  mousemove(event: Event): void
  mouseup(event: Event): void
  update(delta: number): void
  updateMovementVector(): void
  updateRotationVector(): void
  getContainerDimensions(): void
  dispose(): void
}