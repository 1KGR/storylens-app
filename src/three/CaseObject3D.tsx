import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Film } from "../data/films";
import { generateCoverTexture, generateDiscTexture, generateInteriorTexture, generateSpineTexture, loadPosterTexture } from "./coverTexture";
import { useFilmArt } from "../services/filmDataLayer";

const W = 2;
const H = 3;
const T = 0.16; // case thickness in scene units

interface CaseObject3DProps {
  film: Film;
  open: boolean;
  pickedUp: boolean;
}

export function CaseObject3D({ film, open, pickedUp }: CaseObject3DProps) {
  const art = useFilmArt(film);
  const hingeRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);
  const discRef = useRef<THREE.Group>(null);
  const [coverTex, setCoverTex] = useState<THREE.Texture>(() => generateCoverTexture(film));
  const spineTex = useMemo(() => generateSpineTexture(film), [film]);
  const discTex = useMemo(() => generateDiscTexture(), []);
  const targetAngle = useRef(0);

  useEffect(() => {
    setCoverTex(generateCoverTexture(film));
    if (art.posterUrl) {
      loadPosterTexture(art.posterUrl)
        .then(setCoverTex)
        .catch(() => {
          /* keep the generated cover on any load failure */
        });
    }
  }, [film, art.posterUrl]);

  useEffect(() => {
    targetAngle.current = open ? -Math.PI * 0.62 : 0;
  }, [open]);

  // Smooth, physical-feeling hinge easing rather than a linear tween, plus a
  // restrained pointer-follow tilt while the case is the focus (not once open,
  // so it stays still and readable).
  useFrame((state, delta) => {
    if (!hingeRef.current) return;
    const current = hingeRef.current.rotation.y;
    const next = THREE.MathUtils.damp(current, targetAngle.current, 6, delta);
    hingeRef.current.rotation.y = next;

    if (groupRef.current) {
      const targetScale = pickedUp ? 1.04 : 1;
      const s = THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 8, delta);
      groupRef.current.scale.setScalar(s);
      const targetY = pickedUp ? 0.12 : 0;
      groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 8, delta);

      // A small permanent viewing angle — without it the camera looks straight
      // at the case and its thickness/spine are edge-on and invisible, even
      // once open. Pointer-follow adds a little more while it's still closed.
      const baseTiltY = 0.2;
      const baseTiltX = -0.05;
      const pointerStrength = open ? 0 : 0.14;
      const targetRotY = baseTiltY + state.pointer.x * pointerStrength;
      const targetRotX = baseTiltX - state.pointer.y * pointerStrength * 0.5;
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 5, delta);
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 5, delta);
    }

    // a slow, subtle turn once the case is open — a disc catching light, not a spin-up
    if (discRef.current && open) {
      discRef.current.rotation.z += delta * 0.15;
    }
  });

  const bodyMaterials = useMemo(() => {
    const spine = new THREE.MeshStandardMaterial({ map: spineTex, roughness: 0.55, metalness: 0.05 });
    const dark = new THREE.MeshStandardMaterial({ color: film.gradient[1], roughness: 0.6, metalness: 0.05 });
    const edge = new THREE.MeshStandardMaterial({ color: "#14110c", roughness: 0.65, metalness: 0.08 });
    // the +z face is what the front cover normally hides — once it swings
    // open this is the "interior lining" the viewer sees, so it gets a warm
    // paper color (matching the Notes/Disc panel below) rather than the
    // case's outer color, which would just look like a flat colored block.
    const interior = new THREE.MeshStandardMaterial({ map: generateInteriorTexture(), roughness: 0.85, metalness: 0 });
    // BoxGeometry face order: +x, -x, +y, -y, +z, -z
    return [edge, spine, edge, edge, interior, dark];
  }, [film, spineTex]);

  return (
    <group ref={groupRef}>
      {/* case body: back + spine + top/bottom/right edges — the front is a
          separate hinged cover so it can swing open */}
      <mesh position={[0, 0, -T * 0.5]} material={bodyMaterials} castShadow receiveShadow>
        <boxGeometry args={[W, H, T]} />
      </mesh>

      {/* the disc: a real lit/shaded mesh with its own reflective material,
          not a flat CSS circle — it sits in the same spot whether the case
          is open or shut, physically occluded by the cover when closed (see
          hinge group below) and revealed once it swings away, exactly like a
          disc in a real tray. */}
      <group ref={discRef} position={[0.05, -0.05, T * 0.4]}>
        <mesh>
          <circleGeometry args={[0.62, 64]} />
          <meshStandardMaterial map={discTex} roughness={0.22} metalness={0.55} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0, 0.011]}>
          <circleGeometry args={[0.1, 32]} />
          <meshStandardMaterial color="#060504" roughness={0.4} metalness={0.2} />
        </mesh>
      </group>

      {/* hinge pivot sits at the left edge (the spine) */}
      <group ref={hingeRef} position={[-W / 2, 0, T * 0.02]}>
        <mesh position={[W / 2, 0, T * 0.5]} castShadow>
          <boxGeometry args={[W, H, T * 0.12]} />
          <meshStandardMaterial map={coverTex} roughness={0.32} metalness={0.06} />
        </mesh>
        {/* restrained specular sheen, a static layer — not an animated shine sweep */}
        <mesh position={[W / 2, 0, T * 0.5 + T * 0.061]}>
          <planeGeometry args={[W, H]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.045} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}
