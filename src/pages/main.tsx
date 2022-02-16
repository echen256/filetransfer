import "@google/model-viewer/dist/model-viewer";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useRef, useState } from "react";
import { Quaternion, Vector3 } from "three";
import {
  Card,
  InputGroup,
  Button,
  Divider,
  Label,
  FormGroup, Checkbox
} from "@blueprintjs/core";
// @ts-ignore
import GraphGenerator from "./../algo/graphGenerator.ts";

function ThreeJS(props) {
  let { settings , graph} = props;

  return (
    <Card className="bp3-elevation-3">
      <Canvas
        style={{
        
          height: "1000px",
          width: "1200px",

        }}
      >
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        {DrawTrianglePoints(graph, settings)}
      </Canvas>
    </Card>
  );
}

//gets the minimum spanning tree geometry and creates a box at every point, and a rectangular prism between each edge endpoint

function DrawTrianglePoints(graph, settings) {
  let { vertices, edgeMST } = graph;
  let { baseSize, EdgeThickness } = settings;
  let pointGeometry = [];
  let edgeGeometry = [];

  for (var i = 0; i < vertices.length; i++) {
    var v0 = vertices[i];



    pointGeometry.push(
      <Box
        key={i}
        position={[v0[0], v0[1], v0[2]]}
        size={[baseSize, baseSize, baseSize]}
      />
    );
  }

  for (var i = 0; i < edgeMST.length; i++) {
    var edge = edgeMST[i];
    var v0 = vertices[edge[0]];
    var v1 = vertices[edge[1]];
    var pos = new Vector3((v0[0] + v1[0]) / 2, (v0[1] + v1[1]) / 2, (v0[2] + v1[2]) / 2 );

    let edgeVector = new Vector3(v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]);
    let distance = new Vector3(v0[0], v0[1], v0[2]).distanceTo(
      new Vector3(v1[0], v1[1], v1[2])
    );

    let size = [distance, EdgeThickness, EdgeThickness];
    let quaternion = new Quaternion()
    quaternion.setFromUnitVectors(new Vector3(1,0,0), edgeVector.normalize())
     
      
    pointGeometry.push(
      <Box
        key={i + ":edge"}
        position={pos}
        size={size}
        quaternion = {quaternion}
      />
    );
  }
  return pointGeometry.concat(edgeGeometry);
}

function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef();
  return (
    <mesh {...props} ref={ref} scale={1}>
      <boxGeometry args={props.size}  />
      <meshStandardMaterial color={"orange"} />
    </mesh>
  );
}

export default function Main() {
  const [settings, setSettings] = useState({
    baseSize: 0.5,
    EdgeThickness: 0.25,
    count: 30,
    min: -10 ,
    max: 10,
    threeD : false
  });

  
  let { min, max, count } = settings;
  let graph = GraphGenerator(settings);

  const updateSettings = (event) => {
      settings[event.target.id] = Number(event.target.value)  
      setSettings({...settings})
  }

  const updateSettingsUnrestricted = (event) => {
   // console.log(event.target.value, typeof( event.target.checked), event.target.checked, even)
   console.log(event.target.id, event.target.checked)
    settings[event.target.id] = event.target.checked
    setSettings({...settings})
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "row-reverse" }}
      className="bp3-dark"
    >
      {" "}
      <Card style = {{marginLeft:"100px", display : "flex" , flexDirection: "column"}}>
        {" "}
        <h3>Settings </h3>
        <form>
          <Divider />
          <FormGroup label="Number of Points" labelForm="count">
            <InputGroup
              id="count"
              placeholder="Number of points you want to generate"
              defaultValue={settings.count}
              onBlur={updateSettings}
            />{" "}
          </FormGroup>
          <Divider /> 
          <FormGroup label="Minimum X And Y Values" labelForm="min">
            <InputGroup
              id="min"
              type = "number"
              defaultValue = {settings.min}
        
              placeholder= "..."
              onBlur={updateSettings}
            />{" "}
          </FormGroup>
          <Divider /> 
          <FormGroup label="Maximum X and Y Values" labelForm="max">
            <InputGroup
              id="max"
              defaultValue = {settings.max}
              placeholder= "..."
            type = "number"
        
              onBlur={updateSettings}
            />{" "}
          </FormGroup>
          <Divider /> 
          <FormGroup label="Edge Thickness" labelForm="EdgeThickness">
            <InputGroup
              id="EdgeThickness"
              defaultValue = {settings.EdgeThickness}
              placeholder= "..."
              onBlur={updateSettings}
            />{" "}
          </FormGroup>
          <FormGroup label="Point Thickness" labelForm="baseSize">
            <InputGroup
              id="baseSize"
              placeholder= "..."
              defaultValue = {settings.baseSize}
              onBlur={updateSettings}
            />{" "}
          </FormGroup>
          <FormGroup label="Three Dimensions?" labelForm ="threeD">
            <Checkbox 
              defaultValue={settings.threeD}
              id = "threeD"
              onClick = {updateSettingsUnrestricted}
            />

            </FormGroup>
        </form>

        <Divider/>
        <div style = {{flexGrow : 1, display : "flex", flexDirection : "column-reverse"}}>
            <div style = {{marginTop : "auto"}}>
                <Button icon = "download" onClick = {() => {}} >Export Graph as JSON</Button>
            </div>
        </div>
      </Card>{" "}
      <ThreeJS settings={settings} graph = {graph} />{" "}
    </div>
  );
}
