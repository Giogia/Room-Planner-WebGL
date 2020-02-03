import { Camera } from "three";

export class PointerLockControls {
  constructor(camrea: Camera, domElement?: HTMLElement)

  domElement: HTMLElement
  isLocked: boolean

  connect(): void
  disconnect(): void
  dispose(): void
  getObject(): void
  getDirection(): void
  lock(): void
  unlock(): void
}