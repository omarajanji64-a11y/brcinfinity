
'use client';

export default function AnimatedInfinity() {
  return (
    <div className="relative w-80 h-40 flex items-center justify-center">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 200 100"
        className="absolute inset-0"
      >
        <path
          d="M50 50 C 0 0, 150 0, 100 50 C 50 100, 200 100, 150 50"
          stroke="hsl(var(--accent))"
          strokeWidth="3"
          fill="none"
          className="path-animation"
        />
      </svg>
    </div>
  );
}
