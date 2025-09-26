import { FC, useEffect, useRef } from "react";


// --- 3D Viewport Component ---
const ThreeViewport: FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let animationFrameId: number;
        const currentMount = mountRef.current;
        let renderer: any, gimbalRenderer: any, controls: any;

        const init = (): (() => void) | void => {
            if (typeof window.THREE === 'undefined' || !currentMount) {
                console.error("THREE.js or mount point not available.");
                return;
            }

            const setupScene = (): (() => void) => {
                if (typeof window.THREE.OrbitControls === 'undefined') {
                    console.error("OrbitControls not loaded correctly.");
                    return () => {};
                }

                const scene = new window.THREE.Scene();
                scene.background = new window.THREE.Color(0x1C1C1E);
                const camera = new window.THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
                renderer = new window.THREE.WebGLRenderer({ antialias: true });
                
                renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
                currentMount.appendChild(renderer.domElement);

                controls = new window.THREE.OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true;
                controls.dampingFactor = 0.05;
                controls.screenSpacePanning = false;
                controls.minDistance = 3;
                controls.maxDistance = 10;

                const geometry = new window.THREE.BoxGeometry(1, 1, 1);
                const material = new window.THREE.MeshStandardMaterial({ color: 0x6366F1 });
                const cube = new window.THREE.Mesh(geometry, material);
                scene.add(cube);
                
                const gridHelper = new window.THREE.GridHelper(10, 10, 0x444444, 0x444444);
                scene.add(gridHelper);

                const ambientLight = new window.THREE.AmbientLight(0xffffff, 0.5);
                scene.add(ambientLight);
                const pointLight = new window.THREE.PointLight(0xffffff, 0.8);
                pointLight.position.set(5, 5, 5);
                scene.add(pointLight);

                camera.position.z = 5;

                const gimbalScene = new window.THREE.Scene();
                const gimbalCamera = new window.THREE.PerspectiveCamera(50, 1, 0.1, 10);
                gimbalRenderer = new window.THREE.WebGLRenderer({ alpha: true, antialias: true });
                gimbalRenderer.setSize(80, 80);
                gimbalRenderer.domElement.style.position = 'absolute';
                gimbalRenderer.domElement.style.top = '10px';
                gimbalRenderer.domElement.style.right = '10px';
                currentMount.appendChild(gimbalRenderer.domElement);

                const axesHelper = new window.THREE.AxesHelper(2);
                gimbalScene.add(axesHelper);

                const animate = () => {
                    animationFrameId = requestAnimationFrame(animate);
                    cube.rotation.x += 0.005;
                    cube.rotation.y += 0.005;
                    if (controls) controls.update();
                    
                    gimbalCamera.position.copy(camera.position);
                    gimbalCamera.position.sub(controls.target);
                    gimbalCamera.position.setLength(3);
                    gimbalCamera.lookAt(gimbalScene.position);

                    if (renderer) renderer.render(scene, camera);
                    if (gimbalRenderer) gimbalRenderer.render(gimbalScene, gimbalCamera);
                };
                animate();

                const handleResize = () => {
                    if (!currentMount || !renderer) return;
                    camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
                };
                window.addEventListener('resize', handleResize);
                
                return () => {
                    window.removeEventListener('resize', handleResize);
                };
            };

            if (window.THREE && window.THREE.OrbitControls) {
                return setupScene();
            } else {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
                script.id = 'orbit-controls-script';
                script.onload = setupScene;
                script.onerror = () => console.error("Failed to load OrbitControls script.");

                if (!document.getElementById(script.id)) {
                    document.body.appendChild(script);
                }

                return () => {
                    const existingScript = document.getElementById(script.id);
                    if (existingScript) {
                        document.body.removeChild(existingScript);
                    }
                };
            }
        };

        const cleanupScene = init();

        return () => {
            cancelAnimationFrame(animationFrameId);
            if (controls) controls.dispose();
            if (renderer) renderer.dispose();
            if (gimbalRenderer) gimbalRenderer.dispose();
            if (currentMount) {
                while (currentMount.firstChild) {
                    currentMount.removeChild(currentMount.firstChild);
                }
            }
            if (typeof cleanupScene === 'function') {
                cleanupScene();
            }
        };
    }, []);

    return <div ref={mountRef} className="w-full h-full relative" />;
};

export default ThreeViewport;