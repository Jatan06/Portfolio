import { SKILLS } from "../constants";
import Reveal from "../components/Reveal";
import SkillBar from "../components/SkillBar";

/**
 * Skills section — description blurb, tag badges, and animated skill bars.
 *
 * @prop {boolean} isMobile - true when viewport < 768px
 */
export default function Skills({ isMobile }) {
  const techTags = ["Java", "Python", "C/C++", "Flask", "MySQL", "MongoDB", "Data Structures", "OOP"];

  return (
    <section
      id="skills"
      style={{ padding: isMobile ? "80px 24px" : "100px 80px", position: "relative", zIndex: 2 }}
    >
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: isMobile ? "48px" : "80px",
        maxWidth: "1100px",
      }}>
        {/* Left: description + tags */}
        <div>
          <Reveal delay={0}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#39ff14", letterSpacing: "0.25em", marginBottom: "14px", textTransform: "uppercase" }}>
              03 / Skills
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? "32px" : "clamp(34px, 4vw, 52px)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "24px" }}>
              My<br /><span style={{ color: "#39ff14" }}>Stack</span>
            </h2>
          </Reveal>

          <Reveal delay={200}>
            <p style={{ color: "#444", fontSize: "14px", lineHeight: 1.85 }}>
              A versatile toolkit spanning languages, frameworks, and tools — from system-level C/C++ to modern full-stack MERN development and cloud deployments.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div style={{ marginTop: "36px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {techTags.map((tag) => (
                <span key={tag} style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#39ff1488", border: "1px solid #39ff1420", padding: "5px 12px", letterSpacing: "0.05em" }}>
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Right: skill bars */}
        <div style={{ paddingTop: isMobile ? "0px" : "64px" }}>
          {SKILLS.map((s, i) => (
            <SkillBar key={s.name} name={s.name} level={s.level} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}
