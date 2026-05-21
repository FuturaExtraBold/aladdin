import "./AdStage.css";

import { useEffect, useRef } from "react";

import BgPlasma from "./BgPlasma";

const THETA_DEFAULT = 0; // handle-right side-profile at rest
const THETA_MIN = -45; // 45deg towards camera from default
const PHI_CENTER = 90; // equator = level
const PHI_DELTA = 10; // ±10deg vertical range
const RADIUS = "1m";
const CAMERA_TARGET = "0m 0.25m 0m";

function applyGlassMaterial(mv) {
  const materials = mv.model?.materials;
  if (!materials?.length) return;
  for (const mat of materials) {
    mat.setAlphaMode("OPAQUE");
    const pbr = mat.pbrMetallicRoughness;

    pbr.setBaseColorFactor([0.8, 0.45, 0.1, 1.0]); // brass/copper base
    pbr.setMetallicFactor(1.0);
    pbr.setRoughnessFactor(0.3);
    mat.setEmissiveFactor([0.2, 0.08, 0.0]); // warm copper glow
  }
}

export default function AdStage() {
  const modelRef = useRef(null);

  // Window-level mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      const mv = modelRef.current;
      if (!mv) return;
      const xRatio = e.clientX / window.innerWidth;
      const yRatio = 1 - e.clientY / window.innerHeight; // inverted: cursor up → tilt up
      const theta = THETA_DEFAULT - xRatio * (THETA_DEFAULT - THETA_MIN); // 180→135
      const phi = PHI_CENTER + (yRatio - 0.5) * PHI_DELTA * 2; // 80–100deg
      mv.setAttribute("camera-orbit", `${theta}deg ${phi}deg ${RADIUS}`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Apply glass material — guard against cached loads firing before effect runs
  useEffect(() => {
    const mv = modelRef.current;
    if (!mv) return;
    const onLoad = () => applyGlassMaterial(mv);
    mv.addEventListener("load", onLoad);
    if (mv.model) applyGlassMaterial(mv);
    return () => mv.removeEventListener("load", onLoad);
  }, []);

  return (
    <div className="ad-stage">
      <BgPlasma />
      <div className="ad-stage__canvas">
        <img src="/logo.png" alt="Aladdin" className="ad-stage__logo" />
        <div className="ad-stage__model">
          {}
          <model-viewer
            ref={modelRef}
            src="/genie.draco.glb"
            alt="Aladdin lamp 3D model"
            camera-orbit={`${THETA_DEFAULT}deg ${PHI_CENTER}deg ${RADIUS}`}
            camera-target={CAMERA_TARGET}
            min-camera-orbit="auto auto auto"
            max-camera-orbit="auto auto auto"
            interaction-prompt="none"
            disable-zoom
            disable-pan
            disable-tap
            shadow-intensity="1"
            exposure="1"
            environment-image="legacy"
            style={{ width: "100%", height: "100%", background: "transparent" }}
          />
        </div>
      </div>
    </div>
  );
}
