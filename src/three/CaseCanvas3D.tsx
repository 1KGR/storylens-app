import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";
import type { Film } from "../data/films";
import { CaseObject3D } from "./CaseObject3D";

interface CaseCanvas3DProps {
  film: Film;
  open: boolean;
  pickedUp: boolean;
  onContextLost?: () => void;
}

// A restrained "camera operator": a controlled push-in the instant the case
// is picked up, then a wider reframe once it opens — the hinge swings the
// cover well past perpendicular (see CaseObject3D's targetAngle), so the
// open shot needs to pull back and pan toward the cover's new position
// rather than push in tighter, or the reveal just crops the cover out of
// frame. Deliberately just resting states with damped easing between them —
// not a constantly moving camera, which would read as a website animation
// rather than a film camera.
function CameraRig({ open, pickedUp }: { open: boolean; pickedUp: boolean }) {
  useFrame((state, delta) => {
    const camera = state.camera;
    const targetX = open ? -0.25 : pickedUp ? 0.5 : 0.65;
    const targetY = open ? 0.2 : pickedUp ? 0.28 : 0.3;
    const targetZ = open ? 7.3 : pickedUp ? 6.3 : 6.9;
    const targetFov = open ? 38 : pickedUp ? 28 : 30;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 4, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 4, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 4, delta);
    if (camera instanceof THREE.PerspectiveCamera) {
      const nextFov = THREE.MathUtils.damp(camera.fov, targetFov, 4, delta);
      if (Math.abs(nextFov - camera.fov) > 0.001) {
        camera.fov = nextFov;
        camera.updateProjectionMatrix();
      }
    }
  });
  return null;
}

export function CaseCanvas3D({ film, open, pickedUp, onContextLost }: CaseCanvas3DProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      style={{ width: "100%", height: "100%" }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener(
          "webglcontextlost",
          (e) => {
            e.preventDefault();
            onContextLost?.();
          },
          { once: true }
        );
      }}
    >
      <PerspectiveCamera makeDefault position={[0.65, 0.3, 6.9]} fov={30} />
      <CameraRig open={open} pickedUp={pickedUp} />
      {/* cool, dim ambient fill against a warm key + a low gold rim light —
          a private-screening-room feel rather than a flat product shot */}
      <ambientLight intensity={0.42} color="#dfe6f2" />
      <directionalLight position={[3, 4, 5]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} color="#fff4e0" />
      <directionalLight position={[-3, -1.5, -3]} intensity={0.2} color="#c9a227" />
      <directionalLight position={[-2, 1.5, -4]} intensity={0.28} color="#8fa6c9" />
      <Suspense fallback={null}>
        <CaseObject3D film={film} open={open} pickedUp={pickedUp} />
        <ContactShadows position={[0, -1.62, 0]} opacity={0.5} scale={6} blur={2.6} far={2.4} />
      </Suspense>
    </Canvas>
  );
}
