import React, { useRef, useState, useEffect } from 'react';

interface ResponsiveTableContainerProps {
  children: React.ReactNode;
  maxHeight?: string; // e.g. "600px" or "max-h-[640px]"
  className?: string;
  tableId?: string;
  minWidth?: string; // e.g. "880px" or "min-w-[880px]"
}

export const ResponsiveTableContainer: React.FC<ResponsiveTableContainerProps> = ({
  children,
  maxHeight = '640px',
  className = '',
  tableId,
  minWidth
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  // Format style for maxHeight and minWidth
  const heightStyle = maxHeight ? { maxHeight: maxHeight.includes('px') || maxHeight.includes('vh') || maxHeight.includes('%') ? maxHeight : undefined } : undefined;
  const widthStyle = minWidth ? { minWidth: minWidth.includes('px') || minWidth.includes('vw') || minWidth.includes('%') ? minWidth : undefined } : undefined;

  return (
    <div id={tableId} className="relative rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      {/* Subtle left indicator if scrollable */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-slate-900/10 to-transparent pointer-events-none z-20" />
      )}

      {/* Subtle right indicator if scrollable */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-slate-900/10 to-transparent pointer-events-none z-20" />
      )}

      <div
        ref={containerRef}
        style={heightStyle}
        className={`overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent ${className}`}
      >
        <div style={widthStyle} className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
};
