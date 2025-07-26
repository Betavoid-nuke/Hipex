// /twinx/components/ThreeViewport.tsx
'use client';

import { useRef, useEffect } from 'react';
import Script from 'next/script';
import { Project } from '../lib/types';
import * as THREE from 'three';
// Note: OrbitControls and GLTFLoader are not directly importable as modules from the CDN scripts.
// They attach themselves to the THREE object on the window. We'll handle this.

interface ThreeViewportProps {
    project: Project | null;
}

const ThreeViewport = ({ project }: ThreeViewportProps) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const modelRef = useRef<THREE.Group | null>(null);
    const isInitialized = useRef(false);

    const loadModel = (scene: THREE.Scene, url: string) => {
        // @ts-ignore - GLTFLoader is loaded via script
        const loader = new window.THREE.GLTFLoader();
        loader.load(
            url,
            (gltf: { scene: THREE.Group; }) => {
                if (modelRef.current) {
                    scene.remove(modelRef.current);
                }
                modelRef.current = gltf.scene;
                modelRef.current.scale.set(100, 100, 100);
                modelRef.current.position.y = 1;
                scene.add(modelRef.current);
            },
            undefined,
            (error: any) => {
                console.error('An error happened while loading the model:', error);
            }
        );
    };

    const onScriptsLoaded = () => {
        if (isInitialized.current || !mountRef.current) return;
        isInitialized.current = true;

        const currentMount = mountRef.current;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1C1C1E);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        rendererRef.current = renderer;
        currentMount.appendChild(renderer.domElement);

        // @ts-ignore - OrbitControls is loaded via script
        const controls = new window.THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x444444);
        scene.add(gridHelper);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        camera.position.set(4, 3, 5);
        camera.lookAt(0, 0, 0);

        let animationFrameId: number;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        // Initial model load if project is ready
        if (project?.currentStep === 12) { // TOTAL_STEPS
            loadModel(scene, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF/BoomBox.gltf');
        }

        // Cleanup function
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            controls.dispose();
            renderer.dispose();
            if (currentMount) {
                while (currentMount.firstChild) {
                    currentMount.removeChild(currentMount.firstChild);
                }
            }
            isInitialized.current = false;
        };
    };

    useEffect(() => {
        // This effect handles model changes after initialization
        if (isInitialized.current && sceneRef.current) {
             if (project?.currentStep === 12) { // TOTAL_STEPS
                loadModel(sceneRef.current, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF/BoomBox.gltf');
            } else {
                // Remove model if project is no longer complete
                if (modelRef.current) {
                    sceneRef.current.remove(modelRef.current);
                    modelRef.current = null;
                }
            }
        }
    }, [project]);


    return (
        <>
            <Script src="https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js" strategy="afterInteractive" />
            <Script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js" strategy="afterInteractive" />
            <Script
                src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"
                strategy="afterInteractive"
                onLoad={onScriptsLoaded}
            />
            <div ref={mountRef} className="w-full h-full relative" />
        </>
    );
};

export default ThreeViewport;