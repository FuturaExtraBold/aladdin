import "./Sparkle.css";

const SPARKS = [
  // spout tip area (left side of model)
  { top: "30%", left: "8%", delay: "0s", dur: "1.8s" },
  { top: "45%", left: "14%", delay: "1.1s", dur: "2.3s" },
  // mid-body left
  { top: "22%", left: "28%", delay: "0.5s", dur: "2.0s" },
  { top: "55%", left: "32%", delay: "1.6s", dur: "1.7s" },
  // mid-body center
  { top: "18%", left: "48%", delay: "0.2s", dur: "2.4s" },
  { top: "60%", left: "52%", delay: "1.3s", dur: "1.5s" },
  // mid-body right
  { top: "25%", left: "66%", delay: "0.8s", dur: "2.1s" },
  { top: "50%", left: "70%", delay: "0.3s", dur: "1.9s" },
  // handle area (right side)
  { top: "20%", left: "82%", delay: "1.4s", dur: "2.2s" },
  { top: "42%", left: "88%", delay: "0.7s", dur: "1.6s" },
  { top: "65%", left: "78%", delay: "1.9s", dur: "2.0s" },
  // top knob
  { top: "10%", left: "55%", delay: "0.9s", dur: "1.8s" },
];

export default function Sparkle() {
  return (
    <>
      {SPARKS.map((s, i) => (
        <span
          key={i}
          className="sparkle"
          style={{
            top: s.top,
            left: s.left,
            animationDelay: s.delay,
            animationDuration: s.dur,
          }}
        />
      ))}
    </>
  );
}
