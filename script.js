/**
 * @param {CanvasRenderingContext2D} context 
 * @param {[Number, Number]} center 
 * @param {Number} radius 
 */
class Vertex {
  static TYPES = {NORMAL: 0, START: 1};
  static array = [];
  static smallRadius = 15;
  static bigRadius = 35;
  constructor(position) {
    this.id = this.constructor.array.length;
    this.constructor.array.push(this);
    this.position = position;
    this.type = this.constructor.TYPES.NORMAL;
  }
  drawVertex(context2d) {
    const radius = (this.type === this.constructor.TYPES.NORMAL) ?
      this.constructor.smallRadius : this.constructor.bigRadius;
    context2d.beginPath();
    context2d.arc(...this.position, radius, 0, 2*Math.PI);
    context2d.fill();
  }
}
class Edge {
  static array = [];
  static width = 30;
  constructor(papa, mama) {
    this.vertices = [papa, mama];
    this.id = this.constructor.array.length;
    this.constructor.array.push(this);
  }
  /**
   * @param {CanvasRenderingContext2D} context2d 
   */
  drawEdge(context2d) {
    context2d.lineWidth = this.constructor.width;
    context2d.beginPath();
    context2d.moveTo(...this.vertices[0].position);
    context2d.lineTo(...this.vertices[1].position);
    context2d.stroke();
  }
}
function updateCanvas(canvas) {
  const context = canvas.getContext('2d');
  const linearGradient = context.createLinearGradient(0, 0, 600, 600); 
  linearGradient.addColorStop(0, 'green');
  linearGradient.addColorStop(1, 'red');
  context.strokeStyle = context.fillStyle = linearGradient;
  for (const v of Vertex.array) {
    v.drawVertex(context);
  }
  for (const e of Edge.array) {
    e.drawEdge(context);
  }
}
/**
 * @param {PointerEvent} event 
 */
function onCanvasClick(event) {
  //TODO
  updateCanvas(event.target);
}
function initCanvas(canvas) {
  [canvas.height, canvas.width] = [400, 600];
  canvas.addEventListener('click', onCanvasClick);
}
function createGrid(canvas, Nx=5, Ny=4, marginX=50, marginY=100) {
  const vertexTable = [];
  const dx = (canvas.width-2*marginX) / (Nx-1);
  const dy = (canvas.height-2*marginY) / (Ny-1);
  for (let nx = 0; nx < Nx; nx++) {
    vertexTable.push([]);
    for (let ny = 0; ny < Ny; ny++) {
      const x = marginX+nx*dx;
      const y = marginY+ny*dy;
      vertexTable.at(-1).push(new Vertex([x, y]));
    }
  }
  for (let nx = 1; nx < Nx; nx++) {
    for (let ny = 0; ny < Ny; ny++) {
      new Edge(vertexTable[nx-1][ny], vertexTable[nx][ny]);
    }
  }
  for (let nx = 0; nx < Nx; nx++) {
    for (let ny = 1; ny < Ny; ny++) {
      new Edge(vertexTable[nx][ny-1], vertexTable[nx][ny]);
    }
  }
}
function addStart(vertexId) {
  Vertex.constructor.array[vertexId].type = Vertex.constructor.START;
}
const canvas = document.getElementsByTagName('canvas')[0];
initCanvas(canvas);
createGrid(canvas);
updateCanvas(canvas);
console.log(Vertex.array);
console.log(Edge.array);