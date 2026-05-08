export function ScanlineOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999] before:content-[''] before:absolute before:inset-0 before:bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.3)_2px,rgba(0,0,0,0.3)_4px)] before:opacity-10"
      aria-hidden="true"
    />
  );
}
