---
layout: distill
title: "How I Added an Interactive Particle Background to My Portfolio"
description: A step-by-step guide to replacing al-folio's plain white background with an animated, mouse-interactive particle effect using particles.js.
tags: tutorial web-development
categories: tutorial
date: 2026-03-21
featured: false

authors:
  - name: Tuyet-Han LE
    url: "https://letuyethan.github.io"
    affiliations:
      name: University of Orleans

toc:
  - name: The Problem
  - name: The Solution -- particles.js
  - name: Understanding al-folio's Layout Structure
  - name: "Step 1: Create the Particle Include"
  - name: "Step 2: Add It to the Default Layout"
  - name: How the Code Works
  - name: The Mouse Interaction Gotcha
  - name: The Distill Layout Gotcha
  - name: Customizing the Effect
  - name: Final Result
---

## The Problem

The [al-folio](https://github.com/alshedivat/al-folio) Jekyll theme is one of the best academic portfolio templates out there. It's clean, well-organized, and has great features like CV rendering, publication management, and blog support.

But out of the box, the background is just... white. Every al-folio site looks the same at first glance. When I was building my portfolio for graduate school applications, I wanted something that would make visitors notice the site *feels* different, without distracting from the content.

The answer: a subtle, interactive particle animation that lives behind the page content. Particles float gently across the screen, connect with faint lines when they're close to each other, and -- most importantly -- **react to your mouse movements**, drawing lines toward your cursor as you browse.

---

## The Solution -- particles.js

[particles.js](https://vincentgarreau.com/particles.js/) is a lightweight JavaScript library for creating particle animations on HTML canvas elements. It's been around since 2015, has over 28k stars on GitHub, and is dead simple to configure.

Key features that make it perfect for this use case:

- **Zero dependencies** -- just one script tag
- **Highly configurable** -- particle count, size, speed, colors, connection lines, all via a JSON config
- **Mouse interactivity built-in** -- grab mode (particles connect to cursor), push mode (click to add particles), repulse mode (particles flee from cursor)
- **Responsive** -- handles window resizing automatically
- **Lightweight** -- ~15KB minified

You can try it yourself on the [official interactive demo](https://vincentgarreau.com/particles.js/) -- move your mouse around and click to see the different interaction modes in action.

---

## Understanding al-folio's Layout Structure

Before writing any code, I needed to understand *where* to add the particle animation. al-folio uses Jekyll's layout inheritance system:

```
default.liquid          <-- The base layout (HTML skeleton)
  ├── about.liquid      <-- Home/about page
  ├── post.liquid       <-- Blog posts
  ├── page.liquid       <-- Generic pages (projects, etc.)
  ├── cv.liquid         <-- CV page
  └── distill.liquid    <-- Distill-style blog posts
```

Every page ultimately inherits from `_layouts/default.liquid`, which defines the `<html>`, `<head>`, and `<body>` structure. This means: **if I add the particle animation to `default.liquid`, it appears on every page automatically.**

The relevant part of `default.liquid` looks like this:

```html
<body class="...">
    <!-- Header -->
    {% raw %}{% include header.liquid %}{% endraw %}

    <!-- Content -->
    <div class="container mt-5" role="main">
      ...
    </div>

    <!-- Footer -->
    {% raw %}{% include footer.liquid %}{% endraw %}
</body>
```

The plan: insert a full-screen particle canvas **before** the header, positioned behind everything with CSS.

---

## Step 1: Create the Particle Include

I created a new file `_includes/particles.liquid` containing the particle div, the library script, and the configuration:

```html
<div id="particles-js" style="position: fixed; top: 0; left: 0;
     width: 100%; height: 100%; z-index: -1;"></div>
<script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js">
</script>
```

The `<div>` is the canvas container. The critical CSS properties are:

- `position: fixed` -- stays in place even when scrolling
- `top: 0; left: 0; width: 100%; height: 100%` -- covers the entire viewport
- `z-index: -1` -- sits *behind* all page content

Then the configuration script:

```javascript
document.addEventListener('DOMContentLoaded', function() {
  // Adapt colors to light/dark mode
  const isDark = document.documentElement
    .getAttribute('data-theme') === 'dark' ||
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  const particleColor = isDark ? '#64b4ff' : '#0076df';
  const lineColor = isDark ? '#64b4ff' : '#0076df';

  particlesJS('particles-js', {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: particleColor },
      shape: { type: 'circle' },
      opacity: {
        value: 0.3, random: true,
        anim: { enable: true, speed: 0.5, opacity_min: 0.1, sync: false }
      },
      size: {
        value: 3, random: true,
        anim: { enable: true, speed: 2, size_min: 0.5, sync: false }
      },
      line_linked: {
        enable: true, distance: 150,
        color: lineColor, opacity: 0.15, width: 1
      },
      move: {
        enable: true, speed: 1.5, direction: 'none',
        random: true, straight: false, out_mode: 'out',
        bounce: false, attract: { enable: false }
      }
    },
    interactivity: {
      detect_on: 'window',
      events: {
        onhover: { enable: true, mode: 'grab' },
        onclick: { enable: true, mode: 'push' },
        resize: true
      },
      modes: {
        grab: { distance: 200, line_linked: { opacity: 0.4 } },
        push: { particles_nb: 4 }
      }
    },
    retina_detect: true
  });
});
```

---

## Step 2: Add It to the Default Layout

In `_layouts/default.liquid`, I added a single line right after the `<body>` tag:

```html
<body class="...">
    <!-- Particle background -->
    {% raw %}{% include particles.liquid %}{% endraw %}

    <!-- Header -->
    {% raw %}{% include header.liquid %}{% endraw %}

    <!-- Content -->
    ...
```

That's it. Two files changed, one file created. The particle animation now appears on every page of the site.

---

## How the Code Works

Let me break down the key configuration sections:

### Particle appearance

```javascript
number: { value: 80, density: { enable: true, value_area: 800 } }
```

80 particles spread across an 800px-equivalent area. The `density` option ensures the particle count scales with screen size -- a phone won't be overwhelmed, and a large monitor won't look empty.

### Connection lines

```javascript
line_linked: {
  enable: true, distance: 150,
  color: lineColor, opacity: 0.15, width: 1
}
```

When two particles are within 150px of each other, a faint line connects them. The low opacity (0.15) keeps it subtle -- you notice the effect without it being distracting.

### Mouse interaction

```javascript
interactivity: {
  detect_on: 'window',
  events: {
    onhover: { enable: true, mode: 'grab' },
    onclick: { enable: true, mode: 'push' }
  },
  modes: {
    grab: { distance: 200, line_linked: { opacity: 0.4 } },
    push: { particles_nb: 4 }
  }
}
```

- **Grab mode**: when you hover, particles within 200px draw lines toward your cursor with 0.4 opacity (stronger than the ambient 0.15 lines between particles)
- **Push mode**: clicking anywhere adds 4 new particles at the click position

### Dark mode support

```javascript
const isDark = document.documentElement
  .getAttribute('data-theme') === 'dark' ||
  window.matchMedia('(prefers-color-scheme: dark)').matches;
const particleColor = isDark ? '#64b4ff' : '#0076df';
```

al-folio supports dark mode. I check for it and use a lighter blue (#64b4ff) on dark backgrounds so the particles remain visible but not harsh.

---

## The Mouse Interaction Gotcha

There's one subtle bug that took me a while to figure out. My first version used:

```javascript
detect_on: 'canvas'  // DON'T DO THIS
```

With this setting, **the mouse interaction didn't work at all**. The particles floated around, but hovering and clicking had no effect.

The reason: the particle canvas sits at `z-index: -1`, *behind* all page content. When you move your mouse over the page, the browser sends mouse events to the topmost element -- which is the page content (`<div class="container">`), not the canvas. The canvas never receives the events.

The fix is simple:

```javascript
detect_on: 'window'  // DO THIS
```

With `'window'`, particles.js listens for mouse events on the `window` object, which captures all mouse movement regardless of which element is on top. The library then maps the mouse coordinates to the canvas internally.

This is a common pitfall when using particles.js with a background canvas, and it's not well-documented<d-footnote>The particles.js documentation doesn't mention this issue. If you search GitHub issues, you'll find several people confused about why mouse interactivity doesn't work with z-index layering.</d-footnote>.

---

## The Distill Layout Gotcha

After deploying the particle background, I noticed something odd: the effect showed up on every page -- the home page, the CV, regular blog posts, project pages -- *except* on distill-style blog posts. Those still had a plain white background.

It took me a moment to figure out why. Most al-folio pages inherit from `default.liquid`:

```
default.liquid     <-- particles.liquid is included here
  ├── about.liquid
  ├── post.liquid
  ├── page.liquid
  └── cv.liquid
```

But `distill.liquid` is different. It defines its **own standalone HTML structure** -- its own `<html>`, `<head>`, and `<body>` tags -- because the Distill framework needs to control the full document. It does *not* inherit from `default.liquid` at all:

```
distill.liquid     <-- completely independent, no particles!
```

The fix is simple: add the same include line to `_layouts/distill.liquid`, right after the `<body>` tag:

```html
<body class="...">
    <!-- Particle background -->
    {% raw %}{% include particles.liquid %}{% endraw %}

    <!-- Header -->
    {% raw %}{% include header.liquid %}{% endraw %}
    ...
```

This is easy to miss because you'd assume all layouts share the same base. In al-folio, `distill.liquid` is the exception<d-footnote>This is a consequence of how the Distill web framework works. It needs specific HTML structure (d-front-matter, d-article, d-appendix tags) that doesn't fit neatly into Jekyll's layout inheritance. So al-folio implements it as a standalone layout.</d-footnote>. If you add any global customization to `default.liquid`, always check whether `distill.liquid` needs the same change.

---

## Customizing the Effect

Here are some quick tweaks you can make to the configuration:

| What to change | Parameter | Default | Try |
|---|---|---|---|
| More/fewer particles | `number.value` | 80 | 40 (minimal) or 120 (dense) |
| Faster/slower movement | `move.speed` | 1.5 | 0.5 (calm) or 3 (energetic) |
| Longer connection lines | `line_linked.distance` | 150 | 200 (more connected) |
| Stronger mouse grab | `grab.distance` | 200 | 300 (wider reach) |
| Different interaction | `onhover.mode` | 'grab' | 'repulse' (particles flee) or 'bubble' (particles grow) |
| Particle color | `color.value` | '#0076df' | Any hex color |

You can also change the mouse click behavior. Instead of `'push'` (add particles), try `'remove'` (delete particles on click) or `'repulse'` (push particles away from click).

---

## Final Result

The end result is a portfolio that feels alive without being distracting. The particles are subtle enough that they don't compete with your content, but interactive enough that visitors notice something is different.

Total changes:
- **1 file created**: `_includes/particles.liquid` (~90 lines)
- **1 file modified**: `_layouts/default.liquid` (added 3 lines)
- **0 dependencies installed** -- particles.js loads from a CDN

The entire customization takes about 10 minutes if you know where to look. Hopefully this post saves you the debugging time I spent on the `detect_on: 'window'` issue.
