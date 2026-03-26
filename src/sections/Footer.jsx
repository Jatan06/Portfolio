import Reveal from "../components/Reveal";

/**
 * Footer — copyright notice and "Built with React" credit.
 *
 * @prop {boolean} isMobile - true when viewport < 768px
 */
export default function Footer({ isMobile }) {
  return (
    <Reveal delay={0}>
      <footer style={{
        padding: isMobile ? "28px 24px" : "28px 80px",
        borderTop: "1px solid #0a0a0a",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: isMobile ? "12px" : "0",
        position: "relative", zIndex: 2,
      }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#1e1e1e", letterSpacing: "0.05em", textAlign: isMobile ? "center" : "left" }}>
          © 2025 Jatan Parikh
        </div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#1e1e1e", textAlign: isMobile ? "center" : "right" }}>
          Built with <span style={{ color: "#39ff1433" }}>React</span> & passion
        </div>
      </footer>
    </Reveal>
  );
}
