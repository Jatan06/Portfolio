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
        justifyContent: "center",
        alignItems: "center",
        gap: isMobile ? "12px" : "0",
        position: "relative", zIndex: 2,
      }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#1e1e1e", letterSpacing: "0.05em", textAlign: "center" }}>
          © 2025 Jatan Parikh
        </div>
      </footer>
    </Reveal>
  );
}
