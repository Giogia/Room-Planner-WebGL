import { Camera } from 'three';

export class DeviceOrientationControls {
  constructor(object: Camera)

  enabled: boolean
  deviceOrientation: object
  screenOrientation: number
  alphaOffset: number

  connect(): void
  disconnect(): void
  update(): void
  dispose(): void
}
