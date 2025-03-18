import React,{useState} from "react";
import { useRef } from "react";



export default function Toolbar({setColor, setStroke, setErase, undo, redo, handleShape, handleSelect, handleDialogue, snapshotHistory}) {
  
  const [currentColor, setCurrentColor] = useState<string>('#0F0F0F')
  const [previousColor, setPreviousColor] = useState<string>('#0F0F0F'); // Store previous color before eraser mode
  const [currentStroke, setCurrentStroke] = useState<number>(2)
  const [isPen, setIsPen] = useState(true)
  const [isShapeSelectorActive, setIsShapeSelectorActive] = useState(false)
  
  const modalRef = useRef(null)

  const Eraser = () => {
    setErase((prevState) => {
      const newState = !prevState;
      if (newState) {
        // Store the current color before switching to the eraser
        setColor('white'); // Switch to eraser color
      } else {
        // Switch back to theA previous color
        setColor(previousColor);
      }
      return newState;
    });
    if (isPen){
      setIsPen(false)
    }
  };

  const Pen = ()=> {
    setColor(previousColor);
    if (!isPen){
      setIsPen(true)
    }
  }

  const handleShapeSelection = ()=> {

    if (isShapeSelectorActive) {
      setIsShapeSelectorActive(false)
      modalRef.current?.close()
    }else{
      setIsShapeSelectorActive(true)
       return modalRef.current?.showModal()
    }
    
  }
  const handleOutsideClick = (event)=>{
    if (event.targer !== modalRef.current){
        // setIsShapeSelectorActive(false)
        // modalRef.current?.close()
    }

  }

  const shape = ()=> {

  }
  
  const select = ()=> {}

  const handleColorChange = (newColor: string) => {
    setCurrentColor(newColor);
    setColor(newColor);
    setPreviousColor(currentColor); 
    setErase(false); 
  };
  

  const handleStrokeChange = (newStroke:number)=>{
    setStroke(newStroke);
    setCurrentStroke(newStroke)

  }
  
  return (
    <>
      <section className="toolbar-section">
      {/* undo redo button */}
      <div className="toolbar d-flex ">
        <div className="action">
          <button onClick={undo} className="tool tool-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="800px"
              height="800px"
              viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.7071 4.29289C11.0976 4.68342 11.0976 5.31658 10.7071 5.70711L8.41421 8H13.5C16.5376 8 19 10.4624 19 13.5C19 16.5376 16.5376 19 13.5 19H11C10.4477 19 10 18.5523 10 18C10 17.4477 10.4477 17 11 17H13.5C15.433 17 17 15.433 17 13.5C17 11.567 15.433 10 13.5 10H8.41421L10.7071 12.2929C11.0976 12.6834 11.0976 13.3166 10.7071 13.7071C10.3166 14.0976 9.68342 14.0976 9.29289 13.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289L9.29289 4.29289C9.68342 3.90237 10.3166 3.90237 10.7071 4.29289Z"
                fill=""
              />
            </svg>
          </button>
          <button onClick={redo} className="tool tool-button  ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="800px"
              height="800px"
              viewBox="0 0 24 24"
              fill="currentfill">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.2929 4.29289C13.6834 3.90237 14.3166 3.90237 14.7071 4.29289L18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L14.7071 13.7071C14.3166 14.0976 13.6834 14.0976 13.2929 13.7071C12.9024 13.3166 12.9024 12.6834 13.2929 12.2929L15.5858 10H10.5C8.567 10 7 11.567 7 13.5C7 15.433 8.567 17 10.5 17H13C13.5523 17 14 17.4477 14 18C14 18.5523 13.5523 19 13 19H10.5C7.46243 19 5 16.5376 5 13.5C5 10.4624 7.46243 8 10.5 8H15.5858L13.2929 5.70711C12.9024 5.31658 12.9024 4.68342 13.2929 4.29289Z"
                fill=""
              />
            </svg>
          </button>
        </div>

        {/* pen and eraser */}
        <div className="drawing-tool">
          <button onClick={Eraser} className={`tool ${isPen ? '' :'active'}`}>
            <svg
              fill=""
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)">
              <g id="SVGRepo_bgCarrier" strokeWidth="5"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <g id="Eraser">
                  {" "}
                  <path d="M20.454,19.028h-7.01l6.62-6.63a2.935,2.935,0,0,0,.87-2.09,2.844,2.844,0,0,0-.87-2.05l-3.42-3.44a2.93,2.93,0,0,0-4.13.01L3.934,13.4a2.946,2.946,0,0,0,0,4.14l1.48,1.49H3.554a.5.5,0,0,0,0,1h16.9A.5.5,0,0,0,20.454,19.028Zm-7.24-13.5a1.956,1.956,0,0,1,2.73,0l3.42,3.44a1.868,1.868,0,0,1,.57,1.35,1.93,1.93,0,0,1-.57,1.37l-5.64,5.64-6.15-6.16Zm-1.19,13.5h-5.2l-2.18-2.2a1.931,1.931,0,0,1,0-2.72l2.23-2.23,6.15,6.15Z"></path>{" "}
                </g>{" "}
              </g>
            </svg>
          </button>
          <button onClick={Pen} className={`tool ${isPen ? 'active' :''}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill=""
              width="800px"
              height="800px"
              viewBox="-12.5 0 35.372 35.372">
              <g transform="translate(-555.622 -510.69) ">
                <path d="M564.993,539.31a1,1,0,0,1-1-1V515.533c-.121-.481-.839-2.843-3.24-2.843a3.305,3.305,0,0,0-3.13,2.825V538.31a1,1,0,0,1-2,0l.013-23.057a5.306,5.306,0,0,1,5.117-4.563c3.417,0,4.91,2.967,5.22,4.535l.02.2v22.89A1,1,0,0,1,564.993,539.31Z" />
                <path d="M560.81,546.062a1.811,1.811,0,0,1-1.588-.939l-3.476-6.329a1,1,0,1,1,1.754-.963l3.31,6.029,3.311-6.029a1,1,0,1,1,1.754.963l-3.476,6.329a1.809,1.809,0,0,1-1.587.939Z" />
                <path d="M564.993,519.187h-8.37a1,1,0,0,1,0-2h8.37a1,1,0,0,1,0,2Z" />
              </g>
            </svg>
          </button>
        </div>
        <div className="shape-tool ">
          <dialog onClick={handleOutsideClick} ref={modalRef} id="modal" className="dialogBox">
            <button onClick={() => handleShapeSelection()}>X</button>
            <button onClick={() => {handleShape('line'); modalRef.current.close(); setIsShapeSelectorActive(false);}}>Line</button>
            <button onClick={() => {handleShape('rectangle'); modalRef.current.close(); setIsShapeSelectorActive(false);}}>Rectangle</button>
            <button onClick={() => {handleShape('circle'); modalRef.current.close(); setIsShapeSelectorActive(false);}}>Circle</button>
            <button onClick={() => {handleShape('triangle'); modalRef.current.close(); setIsShapeSelectorActive(false);}}>Triangle</button>
          </dialog>
          <button 
          onClick={() => handleShapeSelection()} 
          className={`tool tool-button ${isShapeSelectorActive ? 'active' : 'shape'}`}>
            <svg
              viewBox="0 0 20.00 20.00"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <title>shapes, shape icon</title>{" "}
                <g
                  id="Free-Icons"
                  strokeWidth="2"
                  fillRule="evenodd"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  >
                  {" "}
                  <g
                    transform="translate(-525.000000, -600.000000)"
                    id="Group"
                    strokeWidth="1.1">
                    {" "}
                    <g transform="translate(523.000000, 598.000000)" id="Shape">
                      {" "}
                      <path d="M11,8 L18,8 C19.6568542,8 21,9.34314575 21,11 L21,18 C21,19.6568542 19.6568542,21 18,21 L11,21 C9.34314575,21 8,19.6568542 8,18 L8,11 C8,9.34314575 9.34314575,8 11,8 Z">
                        {" "}
                      </path>{" "}
                      <path d="M14.8977454,7.89115917 C14.3775792,5.10718156 11.9348689,3 9,3 C5.6862915,3 3,5.6862915 3,9 C3,11.9667237 5.15317212,14.4305472 7.98204766,14.9140016">
                        {" "}
                      </path>{" "}
                    </g>{" "}
                  </g>{" "}
                </g>{" "}
              </g>
            </svg>
          </button>
          <button onClick={handleSelect} className="tool tool-button">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#F9F9F9"
              strokeWidth="0.7">
              <g id="SVGRepo_bgCarrier" strokeWidth="1"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path d="M5.5,3 C5.77614237,3 6,3.22385763 6,3.5 C6,3.77614237 5.77614237,4 5.5,4 C4.67157288,4 4,4.67157288 4,5.5 C4,5.77614237 3.77614237,6 3.5,6 C3.22385763,6 3,5.77614237 3,5.5 C3,4.11928813 4.11928813,3 5.5,3 Z M8.5,4 C8.22385763,4 8,3.77614237 8,3.5 C8,3.22385763 8.22385763,3 8.5,3 L10.5,3 C10.7761424,3 11,3.22385763 11,3.5 C11,3.77614237 10.7761424,4 10.5,4 L8.5,4 Z M13.5,4 C13.2238576,4 13,3.77614237 13,3.5 C13,3.22385763 13.2238576,3 13.5,3 L15.5,3 C15.7761424,3 16,3.22385763 16,3.5 C16,3.77614237 15.7761424,4 15.5,4 L13.5,4 Z M8.5,21 C8.22385763,21 8,20.7761424 8,20.5 C8,20.2238576 8.22385763,20 8.5,20 L10.5,20 C10.7761424,20 11,20.2238576 11,20.5 C11,20.7761424 10.7761424,21 10.5,21 L8.5,21 Z M13.5,21 C13.2238576,21 13,20.7761424 13,20.5 C13,20.2238576 13.2238576,20 13.5,20 L15.5,20 C15.7761424,20 16,20.2238576 16,20.5 C16,20.7761424 15.7761424,21 15.5,21 L13.5,21 Z M3,8.5 C3,8.22385763 3.22385763,8 3.5,8 C3.77614237,8 4,8.22385763 4,8.5 L4,10.5 C4,10.7761424 3.77614237,11 3.5,11 C3.22385763,11 3,10.7761424 3,10.5 L3,8.5 Z M3,13.5 C3,13.2238576 3.22385763,13 3.5,13 C3.77614237,13 4,13.2238576 4,13.5 L4,15.5 C4,15.7761424 3.77614237,16 3.5,16 C3.22385763,16 3,15.7761424 3,15.5 L3,13.5 Z M3,18.5 C3,18.2238576 3.22385763,18 3.5,18 C3.77614237,18 4,18.2238576 4,18.5 C4,19.3284271 4.67157288,20 5.5,20 C5.77614237,20 6,20.2238576 6,20.5 C6,20.7761424 5.77614237,21 5.5,21 C4.11928813,21 3,19.8807119 3,18.5 Z M18.5,21 C18.2238576,21 18,20.7761424 18,20.5 C18,20.2238576 18.2238576,20 18.5,20 C19.3284271,20 20,19.3284271 20,18.5 C20,18.2238576 20.2238576,18 20.5,18 C20.7761424,18 21,18.2238576 21,18.5 C21,19.8807119 19.8807119,21 18.5,21 Z M21,15.5 C21,15.7761424 20.7761424,16 20.5,16 C20.2238576,16 20,15.7761424 20,15.5 L20,13.5 C20,13.2238576 20.2238576,13 20.5,13 C20.7761424,13 21,13.2238576 21,13.5 L21,15.5 Z M21,10.5 C21,10.7761424 20.7761424,11 20.5,11 C20.2238576,11 20,10.7761424 20,10.5 L20,8.5 C20,8.22385763 20.2238576,8 20.5,8 C20.7761424,8 21,8.22385763 21,8.5 L21,10.5 Z M21,5.5 C21,5.77614237 20.7761424,6 20.5,6 C20.2238576,6 20,5.77614237 20,5.5 C20,4.67157288 19.3284271,4 18.5,4 C18.2238576,4 18,3.77614237 18,3.5 C18,3.22385763 18.2238576,3 18.5,3 C19.8807119,3 21,4.11928813 21,5.5 Z"></path>{" "}
              </g>
            </svg>
          </button>
        </div>


        {/* Stroke  */}
        <div className="stroke">
          <button onClick={()=> handleStrokeChange(1)} className={`tool stroke-button ${currentStroke === 1 ? 'active' : ''}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24">
              <g
                // stroke="#F9F9F9"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </g>
            </svg>
          </button>
          <button onClick={()=> handleStrokeChange(2)} className={`tool stroke-button ${currentStroke === 2 ? 'active' : ''}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="40"
              viewBox="0 0 24 24">
              <g
                // stroke="#F9F9F9"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </g>
            </svg>
          </button>
          <button onClick={()=> handleStrokeChange(3)} className={`tool stroke-button ${currentStroke === 3 ? 'active' : ''}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24">
              <g
                // stroke=" #F9F9F9"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </g>
            </svg>
          </button>
          <button onClick={()=> handleStrokeChange(5)} className={`tool stroke-button ${currentStroke === 5 ? 'active' : ''}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24">
              <g
                // stroke=" #F9F9F9"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </g>
            </svg>
          </button>
          <button onClick={()=> handleStrokeChange(10)} className={`tool stroke-button ${currentStroke === 10 ? 'active ' : ''}`}>
            <svg 
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24">
              <g 
                // stroke="#f9f9f9"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </g>
            </svg>
          </button>
        </div>
        <div className="colors">
          <button onClick={()=> handleColorChange('white')} className={`tool ${currentColor === 'white' ? 'color-button' : ''}`} style={{backgroundColor: 'white'}} ></button>
          <button onClick={()=> handleColorChange('#0F0F0F')} className={`tool ${currentColor === '#0F0F0F' ? 'color-button' : ''}`} style={{backgroundColor: 'black'}} ></button>
          <button onClick={()=> handleColorChange('red')} className={`tool ${currentColor === 'red' ? 'color-button' : ''}`} style={{backgroundColor: 'red'}} ></button>
          <button onClick={()=> handleColorChange('blue')} className={`tool ${currentColor === 'blue' ? 'color-button' : ''}`} style={{backgroundColor: 'blue'}} ></button>
          <button onClick={()=> handleColorChange('green')} className={`tool ${currentColor === 'green' ? 'color-button' : ''}`} style={{backgroundColor: 'green'}} ></button>
          <button onClick={()=> handleColorChange('yellow')} className={`tool ${currentColor === 'yellow' ? 'color-button' : ''}`} style={{backgroundColor: 'yellow'}} ></button>
        </div>
      </div>
      <button onClick={handleDialogue} className="ai-button">Ai</button>
      </section>
    </>
  );
}
