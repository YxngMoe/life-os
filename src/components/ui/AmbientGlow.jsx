export default function AmbientGlow() {
  return (
    <div className="ambient-layer" aria-hidden="true">
      <div className="neural-grid" />
      <div className="scanline" />
      <div className="ambient-glow ambient-glow--cyan" />
      <div className="ambient-glow ambient-glow--magenta" />
      <div className="ambient-glow ambient-glow--violet" />
      <div className="ambient-orb ambient-orb--1" />
      <div className="ambient-orb ambient-orb--2" />
    </div>
  );
}
