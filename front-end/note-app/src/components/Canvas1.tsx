import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";

// Shape types
const SHAPE_TYPES = {
  LINE: "line",
  TRIANGLE: "triangle",
  RECTANGLE: "rectangle",
  CIRCLE: "circle",
};

const Canvas = forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);
  const [snapshotHistory, setSnapshotHistory] = useState([]);
  const [currentShape, setCurrentShape] = useState(SHAPE_TYPES.LINE);
  const [shapes, setShapes] = useState([]);
  const [isErasing, setIsErasing] = useState(false); // For erasing functionality
  const [isTwoFingers, setIsTwoFingers] = useState(false);
  const [startPos, setStartPos] = useState(null);

  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current,
    getHistory: () => history,
    getRedoHistory: () => redoHistory,
    setHistory: setHistory,
    setRedoHistory: setRedoHistory,
  }));

  useEffect(() => {
    props.updateHistory(history);
  }, [history]);

  useEffect(() => {
    props.updateRedoHistory(redoHistory);
  }, [redoHistory]);

  useEffect(() => {
    if (snapshotHistory.length > 0) {
      props.updateSnapshotHistory(snapshotHistory[0]); // Send only the latest snapshot
    }
  }, [snapshotHistory]);

  const saveHistory = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const image = ctx?.getImageData(0, 0, canvas.width, canvas.height);
    if (image) {
      setHistory((prevHistory) => [...prevHistory, image]);
      setRedoHistory([]); // Clear redo history on new action
    }
  };

  const saveSnapshot = () => {
    const canvas = canvasRef.current;
    const snapshot = canvas.toDataURL(); // Save snapshot image
    setSnapshotHistory([snapshot]); // Only store the latest snapshot
  };

  const getPosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    let x, y;
    if (e.touches) {
      // For touch event
      const touch = e.touches[0];
      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;
    } else {
      // For mouse event
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }
    return { x, y };
  };

  const startDrawing = (e) => {
    const { x, y } = getPosition(e);
    setStartPos({ x, y });
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const { x, y } = getPosition(e);
    const newShape = {
      type: currentShape,
      startX: startPos.x,
      startY: startPos.y,
      endX: x,
      endY: y,
      width: x - startPos.x,
      height: y - startPos.y,
    };

    if (isErasing) {
      erase(x, y);
    } else {
      setShapes((prevShapes) => {
        const newShapes = [...prevShapes];
        newShapes.pop(); // Remove the ongoing shape
        newShapes.push(newShape); // Add updated shape
        return newShapes;
      });
      renderCanvas();
    }
  };

  const erase = (x, y) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(x - 10, y - 10, 20, 20); // Simple erasing mechanism, can be adjusted
    setShapes([]);
  };

  const stopDrawing = () => {
    if (!isErasing) {
      setIsDrawing(false);
      if (shapes.length > 0) {
        saveSnapshot();
        setShapes([...shapes, shapes[shapes.length - 1]]);
      }
    }
  };

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before re-drawing
    shapes.forEach((shape) => drawShape(shape, ctx)); // Draw all shapes
    if (shapes.length > 0) {
      drawShape(shapes[shapes.length - 1], ctx); // Draw the ongoing shape
    }
  };

  const drawShape = (shape, ctx) => {
    if (shape.type === SHAPE_TYPES.LINE) {
      ctx.beginPath();
      ctx.moveTo(shape.startX, shape.startY);
      ctx.lineTo(shape.endX, shape.endY);
      ctx.stroke();
    } else if (shape.type === SHAPE_TYPES.RECTANGLE) {
      ctx.beginPath();
      ctx.rect(shape.startX, shape.startY, shape.width, shape.height);
      ctx.stroke();
    } else if (shape.type === SHAPE_TYPES.CIRCLE) {
      const radius = Math.sqrt(
        Math.pow(shape.endX - shape.startX, 2) + Math.pow(shape.endY - shape.startY, 2)
      );
      ctx.beginPath();
      ctx.arc(shape.startX, shape.startY, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (shape.type === SHAPE_TYPES.TRIANGLE) {
      const x1 = shape.startX;
      const y1 = shape.startY;
      const x2 = shape.endX;
      const y2 = shape.endY;
      const x3 = shape.startX + shape.width; // Third point of the triangle

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y2); // Base line is horizontal
      ctx.closePath();
      ctx.stroke();
    }
  };

  const handleMouseDown = (e) => {
    startDrawing(e);
  };

  const handleMouseMove = (e) => {
    draw(e);
  };

  const handleMouseUp = () => {
    stopDrawing();
  };

  const handleMouseOut = () => {
    stopDrawing();
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    if (e.touches.length === 2) {
      setIsTwoFingers(true);
    } else {
      setIsTwoFingers(false);
    }
    startDrawing(e);
  };

  const handleTouchMove = (e) => {
    e.preventDefault(); // Prevent scroll behavior
    if (e.touches.length === 2) {
      startDrawing();
    } else {
      draw(e);
    }
  };

  const handleTouchEnd = () => {
    setIsTwoFingers(e.touches.length === 2);
    stopDrawing();
  };

  // Shape selection handlers
  const selectShape = (shape) => {
    setCurrentShape(shape);
    setIsErasing(false); // Disable erasing when switching shape
  };

  const toggleErase = () => {
    setIsErasing(!isErasing);
    setCurrentShape(SHAPE_TYPES.LINE); // Reset to line when erasing
  };

  return (
    <div className="Canvas-section">
      {/* Shape Selection and Erase Buttons */}
      <div className="shape-selector">
        <button onClick={() => selectShape(SHAPE_TYPES.LINE)}>Line</button>
        <button onClick={() => selectShape(SHAPE_TYPES.RECTANGLE)}>Rectangle</button>
        <button onClick={() => selectShape(SHAPE_TYPES.CIRCLE)}>Circle</button>
        <button onClick={() => selectShape(SHAPE_TYPES.TRIANGLE)}>Triangle</button>
        <button onClick={toggleErase}>{isErasing ? "Stop Erasing" : "Erase"}</button>
      </div>

      <canvas
        ref={canvasRef}
        id="noteCanvas"
        width={2480}
        height={3508}
        style={{
          background: "white",
          display: "block",
          margin: "20px auto",
          border: "1px solid black",
          touchAction: isTwoFingers ? "auto" : "none",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseOut}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      ></canvas>
    </div>
  );
});

export default Canvas;
