"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SyncRouterLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number | "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showBadge?: boolean;
  className?: string;
  iconOnly?: boolean;
  animated?: boolean;
}

export interface SyncRouterIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  glow?: boolean;
}

/**
 * SyncRouter Icon Mark
 * Distinctive geometric vector representing multi-path AI model routing and synchronization.
 * Features interlocking directional routing streams and synchronized neural node endpoints.
 */
export function SyncRouterIcon({
  size = 24,
  className,
  glow = false,
  ...props
}: SyncRouterIconProps) {
  const numericSize = typeof size === "number" ? size : undefined;
  const gradientId = React.useId();

  return (
    <svg
      width={numericSize || size}
      height={numericSize || size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 transition-transform duration-300", className)}
      aria-label="SyncRouter Logo"
      {...props}
    >
      <defs>
        {/* Core Amber / Gold Flow Gradient */}
        <linearGradient
          id={`sr-primary-${gradientId}`}
          x1="4"
          y1="4"
          x2="28"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="45%" stopColor="#E8A33D" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* Counter Flow Gradient for Depth */}
        <linearGradient
          id={`sr-secondary-${gradientId}`}
          x1="28"
          y1="28"
          x2="4"
          y2="4"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="70%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>

        {/* Dynamic Glow Filter */}
        {glow && (
          <filter id={`sr-glow-${gradientId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        )}
      </defs>

      {/* Main Synchronized Routing Pathway - Top Loop & Outbound Node */}
      <path
        d="M6 10C6 6.68629 8.68629 4 12 4H20C23.3137 4 26 6.68629 26 10C26 13.3137 23.3137 16 20 16H11C8.23858 16 6 18.2386 6 21C6 23.7614 8.23858 26 11 26H20"
        stroke={`url(#sr-primary-${gradientId})`}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Synchronous Interlocking Reverse Wave - Bottom to Top Connection */}
      <path
        d="M26 22C26 25.3137 23.3137 28 20 28H12C8.68629 28 6 25.3137 6 22C6 18.6863 8.68629 16 12 16H21C23.7614 16 26 13.7614 26 11C26 8.23858 23.7614 6 21 6H12"
        stroke={`url(#sr-secondary-${gradientId})`}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="0.5 4.5"
        strokeOpacity="0.4"
      />

      {/* Upper Inbound / Dispatch Arrow Head */}
      <path
        d="M17 1.5L20.5 4L17 6.5"
        stroke={`url(#sr-primary-${gradientId})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Lower Outbound / Dispatch Arrow Head */}
      <path
        d="M15 29.5L11.5 27L15 24.5"
        stroke={`url(#sr-primary-${gradientId})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Central Routing Core Synced Node */}
      <circle
        cx="16"
        cy="16"
        r="3"
        fill={`url(#sr-primary-${gradientId})`}
      />
      <circle
        cx="16"
        cy="16"
        r="1.2"
        fill="#0F0E0D"
      />

      {/* Satellite Model Routing Nodes */}
      <circle cx="6" cy="10" r="1.75" fill="#FBBF24" />
      <circle cx="26" cy="22" r="1.75" fill="#E8A33D" />
    </svg>
  );
}

/**
 * Modern Clean Variant: Geometric Dual-Orbital "S" Routing Nodes
 * Minimalist, ultra-sharp at small sizes (16-24px)
 */
export function SyncRouterMark({
  size = 20,
  className,
  ...props
}: SyncRouterIconProps) {
  const numericSize = typeof size === "number" ? size : undefined;
  const id = React.useId();

  return (
    <svg
      width={numericSize || size}
      height={numericSize || size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-label="SyncRouter Icon"
      {...props}
    >
      <defs>
        <linearGradient id={`mark-grad-${id}`} x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="50%" stopColor="#E8A33D" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>

      {/* Upper Routing Loop */}
      <path
        d="M4.5 8C4.5 5.51472 6.51472 3.5 9 3.5H15C17.4853 3.5 19.5 5.51472 19.5 8C19.5 10.4853 17.4853 12.5 15 12.5H9C6.51472 12.5 4.5 14.5147 4.5 17C4.5 19.4853 6.51472 21.5 9 21.5H15C17.4853 21.5 19.5 19.4853 19.5 17"
        stroke={`url(#mark-grad-${id})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Routing Target Node Dots */}
      <circle cx="4.5" cy="8" r="1.5" fill="#FBBF24" />
      <circle cx="19.5" cy="17" r="1.5" fill="#E8A33D" />
      <circle cx="12" cy="12.5" r="1.5" fill="#FDE68A" />
    </svg>
  );
}

/**
 * Full SyncRouter Brand Component with Logo Mark + Typography
 */
export function SyncRouterLogo({
  size = "md",
  showText = true,
  showBadge = true,
  iconOnly = false,
  className,
  ...props
}: SyncRouterLogoProps) {
  const sizeMap = {
    sm: { icon: 18, box: "h-7 w-7", text: "text-sm", badge: "text-[9px] px-1 py-0.2" },
    md: { icon: 20, box: "h-9 w-9", text: "text-[15px]", badge: "text-[10px] px-1.5 py-0.5" },
    lg: { icon: 24, box: "h-10 w-10", text: "text-xl", badge: "text-[11px] px-2 py-0.5" },
    xl: { icon: 30, box: "h-12 w-12", text: "text-2xl", badge: "text-xs px-2 py-1" },
  };

  const currentSize = typeof size === "string" ? sizeMap[size] : sizeMap.md;
  const iconPixelSize = typeof size === "number" ? size : currentSize.icon;

  return (
    <div
      className={cn("flex items-center gap-2.5 select-none", className)}
      {...props}
    >
      {/* Icon Container with subtle border and surface elevation */}
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-[8px] border border-border bg-surface shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all",
          typeof size === "string" ? currentSize.box : "p-2"
        )}
      >
        <SyncRouterIcon size={iconPixelSize} />
      </div>

      {/* Brand Text */}
      {showText && !iconOnly && (
        <div className="flex min-w-0 items-center gap-2">
          <span className={cn("font-semibold tracking-tight text-text-primary", currentSize.text)}>
            Sync<span className="text-accent">Router</span>
          </span>

          {showBadge && (
            <span
              className={cn(
                "rounded-[6px] border border-border bg-surface-hover/80 font-mono font-semibold uppercase tracking-wider text-text-muted",
                currentSize.badge
              )}
            >
              AI
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default SyncRouterLogo;
