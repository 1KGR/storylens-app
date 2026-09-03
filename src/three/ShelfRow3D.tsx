import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Film } from "../data/films";
import { generateCoverTexture, generateShadowTexture, generateSpineTexture, loadPosterTexture } from "./coverTexture";
import { useFilmArt } from "../services/filmDataLayer";
import { shelfJitter } from "../components/CollectorCase";
import { SLOT_W, GAP, CASE_W, CASE_H, CASE_T, type RowHover } from "./shelfLayout";

export type { RowHover };

// Permanent resting viewing angle for every case on the shelf, in radians —
// matches CaseObject3D's own baseTilt convention (positive Y turns the spine
// side toward camera) so the shelf and the opened hero case read consistently.
// Without this an orthographic camera looking straight at a closed box sees
// only its front face — the spine/edges/thickness that make it read as a
// physical object, not a flat card, disappear entirely.
const REST_TILT_Y = 0.52;
const REST_TILT_X = -0.06;

interface ShelfCaseMeshProps {
  film: Film;
  index: number;
  x: number;
  hoverRef: React.RefObject<RowHover>;
  hidden: boolean;
}

function ShelfCaseMesh({ film, index, x, hoverRef, hidden }: ShelfCaseMeshProps) {
  const art = useFilmArt(film);
  const groupRef = useRef<THREE.Group>(null);
  const sheenRef = useRef<THREE.Mesh>(null);
  const [coverTex, setCoverTex] = useState<THREE.Texture>(() => generateCoverTexture(film));
  const spineTex = useMemo(() => generateSpineTexture(film), [film]);
  const shadowTex = useMemo(() => generateShadowTexture(), []);
  const phase = useMemo(() => (index * 1.618) % Math.PI, [index]);
  const jitter = useMemo(() => shelfJitter(film.slug), [film.slug]);

  useEffect(() => {
    setCoverTex(generateCoverTexture(film));
    if (art.posterUrl) {
      loadPosterTexture(art.posterUrl)
        .then(setCoverTex)
        .catch(() => {});
    }
  }, [film, art.posterUrl]);

  const materials = useMemo(() => {
    const edge = new THREE.MeshStandardMaterial({ color: "#14110c", roughness: 0.65, metalness: 0.08 });
    const spine = new THREE.MeshStandardMaterial({ map: spineTex, roughness: 0.55, metalness: 0.05 });
    const dark = new THREE.MeshStandardMaterial({ color: film.gradient[1], roughness: 0.6, metalness: 0.05 });
    // +x, -x, +y, -y, +z, -z — the cover sits on +z, facing the camera, since a
    // resting case is closed (no hinge needed until it's picked up onto the stage)
    const cover = new THREE.MeshStandardMaterial({ map: coverTex, roughness: 0.34, metalness: 0.06 });
    return [edge, spine, edge, edge, cover, dark];
  }, [film, spineTex, coverTex]);

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;
    const hover = hoverRef.current;
    const isHovered = hover.index === index;
    const otherHovered = hover.index !== -1 && !isHovered;

    const targetY = isHovered ? 18 : jitter.lift;
    const targetZ = isHovered ? 34 : otherHovered ? jitter.depth - 6 : jitter.depth;
    const targetScale = isHovered ? 1.06 : otherHovered ? 0.97 : 1;
    // a barely-perceptible idle sway, phase-offset per case so the shelf never
    // moves in unison — "resting naturally," not animating
    const idleSway = Math.sin(state.clock.elapsedTime * 0.4 + phase) * 0.15;

    g.position.y = THREE.MathUtils.damp(g.position.y, targetY, 6, delta);
    g.position.z = THREE.MathUtils.damp(g.position.z, targetZ, 6, delta);
    const s = THREE.MathUtils.damp(g.scale.x, targetScale, 7, delta);
    g.scale.setScalar(s);

    const px = isHovered ? hover.px : 0.5;
    const py = isHovered ? hover.py : 0.5;
    // A permanent resting 3/4 angle — without it an orthographic camera looking
    // straight at a closed box sees only its front face, and the spine/edges/
    // thickness that make this read as a physical object disappear entirely.
    // Hovering swings the case toward the viewer (as if reaching for it) with
    // a little extra cursor-follow on top.
    const targetRotY = isHovered ? REST_TILT_Y * 0.3 + (px - 0.5) * 0.32 : REST_TILT_Y;
    const targetRotX = isHovered ? REST_TILT_X + (0.5 - py) * 0.22 : REST_TILT_X;
    const targetRotZ = isHovered ? 0 : THREE.MathUtils.degToRad(jitter.rotate + idleSway);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetRotY, 6, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetRotX, 6, delta);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, targetRotZ, 6, delta);

    if (sheenRef.current) {
      const mat = sheenRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.damp(mat.opacity, isHovered ? 0.16 : 0, 8, delta);
      sheenRef.current.position.x = THREE.MathUtils.damp(sheenRef.current.position.x, (px - 0.5) * CASE_W, 10, delta);
      sheenRef.current.position.y = THREE.MathUtils.damp(sheenRef.current.position.y, (0.5 - py) * CASE_H, 10, delta);
    }
  });

  if (hidden) return null;

  return (
    <group ref={groupRef} position={[x, 0, 0]}>
      {/* fake drop shadow, always facing the camera — see generateShadowTexture */}
      <mesh position={[6, -CASE_H / 2 + 10, -CASE_T / 2 - 6]}>
        <planeGeometry args={[CASE_W * 1.6, CASE_H * 0.55]} />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} />
      </mesh>
      <mesh material={materials}>
        <boxGeometry args={[CASE_W, CASE_H, CASE_T]} />
      </mesh>
      {/* a crisp bright seam along the spine/cover edge — the physical detail
          that reads as "hinged case", not just a shaded box */}
      <mesh position={[-CASE_W / 2 - 0.5, 0, CASE_T / 2 - 1]}>
        <planeGeometry args={[1.6, CASE_H]} />
        <meshBasicMaterial color="#fff6df" transparent opacity={0.5} />
      </mesh>
      <mesh ref={sheenRef} position={[0, 0, CASE_T / 2 + 0.4]}>
        <circleGeometry args={[CASE_W * 0.42, 24]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

interface ShelfRow3DProps {
  films: Film[];
  hoverRef: React.RefObject<RowHover>;
  openSlug: string | null;
  onContextLost?: () => void;
}

export function ShelfRow3D({ films, hoverRef, openSlug, onContextLost }: ShelfRow3DProps) {
  const rowWidth = films.length * SLOT_W + (films.length - 1) * GAP;
  const startX = -rowWidth / 2 + SLOT_W / 2;

  return (
    <Canvas
      orthographic
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 500], near: -1000, far: 1000, zoom: 1 }}
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
      {/* private-screening-room recipe: warm dim key raking across the spine
          edge, cool low fill — each case has its own fake drop shadow (see
          ShelfCaseMesh), so no per-row contact-shadow pass is needed */}
      <ambientLight intensity={0.42} color="#dfe6f2" />
      <directionalLight position={[220, 160, 300]} intensity={1.65} color="#fff4e0" />
      <directionalLight position={[-160, 40, -80]} intensity={0.3} color="#c9a227" />
      <Suspense fallback={null}>
        {films.map((f, i) => (
          <ShelfCaseMesh key={f.slug} film={f} index={i} x={startX + i * (SLOT_W + GAP)} hoverRef={hoverRef} hidden={f.slug === openSlug} />
        ))}
      </Suspense>
    </Canvas>
  );
}
