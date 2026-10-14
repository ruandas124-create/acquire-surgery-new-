/**
 * Browser Environment Shims
 * Provides bulletproof fallbacks for browser APIs (IntersectionObserver, ResizeObserver, matchMedia, scrollTo)
 * that may be absent or restricted in iframe sandboxes, embedded webviews, or test runners.
 */

if (typeof window !== 'undefined') {
  // 1. IntersectionObserver shim
  if (typeof (window as unknown as { IntersectionObserver?: unknown }).IntersectionObserver === 'undefined') {
    class SafeIntersectionObserver {
      private callback: IntersectionObserverCallback;
      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
      }
      observe(target: Element) {
        if (typeof this.callback === 'function') {
          try {
            const entry: IntersectionObserverEntry = {
              time: Date.now(),
              rootBounds: null,
              boundingClientRect: target.getBoundingClientRect ? target.getBoundingClientRect() : ({} as DOMRectReadOnly),
              intersectionRect: target.getBoundingClientRect ? target.getBoundingClientRect() : ({} as DOMRectReadOnly),
              isIntersecting: true,
              intersectionRatio: 1,
              target,
            };
            this.callback([entry], this as unknown as IntersectionObserver);
          } catch {
            // ignore
          }
        }
      }
      unobserve() {}
      disconnect() {}
      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }
    }
    (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = SafeIntersectionObserver;
  }

  // 2. ResizeObserver shim
  if (typeof (window as unknown as { ResizeObserver?: unknown }).ResizeObserver === 'undefined') {
    class SafeResizeObserver {
      private callback: ResizeObserverCallback;
      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
      }
      observe(target: Element) {
        if (typeof this.callback === 'function') {
          try {
            const rect = target.getBoundingClientRect ? target.getBoundingClientRect() : { width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0, x: 0, y: 0, toJSON: () => ({}) };
            const entry: ResizeObserverEntry = {
              target,
              contentRect: rect as DOMRectReadOnly,
              borderBoxSize: [] as readonly ResizeObserverSize[],
              contentBoxSize: [] as readonly ResizeObserverSize[],
              devicePixelContentBoxSize: [] as readonly ResizeObserverSize[],
            };
            this.callback([entry], this as unknown as ResizeObserver);
          } catch {
            // ignore
          }
        }
      }
      unobserve() {}
      disconnect() {}
    }
    (window as unknown as { ResizeObserver: unknown }).ResizeObserver = SafeResizeObserver;
  }

  // 3. matchMedia shim
  if (typeof window.matchMedia !== 'function') {
    window.matchMedia = function(query: string): MediaQueryList {
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      };
    };
  }

  // 4. scrollTo shim
  if (typeof window.scrollTo !== 'function') {
    window.scrollTo = () => {};
  }
}

export {};
