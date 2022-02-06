import Delaunator from "delaunator";
import Kruskal from "kruskal";

export default function GraphGenerator(props) {
  let { count, min, max } = props;
  let points = [];
  let vertices = []
  //generates a list of random points within min and max
  for (let i = 0; i < count; i++) {
    let x = random(min, max);
    let y = random(min, max);
    points.push(x);
    points.push(y);
    vertices.push([x,y])
  }

  //computes the delaunay triangulation of the random points and returns the triangles
  let delaunator = new Delaunator(points);
  let triangles = delaunator.triangles;

  

  //map triangles to correct format for Kruskals algo
  //array is formatted as a list of vertex pairs, ie [ [x,y] , [x1,y1], [x2,y2]]
  //edges are formatted as a list of vertex indices in the previous array, ie [[ 0,1], [1,2], [2,1]]

  let edges = [];

  for (var i = 0; i < triangles.length - 2; i+= 3){
    edges.push([triangles[i], triangles[i + 1]]);
    edges.push([triangles[i + 1], triangles[i + 2]]);
    edges.push([triangles[i + 2], triangles[i]]);
  }

  var edgeMST = Kruskal.kruskal(vertices, edges, metric_dist);

  return { 
    triangles,
    vertices,
    edges,
    edgeMST

  }
}

//method for computing the distance between 2 points. essential for the MST algo

function metric_dist(a, b) {
  var dx = a[0] - b[0];
  var dy = a[1] - b[1];
  return dx * dx + dy * dy;
}

//helper for generating random numbers

function random(min: number, max: number) {
  let diff = max - min;
  return Math.floor(Math.random() * diff) + min;
}
