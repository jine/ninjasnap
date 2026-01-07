# Ninja Snapshot Tool Design Tokens

## Overview

This design system is for a ninja-themed screenshot/snapshot tool. It draws inspiration from Grok's sleek, modern AI aesthetic: clean lines, high contrast, efficient layouts, with a futuristic edge. Ninja theme incorporates stealthy dark palettes, subtle shadows, and agile, quick-response UI elements. Focus on minimalism, speed, and invisibility (e.g., low-profile overlays).

## Color Palette

- **Primary (Ninja Black)**: `#000000` - Base background for stealth mode.
- **Secondary (Shadow Gray)**: `#1A1A1A` - Panels, cards, and overlays.
- **Accent (Shuriken Red)**: `#FF0000` - Buttons, highlights, alerts (e.g., capture confirmation).
- **Neutral (Smoke Gray)**: `#808080` - Text, borders, inactive states.
- **Success (Kunai Green)**: `#00FF00` - Success indicators (e.g., screenshot saved).
- **Error (Poison Purple)**: `#800080` - Error states.
- **Background (Night Sky)**: `#0A0A0A` - App window or full-screen mode.
- **Text Primary**: `#FFFFFF` - High-contrast on dark backgrounds.
- **Text Secondary**: `#CCCCCC` - Subtle labels.

## Typography

- **Font Family**: `'Noto Sans', sans-serif` - Clean, modern, with optional ninja-inspired font like 'Ninja Naruto' for headings if available.
- **Headings**:
  - H1: 24px, bold, letter-spacing: 0.5px.
  - H2: 18px, bold.
  - H3: 14px, semi-bold.
- **Body Text**: 14px, regular, line-height: 1.5.
- **Labels/Captions**: 12px, regular, uppercase for buttons.
- **Font Weights**: Light (300), Regular (400), Bold (700).

## Spacing

- **Base Unit**: 8px - All multiples derive from this for rhythm.
- **Small**: 8px - Padding for buttons, icons.
- **Medium**: 16px - Margins between elements.
- **Large**: 24px - Section spacing.
- **X-Large**: 32px - Major layout gaps.
- **Grid**: 4px increments for fine adjustments.

## Icons and Imagery

- **Use SVG icons**: Shuriken for capture, smoke bomb for cancel, kunai for select.
- **Icon Size**: 24px default, 16px small.
- **Theme**: Monochrome with accent hover (e.g., red glow on interaction).
- **Animations**: Subtle fade-ins (0.3s), quick scale on hover (1.1x).

## Components

### Buttons

- **Primary**: Background `#FF0000`, text `#000000`, padding 8px 16px, border-radius 4px, hover: opacity 0.8.
- **Secondary**: Background transparent, border 1px `#808080`, text `#FFFFFF`.
- **Ghost**: Text-only, underline on hover.

### Overlays

- **Screenshot Overlay**: Semi-transparent `#00000080`, with crosshair cursor.
- **Toolbar**: Floating, position absolute, background `#1A1A1A`, box-shadow 0 4px 8px rgba(0,0,0,0.5).

### Modals

- **Background**: `#0A0A0A`, border: none, shadow: deep inset.
- **Close Icon**: White X, top-right.

## Layout

- **Responsive**: Mobile-first, but optimized for desktop (full-screen capture).
- **Dark Mode Only**: No light theme to maintain ninja stealth.
- **Accessibility**: Contrast ratio >4.5:1, keyboard-navigable.

## Usage Guidelines

- **Keep UI minimal**: Hide toolbar until hotkey (e.g., Ctrl+Shift+N).
- **Feedback**: Quick toast notifications with ninja vanish animation.
