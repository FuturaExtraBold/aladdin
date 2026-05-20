import "./AdStage.css";

import { useEffect, useRef } from "react";

import BgPlasma from "./BgPlasma";

const THETA_RANGE = 45;
const PHI_MIN = 45;
const PHI_MAX = 90;
const RADIUS = "2m";
// Target mid-body so head frames nicely; orbit sweeps head through a wide arc
const CAMERA_TARGET = "0m 0.5m 0m";

function applyGlassMaterial(mv) {
  const materials = mv.model?.materials;
  if (!materials?.length) return;
  for (const mat of materials) {
    mat.setAlphaMode("BLEND");
    const pbr = mat.pbrMetallicRoughness;
    pbr.setBaseColorFactor([0, 1, 0, 0.45]); // #00ff00 green glass
    pbr.setMetallicFactor(1.0);
    pbr.setRoughnessFactor(0.0);
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
      const yRatio = e.clientY / window.innerHeight;
      // Inverted: cursor right → model turns left, cursor down → tilts up
      const theta = THETA_RANGE - xRatio * THETA_RANGE * 2;
      const phi = PHI_MAX - yRatio * (PHI_MAX - PHI_MIN);
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
        <div className="ad-stage__model">
          {}
          <model-viewer
            ref={modelRef}
            src="/walle.draco.glb"
            alt="Wall-E 3D model"
            camera-orbit={`0deg 90deg ${RADIUS}`}
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
