import Reveal from "../components/Reveal";

/**
 * Contact section — email CTA and social links.
 *
 * @prop {boolean} isMobile - true when viewport < 768px
 */
export default function Contact({ isMobile }) {
  const socials = [
    ["GitHub",   "https://github.com/Jatan06"],
    ["LinkedIn", "https://linkedin.com/in/jatanparikh"],
  ];

  return (
    <section
      id="contact"
      style={{
        padding: isMobile ? "80px 24px" : "100px 80px",
        position: "relative", zIndex: 2,
        minHeight: "80vh", display: "flex", flexDirection: "column", justifyContent: "center",
      }}
    >
      {/* Decorative border (desktop only) */}
      {!isMobile && (
        <div style={{ position: "absolute", inset: "60px 40px", border: "1px solid #0d0d0d", pointerEvents: "none" }} />
      )}

      <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto" }}>
        <Reveal delay={0}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#39ff14", letterSpacing: "0.25em", marginBottom: "18px", textTransform: "uppercase" }}>
            04 / Contact
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? "38px" : "clamp(38px, 5vw, 68px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: "22px" }}>
            Let's build<br />
            <span style={{ color: "#39ff14", textShadow: "0 0 40px #39ff1433" }}>together.</span>
          </h2>
        </Reveal>

        <Reveal delay={200}>
          <p style={{ color: "#444", fontSize: "14px", lineHeight: 1.85, marginBottom: "44px" }}>
            Have a project idea or want to collaborate on something interesting? I'm always open to a good conversation about tech and coding.
          </p>
        </Reveal>

        {/* Email CTA */}
        <Reveal delay={300} direction="scale">
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=parikhjatan54@gmail.com"
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                display: "inline-block",
                border: "1px solid #39ff14",
                padding: isMobile ? "16px 32px" : "18px 44px",
                fontFamily: "'Space Mono', monospace",
                fontSize: isMobile ? "10px" : "12px", color: "#39ff14",
                letterSpacing: "0.12em", textTransform: "uppercase",
                cursor: "pointer",
                transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#39ff14"; e.currentTarget.style.color = "#000"; e.currentTarget.style.boxShadow = "0 0 30px #39ff1466"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#39ff14"; e.currentTarget.style.boxShadow = "none"; }}
            >
              parikhjatan54@gmail.com
            </div>
          </a>
        </Reveal>

        {/* Social links */}
        <Reveal delay={420}>
          <div style={{ display: "flex", justifyContent: "center", gap: isMobile ? "24px" : "44px", marginTop: "56px" }}>
            {socials.map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "#2a2a2a", textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.target.style.color = "#39ff14")}
                onMouseLeave={(e) => (e.target.style.color = "#2a2a2a")}
              >
                {label} ↗
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
