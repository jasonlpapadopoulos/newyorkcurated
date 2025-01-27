import { useEffect, useRef, useState } from 'react';

interface ResizeHandleProps {
  onResize: (newMapHeight: number) => void;
}

export default function ResizeHandle({ onResize }: ResizeHandleProps) {
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);
  const [isSnapping, setIsSnapping] = useState(false);

  useEffect(() => {
    const handleMove = (clientY: number) => {
      if (!isDraggingRef.current) return;

      const containerHeight = window.innerHeight - 70; // Account for header
      const deltaY = clientY - startYRef.current;
      const newMapHeight = Math.min(
        Math.max(
          (startHeightRef.current + deltaY) / containerHeight * 100,
          10  // Minimum map height 10%
        ),
        90 // Maximum map height 90%
      );

      requestAnimationFrame(() => {
        onResize(newMapHeight);
      });
    };

    const handleEnd = () => {
      if (!isDraggingRef.current) return;
      
      isDraggingRef.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
      setIsSnapping(true);

      // Get current map height
      const mapView = document.getElementById('map-view');
      const currentHeight = mapView ? parseFloat(mapView.style.height) : 33;
      
      // Snap to positions
      let targetHeight;
      if (currentHeight < 40) targetHeight = 10;
      else if (currentHeight > 80) targetHeight = 90;
      else targetHeight = 33;
      
      // Animate to target position
      onResize(targetHeight);
      
      setTimeout(() => setIsSnapping(false), 300);
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleMove(e.touches[0].clientY);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
    document.addEventListener('touchcancel', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
      document.removeEventListener('touchcancel', handleEnd);
    };
  }, [onResize]);

  const handleStart = (clientY: number) => {
    isDraggingRef.current = true;
    startYRef.current = clientY;
    startHeightRef.current = document.getElementById('map-view')?.offsetHeight || 0;
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientY);
  };

  return (
    <div className={`resize-handle ${isSnapping ? 'snapping' : ''}`}>
      <div 
        className="resize-handle-bar"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="resize-handle-indicator" />
      </div>
    </div>
  );
}