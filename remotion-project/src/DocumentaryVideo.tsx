import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Video,
} from "remotion";

// ─── palette ─────────────────────────────────────────────────────────────────
const AMBER = "#FF6B35";
const GOLD = "#FFD060";
const WHITE = "#FFFFFF";
const DARK = "#0A0A0A";

// ─── timing constants (frames @ 30 fps) ──────────────────────────────────────
const TOTAL = 2946; // 98.2 s

// ─── helpers ──────────────────────────────────────────────────────────────────
const fadeIn = (frame: number, start = 0, dur = 20) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const fadeOut = (frame: number, end: number, dur = 20) =>
  interpolate(frame, [end - dur, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const slideUp = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 80 } });

// ─── Vignette ─────────────────────────────────────────────────────────────────
const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse at 50% 40%, transparent 35%, rgba(0,0,0,0.72) 100%)",
      pointerEvents: "none",
    }}
  />
);

// ─── CinematicBars ───────────────────────────────────────────────────────────
const CinematicBars: React.FC = () => {
  const frame = useCurrentFrame();
  const barH = interpolate(frame, [0, 35], [0, 88], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: barH,
          background: DARK,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: barH,
          background: DARK,
        }}
      />
    </>
  );
};

// ─── AccentLine ───────────────────────────────────────────────────────────────
const AccentLine: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = slideUp(frame, fps, delay);
  return (
    <div
      style={{
        height: 3,
        width: interpolate(progress, [0, 1], [0, 120]),
        background: `linear-gradient(90deg, ${AMBER}, ${GOLD})`,
        borderRadius: 2,
        marginBottom: 10,
      }}
    />
  );
};

// ─── OpeningTitle ─────────────────────────────────────────────────────────────
const OpeningTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const lineProgress = slideUp(frame, fps, 5);
  const titleOpacity = fadeIn(frame, 15, 25);
  const titleY = interpolate(lineProgress, [0, 1], [40, 0]);
  const exitOpacity = fadeOut(frame, 90, 20);
  const combinedOpacity = Math.min(titleOpacity, exitOpacity);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "flex-start",
        paddingBottom: height * 0.38,
        paddingLeft: width * 0.08,
        opacity: combinedOpacity,
      }}
    >
      <AccentLine delay={5} />
      <div
        style={{
          transform: `translateY(${titleY}px)`,
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontSize: 48,
          fontWeight: 700,
          color: WHITE,
          lineHeight: 1.15,
          textShadow: "0 2px 24px rgba(0,0,0,0.8)",
          letterSpacing: -0.5,
          maxWidth: width * 0.82,
        }}
      >
        The Voice
        <br />
        <span style={{ color: AMBER }}>of the Youth</span>
      </div>
      <div
        style={{
          marginTop: 10,
          fontFamily: "'Arial', sans-serif",
          fontSize: 15,
          color: "rgba(255,255,255,0.65)",
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        A Short Documentary
      </div>
    </AbsoluteFill>
  );
};

// ─── LowerThird ───────────────────────────────────────────────────────────────
interface LowerThirdProps {
  name: string;
  title: string;
}

const LowerThird: React.FC<LowerThirdProps> = ({ name, title }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const progress = slideUp(frame, fps, 0);
  const x = interpolate(progress, [0, 1], [-300, 0]);
  const opacity = Math.min(fadeIn(frame, 0, 18), fadeOut(frame, 210, 25));

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "flex-start",
        paddingBottom: height * 0.17,
        paddingLeft: width * 0.06,
        opacity,
      }}
    >
      <div style={{ transform: `translateX(${x}px)` }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 6,
          }}
        >
          <div
            style={{
              width: 4,
              height: 42,
              background: `linear-gradient(180deg, ${AMBER}, ${GOLD})`,
              borderRadius: 2,
            }}
          />
          <div>
            <div
              style={{
                fontFamily: "'Arial Black', 'Arial', sans-serif",
                fontSize: 26,
                fontWeight: 900,
                color: WHITE,
                letterSpacing: 0.5,
                textShadow: "0 1px 12px rgba(0,0,0,0.9)",
              }}
            >
              {name}
            </div>
            <div
              style={{
                fontFamily: "'Arial', sans-serif",
                fontSize: 13,
                color: GOLD,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                marginTop: 2,
              }}
            >
              {title}
            </div>
          </div>
        </div>
        <div
          style={{
            height: 2,
            background: `linear-gradient(90deg, ${AMBER}aa, transparent)`,
            width: width * 0.75,
            marginLeft: 16,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ─── StatCallout ──────────────────────────────────────────────────────────────
interface StatCalloutProps {
  label: string;
  subtitle: string;
}

const StatCallout: React.FC<StatCalloutProps> = ({ label, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const progress = slideUp(frame, fps, 0);
  const scale = interpolate(progress, [0, 1], [0.6, 1]);
  const opacity = Math.min(fadeIn(frame, 0, 18), fadeOut(frame, 210, 25));

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "flex-end",
        paddingRight: width * 0.06,
        paddingBottom: height * 0.35,
        opacity,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          background: "rgba(0,0,0,0.72)",
          border: `1.5px solid ${AMBER}`,
          borderRadius: 12,
          padding: "16px 22px",
          backdropFilter: "blur(4px)",
          textAlign: "center",
          minWidth: 130,
        }}
      >
        <div
          style={{
            fontFamily: "'Arial Black', sans-serif",
            fontSize: 42,
            fontWeight: 900,
            color: GOLD,
            lineHeight: 1,
            letterSpacing: -1,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: "'Arial', sans-serif",
            fontSize: 11,
            color: "rgba(255,255,255,0.75)",
            letterSpacing: 1.5,
            textTransform: "uppercase",
            marginTop: 4,
          }}
        >
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── ChapterMarker ────────────────────────────────────────────────────────────
interface ChapterMarkerProps {
  text: string;
}

const ChapterMarker: React.FC<ChapterMarkerProps> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const progress = slideUp(frame, fps, 0);
  const opacity = Math.min(fadeIn(frame, 0, 12), fadeOut(frame, 90, 15));
  const lineW = interpolate(progress, [0, 1], [0, width * 0.8]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity,
      }}
    >
      <div
        style={{
          background: "rgba(0,0,0,0.85)",
          width: "100%",
          padding: "22px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            height: 1,
            width: lineW,
            background: `linear-gradient(90deg, transparent, ${AMBER}, transparent)`,
          }}
        />
        <div
          style={{
            fontFamily: "'Arial', sans-serif",
            fontSize: 13,
            color: AMBER,
            letterSpacing: 5,
            textTransform: "uppercase",
          }}
        >
          {text}
        </div>
        <div
          style={{
            height: 1,
            width: lineW,
            background: `linear-gradient(90deg, transparent, ${AMBER}, transparent)`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ─── ClosingSlate ─────────────────────────────────────────────────────────────
const ClosingSlate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = slideUp(frame, fps, 0);
  const bgOpacity = interpolate(frame, [0, 45, 270, 300], [0, 0.88, 0.88, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const contentOpacity = fadeIn(frame, 30, 30);
  const logoScale = interpolate(progress, [0, 1], [0.7, 1]);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: DARK,
          opacity: bgOpacity,
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 18,
          opacity: contentOpacity,
        }}
      >
        <div
          style={{
            transform: `scale(${logoScale})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: "50%",
              border: `2.5px solid ${AMBER}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,107,53,0.12)",
            }}
          >
            <span style={{ fontSize: 32 }}>🪳</span>
          </div>
          <div
            style={{
              fontFamily: "'Arial Black', sans-serif",
              fontSize: 20,
              fontWeight: 900,
              color: WHITE,
              letterSpacing: 1,
              textAlign: "center",
            }}
          >
            Cockroach Janta Party
          </div>
          <div
            style={{
              fontFamily: "'Arial', sans-serif",
              fontSize: 12,
              color: GOLD,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            Political Front of the Youth
          </div>
          <div
            style={{
              height: 1,
              width: 160,
              background: `linear-gradient(90deg, transparent, ${AMBER}, transparent)`,
              marginTop: 4,
            }}
          />
          <div
            style={{
              fontFamily: "'Arial', sans-serif",
              fontSize: 13,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: 2,
            }}
          >
            cockroachjantaparty.org
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── GrainOverlay ─────────────────────────────────────────────────────────────
const GrainOverlay: React.FC = () => (
  <AbsoluteFill
    style={{
      opacity: 0.035,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat",
      backgroundSize: "128px",
      mixBlendMode: "overlay",
      pointerEvents: "none",
    }}
  />
);

// ─── DocumentaryVideo (main composition) ─────────────────────────────────────
export const DocumentaryVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: DARK }}>
      {/* ── source footage ── */}
      <Video
        src={staticFile("source.webm")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* ── cinematic post-FX ── */}
      <Vignette />
      <GrainOverlay />

      {/* ── letterbox bars animate in over first 35 frames ── */}
      <CinematicBars />

      {/* ── opening title (0 – 3 s) ── */}
      <Sequence from={0} durationInFrames={90}>
        <OpeningTitle />
      </Sequence>

      {/* ── lower third name plate (2 s – 9 s) ── */}
      <Sequence from={60} durationInFrames={210}>
        <LowerThird
          name="Abhijeet Dipke"
          title="Founding President · Cockroach Janta Party"
        />
      </Sequence>

      {/* ── followers stat callout (12 s – 19 s) ── */}
      <Sequence from={360} durationInFrames={210}>
        <StatCallout label="6.3M" subtitle="Instagram followers" />
      </Sequence>

      {/* ── chapter marker (48 s – 51 s) ── */}
      <Sequence from={1440} durationInFrames={90}>
        <ChapterMarker text="The Youth Movement" />
      </Sequence>

      {/* ── closing slate (last 10 s) ── */}
      <Sequence from={TOTAL - 300} durationInFrames={300}>
        <ClosingSlate />
      </Sequence>
    </AbsoluteFill>
  );
};
