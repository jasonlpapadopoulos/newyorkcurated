import { useEffect, useRef } from 'react';

interface ResizeHandleProps {
  onResize: (newMapHeight: number) => void;
}

export default function ResizeHandle({ onResize }: ResizeHandleProps) {
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  useEffect(() => {
    const handleMove = (clientY: number) => {
      if (!isDraggingRef.current) return;

      const containerHeight = window.innerHeight;
      const deltaY = clientY - startYRef.current;
      const newMapHeight = Math.min(
        Math.max(
          (startHeightRef.current + deltaY) / containerHeight * 100,
          5  // Allow map to be minimized to 5%
        ),
        95 // Allow map to be maximized to 95%
      );

      onResize(newMapHeight);
    };

    const handleEnd = () => {
      if (!isDraggingRef.current) return;
      
      isDraggingRef.current = false;
      document.body.style.cursor = 'default';
      document.body.style.touchAction = 'auto';
      
      // Get current map height
      const mapView = document.getElementById('map-view');
      const currentHeight = mapView ? parseFloat(mapView.style.height) : 50;
      
      // Snap to extremes or keep current position
      if (currentHeight < 10) {
        onResize(5);
      } else if (currentHeight > 90) {
        onResize(95);
      }
    };

    // Mouse event handlers
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientY);
    const handleMouseUp = () => handleEnd();

    // Touch event handlers
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Prevent scrolling while dragging
      handleMove(e.touches[0].clientY);
    };
    const handleTouchEnd = () => handleEnd();

    // Add all event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      // Remove all event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [onResize]);

  const handleStart = (clientY: number) => {
    isDraggingRef.current = true;
    startYRef.current = clientY;
    startHeightRef.current = document.getElementById('map-view')?.offsetHeight || 0;
    document.body.style.cursor = 'row-resize';
    document.body.style.touchAction = 'none'; // Prevent scrolling while dragging
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientY);
  };

  return (
    <div 
      className="resize-handle"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="resize-handle-line" />
    </div>
  );
}