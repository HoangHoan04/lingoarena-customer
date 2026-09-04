"use client";

import React, { useEffect, useState } from "react";
import type { AiStatusState } from "@/types/ai-conversation";

export type AnimeCharacterId = "yuki-sarah" | "kaito-david" | "duo-mascot" | "hana-emma" | "ren-james";

interface DuolingoAnimeCharacterProps {
  characterId: AnimeCharacterId;
  status: AiStatusState;
  className?: string;
}

export default function DuolingoAnimeCharacter({
  characterId,
  status,
  className = "",
}: DuolingoAnimeCharacterProps) {
  const [blink, setBlink] = useState(false);

  // Natural blinking interval
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 220);
    }, Math.random() * 2000 + 3000);

    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Dynamic Background Aura depending on AI status */}
      <div
        className={`absolute inset-0 rounded-full blur-3xl transition-all duration-700 pointer-events-none ${
          status === "speaking"
            ? "bg-blue-500/25 scale-110"
            : status === "listening"
            ? "bg-emerald-500/25 scale-105"
            : status === "thinking"
            ? "bg-amber-500/25 scale-100"
            : "bg-purple-500/15 scale-95"
        }`}
      />

      {/* Floating Emotion Sparkles & Emotes */}
      {status === "speaking" && (
        <div className="absolute -top-4 -right-4 flex items-center gap-1.5 z-20 animate-bounce">
          <span className="text-xl">💬</span>
          <span className="size-2 rounded-full bg-blue-400 animate-ping" />
        </div>
      )}
      {status === "listening" && (
        <div className="absolute -top-4 -left-4 flex items-center gap-1.5 z-20 animate-pulse">
          <span className="text-xl">👂</span>
          <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
      )}
      {status === "thinking" && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 z-20 animate-bounce">
          <span className="text-xl">💭</span>
          <span className="size-2.5 rounded-full bg-amber-400 animate-ping" />
        </div>
      )}

      {/* Render Selected Character SVG Animation */}
      {characterId === "duo-mascot" ? (
        <DuoOwlMascot status={status} blink={blink} />
      ) : characterId === "kaito-david" ? (
        <KaitoAnimeCharacter status={status} blink={blink} />
      ) : characterId === "hana-emma" ? (
        <HanaAnimeCharacter status={status} blink={blink} />
      ) : characterId === "ren-james" ? (
        <RenAnimeCharacter status={status} blink={blink} />
      ) : (
        <YukiAnimeCharacter status={status} blink={blink} />
      )}

      {/* Duolingo Style Stage Shadow */}
      <div className="w-48 sm:w-60 h-4 bg-black/30 dark:bg-black/50 rounded-full blur-xs mt-[-14px] z-0 animate-pulse" />
    </div>
  );
}

/* =========================================================================
   1. YUKI / SARAH (Duolingo Style Anime Teacher with Headset & Bob Hair)
   ========================================================================= */
function YukiAnimeCharacter({ status, blink }: { status: AiStatusState; blink: boolean }) {
  const isSpeaking = status === "speaking";
  const isListening = status === "listening";
  const isThinking = status === "thinking";

  return (
    <svg
      viewBox="0 0 320 360"
      className={`w-60 sm:w-72 h-auto z-10 filter drop-shadow-xl transition-transform duration-300 ${
        isSpeaking
          ? "animate-[duo-bounce_0.6s_ease-in-out_infinite]"
          : isListening
          ? "animate-[duo-sway_2s_ease-in-out_infinite] scale-102"
          : isThinking
          ? "animate-[duo-tilt_1.5s_ease-in-out_infinite]"
          : "animate-[duo-breathe_3s_ease-in-out_infinite]"
      }`}
    >
      <defs>
        <linearGradient id="yukiHair" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
        <linearGradient id="yukiOutfit" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="skin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF1E6" />
          <stop offset="100%" stopColor="#FDE0D0" />
        </linearGradient>
      </defs>

      <style>{`
        @keyframes duo-breathe {
          0%, 100% { transform: translateY(0px) scale(1, 1); }
          50% { transform: translateY(-4px) scale(1.01, 0.99); }
        }
        @keyframes duo-bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes duo-sway {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes duo-tilt {
          0%, 100% { transform: rotate(-4deg) translateY(-2px); }
          50% { transform: rotate(0deg) translateY(0px); }
        }
        @keyframes talkMouth {
          0%, 100% { d: path("M 148 206 Q 160 216 172 206 Z"); }
          50% { d: path("M 148 206 Q 160 226 172 206 Z"); }
        }
      `}</style>

      {/* Back Hair */}
      <path
        d="M 90 140 C 70 240 100 280 120 290 C 130 250 140 240 150 240 C 170 240 180 250 200 290 C 220 280 250 240 230 140 Z"
        fill="url(#yukiHair)"
      />

      {/* Body / Torso / Clothes */}
      <path
        d="M 115 250 C 115 240 135 230 160 230 C 185 230 205 240 205 250 L 225 330 C 225 340 210 345 160 345 C 110 345 95 340 95 330 Z"
        fill="url(#yukiOutfit)"
      />

      {/* Collar / Tie */}
      <polygon points="160,240 148,270 160,285 172,270" fill="#F59E0B" />
      <polygon points="148,240 160,255 160,240" fill="#FFFFFF" />
      <polygon points="172,240 160,255 160,240" fill="#E2E8F0" />

      {/* Arms & Hands */}
      {isSpeaking ? (
        <>
          {/* Gesturing Hand Left */}
          <path
            d="M 105 255 Q 80 270 75 295 Q 85 305 95 290 L 115 270"
            fill="#FDE0D0"
            stroke="#1D4ED8"
            strokeWidth="3"
          />
          {/* Gesturing Hand Right */}
          <path
            d="M 215 255 Q 240 270 245 295 Q 235 305 225 290 L 205 270"
            fill="#FDE0D0"
            stroke="#1D4ED8"
            strokeWidth="3"
          />
        </>
      ) : isThinking ? (
        <>
          {/* Hand to chin thinking */}
          <path
            d="M 215 260 Q 230 240 200 225 Q 185 225 180 235 L 205 280"
            fill="#FDE0D0"
            stroke="#1D4ED8"
            strokeWidth="3"
          />
          <path
            d="M 105 260 Q 95 285 100 310"
            fill="#FDE0D0"
            stroke="#1D4ED8"
            strokeWidth="3"
          />
        </>
      ) : (
        <>
          <path
            d="M 100 255 Q 85 285 90 320"
            fill="none"
            stroke="#1D4ED8"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            d="M 220 255 Q 235 285 230 320"
            fill="none"
            stroke="#1D4ED8"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <circle cx="90" cy="320" r="10" fill="#FDE0D0" />
          <circle cx="230" cy="320" r="10" fill="#FDE0D0" />
        </>
      )}

      {/* Head / Face */}
      <circle cx="160" cy="165" r="62" fill="url(#skin)" />

      {/* Headset (Teacher Headphone Band) */}
      <path
        d="M 98 165 C 98 95 222 95 222 165"
        fill="none"
        stroke="#1E293B"
        strokeWidth="9"
        strokeLinecap="round"
      />
      {/* Ear cushions */}
      <rect x="90" y="145" width="16" height="34" rx="8" fill="#F59E0B" />
      <rect x="214" y="145" width="16" height="34" rx="8" fill="#F59E0B" />
      {/* Headset Mic boom */}
      <path
        d="M 100 170 Q 110 205 135 210"
        fill="none"
        stroke="#1E293B"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="137" cy="210" r="5" fill="#3B82F6" />

      {/* Front Hair Bangs */}
      <path
        d="M 100 140 Q 130 115 160 135 Q 190 115 220 140 C 225 155 220 185 220 185 C 205 150 185 145 160 155 C 135 145 115 150 100 185 Z"
        fill="url(#yukiHair)"
      />

      {/* Anime Eyebrows */}
      <path
        d={
          isThinking
            ? "M 125 135 Q 140 130 148 138"
            : "M 125 135 Q 140 128 148 135"
        }
        fill="none"
        stroke="#4F46E5"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d={
          isThinking
            ? "M 172 138 Q 180 130 195 135"
            : "M 172 135 Q 180 128 195 135"
        }
        fill="none"
        stroke="#4F46E5"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Anime Eyes */}
      {blink ? (
        <>
          {/* Closed Happy Eyes when blinking */}
          <path
            d="M 125 155 Q 138 165 150 155"
            fill="none"
            stroke="#1E293B"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 170 155 Q 182 165 195 155"
            fill="none"
            stroke="#1E293B"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          {/* Left Eye */}
          <g>
            <ellipse cx="138" cy="155" rx="12" ry="16" fill="#1E293B" />
            <ellipse cx="138" cy="158" rx="10" ry="12" fill="#7C3AED" />
            {/* Sparkle highlights */}
            <circle cx="134" cy="150" r="4.5" fill="#FFFFFF" />
            <circle cx="142" cy="162" r="2" fill="#FFFFFF" />
          </g>

          {/* Right Eye */}
          <g>
            <ellipse cx="182" cy="155" rx="12" ry="16" fill="#1E293B" />
            <ellipse cx="182" cy="158" rx="10" ry="12" fill="#7C3AED" />
            {/* Sparkle highlights */}
            <circle cx="178" cy="150" r="4.5" fill="#FFFFFF" />
            <circle cx="186" cy="162" r="2" fill="#FFFFFF" />
          </g>
        </>
      )}

      {/* Cute Anime Nose */}
      <circle cx="160" cy="178" r="1.5" fill="#E28B68" />

      {/* Pink Cheeks (Blush) */}
      <ellipse cx="124" cy="174" rx="9" ry="5" fill="#F472B6" opacity="0.6" />
      <ellipse cx="196" cy="174" rx="9" ry="5" fill="#F472B6" opacity="0.6" />

      {/* Animated Lip-Sync Mouth */}
      {isSpeaking ? (
        <path
          d="M 148 198 Q 160 216 172 198 Z"
          fill="#DC2626"
          stroke="#991B1B"
          strokeWidth="1.5"
          className="animate-[talkMouth_0.25s_infinite_alternate]"
        />
      ) : isListening ? (
        /* Gentle open listening mouth */
        <ellipse cx="160" cy="198" rx="4" ry="5" fill="#DC2626" />
      ) : isThinking ? (
        /* Cute wavy thinking mouth */
        <path
          d="M 152 200 Q 157 196 162 200 Q 167 196 172 200"
          fill="none"
          stroke="#991B1B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ) : (
        /* Default charming smile */
        <path
          d="M 152 196 Q 160 205 168 196"
          fill="none"
          stroke="#991B1B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

/* =========================================================================
   2. DUO OWL MASCOT (Classic Duolingo Style Animated Owl)
   ========================================================================= */
function DuoOwlMascot({ status, blink }: { status: AiStatusState; blink: boolean }) {
  const isSpeaking = status === "speaking";
  const isListening = status === "listening";
  const isThinking = status === "thinking";

  return (
    <svg
      viewBox="0 0 320 360"
      className={`w-60 sm:w-72 h-auto z-10 filter drop-shadow-xl transition-transform duration-300 ${
        isSpeaking
          ? "animate-[duo-bounce_0.5s_ease-in-out_infinite]"
          : isListening
          ? "animate-[duo-sway_1.8s_ease-in-out_infinite]"
          : isThinking
          ? "animate-[duo-tilt_1.2s_ease-in-out_infinite]"
          : "animate-[duo-breathe_3s_ease-in-out_infinite]"
      }`}
    >
      <defs>
        <linearGradient id="duoGreen" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#78C800" />
          <stop offset="100%" stopColor="#58A700" />
        </linearGradient>
        <linearGradient id="duoBelly" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8EE000" />
          <stop offset="100%" stopColor="#6AB800" />
        </linearGradient>
      </defs>

      {/* Feet */}
      <ellipse cx="130" cy="325" rx="20" ry="12" fill="#FF9600" />
      <ellipse cx="190" cy="325" rx="20" ry="12" fill="#FF9600" />

      {/* Owl Body */}
      <rect x="85" y="100" width="150" height="210" rx="75" fill="url(#duoGreen)" />

      {/* Belly Patch */}
      <ellipse cx="160" cy="225" rx="55" ry="60" fill="url(#duoBelly)" />

      {/* Belly Feathers pattern */}
      <path d="M 140 215 Q 150 225 160 215 Q 170 225 180 215" fill="none" stroke="#58A700" strokeWidth="4" strokeLinecap="round" />
      <path d="M 145 240 Q 155 250 165 240 Q 175 250 185 240" fill="none" stroke="#58A700" strokeWidth="4" strokeLinecap="round" />

      {/* Owl Wings */}
      {isSpeaking ? (
        <>
          <path d="M 85 180 Q 40 170 50 220 Q 75 240 85 220 Z" fill="#58A700" />
          <path d="M 235 180 Q 280 170 270 220 Q 245 240 235 220 Z" fill="#58A700" />
        </>
      ) : isThinking ? (
        <>
          <path d="M 85 180 Q 55 200 85 235 Z" fill="#58A700" />
          {/* Wing tapping chin */}
          <path d="M 235 180 Q 260 220 185 200 Z" fill="#58A700" />
        </>
      ) : (
        <>
          <path d="M 85 170 Q 50 210 85 245 Z" fill="#58A700" />
          <path d="M 235 170 Q 270 210 235 245 Z" fill="#58A700" />
        </>
      )}

      {/* Large Round Owl Eyes */}
      <g>
        {/* Eye White Outer */}
        <circle cx="125" cy="150" r="28" fill="#FFFFFF" stroke="#468200" strokeWidth="3" />
        <circle cx="195" cy="150" r="28" fill="#FFFFFF" stroke="#468200" strokeWidth="3" />

        {blink ? (
          <>
            <path d="M 105 150 Q 125 165 145 150" fill="none" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
            <path d="M 175 150 Q 195 165 215 150" fill="none" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
          </>
        ) : (
          <>
            {/* Pupils */}
            <circle cx="130" cy="150" r="14" fill="#1E293B" />
            <circle cx="190" cy="150" r="14" fill="#1E293B" />
            {/* Catchlights */}
            <circle cx="126" cy="144" r="6" fill="#FFFFFF" />
            <circle cx="186" cy="144" r="6" fill="#FFFFFF" />
          </>
        )}
      </g>

      {/* Owl Beak */}
      {isSpeaking ? (
        <polygon points="160,165 140,185 160,205 180,185" fill="#FF9600" className="animate-pulse" />
      ) : (
        <polygon points="160,168 144,188 176,188" fill="#FF9600" />
      )}
    </svg>
  );
}

/* =========================================================================
   3. KAITO / DAVID (Anime Senpai & Cool Professional with Glasses)
   ========================================================================= */
function KaitoAnimeCharacter({ status, blink }: { status: AiStatusState; blink: boolean }) {
  const isSpeaking = status === "speaking";

  return (
    <svg
      viewBox="0 0 320 360"
      className={`w-60 sm:w-72 h-auto z-10 filter drop-shadow-xl transition-transform duration-300 ${
        isSpeaking ? "animate-[duo-bounce_0.55s_ease-in-out_infinite]" : "animate-[duo-breathe_3.2s_ease-in-out_infinite]"
      }`}
    >
      <defs>
        <linearGradient id="kaitoHair" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="suit" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
      </defs>

      {/* Suit & Shoulders */}
      <path d="M 100 250 C 100 230 135 220 160 220 C 185 220 220 230 220 250 L 235 340 L 85 340 Z" fill="url(#suit)" />
      {/* Shirt & Tie */}
      <polygon points="160,225 145,265 175,265" fill="#FFFFFF" />
      <polygon points="160,240 154,320 160,335 166,320" fill="#EF4444" />

      {/* Head */}
      <circle cx="160" cy="160" r="58" fill="#FFF1E6" />

      {/* Cool Guy Anime Hair */}
      <path
        d="M 95 145 C 90 95 140 75 160 75 C 200 75 230 100 225 145 C 220 115 195 105 180 110 C 160 95 130 105 115 125 Z"
        fill="url(#kaitoHair)"
      />
      <path d="M 115 120 L 125 155 L 140 125 L 155 160 L 170 125 L 190 150 L 205 125" fill="url(#kaitoHair)" />

      {/* Stylish Rectangular Glasses */}
      <rect x="120" y="145" width="34" height="22" rx="4" fill="none" stroke="#F59E0B" strokeWidth="3" />
      <rect x="166" y="145" width="34" height="22" rx="4" fill="none" stroke="#F59E0B" strokeWidth="3" />
      <line x1="154" y1="155" x2="166" y2="155" stroke="#F59E0B" strokeWidth="3" />

      {/* Eyes inside glasses */}
      {blink ? (
        <>
          <line x1="126" y1="156" x2="148" y2="156" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          <line x1="172" y1="156" x2="194" y2="156" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="137" cy="156" r="6" fill="#0F172A" />
          <circle cx="183" cy="156" r="6" fill="#0F172A" />
          <circle cx="135" cy="154" r="2" fill="#FFFFFF" />
          <circle cx="181" cy="154" r="2" fill="#FFFFFF" />
        </>
      )}

      {/* Confident Smile or Talking Mouth */}
      {isSpeaking ? (
        <path d="M 150 196 Q 160 210 170 196 Z" fill="#DC2626" />
      ) : (
        <path d="M 152 195 Q 160 202 168 195" fill="none" stroke="#991B1B" strokeWidth="2.5" strokeLinecap="round" />
      )}
    </svg>
  );
}

/* =========================================================================
   4. HANA / EMMA (Sporty & Bubbly Anime Girl with Cap)
   ========================================================================= */
function HanaAnimeCharacter({ status, blink }: { status: AiStatusState; blink: boolean }) {
  const isSpeaking = status === "speaking";

  return (
    <svg
      viewBox="0 0 320 360"
      className={`w-60 sm:w-72 h-auto z-10 filter drop-shadow-xl transition-transform duration-300 ${
        isSpeaking ? "animate-[duo-bounce_0.5s_ease-in-out_infinite]" : "animate-[duo-breathe_2.8s_ease-in-out_infinite]"
      }`}
    >
      {/* Orange Sporty Hoodie */}
      <path d="M 105 240 C 105 225 135 215 160 215 C 185 215 215 225 215 240 L 230 340 L 90 340 Z" fill="#F97316" />

      {/* Head */}
      <circle cx="160" cy="160" r="58" fill="#FFF1E6" />

      {/* Brown Twintails Hair */}
      <path d="M 85 140 Q 60 190 75 240" fill="none" stroke="#78350F" strokeWidth="18" strokeLinecap="round" />
      <path d="M 235 140 Q 260 190 245 240" fill="none" stroke="#78350F" strokeWidth="18" strokeLinecap="round" />

      {/* Cool Sporty Cap */}
      <path d="M 105 130 Q 160 85 215 130 Z" fill="#3B82F6" />
      <path d="M 95 130 Q 160 120 225 130 Q 235 138 215 142 Q 160 134 95 130 Z" fill="#1D4ED8" />

      {/* Sparkly Anime Eyes */}
      {blink ? (
        <>
          <path d="M 125 162 Q 138 172 150 162" fill="none" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 170 162 Q 182 172 195 162" fill="none" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="138" cy="162" rx="11" ry="14" fill="#0284C7" />
          <ellipse cx="182" cy="162" rx="11" ry="14" fill="#0284C7" />
          <circle cx="135" cy="157" r="4.5" fill="#FFFFFF" />
          <circle cx="179" cy="157" r="4.5" fill="#FFFFFF" />
        </>
      )}

      {/* Rosy Cheeks */}
      <ellipse cx="125" cy="178" rx="8" ry="4" fill="#FB7185" opacity="0.7" />
      <ellipse cx="195" cy="178" rx="8" ry="4" fill="#FB7185" opacity="0.7" />

      {/* Open Talking Mouth */}
      {isSpeaking ? (
        <path d="M 148 198 Q 160 216 172 198 Z" fill="#E11D48" />
      ) : (
        <path d="M 152 198 Q 160 206 168 198" fill="none" stroke="#9F1239" strokeWidth="2.5" strokeLinecap="round" />
      )}
    </svg>
  );
}

/* =========================================================================
   5. REN / JAMES (Intellectual Anime Scholar with Trench & Book)
   ========================================================================= */
function RenAnimeCharacter({ status, blink }: { status: AiStatusState; blink: boolean }) {
  const isSpeaking = status === "speaking";

  return (
    <svg
      viewBox="0 0 320 360"
      className={`w-60 sm:w-72 h-auto z-10 filter drop-shadow-xl transition-transform duration-300 ${
        isSpeaking ? "animate-[duo-bounce_0.55s_ease-in-out_infinite]" : "animate-[duo-breathe_3s_ease-in-out_infinite]"
      }`}
    >
      {/* Emerald Academic Trench */}
      <path d="M 100 240 C 100 225 135 215 160 215 C 185 215 220 225 220 240 L 235 340 L 85 340 Z" fill="#065F46" />
      <polygon points="160,225 145,265 175,265" fill="#FEF3C7" />

      {/* Head */}
      <circle cx="160" cy="160" r="58" fill="#FFF1E6" />

      {/* Silver Scholar Hair */}
      <path
        d="M 95 140 C 90 90 140 70 160 70 C 200 70 230 95 225 140 C 215 115 195 105 175 110 C 155 95 125 105 115 125 Z"
        fill="#94A3B8"
      />

      {/* Round Glasses */}
      <circle cx="138" cy="156" r="16" fill="none" stroke="#D97706" strokeWidth="3" />
      <circle cx="182" cy="156" r="16" fill="none" stroke="#D97706" strokeWidth="3" />
      <line x1="154" y1="156" x2="166" y2="156" stroke="#D97706" strokeWidth="3" />

      {/* Eyes */}
      {blink ? (
        <>
          <line x1="128" y1="156" x2="148" y2="156" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          <line x1="172" y1="156" x2="192" y2="156" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="138" cy="156" r="6" fill="#047857" />
          <circle cx="182" cy="156" r="6" fill="#047857" />
          <circle cx="136" cy="154" r="2" fill="#FFFFFF" />
          <circle cx="180" cy="154" r="2" fill="#FFFFFF" />
        </>
      )}

      {/* Mouth */}
      {isSpeaking ? (
        <path d="M 150 196 Q 160 210 170 196 Z" fill="#DC2626" />
      ) : (
        <path d="M 152 195 Q 160 202 168 195" fill="none" stroke="#991B1B" strokeWidth="2.5" strokeLinecap="round" />
      )}
    </svg>
  );
}
