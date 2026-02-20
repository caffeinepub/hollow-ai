import { useState, useEffect, RefObject } from 'react';

interface Point {
  x: number;
  y: number;
}

export function useCanvasDrawing(canvasRef: RefObject<HTMLCanvasElement | null>) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [isErasing, setIsErasing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize canvas with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [canvasRef]);

  const getCoordinates = (e: MouseEvent | TouchEvent): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e instanceof MouseEvent) {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    } else if (e instanceof TouchEvent && e.touches.length > 0) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }

    return null;
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const nativeEvent = e.nativeEvent;
    const point = getCoordinates(nativeEvent as MouseEvent | TouchEvent);
    if (point) {
      setIsDrawing(true);
      setLastPoint(point);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const nativeEvent = e.nativeEvent;
    const currentPoint = getCoordinates(nativeEvent as MouseEvent | TouchEvent);
    if (!currentPoint || !lastPoint) return;

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.strokeStyle = isErasing ? '#FFFFFF' : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    setLastPoint(currentPoint);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return {
    isDrawing,
    color,
    brushSize,
    isErasing,
    setColor,
    setBrushSize,
    setIsErasing,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
  };
}
