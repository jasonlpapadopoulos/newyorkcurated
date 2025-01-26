import { useEffect, useRef } from 'react';

interface ResizeHandleProps {
  onResize: (newMapHeight: number) => void;
}

export default function ResizeHandle({ onResize }: ResizeHandleProps) {
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const containerHeight = window.innerHeight;
      const deltaY = e.clientY - startYRef.current;
      const newMapHeight = Math.min(
        Math.max(
          (startHeightRef.current + deltaY) / containerHeight * 100,
          5  // Allow map to be minimized to 5%
        ),
        95 // Allow map to be maximized to 95%
      );

      onResize(newMapHeight);
    };

    const handleMouseUp = () => {
      if (!isDraggingRef.current) return;
      
      isDraggingRef.current = false;
      document.body.style.cursor = 'default';
      
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

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onResize]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    startHeightRef.current = document.getElementById('map-view')?.offsetHeight || 0;
    document.body.style.cursor = 'row-resize';
  };

  return (
    <div 
      className="resize-handle"
      onMouseDown={handleMouseDown}
    >
      <div className="resize-handle-line" />
    </div>
  );
}