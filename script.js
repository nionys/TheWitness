class Panel {
  smallRadius = 15;
  bigRadius = 35;
  vertices = [];
  edges = [];
  faces = [];
  starts = [];
  ends = [];
  constructor(canvas) {
    this.canvas = canvas;
  }
  static createGridPanel(canvas, Nx=5, Ny=4, marginX=50, marginY=100) {
    const panel = new Panel(canvas);
    const vertexTable = [];
    const dx = (canvas.width-2*marginX) / (Nx-1);
    const dy = (canvas.height-2*marginY) / (Ny-1);
    for (let nx = 0; nx < Nx; nx++) {
      vertexTable.push([]);
      for (let ny = 0; ny < Ny; ny++) {
        const x = marginX+nx*dx;
        const y = marginY+ny*dy;
        const vertex = new Vertex([x, y], panel);
        vertexTable.at(-1).push(vertex);
        panel.vertices.push(vertex);
      }
    }
    for (let nx = 1; nx < Nx; nx++) {
      for (let ny = 0; ny < Ny; ny++) {
        const edge = new Edge(vertexTable[nx-1][ny], vertexTable[nx][ny], panel);
        panel.edges.push(edge);
      }
    }
    for (let nx = 0; nx < Nx; nx++) {
      for (let ny = 1; ny < Ny; ny++) {
        const edge = new Edge(vertexTable[nx][ny-1], vertexTable[nx][ny], panel);
        panel.edges.push(edge);
      }
    }
    return panel;
  }
  render(canvas) {
    canvas = (canvas) ? canvas : this.canvas;
    const context = canvas.getContext('2d');
    const linearGradient = context.createLinearGradient(0, 0, 600, 600); 
    linearGradient.addColorStop(0, 'green');
    linearGradient.addColorStop(1, 'red');
    context.strokeStyle = context.fillStyle = linearGradient;
    for (const vertex of this.vertices) vertex.draw(context);
    for (const edge of this.edges) edge.draw(context);
  }
}
/**
 * @param {CanvasRenderingContext2D} context 
 * @param {[Number, Number]} center 
 * @param {Number} radius 
 */
class Vertex {
  static TYPES = {NORMAL: 0, START: 1};
  constructor(position, parent) {
    this.parent = parent;
    this.position = position;
    this.type = Vertex.TYPES.NORMAL;
  }
  draw(context2d) {
    const cls = this.constructor;
    const radius = (this.type === cls.TYPES.NORMAL) ?
      this.parent.smallRadius : this.parent.bigRadius;
    context2d.beginPath();
    context2d.arc(...this.position, radius, 0, 2*Math.PI);
    context2d.fill();
  }
}
class Edge {
  constructor(firstVertex, secondVertex, parent) {
    this.parent = parent;
    this.vertices = [firstVertex, secondVertex];
  }
  draw(context2d) {
    context2d.lineWidth = this.parent.smallRadius*2;
    context2d.beginPath();
    context2d.moveTo(...this.vertices[0].position);
    context2d.lineTo(...this.vertices[1].position);
    context2d.stroke();
  }
}
function initCanvas(canvas) {
  [canvas.height, canvas.width] = [400, 600];
}
const canvas = document.getElementsByTagName('canvas')[0];
initCanvas(canvas);
const panel = Panel.createGridPanel(canvas);
panel.render();
