import { useEffect, useRef, useState } from 'react';

interface ResizeHandleProps {
  onResize: (newMapHeight: number) => void;
}

export default function ResizeHandle({ onResize }: ResizeHandleProps) {
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);
  const [isSnapping, setIsSnapping] = useState(false);
  const [hasInitialResizeOccurred, setHasInitialResizeOccurred] = useState(false);
  const dragThreshold = 5; // Pixels to move before considering it a drag
  const moveCountRef = useRef(0);

  const handleClick = () => {
    // Only handle as click if we haven't moved much
    if (moveCountRef.current < dragThreshold) {
      const mapView = document.getElementById('map-view');
      const currentHeight = mapView ? parseFloat(mapView.style.height) : 33;
      
      setIsSnapping(true);
      
      // If this is the first interaction, set the flag
      if (!hasInitialResizeOccurred) {
        setHasInitialResizeOccurred(true);
      }

      // Toggle between positions
      let targetHeight;
      if (!hasInitialResizeOccurred) {
        // First click goes to 5%
        targetHeight = 5;
      } else {
        // After first interaction, toggle between 5% and 95%
        targetHeight = currentHeight < 50 ? 95 : 5;
      }

      onResize(targetHeight);
      setTimeout(() => setIsSnapping(false), 300);
    }
  };

  useEffect(() => {
    const handleMove = (clientY: number) => {
      if (!isDraggingRef.current) return;

      moveCountRef.current += 1;

      const containerHeight = window.innerHeight - 70;
      const deltaY = clientY - startYRef.current;
      let newMapHeight = (startHeightRef.current + deltaY) / containerHeight * 100;

      if (hasInitialResizeOccurred) {
        // Snap to either 5% or 95% based on drag position
        newMapHeight = newMapHeight > 50 ? 95 : 5;
      }

      newMapHeight = Math.min(Math.max(newMapHeight, 5), 95);

      requestAnimationFrame(() => {
        onResize(newMapHeight);
      });
    };

    const handleEnd = () => {
      if (!isDraggingRef.current) return;
      
      isDraggingRef.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
      
      // Only handle as drag if we've moved enough
      if (moveCountRef.current >= dragThreshold) {
        setIsSnapping(true);

        const mapView = document.getElementById('map-view');
        const currentHeight = mapView ? parseFloat(mapView.style.height) : 33;

        if (!hasInitialResizeOccurred) {
          setHasInitialResizeOccurred(true);
        }

        let targetHeight;
        if (hasInitialResizeOccurred) {
          targetHeight = currentHeight > 50 ? 95 : 5;
        } else {
          if (currentHeight < 25) targetHeight = 5;
          else if (currentHeight > 66) targetHeight = 95;
          else targetHeight = 33;
        }
        
        onResize(targetHeight);
        setTimeout(() => setIsSnapping(false), 300);
      }

      // Reset move counter
      moveCountRef.current = 0;
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
  }, [onResize, hasInitialResizeOccurred]);

  const handleStart = (clientY: number) => {
    isDraggingRef.current = true;
    startYRef.current = clientY;
    startHeightRef.current = document.getElementById('map-view')?.offsetHeight || 0;
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
    moveCountRef.current = 0;
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
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="resize-handle-indicator" />
      </div>
    </div>
  );
}