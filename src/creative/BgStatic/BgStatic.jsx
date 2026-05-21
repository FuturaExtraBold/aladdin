import "./BgStatic.css";

import StarField from "./StarField";

export default function BgStatic() {
  return (
    <>
      <div className="bg-static" aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1920 1500"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Sunset orange-pink bloom — centered on the ad zone */}
            <radialGradient
              id="bg-magenta"
              cx="960"
              cy="200"
              r="900"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#c84010" stopOpacity="1" />
              <stop offset="40%" stopColor="#601808" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {/* Deep purple bloom — offset right toward Aladdin lamp */}
            <radialGradient
              id="bg-teal"
              cx="1250"
              cy="160"
              r="750"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#200850" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#100428" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {/* Top wash — indigo across the upper band */}
            <linearGradient id="bg-top" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a0830" stopOpacity="0.9" />
              <stop offset="20%" stopColor="#0d0418" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
          </defs>

          <rect width="1920" height="1500" fill="#04020c" />
          <rect width="1920" height="1500" fill="url(#bg-top)" />
          <rect width="1920" height="1500" fill="url(#bg-magenta)" />
          <rect width="1920" height="1500" fill="url(#bg-teal)" />
        </svg>
      </div>
      <StarField />
      <div className="bg-vignette" aria-hidden="true" />
    </>
  );
}
