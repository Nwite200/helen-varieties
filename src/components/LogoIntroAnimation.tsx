import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Helen's Varieties Logo Intro & Navigation Transition:
 * 
 * 1. Initial Site Load (Played ONLY ONCE per browser tab session):
 *    - Total Duration: ~1.8 seconds (1800ms)
 *    - Entrance: Fade and scale logo in over 600ms
 *    - Hold: Hold logo visibly for 500ms (at t = 600ms -> 1100ms)
 *    - Exit: Fade out overlay over 700ms (at t = 1100ms -> 1800ms) to reveal the homepage.
 *    - Starts promptly without unnecessary delay.
 *    - Marks sessionStorage so subsequent navigation will not replay it.
 * 
 * 2. Subsequent Page Navigations:
 *    - Subtle 250ms fade transition without replaying the logo animation.
 * 
 * 3. Interaction Safety:
 *    - Pointer events are disabled so it NEVER blocks user clicks or gets stuck.
 *    - Completely unmounts from DOM after transitions finish.
 */
export const LogoIntroAnimation: React.FC = () => {
  const location = useLocation();

  // Check if session already played the full 1.8s logo intro
  const hasPlayedIntroInSession = typeof window !== 'undefined' 
    ? Boolean(sessionStorage.getItem('hv_logo_intro_played')) 
    : false;

  const [isFullIntro] = useState<boolean>(!hasPlayedIntroInSession);
  const [animStage, setAnimStage] = useState<'entering' | 'holding' | 'leaving' | 'hidden'>(
    !hasPlayedIntroInSession ? 'entering' : 'hidden'
  );
  const [routeTransitionActive, setRouteTransitionActive] = useState<boolean>(false);

  const isInitialMount = useRef<boolean>(true);

  // 1. Initial 1.8s Logo Intro Lifecycle (Runs once per tab session)
  useEffect(() => {
    if (!isFullIntro) return;

    // Stage 1: Entrance (0ms -> 600ms) is active initially.
    // Stage 2: Hold (600ms -> 1100ms)
    const holdTimer = setTimeout(() => {
      setAnimStage('holding');
    }, 600);

    // Stage 3: Exit Fade Out over 700ms (starts at 1100ms -> ends at 1800ms)
    const exitTimer = setTimeout(() => {
      setAnimStage('leaving');
    }, 1100);

    // Final Cleanup & Unmount (at 1800ms total)
    const finishTimer = setTimeout(() => {
      setAnimStage('hidden');
      try {
        sessionStorage.setItem('hv_logo_intro_played', 'true');
      } catch {
        // Safe fallback in case storage is restricted
      }
    }, 1800);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [isFullIntro]);

  // 2. Subsequent Client-Side Route Navigations: Subtle 250ms page fade
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only apply subtle 250ms route transition once initial full intro is done
    if (!isFullIntro || animStage === 'hidden') {
      setRouteTransitionActive(true);
      const timer = setTimeout(() => {
        setRouteTransitionActive(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, isFullIntro, animStage]);

  // Render Full 1.8s Initial Logo Intro
  if (isFullIntro && animStage !== 'hidden') {
    return (
      <aside
        aria-label="Welcome to Helen's Varieties Venture"
        aria-live="polite"
        className={`fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center bg-gradient-to-b from-white via-[#F7F7F8] to-[#E6F0FA] ${
          animStage === 'leaving' ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          transition: animStage === 'leaving' ? 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1)' : undefined
        }}
      >
        <div className="relative flex flex-col items-center justify-center p-6 text-center select-none">
          {/* Subtle ambient aura */}
          <div className="absolute w-48 h-48 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Logo Card: Fades and scales in over 600ms */}
          <div
            className="relative transform"
            style={{
              transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: animStage === 'entering' ? 0 : 1,
              transform: animStage === 'entering' ? 'scale(0.85) translateY(8px)' : 'scale(1) translateY(0px)'
            }}
          >
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-3xl p-3.5 shadow-2xl shadow-blue-500/25 border border-blue-50 flex items-center justify-center">
              <img
                src="/images/helen-varieties-logo.png"
                alt="Helen Varieties Venture"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Typography Branding: Synchronized fade in */}
          <div
            className="mt-5 space-y-1.5"
            style={{
              transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: animStage === 'entering' ? 0 : 1,
              transform: animStage === 'entering' ? 'translateY(6px)' : 'translateY(0px)'
            }}
          >
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Helen<span className="text-[#0070DC]"> Varieties</span>
            </h1>
            <p className="text-[11px] sm:text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Discover More • Pre-Order with Confidence
            </p>
          </div>
        </div>
      </aside>
    );
  }

  // Render Subtle 250ms Navigation Fade Overlay for subsequent client-side routes
  if (routeTransitionActive) {
    return (
      <div
        className="fixed inset-0 z-[9990] pointer-events-none bg-white/40 backdrop-blur-[1px] animate-in fade-in duration-100 ease-out"
        style={{
          transition: 'opacity 250ms ease-out'
        }}
      />
    );
  }

  return null;
};
