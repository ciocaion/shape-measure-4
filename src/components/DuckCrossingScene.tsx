
import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Group } from 'three';

interface DuckCrossingSceneProps {
  currentPathLength: number;
  targetPathLength: number;
  completed: boolean;
}

const DuckCrossingScene: React.FC<DuckCrossingSceneProps> = ({
  currentPathLength,
  targetPathLength,
  completed
}) => {
  const sceneRef = useRef<Group>(null);
  
  // Calculate path progress
  const pathProgress = Math.min(currentPathLength / targetPathLength, 1);
  const crosswalkWidth = 8;
  const roadWidth = 4;
  const groundWidth = 3;
  
  // Create crosswalk stripes based on current path length
  const createCrosswalkStripes = () => {
    const stripes = [];
    const stripeWidth = 0.6;
    const stripeSpacing = 0.8;
    const totalStripes = Math.floor(crosswalkWidth / stripeSpacing);
    
    for (let i = 0; i < totalStripes; i++) {
      const stripeProgress = i / totalStripes;
      const isVisible = stripeProgress <= pathProgress;
      const isWhite = i % 2 === 0;
      
      if (isVisible) {
        stripes.push(
          <mesh
            key={i}
            position={[-crosswalkWidth/2 + i * stripeSpacing + stripeWidth/2, 0.01, 0]}
          >
            <boxGeometry args={[stripeWidth, 0.02, roadWidth]} />
            <meshStandardMaterial color={isWhite ? '#ffffff' : '#000000'} />
          </mesh>
        );
      }
    }
    
    return stripes;
  };

  // Duck component with better appearance
  const Duck = ({ position }: { position: [number, number, number] }) => (
    <group position={position}>
      {/* Duck body */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>
      
      {/* Duck head */}
      <mesh position={[0.15, 0.2, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>
      
      {/* Duck beak */}
      <mesh position={[0.25, 0.18, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.06, 0.15, 8]} />
        <meshStandardMaterial color="#ff8c00" />
      </mesh>
      
      {/* Duck eye */}
      <mesh position={[0.22, 0.25, 0.08]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Duck wing */}
      <mesh position={[-0.1, 0.1, 0.1]} rotation={[0.3, 0.5, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#e6c200" />
      </mesh>
    </group>
  );

  return (
    <div className="w-full h-80 bg-sky-200 rounded-lg border-4 border-gray-800 overflow-hidden">
      <Canvas camera={{ position: [0, 12, 8], fov: 60 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        
        <group ref={sceneRef}>
          {/* Left ground area */}
          <mesh position={[-6, 0, 0]}>
            <boxGeometry args={[groundWidth, 0.1, 8]} />
            <meshStandardMaterial color="#4ade80" />
          </mesh>
          
          {/* Road */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[crosswalkWidth, 0.05, roadWidth]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
          
          {/* Road center line */}
          <mesh position={[0, 0.06, 0]}>
            <boxGeometry args={[crosswalkWidth, 0.01, 0.1]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
          
          {/* Crosswalk stripes */}
          {createCrosswalkStripes()}
          
          {/* Right ground area */}
          <mesh position={[6, 0, 0]}>
            <boxGeometry args={[groundWidth, 0.1, 8]} />
            <meshStandardMaterial color="#4ade80" />
          </mesh>
          
          {/* Duck on the left */}
          <Duck position={[-5, 0.5, 0]} />
          
          {/* Duck on the right when completed */}
          {completed && <Duck position={[5, 0.5, 0]} />}
          
          {/* Trees on both sides */}
          <group position={[-6.5, 0.8, 2]}>
            <mesh>
              <cylinderGeometry args={[0.1, 0.1, 1.6]} />
              <meshStandardMaterial color="#8b4513" />
            </mesh>
            <mesh position={[0, 0.8, 0]}>
              <sphereGeometry args={[0.6, 16, 16]} />
              <meshStandardMaterial color="#22c55e" />
            </mesh>
          </group>
          
          <group position={[6.5, 0.8, -2]}>
            <mesh>
              <cylinderGeometry args={[0.1, 0.1, 1.6]} />
              <meshStandardMaterial color="#8b4513" />
            </mesh>
            <mesh position={[0, 0.8, 0]}>
              <sphereGeometry args={[0.6, 16, 16]} />
              <meshStandardMaterial color="#22c55e" />
            </mesh>
          </group>
          
          {/* Progress indicator */}
          <Text
            position={[0, 3, 0]}
            fontSize={0.8}
            color="#1f2937"
            anchorX="center"
            anchorY="middle"
          >
            {currentPathLength} / {targetPathLength} cm
          </Text>
        </group>
      </Canvas>
    </div>
  );
};

export default DuckCrossingScene;
