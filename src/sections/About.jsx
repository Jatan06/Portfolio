import Reveal from "../components/Reveal";

/**
 * About section — personal background, stats grid.
 *
 * @prop {boolean} isMobile - true when viewport < 768px
 */
export default function About({ isMobile }) {
  const stats = [
    ["8.95",    "CGPA @ LJU"],
    ["3+",      "Major Projects"],
    ["Java",    "Core Language"],
    ["Flask",   "Backend Stack"],
    ["SQL",     "Databases"],
  ];

  return (
    <section
      id="about"
      style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        padding: isMobile ? "80px 24px" : "100px 80px",
        position: "relative", zIndex: 2,
      }}
    >
      {/* Left accent line (desktop only) */}
      {!isMobile && (
        <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: "3px", height: "140px", background: "linear-gradient(180deg, transparent, #39ff14, transparent)" }} />
      )}

      <div style={{
        maxWidth: "1100px",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: isMobile ? "48px" : "80px",
        alignItems: "center", width: "100%",
      }}>
        {/* Left: bio text */}
        <div>
          <Reveal delay={0}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#39ff14", letterSpacing: "0.25em", marginBottom: "18px", textTransform: "uppercase" }}>
              01 / About
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? "32px" : "clamp(34px, 4vw, 52px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "28px" }}>
              Learning, building,<br />
              <span style={{ color: "#39ff14" }}>shipping.</span>
            </h2>
          </Reveal>

          <Reveal delay={200}>
            <p style={{ color: "#555", fontSize: "14.5px", lineHeight: 1.85, marginBottom: "20px" }}>
              I'm Jatan Parikh, a Computer Science Engineering student (Class of 2028) at LJU, Ahmedabad. I'm passionate about backend architecture, data structures, and building robust full-stack applications using OOP principles.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <p style={{ color: "#444", fontSize: "14px", lineHeight: 1.85 }}>
              I hold certifications in <span style={{ color: "#39ff14aa" }}>Microsoft Azure SQL</span> and Java Data Structures. I also actively participate in hackathons to apply my skills to real-world scenarios, and I'm currently seeking internship opportunities to learn and grow in a dynamic environment.
            </p>
          </Reveal>
        </div>

        {/* Right: stats */}
        <div>
          {stats.map(([num, label], i) => (
            <Reveal key={i} delay={i * 100} direction="right">
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: isMobile ? "16px 0" : "22px 0",
                borderBottom: i < stats.length - 1 ? "1px solid #0f0f0f" : "none",
              }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? "32px" : "40px", fontWeight: 800, color: "#39ff14", letterSpacing: "-0.04em", textShadow: "0 0 20px #39ff1433" }}>
                  {num}
                </span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: isMobile ? "9px" : "11px", color: "#333", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
