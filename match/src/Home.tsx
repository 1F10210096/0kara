import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import 'particles.js';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
        init(canvasRef.current);
    }
  }, []);

  useEffect(() => {

    if ((window as any).particlesJS) {
        (window as any).particlesJS("particles-js", {
            particles: {
                number: {
                    value: 30,
                    density: {
                        enable: true,
                        value_area: 1121.6780303333778
                    }
                },
                color: {
                    value: "#fff"
                },
                shape: {
                    type: "image",
                    stroke: {
                        width: 0,
                    },
                    image: {
                        src: "http://coco-factory.jp/ugokuweb/wp-content/themes/ugokuweb/data/move02/5-6/img/flower.png",
                        width: 120,
                        height: 120
                    }
                },
                opacity: {
                    value: 0.06409588744762158,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 8.011985930952697,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 4,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: false,
                },
                move: {
                    enable: true,
                    speed: 7,
                    direction: "bottom-right",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 281.9177489524316,
                        rotateY: 127.670995809726
                    }
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: false,
                    },
                    onclick: {
                        enable: false,
                    },
                    resize: true
                }
            },
            retina_detect: false
        });
    }
}, []);

  return (
    <div id="wrapper">
      <h1>Home</h1>
      <Link to="/page_a">PageA</Link>
      <div ref={particlesRef} id="particles-js" style={{ height: '60vh' }}></div>
      <canvas ref={canvasRef} id="waveCanvas" style={{ marginTop: '-100px' }}></canvas>
    </div>
  );
}

let unit: number = 100;
let info: { seconds?: number, t?: number } = {};
let color: string[] = ['#14cb36', '#0ed772', '#0ccb92'];

function init(canvas: HTMLCanvasElement): void {
  info.seconds = 0;
  info.t = 0;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = document.documentElement.clientWidth * dpr;
  canvas.height = 400 * dpr;
  canvas.style.width = `${document.documentElement.clientWidth}px`;
  canvas.style.height = '400px';
  const context = canvas.getContext("2d");
  context!.scale(dpr, dpr);

  (canvas as any).contextCache = context;
  
  update(canvas);
}
function update(canvas: HTMLCanvasElement): void { // ここでcanvasを受け取るように変更
    draw(canvas, color);
    info.seconds = info.seconds! + .014;
    info.t = info.seconds! * Math.PI;
    setTimeout(() => update(canvas), 40); // ここも変更して、canvasを再帰的に引数として渡す
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

    for (let i = yAxis; i <= canvas.width + 10; i += 5) { // 10から5に変更
      x = t + (-yAxis + i) / unit / zoom;
      y = Math.sin(x - delay) / 3;
      context.lineTo(i, unit * y + xAxis);
  }
}

