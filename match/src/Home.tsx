import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// Include the TypeScript (or JavaScript) functions you provided before.
// Assuming you named the file as 'waveAnimation.ts' (or 'waveAnimation.js')
// import './waveAnimation';

export default function Home() {
  const canvas1Ref = useRef<HTMLCanvasElement>(null);
  const canvas2Ref = useRef<HTMLCanvasElement>(null);
  const canvas3Ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvas1Ref.current && canvas2Ref.current && canvas3Ref.current) {
        init(canvas1Ref.current, canvas2Ref.current, canvas3Ref.current);
    }
}, []);

  return (
    <div id="wrapper">
      <h1>Home</h1>
      <Link to="/page_a">PageA</Link>
      
      <canvas ref={canvas1Ref} id="waveCanvas"></canvas>
<canvas ref={canvas2Ref} id="waveCanvas2"></canvas>
<canvas ref={canvas3Ref} id="waveCanvas3"></canvas>
     
    </div>
  );
}

let unit: number = 100;
let canvasList: HTMLCanvasElement[] = [];
let info: { seconds?: number, t?: number } = {};
let colorList: string[][] = [];

function init(canvas1: HTMLCanvasElement, canvas2: HTMLCanvasElement, canvas3: HTMLCanvasElement): void {
  info.seconds = 0;
  info.t = 0;

  // ここでcanvas要素を直接使用します
  canvasList.push(canvas1);
  colorList.push(['#666', '#ccc', '#eee']);
  
  canvasList.push(canvas2);
  colorList.push(['#43c0e4']);
  
  canvasList.push(canvas3);
  colorList.push(['#fff']);

  for(let canvas of canvasList) {
      canvas.width = document.documentElement.clientWidth;
      canvas.height = 200;
      (canvas as any).contextCache = canvas.getContext("2d");
  }
  update();
}


function update(): void {
    for(let canvas of canvasList) {
        draw(canvas, colorList[canvasList.indexOf(canvas)]);
    }
    info.seconds = info.seconds! + .014;
    info.t = info.seconds! * Math.PI;
    setTimeout(update, 35);
}

function draw(canvas: HTMLCanvasElement, color: string[]): void {
    const context: CanvasRenderingContext2D = (canvas as any).contextCache!;
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawWave(canvas, color[0], 0.5, 3, 0);
    drawWave(canvas, color[1], 0.4, 2, 250);
    drawWave(canvas, color[2], 0.2, 1.6, 100);
}

function drawWave(canvas: HTMLCanvasElement, color: string, alpha: number, zoom: number, delay: number): void {
    const context: CanvasRenderingContext2D = (canvas as any).contextCache!;
    context.fillStyle = color;
    context.globalAlpha = alpha;
    context.beginPath();
    drawSine(canvas, info.t! / 0.5, zoom, delay);
    context.lineTo(canvas.width + 10, canvas.height);
    context.lineTo(0, canvas.height);
    context.closePath();
    context.fill();
}

function drawSine(canvas: HTMLCanvasElement, t: number, zoom: number, delay: number): void {
    const xAxis: number = Math.floor(canvas.height / 2);
    let yAxis: number = 0;
    const context: CanvasRenderingContext2D = (canvas as any).contextCache!;
    let x: number = t;
    let y: number = Math.sin(x) / zoom;
    context.moveTo(yAxis, unit * y + xAxis);

    for (let i = yAxis; i <= canvas.width + 10; i += 10) {
        x = t + (-yAxis + i) / unit / zoom;
        y = Math.sin(x - delay) / 3;
        context.lineTo(i, unit * y + xAxis);
    }
}
