import React, { useRef, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Toolbar from "../components/Toolbar";
import Canvas from "../components/Canvas";
import { jsPDF } from "jspdf";
import axios from 'axios';

interface GeneratedResult {
  expression: string;
  answer: string;
}

export default function NotePage() {
  const [color, setColor] = useState("#0F0F0F");
  const [stroke, setStroke] = useState(2);
  const [erase, setErase] = useState(false);
  const [history, setHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);
  const [snapshotHistory, setSnapshotHistory] = useState([]);
  const [isAiDialogueOpen, setIsAiDialogOpen] = useState(false);
  const [dictOfVars, setDictOfVars] = useState({});
  const [result, setResult] = useState<GeneratedResult[]>([]); // Store multiple results in an array
  const [latexPosition, setLatexPosition] = useState({ x: 10, y: 200 });

  const noteTitle = "Note Title";
  const canvasRef = useRef(null);

  const hanleShapes = (shape) =>{
    console.log(shape)
  }
  const handleSelection = () => {
    if (canvasRef.current) {
      canvasRef.current.startSelection(); 
    }

  
  }

  const updateHistory = (newHistory) => {
    setHistory(newHistory);
  };

  const updateRedoHistory = (newRedoHistory) => {
    setRedoHistory(newRedoHistory);
  };

  const updateSnapshotHistory = (newSnapshot) => {
    setSnapshotHistory([newSnapshot]);
  };

  const handleDialogue = () => {
    setIsAiDialogOpen(!isAiDialogueOpen);
  };

  const exportPdf = () => {
    if (isAiDialogueOpen) {
      return;
    } else {
      const canvas = canvasRef.current?.getCanvas();
      if (!canvas) return;

      const canvasImage = canvas.toDataURL("image/png");

      const doc = new jsPDF();
      const imgWidth = 210;
      const imgHeight = (canvas.height / canvas.width) * imgWidth;

      doc.addImage(canvasImage, "PNG", 0, 0, imgWidth, imgHeight);
      doc.save(noteTitle);
    }
  };

  const handleUndo = () => {
    const canvas = canvasRef.current?.getCanvas();
    const ctx = canvas?.getContext("2d");
    const currentHistory = canvasRef.current?.getHistory();

    if (currentHistory && currentHistory.length > 1 && ctx) {
      const prevImage = currentHistory[currentHistory.length - 2];
      ctx.putImageData(prevImage, 0, 0);

      const updatedHistory = currentHistory.slice(0, -1);
      const redoImg = currentHistory[currentHistory.length - 1];

      canvasRef.current?.setHistory(updatedHistory);
      canvasRef.current?.setRedoHistory([redoImg, ...redoHistory]);
    }
  };

  const handleRedo = () => {
    const canvas = canvasRef.current?.getCanvas();
    const ctx = canvas?.getContext("2d");
    const currentRedoHistory = canvasRef.current?.getRedoHistory();

    if (currentRedoHistory && currentRedoHistory.length > 0 && ctx) {
      const nextImage = currentRedoHistory[0];
      ctx.putImageData(nextImage, 0, 0);

      canvasRef.current?.setHistory((prev) => [...prev, nextImage]);
      canvasRef.current?.setRedoHistory(currentRedoHistory.slice(1));
    }
  };

  const handleAi = async () => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) {
      alert("Canvas reference is not set.");
      return;
    }

    const context = canvas.getContext("2d");
    if (!context || canvas.width === 0 || canvas.height === 0) {
      alert("Canvas is blank or has no content.");
      return;
    }

    try {
      const dataURL = canvas.toDataURL('image/png');
      if (!dataURL || dataURL === "data:image/png;base64,") {
        alert("Nothing to process.");
        return;
      }

      const response = await axios({
        method: 'post',
        url: `http://localhost:8900/calculate`,
        data: {
          image: dataURL,
          dict_of_vars: dictOfVars,
        },
      });

      const resp = response.data;
      console.log('AI Response:', resp);

      const newResults = resp.data.map((data: Response) => ({
        expression: data.expr,
        answer: data.result
      }));

      setResult(prevResults => [...prevResults, ...newResults]); // Append new results

      const ctx = canvas.getContext('2d');
      const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
      let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4;
          if (imageData.data[i + 3] > 0) {  // If pixel is not transparent
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }

      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;

      setLatexPosition({ x: centerX, y: centerY });
      setIsAiDialogOpen(false);

    } catch (error) {
      console.error('Error while sending canvas data to backend:', error);
    }
  };

  return (
    <>
      <Header exportPdf={exportPdf} isAiDialogueOpen={isAiDialogueOpen} />
      <Sidebar snapshotHistory={snapshotHistory} />
      <Toolbar
        setColor={setColor}
        setStroke={setStroke}
        setErase={setErase}
        undo={handleUndo}
        redo={handleRedo}
        handleShape = {hanleShapes}
        handleSelect ={handleSelection}
        handleDialogue={handleDialogue}
      />

      <Canvas
        ref={canvasRef}
        color={color}
        stroke={stroke}
        
        updateHistory={updateHistory}
        updateRedoHistory={updateRedoHistory}
        updateSnapshotHistory={updateSnapshotHistory}
        id="noteCanvas"
        width={2480}
        height={3508}
        result={result}
        LatexPosition={setLatexPosition}
      />

      {isAiDialogueOpen && (
        <div className="ai-dialog-overlay">
          <div className="ai-dialog-content">
            <div className="ai-header">
              <h5>Draw your ideas or problems - Let AI transform them into a solution!</h5>
              <button onClick={handleAi}>
                Do magic <span>AI</span>
              </button>
            </div>
            <Canvas
              ref={canvasRef}
              color={color}
              stroke={stroke}
              updateHistory={updateHistory}
              updateRedoHistory={updateRedoHistory}
              updateSnapshotHistory={updateSnapshotHistory}
              id="aiCanvas"
              height={window.innerHeight - 250}
              width={window.innerWidth - 200}
            />
          </div>
        </div>
      )}
    </>
  );
}
