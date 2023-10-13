import { Canvas, useThree } from "@react-three/fiber";
import "./App.css";
import {
  OrbitControls,
  Environment,
  Text3D,
  MeshTransmissionMaterial,
  Float,
  Outlines,
  PerspectiveCamera,
} from "@react-three/drei";
import { Vector3 } from "three";
import {
  Physics,
  RapierRigidBody,
  RigidBody,
  interactionGroups,
} from "@react-three/rapier";
import { Attractor } from "@react-three/rapier-addons";
import { useRef } from "react";

const textOptions = {
  height: 5,
  curveSegments: 12,
  bevelEnabled: true,
  bevelSize: 0.5,
  bevelThickness: 0.5,
};

type LetterProps = {
  char: string;
  position: number[];
  attractorPosition: number[];
  group: number;
};

const Letter = ({ char, position, attractorPosition, group }: LetterProps) => {
  const rigidBody = useRef<RapierRigidBody>(null);
  const {
    viewport: { width, height },
  } = useThree();

  const handleMouseMove = () => {
    rigidBody.current?.applyImpulse(
      {
        x: (0.5 - Math.random()) * 1000,
        y: (0.5 - Math.random()) * 1000,
        z: (0.5 - Math.random()) * 1000,
      },
      true
    );
  };

  return (
    <group>
      <Float
        speed={1}
        rotationIntensity={0.5}
        floatIntensity={0.2}
        floatingRange={[-5, 5]}
      >
        {/* <RigidBody
          ref={rigidBody}
          collisionGroups={interactionGroups(group, [group])}
          linearVelocity={[0, 0, 0]}
          angularVelocity={[0, 0, 0]}
          // angularDamping={1.0}
          // linearDamping={1.0}
          density={10}
        > */}
        <Text3D
          onPointerMove={handleMouseMove}
          font={"./fonts/Roboto Black_Regular.json"}
          {...textOptions}
          size={width / 6}
          position={new Vector3(...position)}
          castShadow={true}
        >
          {char}
          <MeshTransmissionMaterial
            // backside
            color={"hotpink"}
            samples={4}
            thickness={3}
            chromaticAberration={0.025}
            // anisotropy={0.1}
            // distortion={0.1}
            distortionScale={0.1}
            temporalDistortion={0.2}
            iridescence={1}
            // iridescenceIOR={1}
            // iridescenceThicknessRange={[0, 1400]}
          />
          <Outlines
            thickness={1}
            color="black"
            screenspace={true}
            opacity={0}
            transparent={false}
            angle={0}
          />
        </Text3D>
        {/* </RigidBody> */}
      </Float>
      {/* <Attractor
        collisionGroups={interactionGroups(group, [group])}
        range={100}
        strength={100}
        position={new Vector3(...attractorPosition)}
      /> */}
    </group>
  );
};

const Scene = () => {
  const {
    viewport: { width },
  } = useThree();

  const w = width / 12;
  return (
    <>
      <OrbitControls target={[w, 10, 0]} />
      <PerspectiveCamera
        makeDefault
        position={[w, 10, 50]}
        fov={75}
        // lookAt={() => new Vector3(...[8, 10, 0])}
      />
      <Letter
        group={0}
        char={"A"}
        position={[-w * 4, 0, 0]}
        attractorPosition={[-width * 0.25 + 46, 0, 0]}
      />
      <Letter
        group={1}
        char={"K"}
        position={[-w * 1.25, 0, 0]}
        attractorPosition={[-width * 0.08 + 15, 0, 0]}
      />
      <Letter
        group={2}
        char={"Q"}
        position={[w * 1.25, 0, 0]}
        attractorPosition={[width * 0.08 - 15, 0, 0]}
      />
      <Letter
        group={3}
        char={"A"}
        position={[w * 4, 0, 0]}
        attractorPosition={[width * 0.25 - 48, 0, 0]}
      />
    </>
  );
};

const App = () => {
  return (
    <Canvas style={{ backgroundColor: "black" }}>
      <Environment files="./brown_photostudio_02_1k.hdr" background />
      <ambientLight />
      <pointLight position={[10, 10, 10]} castShadow={true} />
      <Physics gravity={[0, 0, 0]}>
        <Scene />
      </Physics>
    </Canvas>
  );
};

export default App;
