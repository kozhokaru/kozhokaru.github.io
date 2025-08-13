---
title: "Building Performant Web Applications"
date: 2024-02-20
tags: [development, performance, web]
excerpt: "Performance isn't a feature—it's the foundation upon which great user experiences are built."
---

Performance is often treated as an optimization phase, something to address after the "real" work is done. This is backwards. Performance should be a first-class design constraint from day one.

## The Real Cost of Slow

A 100ms delay can reduce conversion rates by 7%. A 2-second delay increases bounce rates by 103%. But beyond metrics, slow performance is a breach of trust with your users. It says their time isn't valuable to you.

## The Performance Budget Mindset

Before writing a single line of code, establish your performance budget:

- **Time to Interactive**: < 3 seconds on 3G
- **First Contentful Paint**: < 1 second
- **JavaScript bundle**: < 100KB gzipped
- **CSS**: < 10KB
- **Lighthouse score**: > 95

These aren't aspirational—they're non-negotiable constraints that shape every decision.

## HTML: The Foundation

Start with semantic, minimal HTML:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Document</title>
  <link rel="stylesheet" href="/css/critical.css">
  <link rel="preload" href="/css/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
</head>
<body>
  <!-- Content immediately visible, no JavaScript required -->
</body>
</html>
```

Critical CSS inlined, non-critical deferred. Content visible immediately.

## CSS: Utility Through Constraint

Modern CSS is incredibly powerful. Custom properties provide theming without JavaScript:

```css
:root {
  --spacing: clamp(1rem, 2vw, 1.5rem);
  --text: #2c2c2c;
  --bg: #fdfdf8;
}

@media (prefers-color-scheme: dark) {
  :root {
    --text: #e8e8e3;
    --bg: #1a1a1a;
  }
}

body {
  color: var(--text);
  background: var(--bg);
  padding: var(--spacing);
}
```

No build process. No runtime overhead. Just CSS doing what it does best.

## JavaScript: Progressive Enhancement

JavaScript should enhance, not enable. Core functionality must work without it:

```javascript
// Only enhance if JavaScript is available
if ('IntersectionObserver' in window) {
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        imageObserver.unobserve(img);
      }
    });
  });
  images.forEach(img => imageObserver.observe(img));
}
```

This lazy-loading enhancement is 500 bytes. It improves performance for modern browsers while older browsers still get functional images.

## Images: The Heaviest Weight

Images often account for 60%+ of page weight. Optimize ruthlessly:

1. **Choose the right format**: WebP with JPEG fallback
2. **Responsive images**: Don't serve 4K images to phones
3. **Lazy loading**: Only load what's visible
4. **Blur-up technique**: Show a tiny placeholder while loading

```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.jpg" type="image/jpeg">
  <img src="image.jpg" alt="Description" loading="lazy" decoding="async">
</picture>
```

## The Service Worker Strategy

Service workers enable offline functionality and dramatic performance improvements:

```javascript
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchResponse => {
        return caches.open('v1').then(cache => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    })
  );
});
```

Cache-first with network fallback. Your site loads instantly on repeat visits.

## Measuring What Matters

Performance metrics should reflect real user experience:

- **Core Web Vitals**: LCP, FID, CLS
- **Real User Monitoring**: Actual performance in the field
- **Performance budgets**: Automated testing in CI/CD

```javascript
// Simple RUM
window.addEventListener('load', () => {
  const perfData = performance.getEntriesByType('navigation')[0];
  console.log('DNS lookup:', perfData.domainLookupEnd - perfData.domainLookupStart);
  console.log('TCP handshake:', perfData.connectEnd - perfData.connectStart);
  console.log('Response time:', perfData.responseEnd - perfData.requestStart);
});
```

## The Compound Effect

Performance improvements compound:

- Faster load → Better engagement
- Better engagement → Higher rankings
- Higher rankings → More traffic
- More traffic → More feedback
- More feedback → Better product

It's a virtuous cycle that starts with respecting your users' time and bandwidth.

## Conclusion

Performance isn't about showing off technical prowess. It's about empathy. It's about recognizing that your users might be on a slow connection, an old device, or simply in a hurry.

Build fast by default. Optimize from the start. Treat performance as a feature—because to your users, it absolutely is.