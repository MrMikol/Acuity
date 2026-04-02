/**
 * app/learn/[lessonId].tsx
 *
 * Full-screen paginated lesson viewer for Acuity.
 * Accessed via router.push('/learn/what-is-a-note') etc.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Spacing, Radius, Typography, type ColorTheme } from '../../src/theme';
import { NOTE_LESSONS, type LessonPage } from '../../src/data/noteLessons';
import { BASIC_INTERVAL_LESSONS, ALL_INTERVAL_LESSONS } from '../../src/data/intervalLessons';
import Svg, {
  Circle,
  Ellipse,
  Line,
  Path,
  Rect,
  G,
  Text as SvgText,
} from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Visuals ──────────────────────────────────────────────────────────────────

function WaveformVisual({ color }: { color: string }) {
  const points = [0, 8, 20, 36, 44, 36, 20, 8, 0, -8, -20, -36, -44, -36, -20, -8, 0];
  const step = 140 / (points.length - 1);
  const cx = 160;
  const cy = 60;

  const d = points
    .map((y, i) => `${i === 0 ? 'M' : 'L'} ${cx - 70 + i * step} ${cy + y}`)
    .join(' ');

  const d2 = points
    .map((y, i) => `${i === 0 ? 'M' : 'L'} ${cx - 70 + i * step} ${cy + 20 + y * 0.5}`)
    .join(' ');

  return (
    <Svg width={320} height={120} viewBox="0 0 320 120">
      <Path d={d2} stroke={color} strokeWidth={1.5} fill="none" opacity={0.2} />
      <Path
        d={d}
        stroke={color}
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.9}
      />
      <Circle cx={cx - 70 + 4 * step} cy={cy - 36} r={4} fill={color} opacity={0.8} />
    </Svg>
  );
}

function KeyboardVisual({ color, accentColor }: { color: string; accentColor: string }) {
  const whites = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  // Black key positions: index of the white key to the LEFT of each black key
  // C#=between C(0) and D(1), D#=between D(1) and E(2), F#=between F(3) and G(4), G#=between G(4) and A(5), A#=between A(5) and B(6)
  const blackAfterWhite = [0, 1, 3, 4, 5]; // white key index after which black key sits
  const keyW = 32;
  const keyH = 80;
  const gap = 3;
  const totalW = whites.length * (keyW + gap) - gap;
  const startX = (320 - totalW) / 2;
  const blackW = keyW * 0.6;
  const blackH = keyH * 0.6;

  return (
    <Svg width={320} height={110} viewBox="0 0 320 110">
      {whites.map((note, i) => (
        <Rect
          key={note}
          x={startX + i * (keyW + gap)}
          y={10}
          width={keyW}
          height={keyH}
          rx={4}
          fill={note === 'C' ? accentColor : color}
          opacity={note === 'C' ? 0.9 : 0.15}
        />
      ))}
      {blackAfterWhite.map((whiteIdx, i) => {
        // Center black key in the gap between white key whiteIdx and whiteIdx+1
        const leftEdge = startX + whiteIdx * (keyW + gap) + keyW;
        const x = leftEdge + gap / 2 - blackW / 2;
        return (
          <Rect
            key={i}
            x={x}
            y={10}
            width={blackW}
            height={blackH}
            rx={3}
            fill={color}
            opacity={0.75}
          />
        );
      })}
      <SvgText
        x={startX + keyW / 2}
        y={102}
        fontSize={10}
        fontWeight="700"
        fill={accentColor}
        textAnchor="middle"
        opacity={0.9}
      >
        C4
      </SvgText>
    </Svg>
  );
}

function OctaveVisual({ color, accentColor }: { color: string; accentColor: string }) {
  return (
    <Svg width={320} height={110} viewBox="0 0 320 110">
      <Circle cx={100} cy={55} r={38} stroke={color} strokeWidth={2} fill="none" opacity={0.3} />
      <Circle cx={100} cy={55} r={24} stroke={accentColor} strokeWidth={2.5} fill={accentColor} opacity={0.15} />
      <Circle cx={220} cy={55} r={24} stroke={color} strokeWidth={2} fill="none" opacity={0.3} />
      <Circle cx={220} cy={55} r={14} stroke={accentColor} strokeWidth={2} fill={accentColor} opacity={0.1} />
      <SvgText x={100} y={59} fontSize={13} fontWeight="700" fill={accentColor} textAnchor="middle" opacity={0.9}>
        C3
      </SvgText>
      <SvgText x={220} y={59} fontSize={13} fontWeight="700" fill={color} textAnchor="middle" opacity={0.6}>
        C4
      </SvgText>
      <Line x1={136} y1={55} x2={196} y2={55} stroke={color} strokeWidth={1.5} opacity={0.4} />
      <Path d="M 192 50 L 200 55 L 192 60" stroke={color} strokeWidth={1.5} fill="none" opacity={0.4} />
      <SvgText x={165} y={48} fontSize={10} fontWeight="600" fill={color} textAnchor="middle" opacity={0.5}>
        ×2 freq
      </SvgText>
    </Svg>
  );
}

function EarVisual({ color, accentColor }: { color: string; accentColor: string }) {
  return (
    <Svg width={320} height={110} viewBox="0 0 320 110">
      {[48, 36, 24].map((r, i) => (
        <Circle
          key={r}
          cx={160}
          cy={55}
          r={r}
          stroke={accentColor}
          strokeWidth={1.5}
          fill="none"
          opacity={0.15 + i * 0.12}
        />
      ))}
      <Circle cx={160} cy={55} r={10} fill={accentColor} opacity={0.7} />
      <Path d="M 176 47 Q 210 30 230 45" stroke={color} strokeWidth={1.5} fill="none" opacity={0.3} strokeLinecap="round" />
      <Path d="M 176 55 Q 215 55 240 55" stroke={color} strokeWidth={1.5} fill="none" opacity={0.3} strokeLinecap="round" />
      <Path d="M 176 63 Q 210 78 230 65" stroke={color} strokeWidth={1.5} fill="none" opacity={0.3} strokeLinecap="round" />
      <Circle cx={230} cy={45} r={4} fill={color} opacity={0.4} />
      <Circle cx={240} cy={55} r={4} fill={color} opacity={0.4} />
      <Circle cx={230} cy={65} r={4} fill={color} opacity={0.4} />
    </Svg>
  );
}

function ExerciseVisual({ color, accentColor }: { color: string; accentColor: string }) {
  const notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const btnW = 36;
  const gap = 6;
  const totalW = notes.length * (btnW + gap) - gap;
  const startX = (320 - totalW) / 2;

  return (
    <Svg width={320} height={110} viewBox="0 0 320 110">
      <SvgText
        x={160}
        y={48}
        fontSize={32}
        fontWeight="700"
        fill={accentColor}
        textAnchor="middle"
        opacity={0.6}
      >
        ?
      </SvgText>
      {notes.map((n, i) => (
        <G key={n}>
          <Rect
            x={startX + i * (btnW + gap)}
            y={65}
            width={btnW}
            height={btnW}
            rx={8}
            fill={n === 'C' ? accentColor : color}
            opacity={n === 'C' ? 0.25 : 0.1}
          />
          <SvgText
            x={startX + i * (btnW + gap) + btnW / 2}
            y={88}
            fontSize={13}
            fontWeight="700"
            fill={n === 'C' ? accentColor : color}
            textAnchor="middle"
            opacity={n === 'C' ? 0.9 : 0.5}
          >
            {n}
          </SvgText>
        </G>
      ))}
    </Svg>
  );
}

// ─── Interval Visuals ─────────────────────────────────────────────────────────

function IntervalIntroVisual({ color, accentColor }: { color: string; accentColor: string }) {
  // Two notes connected by an arc showing "distance"
  return (
    <Svg width={320} height={110} viewBox="0 0 320 110">
      {/* Left note */}
      <Ellipse cx={100} cy={70} rx={14} ry={10} fill={accentColor} opacity={0.85} />
      <Line x1={114} y1={70} x2={114} y2={30} stroke={accentColor} strokeWidth={2} opacity={0.85} />
      {/* Right note */}
      <Ellipse cx={220} cy={50} rx={14} ry={10} fill={color} opacity={0.5} />
      <Line x1={234} y1={50} x2={234} y2={10} stroke={color} strokeWidth={2} opacity={0.5} />
      {/* Arc showing distance */}
      <Path d="M 114 55 Q 160 20 220 40" stroke={accentColor} strokeWidth={1.5} fill="none" strokeDasharray="4 3" opacity={0.6} />
      {/* Distance label */}
      <SvgText x={162} y={28} fontSize={11} fontWeight="600" fill={accentColor} textAnchor="middle" opacity={0.8}>interval</SvgText>
    </Svg>
  );
}

function HalfStepsVisual({ color, accentColor }: { color: string; accentColor: string }) {
  // Piano keys highlighting half steps and whole steps
  const whites = [0, 1, 2, 3, 4, 5, 6];
  const keyW = 28; const keyH = 70; const gap = 3;
  const totalW = whites.length * (keyW + gap) - gap;
  const startX = (320 - totalW) / 2;
  const blackPos = [0.6, 1.6, 3.6, 4.6, 5.6];

  return (
    <Svg width={320} height={110} viewBox="0 0 320 110">
      {whites.map((_, i) => (
        <Rect key={i} x={startX + i * (keyW + gap)} y={20} width={keyW} height={keyH}
          rx={3} fill={i === 0 || i === 1 ? accentColor : color}
          opacity={i === 0 || i === 1 ? 0.7 : 0.12} />
      ))}
      {blackPos.map((pos, i) => (
        <Rect key={i} x={startX + pos * (keyW + gap) - 8} y={20} width={16} height={keyH * 0.58}
          rx={2} fill={color} opacity={0.65} />
      ))}
      {/* Half step bracket */}
      <Path d={`M ${startX + keyW} 10 L ${startX + keyW} 5 L ${startX + keyW + gap + keyW} 5 L ${startX + keyW + gap + keyW} 10`}
        stroke={accentColor} strokeWidth={1.5} fill="none" opacity={0.8} />
      <SvgText x={startX + keyW + (keyW + gap) / 2} y={4} fontSize={9} fontWeight="700"
        fill={accentColor} textAnchor="middle" opacity={0.9}>½ step</SvgText>
    </Svg>
  );
}

function SecondsVisual({ color, accentColor }: { color: string; accentColor: string }) {
  return (
    <Svg width={320} height={110} viewBox="0 0 320 110">
      {/* m2 */}
      <SvgText x={80} y={30} fontSize={10} fontWeight="700" fill={accentColor} textAnchor="middle" opacity={0.7}>m2 — 1 half step</SvgText>
      <Circle cx={55} cy={70} r={18} fill={accentColor} opacity={0.2} stroke={accentColor} strokeWidth={1.5} />
      <Circle cx={105} cy={70} r={18} fill={accentColor} opacity={0.6} stroke={accentColor} strokeWidth={1.5} />
      <SvgText x={55} y={74} fontSize={11} fontWeight="700" fill={color} textAnchor="middle">E</SvgText>
      <SvgText x={105} y={74} fontSize={11} fontWeight="700" fill={color} textAnchor="middle">F</SvgText>
      {/* M2 */}
      <SvgText x={240} y={30} fontSize={10} fontWeight="700" fill={color} textAnchor="middle" opacity={0.6}>M2 — 2 half steps</SvgText>
      <Circle cx={210} cy={70} r={18} fill={color} opacity={0.1} stroke={color} strokeWidth={1.5} />
      <Circle cx={270} cy={70} r={18} fill={color} opacity={0.35} stroke={color} strokeWidth={1.5} />
      <SvgText x={210} y={74} fontSize={11} fontWeight="700" fill={color} textAnchor="middle">C</SvgText>
      <SvgText x={270} y={74} fontSize={11} fontWeight="700" fill={color} textAnchor="middle">D</SvgText>
    </Svg>
  );
}

function ThirdsVisual({ color, accentColor }: { color: string; accentColor: string }) {
  return (
    <Svg width={320} height={110} viewBox="0 0 320 110">
      {/* M3 */}
      <SvgText x={80} y={22} fontSize={10} fontWeight="700" fill={accentColor} textAnchor="middle" opacity={0.8}>M3 — 4 half steps</SvgText>
      <Circle cx={45} cy={70} r={18} fill={accentColor} opacity={0.2} stroke={accentColor} strokeWidth={1.5} />
      <Circle cx={115} cy={70} r={18} fill={accentColor} opacity={0.7} stroke={accentColor} strokeWidth={1.5} />
      <SvgText x={45} y={74} fontSize={11} fontWeight="700" fill={color} textAnchor="middle">C</SvgText>
      <SvgText x={115} y={74} fontSize={11} fontWeight="700" fill={color} textAnchor="middle">E</SvgText>
      <SvgText x={80} y={98} fontSize={9} fill={color} textAnchor="middle" opacity={0.5}>bright, happy</SvgText>
      {/* m3 */}
      <SvgText x={240} y={22} fontSize={10} fontWeight="700" fill={color} textAnchor="middle" opacity={0.6}>m3 — 3 half steps</SvgText>
      <Circle cx={205} cy={70} r={18} fill={color} opacity={0.1} stroke={color} strokeWidth={1.5} />
      <Circle cx={275} cy={70} r={18} fill={color} opacity={0.4} stroke={color} strokeWidth={1.5} />
      <SvgText x={205} y={74} fontSize={11} fontWeight="700" fill={color} textAnchor="middle">A</SvgText>
      <SvgText x={275} y={74} fontSize={11} fontWeight="700" fill={color} textAnchor="middle">C</SvgText>
      <SvgText x={240} y={98} fontSize={9} fill={color} textAnchor="middle" opacity={0.5}>dark, tender</SvgText>
    </Svg>
  );
}

function FourthsFifthsVisual({ color, accentColor }: { color: string; accentColor: string }) {
  return (
    <Svg width={320} height={110} viewBox="0 0 320 110">
      {/* P4 */}
      <SvgText x={80} y={22} fontSize={10} fontWeight="700" fill={accentColor} textAnchor="middle" opacity={0.8}>P4 — 5 half steps</SvgText>
      <Circle cx={40} cy={68} r={20} fill={accentColor} opacity={0.15} stroke={accentColor} strokeWidth={2} />
      <Circle cx={120} cy={68} r={20} fill={accentColor} opacity={0.65} stroke={accentColor} strokeWidth={2} />
      <SvgText x={40} y={73} fontSize={12} fontWeight="700" fill={color} textAnchor="middle">C</SvgText>
      <SvgText x={120} y={73} fontSize={12} fontWeight="700" fill={color} textAnchor="middle">F</SvgText>
      <SvgText x={80} y={100} fontSize={9} fill={color} textAnchor="middle" opacity={0.5}>strong, grounded</SvgText>
      {/* P5 */}
      <SvgText x={240} y={22} fontSize={10} fontWeight="700" fill={color} textAnchor="middle" opacity={0.6}>P5 — 7 half steps</SvgText>
      <Circle cx={200} cy={68} r={20} fill={color} opacity={0.08} stroke={color} strokeWidth={2} />
      <Circle cx={280} cy={68} r={20} fill={color} opacity={0.45} stroke={color} strokeWidth={2} />
      <SvgText x={200} y={73} fontSize={12} fontWeight="700" fill={color} textAnchor="middle">C</SvgText>
      <SvgText x={280} y={73} fontSize={12} fontWeight="700" fill={color} textAnchor="middle">G</SvgText>
      <SvgText x={240} y={100} fontSize={9} fill={color} textAnchor="middle" opacity={0.5}>noble, resonant</SvgText>
    </Svg>
  );
}

function IntervalMapVisual({ color, accentColor, blushColor }: { color: string; accentColor: string; blushColor: string }) {
  const intervals = ['m2','M2','m3','M3','P4','TT','P5','m6','M6','m7','M7','P8'];
  const total = intervals.length;
  const barW = (280) / total;
  const startX = 20;

  return (
    <Svg width={320} height={110} viewBox="0 0 320 110">
      {intervals.map((name, i) => {
        const isKnown = i < 6;
        const isTritone = name === 'TT';
        const h = 20 + (i / total) * 50;
        return (
          <G key={name}>
            <Rect x={startX + i * barW + 1} y={90 - h} width={barW - 2} height={h}
              rx={2}
              fill={isTritone ? blushColor : isKnown ? accentColor : color}
              opacity={isKnown ? 0.7 : 0.3} />
            <SvgText x={startX + i * barW + barW / 2} y={105} fontSize={7} fontWeight="600"
              fill={color} textAnchor="middle" opacity={0.7}>{name}</SvgText>
          </G>
        );
      })}
    </Svg>
  );
}

function SixthsVisual({ color, accentColor }: { color: string; accentColor: string }) {
  return (
    <Svg width={320} height={110} viewBox="0 0 320 110">
      <SvgText x={80} y={22} fontSize={10} fontWeight="700" fill={accentColor} textAnchor="middle" opacity={0.8}>M6 — 9 half steps</SvgText>
      <Circle cx={35} cy={68} r={20} fill={accentColor} opacity={0.15} stroke={accentColor} strokeWidth={2} />
      <Circle cx={125} cy={68} r={20} fill={accentColor} opacity={0.65} stroke={accentColor} strokeWidth={2} />
      <SvgText x={35} y={73} fontSize={12} fontWeight="700" fill={color} textAnchor="middle">C</SvgText>
      <SvgText x={125} y={73} fontSize={12} fontWeight="700" fill={color} textAnchor="middle">A</SvgText>
      <SvgText x={80} y={100} fontSize={9} fill={color} textAnchor="middle" opacity={0.5}>warm, nostalgic</SvgText>
      <SvgText x={240} y={22} fontSize={10} fontWeight="700" fill={color} textAnchor="middle" opacity={0.6}>m6 — 8 half steps</SvgText>
      <Circle cx={200} cy={68} r={20} fill={color} opacity={0.08} stroke={color} strokeWidth={2} />
      <Circle cx={280} cy={68} r={20} fill={color} opacity={0.4} stroke={color} strokeWidth={2} />
      <SvgText x={200} y={73} fontSize={12} fontWeight="700" fill={color} textAnchor="middle">C</SvgText>
      <SvgText x={280} y={73} fontSize={12} fontWeight="700" fill={color} textAnchor="middle">A♭</SvgText>
      <SvgText x={240} y={100} fontSize={9} fill={color} textAnchor="middle" opacity={0.5}>bittersweet</SvgText>
    </Svg>
  );
}

function SeventhsVisual({ color, accentColor }: { color: string; accentColor: string }) {
  return (
    <Svg width={320} height={110} viewBox="0 0 320 110">
      <SvgText x={80} y={22} fontSize={10} fontWeight="700" fill={accentColor} textAnchor="middle" opacity={0.8}>m7 — 10 half steps</SvgText>
      <Circle cx={35} cy={68} r={20} fill={accentColor} opacity={0.15} stroke={accentColor} strokeWidth={2} />
      <Circle cx={125} cy={68} r={20} fill={accentColor} opacity={0.65} stroke={accentColor} strokeWidth={2} />
      <SvgText x={35} y={73} fontSize={12} fontWeight="700" fill={color} textAnchor="middle">C</SvgText>
      <SvgText x={125} y={73} fontSize={12} fontWeight="700" fill={color} textAnchor="middle">B♭</SvgText>
      <SvgText x={80} y={100} fontSize={9} fill={color} textAnchor="middle" opacity={0.5}>bluesy tension</SvgText>
      <SvgText x={240} y={22} fontSize={10} fontWeight="700" fill={color} textAnchor="middle" opacity={0.6}>M7 — 11 half steps</SvgText>
      <Circle cx={200} cy={68} r={20} fill={color} opacity={0.08} stroke={color} strokeWidth={2} />
      <Circle cx={280} cy={68} r={20} fill={color} opacity={0.4} stroke={color} strokeWidth={2} />
      <SvgText x={200} y={73} fontSize={12} fontWeight="700" fill={color} textAnchor="middle">C</SvgText>
      <SvgText x={280} y={73} fontSize={12} fontWeight="700" fill={color} textAnchor="middle">B</SvgText>
      <SvgText x={240} y={100} fontSize={9} fill={color} textAnchor="middle" opacity={0.5}>lush, suspended</SvgText>
    </Svg>
  );
}

function TritoneVisual({ color, accentColor }: { color: string; accentColor: string }) {
  // Show it as the exact midpoint of the octave
  return (
    <Svg width={320} height={110} viewBox="0 0 320 110">
      {/* Octave bar */}
      <Line x1={40} y1={55} x2={280} y2={55} stroke={color} strokeWidth={2} opacity={0.2} />
      <Circle cx={40} cy={55} r={14} fill={color} opacity={0.3} stroke={color} strokeWidth={1.5} />
      <Circle cx={280} cy={55} r={14} fill={color} opacity={0.3} stroke={color} strokeWidth={1.5} />
      <SvgText x={40} y={59} fontSize={11} fontWeight="700" fill={color} textAnchor="middle" opacity={0.8}>C</SvgText>
      <SvgText x={280} y={59} fontSize={11} fontWeight="700" fill={color} textAnchor="middle" opacity={0.8}>C</SvgText>
      {/* Midpoint — tritone */}
      <Circle cx={160} cy={55} r={18} fill={accentColor} opacity={0.7} stroke={accentColor} strokeWidth={2} />
      <SvgText x={160} y={59} fontSize={11} fontWeight="700" fill={color} textAnchor="middle">F♯</SvgText>
      <SvgText x={160} y={90} fontSize={10} fontWeight="600" fill={accentColor} textAnchor="middle" opacity={0.9}>6 half steps</SvgText>
      <SvgText x={160} y={20} fontSize={9} fill={color} textAnchor="middle" opacity={0.6}>exact midpoint of the octave</SvgText>
    </Svg>
  );
}

function IntervalExerciseVisual({ color, accentColor }: { color: string; accentColor: string }) {
  const labels = ['m2','M2','m3','M3','P4','P5'];
  const btnW = 40; const gap = 5;
  const totalW = labels.length * (btnW + gap) - gap;
  const startX = (320 - totalW) / 2;
  return (
    <Svg width={320} height={110} viewBox="0 0 320 110">
      <SvgText x={160} y={35} fontSize={28} fontWeight="700" fill={accentColor} textAnchor="middle" opacity={0.5}>?</SvgText>
      {labels.map((l, i) => (
        <G key={l}>
          <Rect x={startX + i * (btnW + gap)} y={48} width={btnW} height={32} rx={6}
            fill={i === 3 ? accentColor : color} opacity={i === 3 ? 0.25 : 0.1} />
          <SvgText x={startX + i * (btnW + gap) + btnW / 2} y={69} fontSize={10} fontWeight="700"
            fill={i === 3 ? accentColor : color} textAnchor="middle" opacity={i === 3 ? 0.9 : 0.5}>{l}</SvgText>
        </G>
      ))}
    </Svg>
  );
}

function LessonVisual({
  visual,
  colors,
}: {
  visual: LessonPage['visual'];
  colors: ColorTheme;
}) {
  if (!visual) return null;
  const props = { color: colors.slate, accentColor: colors.sage };

  switch (visual) {
    case 'waveform':        return <WaveformVisual color={colors.slate} />;
    case 'keyboard':        return <KeyboardVisual {...props} />;
    case 'octave':          return <OctaveVisual {...props} />;
    case 'ear':             return <EarVisual {...props} />;
    case 'exercise':        return <ExerciseVisual {...props} />;
    case 'interval_intro':  return <IntervalIntroVisual {...props} />;
    case 'half_steps':      return <HalfStepsVisual {...props} />;
    case 'seconds':         return <SecondsVisual {...props} />;
    case 'thirds':          return <ThirdsVisual {...props} />;
    case 'fourths_fifths':  return <FourthsFifthsVisual {...props} />;
    case 'interval_exercise': return <IntervalExerciseVisual {...props} />;
    case 'interval_map':    return <IntervalMapVisual color={colors.slate} accentColor={colors.sage} blushColor={colors.blush} />;
    case 'sixths':          return <SixthsVisual {...props} />;
    case 'sevenths':        return <SeventhsVisual {...props} />;
    case 'tritone':         return <TritoneVisual {...props} />;
    default:                return null;
  }
}

// ─── Page renderer ────────────────────────────────────────────────────────────

function LessonPageView({
  page,
  colors,
  styles,
  onCta,
}: {
  page: LessonPage;
  colors: ColorTheme;
  styles: ReturnType<typeof createStyles>;
  onCta: () => void;
}) {
  const isTip = page.type === 'tip';
  const isCta = page.type === 'cta';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.surface }}
      contentContainerStyle={styles.pageContent}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      {page.visual && !isTip && (
        <View style={styles.visualContainer}>
          <LessonVisual visual={page.visual} colors={colors} />
        </View>
      )}

      {isTip && (
        <View style={[styles.tipAccent, { backgroundColor: `${colors.sage}18`, borderColor: `${colors.sage}40` }]}>
          <Text style={[styles.tipLabel, { color: colors.sage }]}>TIP</Text>
        </View>
      )}

      {page.eyebrow && (
        <Text style={[styles.eyebrow, { color: isTip ? colors.sage : colors.textMuted }]}>
          {page.eyebrow.toUpperCase()}
        </Text>
      )}

      <Text style={[styles.heading, { color: colors.text }]}>{page.heading}</Text>
      <Text style={[styles.body, { color: colors.textSecondary }]}>{page.body}</Text>

      {isCta && page.ctaLabel && (
        <Pressable style={[styles.ctaBtn, { backgroundColor: colors.slate }]} onPress={onCta}>
          <Text style={[styles.ctaBtnText, { color: colors.textOnSlate }]}>
            {page.ctaLabel}
          </Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function LessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors);

  const ALL_LESSONS = [...NOTE_LESSONS, ...BASIC_INTERVAL_LESSONS, ...ALL_INTERVAL_LESSONS];
  const lesson = ALL_LESSONS.find((l) => l.id === lessonId);
  const [pageIndex, setPageIndex] = useState(0);

  if (!lesson) {
    return (
      <View style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.textMuted }}>Lesson not found.</Text>
      </View>
    );
  }

  const page = lesson.pages[pageIndex];
  const isFirst = pageIndex === 0;
  const isLast = pageIndex === lesson.pages.length - 1;
  const progress = (pageIndex + 1) / lesson.pages.length;

  const currentIndex = ALL_LESSONS.findIndex((l) => l.id === lessonId);
  const nextLesson = ALL_LESSONS[currentIndex + 1] ?? null;

  const handleNext = () => { if (!isLast) setPageIndex((i) => i + 1); };
  const handlePrev = () => {
    if (!isFirst) setPageIndex((i) => i - 1);
    else router.back();
  };
  const handleCta = () => {
    router.back();
    setTimeout(() => router.push('/(tabs)/practice'), 400);
  };
  const handleFinish = () => {
    if (nextLesson) {
      router.replace(`/learn/${nextLesson.id}`);
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>

      {/* Logo header — cream like the tab headers */}
      <View style={[styles.logoHeader, { paddingTop: insets.top, borderBottomColor: colors.border, backgroundColor: colors.background }]}>
        <Image
          source={require('../../assets/logo.png')}
          style={{ width: 120, height: 28, resizeMode: 'contain' }}
        />
      </View>

      <View style={[styles.header, { backgroundColor: colors.slate }]}>
        <Pressable onPress={handlePrev} hitSlop={12} style={styles.backBtn}>
          <Text style={[styles.backText, { color: colors.textOnSlate }]}>
            {isFirst ? '← Back' : '← Prev'}
          </Text>
        </Pressable>
        <Text style={[styles.lessonTitle, { color: colors.textOnSlate }]} numberOfLines={1}>
          {lesson.title}
        </Text>
        <Text style={[styles.pageCounter, { color: `${colors.textOnSlate}99` }]}>
          {pageIndex + 1}/{lesson.pages.length}
        </Text>
        <View style={[styles.progressTrack, { backgroundColor: colors.slateDark }]}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: colors.textOnSlate, width: `${progress * 100}%` },
            ]}
          />
        </View>
      </View>

      <LessonPageView page={page} colors={colors} styles={styles} onCta={handleCta} />

      {!isLast && (
        <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.surface, paddingBottom: Math.max(insets.bottom, Spacing.lg) }]}>
          <Pressable
            style={[styles.backToMenuBtn, { borderColor: colors.border }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.backToMenuText, { color: colors.textSecondary }]}>
              ← Menu
            </Text>
          </Pressable>
          <Pressable
            style={[styles.nextBtn, { backgroundColor: colors.slate }]}
            onPress={handleNext}
          >
            <Text style={[styles.nextBtnText, { color: colors.textOnSlate }]}>
              Continue →
            </Text>
          </Pressable>
        </View>
      )}

      {isLast && page.type !== 'cta' && (
        <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.surface, paddingBottom: Math.max(insets.bottom, Spacing.lg) }]}>
          <Pressable
            style={[styles.backToMenuBtn, { borderColor: colors.border }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.backToMenuText, { color: colors.textSecondary }]}>
              ← Menu
            </Text>
          </Pressable>
          <Pressable
            style={[styles.nextBtn, { backgroundColor: colors.slate }]}
            onPress={handleFinish}
          >
            <Text style={[styles.nextBtnText, { color: colors.textOnSlate }]}>
              {nextLesson ? `Next lesson →` : '← Back to Learn'}
            </Text>
          </Pressable>
        </View>
      )}

    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

function createStyles(colors: ColorTheme) {
  return StyleSheet.create({
    root: { flex: 1 },

    logoHeader: {
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingBottom: Spacing.sm,
      borderBottomWidth: 1,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.sm,
      paddingBottom: 0,
      gap: Spacing.sm,
      flexWrap: 'wrap',
    },
    progressTrack: {
      width: '100%',
      height: 3,
      borderRadius: 0,
      overflow: 'hidden',
      marginTop: Spacing.sm,
    },
    backBtn: { minWidth: 60 },
    backText: {
      fontSize: Typography.sm,
      fontWeight: Typography.semibold,
    },
    lessonTitle: {
      flex: 1,
      fontSize: Typography.sm,
      fontWeight: Typography.medium,
      textAlign: 'center',
    },
    pageCounter: {
      fontSize: Typography.sm,
      fontWeight: Typography.medium,
      minWidth: 60,
      textAlign: 'right',
    },

    progressFill: {
      height: '100%',
      borderRadius: Radius.full,
    },

    pageContent: {
      paddingHorizontal: Spacing.xl,
      paddingTop: Spacing.xl,
      paddingBottom: Spacing['3xl'],
    },
    visualContainer: {
      alignItems: 'center',
      marginBottom: Spacing.xl,
      backgroundColor: colors.surfaceAlt,
      borderRadius: Radius.xl,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: Spacing.lg,
      overflow: 'hidden',
    },
    tipAccent: {
      alignSelf: 'flex-start',
      borderWidth: 1,
      borderRadius: Radius.md,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      marginBottom: Spacing.lg,
    },
    tipLabel: {
      fontSize: Typography.xs,
      fontWeight: Typography.bold,
      letterSpacing: 1,
    },
    eyebrow: {
      fontSize: Typography.xs,
      fontWeight: Typography.bold,
      letterSpacing: 1.2,
      marginBottom: Spacing.sm,
    },
    heading: {
      fontSize: Typography['2xl'],
      fontWeight: Typography.bold,
      marginBottom: Spacing.lg,
      lineHeight: Typography['2xl'] * 1.2,
    },
    body: {
      fontSize: Typography.base,
      lineHeight: Typography.base * Typography.relaxed,
      marginBottom: Spacing.xl,
    },
    ctaBtn: {
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing['2xl'],
      borderRadius: Radius.lg,
      alignItems: 'center',
      marginTop: Spacing.md,
    },
    ctaBtnText: {
      fontSize: Typography.md,
      fontWeight: Typography.semibold,
    },

    footer: {
      borderTopWidth: 1,
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.lg,
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    backToMenuBtn: {
      borderWidth: 1,
      borderRadius: Radius.lg,
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backToMenuText: {
      fontSize: Typography.sm,
      fontWeight: Typography.semibold,
    },
    nextBtn: {
      flex: 1,
      paddingVertical: Spacing.lg,
      borderRadius: Radius.lg,
      alignItems: 'center',
    },
    nextBtnText: {
      fontSize: Typography.md,
      fontWeight: Typography.semibold,
    },
  });
}