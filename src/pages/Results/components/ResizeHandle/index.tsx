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
      
      const containerHeight = window.innerHeight - 70;
      const deltaY = clientY - startYRef.current;
      let newMapHeight = (startHeightRef.current + deltaY) / containerHeight * 100;
      
      // Constrain the height between 5% and 95%
      newMapHeight = Math.min(Math.max(newMapHeight, 5), 95);
      
      // Update height immediately during drag
      const mapView = document.getElementById('map-view');
      const list = document.getElementById('restaurant-list');
      
      if (mapView && list) {
        mapView.style.transition = 'none';
        list.style.transition = 'none';
        mapView.style.height = `${newMapHeight}%`;
        list.style.height = `${100 - newMapHeight - 8}%`;
      }
      
      // Also call onResize to keep state in sync
      onResize(newMapHeight);
    };

    const handleEnd = () => {
      if (!isDraggingRef.current) return;
      
      isDraggingRef.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
      
      setIsSnapping(true);
      const mapView = document.getElementById('map-view');
      const currentHeight = mapView ? parseFloat(mapView.style.height) : 33;
      const targetHeight = currentHeight > 50 ? 95 : 5;
      
      // Re-enable transitions for snap animation
      if (mapView) {
        mapView.style.transition = 'height 0.3s ease';
      }
      const list = document.getElementById('restaurant-list');
      if (list) {
        list.style.transition = 'height 0.3s ease';
      }
      
      onResize(targetHeight);
      setTimeout(() => setIsSnapping(false), 300);
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Prevent scrolling while dragging
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
    const mapView = document.getElementById('map-view');
    startHeightRef.current = mapView?.offsetHeight || 0;
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
    
    // Disable transitions when starting drag
    if (mapView) {
      mapView.style.transition = 'none';
    }
    const list = document.getElementById('restaurant-list');
    if (list) {
      list.style.transition = 'none';
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent any default touch behavior
    handleStart(e.touches[0].clientY);
  };

  return (
    <div 
      className={`resize-handle ${isSnapping ? 'snapping' : ''}`}
      onTouchStart={handleTouchStart}
      onMouseDown={handleMouseDown}
    >
      <div className="resize-handle-bar">
        <div className="resize-handle-indicator" />
      </div>
    </div>
  );
}