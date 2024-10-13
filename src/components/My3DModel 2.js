// src/components/My3DModel.js
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { MeshWobbleMaterial, Sphere } from '@react-three/drei';

function My3DModel() {
    return (
        <Canvas>
            <ambientLight intensity={0.3} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            <Sphere args={[1, 32, 32]} scale={2}>
                <MeshWobbleMaterial attach="material" color="hotpink" speed={1} factor={0.6} />
            </Sphere>
            <OrbitControls />
        </Canvas>
    );
}

export default My3DModel;