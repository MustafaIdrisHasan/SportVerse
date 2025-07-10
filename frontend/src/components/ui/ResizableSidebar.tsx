import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface ResizableSidebarProps {
  children: React.ReactNode;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  className?: string;
  onWidthChange?: (width: number) => void;
}

const ResizableSidebar: React.FC<ResizableSidebarProps> = ({
  children,
  defaultWidth = 320,
  minWidth = 240,
  maxWidth = 600,
  className = '',
  onWidthChange
}) => {
  const [width, setWidth] = useState(defaultWidth);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [scrollPosition, setScrollPosition] = useState({ atTop: true, atBottom: false });
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [width]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    const deltaX = startXRef.current - e.clientX; // Reversed for right sidebar
    const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidthRef.current + deltaX));
    
    setWidth(newWidth);
    onWidthChange?.(newWidth);
  }, [isResizing, minWidth, maxWidth, onWidthChange]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    const newWidth = !isCollapsed ? 60 : defaultWidth;
    setWidth(newWidth);
    onWidthChange?.(newWidth);
  };

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;

    setScrollPosition({
      atTop: scrollTop <= 5, // Small threshold for better UX
      atBottom: scrollTop + clientHeight >= scrollHeight - 5
    });
  }, []);

  const currentWidth = isCollapsed ? 60 : width;

  return (
    <>
      {/* Mobile Floating Toggle Button */}
      <div className="xl:hidden fixed right-4 z-50" style={{ top: '80px' }}>
        <button
          onClick={toggleCollapse}
          className="p-3 rounded-full bg-dark-200/90 hover:bg-dark-200 border border-gray-600/50 hover:border-accent-electric/50 transition-all duration-200 group shadow-lg backdrop-blur-sm"
          title="Toggle Quick Tools"
        >
          <svg className="w-5 h-5 text-gray-400 group-hover:text-accent-electric transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div
        ref={sidebarRef}
        className={`relative bg-dark-100/50 backdrop-blur-lg border-l border-t border-gray-600/30 transition-all duration-300 ease-in-out ${className}`}
        style={{
          width: currentWidth,
          height: 'calc(100vh - 64px)',
          maxHeight: 'calc(100vh - 64px)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Top border highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-electric/30 to-transparent"></div>

        {/* Top scroll boundary indicator - only show when not at top */}
        {!scrollPosition.atTop && !isCollapsed && (
          <div className="absolute top-1 left-0 right-0 h-3 bg-gradient-to-b from-dark-100/90 to-transparent pointer-events-none z-10 transition-opacity duration-200"></div>
        )}

        {/* SportVerse scroll limit indicator */}
        <div className="absolute top-2 left-2 right-2 text-xs text-gray-500 font-sport text-center opacity-60 pointer-events-none z-10">
          {!isCollapsed && "SportVerse"}
        </div>
      {/* Resize Handle */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-accent-electric/50 transition-colors ${
          isResizing ? 'bg-accent-electric' : 'bg-transparent'
        }`}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-3 h-8 bg-dark-200/80 rounded-l-md border border-gray-600/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <div className="w-1 h-4 bg-gray-400 rounded-full"></div>
        </div>
      </div>



      {/* Content */}
      <div className={`relative h-full transition-opacity duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {!isCollapsed && (
          <>
            <div
              ref={contentRef}
              className="h-full pt-4 px-4 pb-4 overflow-y-auto sidebar-scroll scroll-boundary"
              onScroll={handleScroll}
              style={{
                maxHeight: 'calc(100vh - 64px - 8px)', // Account for top boundary
                scrollBehavior: 'smooth'
              }}
            >
              {React.isValidElement(children)
                ? React.cloneElement(children as React.ReactElement<any>, {
                    onCollapse: toggleCollapse,
                    isCollapsed: isCollapsed
                  })
                : children
              }
            </div>

            {/* Bottom scroll boundary indicator - only show when not at bottom */}
            {!scrollPosition.atBottom && (
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-dark-100/90 to-transparent pointer-events-none z-10 transition-opacity duration-200"></div>
            )}
          </>
        )}
      </div>

      {/* Collapsed State Icons */}
      {isCollapsed && (
        <div
          className="flex flex-col items-center pt-12 space-y-6 overflow-y-auto sidebar-scroll scroll-boundary"
          style={{
            maxHeight: 'calc(100vh - 64px - 16px)', // Account for boundaries
            scrollBehavior: 'smooth'
          }}
        >
          {/* Collapsed Header */}
          <div className="text-center mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-accent-electric/20 to-accent-electric/10 border border-accent-electric/30" title="Quick Tools">
              <svg className="w-6 h-6 text-accent-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="text-xs text-gray-400 font-sport mt-2">Tools</div>
          </div>

          {/* Collapsed Menu Items */}
          <div className="space-y-3">
            <div className="p-2 rounded-lg bg-dark-200/30 border border-gray-600/30 hover:border-gray-500/50 transition-colors cursor-pointer" title="Activity">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="p-2 rounded-lg bg-dark-200/30 border border-gray-600/30 hover:border-gray-500/50 transition-colors cursor-pointer" title="Stats">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="p-2 rounded-lg bg-dark-200/30 border border-gray-600/30 hover:border-gray-500/50 transition-colors cursor-pointer" title="Trending">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default ResizableSidebar;
