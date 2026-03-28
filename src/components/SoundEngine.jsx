import React, { useState, useEffect, useRef } from 'react';

/**
 * SoundEngine Component
 * Pure Web Audio API synthesis for background drone, space wind, and interaction tones.
 */
const SoundEngine = () => {
    const [isMuted, setIsMuted] = useState(() => {
        const stored = localStorage.getItem("jp_sound");
        if (!stored) return true; // Default to OFF to not startle users
        return stored === "off";
    });

    const audioCtxRef = useRef(null);
    const masterGainRef = useRef(null);
    const nodesRef = useRef({});

    // 1. Setup Audio Engine ──────────────────────────────────────────────────
    const initAudio = () => {
        if (audioCtxRef.current) return;
        
        const Context = window.AudioContext || window.webkitAudioContext;
        const ctx = new Context();
        audioCtxRef.current = ctx;

        // Master Gain (used for global mute fade)
        const master = ctx.createGain();
        master.gain.value = isMuted ? 0 : 1;
        master.connect(ctx.destination);
        masterGainRef.current = master;

        // A. Deep Space Drone (40Hz Sine)
        const drone = ctx.createOscillator();
        const droneGain = ctx.createGain();
        drone.type = 'sine';
        drone.frequency.value = 40;
        droneGain.gain.value = 0.025;
        drone.connect(droneGain).connect(master);
        drone.start();

        // B. Space Wind (White Noise + Bandpass)
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        const windFilter = ctx.createBiquadFilter();
        windFilter.type = 'bandpass';
        windFilter.frequency.value = 600;
        windFilter.Q.value = 1.5;
        const windGain = ctx.createGain();
        windGain.gain.value = 0.015;
        whiteNoise.connect(windFilter).connect(windGain).connect(master);
        whiteNoise.start();

        // C. Pulsar Ping (Loop every 9s)
        const pulsarInterval = setInterval(() => {
            if (isMuted) return;
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.frequency.value = 528;
            g.gain.setValueAtTime(0, ctx.currentTime);
            g.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.01);
            g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
            osc.connect(g).connect(master);
            osc.start();
            osc.stop(ctx.currentTime + 0.4);
        }, 9000);

        nodesRef.current = { pulsarInterval };
    };

    // 2. Interaction Handlers ────────────────────────────────────────────────
    useEffect(() => {
        const ctx = audioCtxRef.current;
        const master = masterGainRef.current;

        const playTone = (e) => {
            if (isMuted || !ctx) return;
            const { planetName } = e.detail;
            const freqs = { "About": 261, "Projects": 329, "Skills": 392, "Contact": 523 };
            const freq = freqs[planetName] || 440;

            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            g.gain.setValueAtTime(0, ctx.currentTime);
            g.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            osc.connect(g).connect(master);
            osc.start();
            osc.stop(ctx.currentTime + 0.4);
        };

        const playWhomp = () => {
            if (isMuted || !ctx) return;
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.frequency.setValueAtTime(80, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.6);
            g.gain.setValueAtTime(0, ctx.currentTime);
            g.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
            g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
            osc.connect(g).connect(master);
            osc.start();
            osc.stop(ctx.currentTime + 0.6);
        };

        window.addEventListener('play-planet-tone', playTone);
        window.addEventListener('play-click-sound', playWhomp);
        // iOS/Mobile: Ensure context resumes on first click
        const resumeCtx = () => { if (ctx && ctx.state === 'suspended') ctx.resume(); };
        window.addEventListener('click', resumeCtx);

        return () => {
            window.removeEventListener('play-planet-tone', playTone);
            window.removeEventListener('play-click-sound', playWhomp);
            window.removeEventListener('click', resumeCtx);
        };
    }, [isMuted]);

    // 3. Toggle Logic ────────────────────────────────────────────────────────
    const handleToggle = () => {
        const nextMuted = !isMuted;
        setIsMuted(nextMuted);
        localStorage.setItem("jp_sound", nextMuted ? "off" : "on");
        
        if (!audioCtxRef.current) {
            initAudio();
        } else {
            const master = masterGainRef.current;
            const ctx = audioCtxRef.current;
            master.gain.linearRampToValueAtTime(nextMuted ? 0 : 1, ctx.currentTime + 0.5);
        }
    };

    return (
        <button 
            onClick={handleToggle}
            style={{
                position: "fixed", bottom: "24px", right: "24px", zIndex: 200,
                width: "40px", height: "40px", borderRadius: "4px",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "#050505", border: "1px solid #39ff1444", color: "#39ff14",
                fontFamily: "'Space Mono', monospace", fontSize: "14px", cursor: "pointer",
                transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#39ff14"; e.currentTarget.style.transform = "scale(1.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#39ff1444"; e.currentTarget.style.transform = "scale(1)"; }}
        >
            {isMuted ? "🔇" : "🔊"}
        </button>
    );
};

export default SoundEngine;
