import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import Draggable from 'react-draggable';

const SHAPE_TYPE = {
  LINE: 'line',
  RECTANGLE: 'rectangle',
  CIRCLE: 'circle',
  TRIANGLE: 'triangle',
};

const Canvas = forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  const draggableRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);
  const [snapshotHistory, setSnapshotHistory] = useState([]);
  const [isTwoFingers, setIsTwoFingers] = useState(false);
  const [latexPositions, setLatexPositions] = useState([]); 

  const [isSelecting, setIsSelecting] = useState(false);


  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current, // Expose canvas DOM element
    getHistory: () => history,
    getRedoHistory: () => redoHistory,
    setHistory: setHistory,
    setRedoHistory: setRedoHistory,

    startSelection: () => {
      setIsSelecting(true);
      console.log("Selection mode activated!");
    }
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

  // Save snapshot only after the drawing is finished
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

  const drawShape = (shape, ctx) => {
    if (shape.type === SHAPE_TYPE.LINE) {
      ctx.beginPath();
      ctx.moveTo(shape.startX, shape.startY);
      ctx.lineTo(shape.endX, shape.endY);
      ctx.stroke();
    }
  };
  
  const startSelection = (e) => {
    const { x, y } = getPosition(e);
    console.log(`Selection started at (${x}, ${y})`);
  };


  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPosition(e);

    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
      saveHistory(); // Save the current state as history
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPosition(e);

    if (ctx) {
      ctx.strokeStyle = props.color;
      ctx.lineWidth = props.stroke;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    saveSnapshot(); // Save the final state as a snapshot when drawing stops
  };

  // Mouse events
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

  // Touch events
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

  const handleTouchEnd = (e) => {
    if (e.touches.length === 2) {
      setIsTwoFingers(true);
    } else {
      setIsTwoFingers(false);
    }
    stopDrawing();
  };

  const handleLatexDragStop = (index, data) => {
    setLatexPositions((prevPositions) => {
      const updatedPositions = [...prevPositions];
      updatedPositions[index] = { x: data.x, y: data.y }; // Update the position for the specific LaTeX item
      return updatedPositions;
    });
  };

  return (
    <div className="Canvas-section">
      {props.result && props.result.length > 0 && props.result.map((res, index) => (
        <Draggable
          key={index}
          nodeRef={draggableRef}
          position={latexPositions[index] || { x: window.innerWidth / 2, y: window.innerHeight / 2 }} // Default to the center
          onStop={(e, data) => handleLatexDragStop(index, data)}
        >
          <div
            ref={draggableRef}
            className="latex-response"
            style={{
              position: "absolute",
              cursor: "move",
              color: props.currentColor,
            }}
          >
            <p>{res.expression} = {res.answer}</p> {/* Render expression and answer */}
          </div>
        </Draggable>
      ))}

      <canvas
        ref={canvasRef}
        id={props.id}
        width={props.width}
        height={props.height}
        style={{
          background: "white",
          display: "block",
          border: "1px solid black",
          borderRadius: "10px",
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
