import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { FiMaximize2, FiMinimize2, FiMove, FiX } from 'react-icons/fi';

interface ResizablePanelProps {
  title: string;
  children: ReactNode;
  defaultWidth?: number;
  defaultHeight?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  resizable?: boolean;
  draggable?: boolean;
  collapsible?: boolean;
  onClose?: () => void;
  className?: string;
}

const ResizablePanel: React.FC<ResizablePanelProps> = ({
  title,
  children,
  defaultWidth = 320,
  defaultHeight = 400,
  minWidth = 280,
  minHeight = 200,
  maxWidth = 600,
  maxHeight = 800,
  resizable = true,
  draggable = true,
  collapsible = true,
  onClose,
  className = ''
}) => {
  const [dimensions, setDimensions] = useState({
    width: defaultWidth,
    height: defaultHeight
  });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>('');

  const panelRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!draggable || isMaximized) return;
    
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  // Handle resizing
  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    if (!resizable || isMaximized) return;
    
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: dimensions.width,
      height: dimensions.height
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMaximized) {
        const newX = e.clientX - dragStartRef.current.x;
        const newY = e.clientY - dragStartRef.current.y;

        // Allow dragging to the left (negative X values) and constrain within reasonable bounds
        const maxX = window.innerWidth - 200; // Minimum 200px visible on right
        const minX = -(dimensions.width - 200); // Allow dragging left but keep 200px visible
        const maxY = window.innerHeight - 100; // Minimum 100px visible at bottom
        const minY = 0; // Don't allow dragging above viewport

        setPosition({
          x: Math.max(minX, Math.min(maxX, newX)),
          y: Math.max(minY, Math.min(maxY, newY))
        });
      }

      if (isResizing && !isMaximized) {
        const deltaX = e.clientX - resizeStartRef.current.x;
        const deltaY = e.clientY - resizeStartRef.current.y;
        
        let newWidth = resizeStartRef.current.width;
        let newHeight = resizeStartRef.current.height;

        if (resizeDirection.includes('right')) {
          newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStartRef.current.width + deltaX));
        }
        if (resizeDirection.includes('left')) {
          newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStartRef.current.width - deltaX));
          // Update position when resizing from left to maintain right edge position
          if (newWidth !== resizeStartRef.current.width) {
            setPosition(prev => ({
              ...prev,
              x: prev.x + (resizeStartRef.current.width - newWidth)
            }));
          }
        }
        if (resizeDirection.includes('bottom')) {
          newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStartRef.current.height + deltaY));
        }
        if (resizeDirection.includes('top')) {
          newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStartRef.current.height - deltaY));
          // Update position when resizing from top to maintain bottom edge position
          if (newHeight !== resizeStartRef.current.height) {
            setPosition(prev => ({
              ...prev,
              y: prev.y + (resizeStartRef.current.height - newHeight)
            }));
          }
        }

        setDimensions({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection('');
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, resizeDirection, minWidth, maxWidth, minHeight, maxHeight, isMaximized, dimensions]);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (!isMaximized) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const panelStyle = isMaximized
    ? {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1000
      }
    : {
        position: 'relative' as const,
        width: dimensions.width,
        height: isCollapsed ? 'auto' : dimensions.height,
        transform: `translate(${position.x}px, ${position.y}px)`
      };

  return (
    <div
      ref={panelRef}
      className={`bg-gradient-to-br from-dark-100/90 to-dark-200/90 backdrop-blur-lg border border-gray-600/50 rounded-xl shadow-2xl overflow-hidden ${className}`}
      style={panelStyle}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between p-4 border-b border-gray-600/30 bg-gradient-to-r from-dark-200/50 to-dark-100/50 ${
          draggable && !isMaximized ? 'cursor-move' : ''
        }`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center space-x-3">
          {draggable && !isMaximized && (
            <FiMove className="w-4 h-4 text-gray-400" />
          )}
          <h3 className="text-lg font-bold font-racing text-white">{title}</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {collapsible && (
            <button
              onClick={toggleCollapse}
              className="p-1 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
            >
              <div className={`w-3 h-3 border-2 border-gray-400 transition-transform ${
                isCollapsed ? 'rotate-45' : ''
              }`} />
            </button>
          )}
          
          <button
            onClick={toggleMaximize}
            className="p-1 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
          >
            {isMaximized ? (
              <FiMinimize2 className="w-4 h-4 text-gray-400" />
            ) : (
              <FiMaximize2 className="w-4 h-4 text-gray-400" />
            )}
          </button>
          
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-gray-700/50 hover:bg-red-500/50 transition-colors"
            >
              <FiX className="w-4 h-4 text-gray-400 hover:text-red-400" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="p-4 overflow-auto" style={{ height: isMaximized ? 'calc(100vh - 64px)' : 'calc(100% - 64px)' }}>
          {children}
        </div>
      )}

      {/* Resize Handles */}
      {resizable && !isMaximized && !isCollapsed && (
        <>
          {/* Corner handles */}
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-gradient-to-br from-accent-purple/50 to-accent-pink/50 rounded-tl-lg"
            onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-right')}
          />
          <div
            className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize bg-gradient-to-br from-accent-purple/50 to-accent-pink/50 rounded-bl-lg"
            onMouseDown={(e) => handleResizeMouseDown(e, 'top-right')}
          />
          <div
            className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize bg-gradient-to-br from-accent-purple/50 to-accent-pink/50 rounded-tr-lg"
            onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-left')}
          />
          <div
            className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize bg-gradient-to-br from-accent-purple/50 to-accent-pink/50 rounded-br-lg"
            onMouseDown={(e) => handleResizeMouseDown(e, 'top-left')}
          />

          {/* Edge handles */}
          <div
            className="absolute top-0 left-4 right-4 h-2 cursor-n-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'top')}
          />
          <div
            className="absolute bottom-0 left-4 right-4 h-2 cursor-s-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'bottom')}
          />
          <div
            className="absolute left-0 top-4 bottom-4 w-2 cursor-w-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'left')}
          />
          <div
            className="absolute right-0 top-4 bottom-4 w-2 cursor-e-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'right')}
          />
        </>
      )}
    </div>
  );
};

export default ResizablePanel;
