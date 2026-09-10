import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface GreenhouseViewerProps {
  widthM?: number;
  lengthM?: number;
  gutterHeightM?: number;
  ridgeHeightM?: number;
  className?: string;
}

type ViewMode = 'iso' | 'top' | 'east' | 'front';

export const GreenhouseViewer: React.FC<GreenhouseViewerProps> = ({
  widthM = 20.0,
  lengthM = 50.0,
  gutterHeightM = 3.0,
  ridgeHeightM = 5.5,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Estados de capas CAD (Layers)
  const [showPillars, setShowPillars] = useState<boolean>(true);
  const [showMesh, setShowMesh] = useState<boolean>(true);
  const [showCrop, setShowCrop] = useState<boolean>(true);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [wireframeOnly, setWireframeOnly] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<ViewMode>('iso');

  // Referencias a Three.js para interacción dinámica
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const pillarsGroupRef = useRef<THREE.Group | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const cropGroupRef = useRef<THREE.Group | null>(null);
  const dimsGroupRef = useRef<THREE.Group | null>(null);
  const meshMatsRef = useRef<THREE.MeshStandardMaterial[]>([]);

  // Objetivos de animación de cámara
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(38, 25, 45));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, gutterHeightM / 2, 0));
  const isTransitioningCam = useRef<boolean>(false);

  // Función para crear sprites de texto técnico estilo cota CAD
  const createTextSprite = (text: string, strokeColor = '#00e5ff') => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'rgba(10, 14, 23, 0.92)';
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(4, 4, 248, 56, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = strokeColor;
      ctx.font = 'bold 20px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 128, 32);
    }
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(4.2, 1.05, 1);
    return sprite;
  };

  // Función para cambiar de vista de cámara con transición suave
  const setCameraPreset = useCallback((preset: ViewMode) => {
    setActiveView(preset);
    const halfW = widthM / 2;
    const halfL = lengthM / 2;
    const maxDim = Math.max(widthM, lengthM);

    switch (preset) {
      case 'iso':
        targetCamPos.current.set(halfW * 1.8 + 12, ridgeHeightM + 18, halfL * 1.5 + 12);
        targetLookAt.current.set(0, gutterHeightM * 0.7, 0);
        break;
      case 'top':
        targetCamPos.current.set(0.01, maxDim * 1.45, 0);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'east': // Fachada Este (Barlovento 88% Alisios de Quíbor)
        targetCamPos.current.set(halfW + 32, gutterHeightM + 2, 0);
        targetLookAt.current.set(0, gutterHeightM * 0.8, 0);
        break;
      case 'front': // Fachada Frontal Norte/Sur
        targetCamPos.current.set(0, gutterHeightM + 4, halfL + 30);
        targetLookAt.current.set(0, gutterHeightM * 0.8, 0);
        break;
    }
    isTransitioningCam.current = true;
  }, [widthM, lengthM, gutterHeightM, ridgeHeightM]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 530;

    // 1. Escena CAD (Fondo Técnico Oscuro de Ingeniería)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d); // AutoCAD Dark Slate Navy
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.004);
    sceneRef.current = scene;

    // 2. Cámara Técnica
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.5, 1200);
    camera.position.set(widthM * 1.5 + 10, ridgeHeightM + 18, lengthM * 1.2 + 10);
    cameraRef.current = camera;

    // 3. Renderer WebGL de Alta Definición
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = false;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls con amortiguación
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 + 0.05;
    controls.target.set(0, gutterHeightM / 2, 0);
    controlsRef.current = controls;

    // 5. Iluminación Técnica Neutra
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xcdeafe, 1.2);
    dirLight1.position.set(40, 60, 30);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.8);
    dirLight2.position.set(-40, 30, -30);
    scene.add(dirLight2);

    // 6. Ejes de Coordenadas UCS (Universal Coordinate System)
    const ucsSize = 6;
    const axesHelper = new THREE.AxesHelper(ucsSize);
    axesHelper.position.set(-widthM / 2 - 4, 0.05, -lengthM / 2 - 4);
    (axesHelper.material as THREE.Material).depthTest = true;
    scene.add(axesHelper);

    // 7. Cuadrícula Dual CAD (Major & Minor Grid)
    const gridSpan = Math.max(widthM, lengthM) * 1.8;
    const majorGrid = new THREE.GridHelper(gridSpan, Math.round(gridSpan / 5), 0x00e5ff, 0x1e293b);
    majorGrid.position.y = 0.01;
    scene.add(majorGrid);

    const minorGrid = new THREE.GridHelper(gridSpan, Math.round(gridSpan), 0x162033, 0x0f172a);
    minorGrid.position.y = 0.005;
    scene.add(minorGrid);

    // 8. Grupo Estructural (108 Pilares Tubo Sch 40, Cerchas a dos aguas, Correas y Cruces de San Andrés)
    const pillarsGroup = new THREE.Group();
    pillarsGroupRef.current = pillarsGroup;
    scene.add(pillarsGroup);

    const halfW = widthM / 2;
    const halfL = lengthM / 2;

    // Geometría de Tubo Sch 40 con bordes acentuados estilo AutoCAD (Cian #00FFFF)
    const pillarRadius = 0.08;
    const pillarCylinderGeo = new THREE.CylinderGeometry(pillarRadius, pillarRadius, gutterHeightM, 8);
    const pillarEdgesGeo = new THREE.EdgesGeometry(pillarCylinderGeo);
    
    const pillarCoreMat = new THREE.MeshBasicMaterial({ color: 0x091e2b });
    const pillarLineMat = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 2 });

    // Zapatas de Anclaje de Concreto (1.20m en Quíbor)
    const footingGeo = new THREE.BoxGeometry(0.35, 0.12, 0.35);
    const footingEdgesGeo = new THREE.EdgesGeometry(footingGeo);
    const footingCoreMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
    const footingLineMat = new THREE.LineBasicMaterial({ color: 0x64748b });

    // Cuadrícula exacta de pilares: 6 líneas en X, 18 líneas en Z = 108 Pilares
    const colsCountX = 6;
    const colsCountZ = 18;
    const spacingX = widthM / (colsCountX - 1);
    const spacingZ = lengthM / (colsCountZ - 1);

    for (let i = 0; i < colsCountX; i++) {
      const x = -halfW + i * spacingX;
      for (let j = 0; j < colsCountZ; j++) {
        const z = -halfL + j * spacingZ;

        // Pilar compuesto (Núcleo + Edges CAD)
        const pillarCore = new THREE.Mesh(pillarCylinderGeo, pillarCoreMat);
        const pillarEdges = new THREE.LineSegments(pillarEdgesGeo, pillarLineMat);
        pillarCore.position.set(x, gutterHeightM / 2, z);
        pillarEdges.position.set(x, gutterHeightM / 2, z);
        pillarsGroup.add(pillarCore);
        pillarsGroup.add(pillarEdges);

        // Zapata perimetral
        const isPerimeter = i === 0 || i === colsCountX - 1 || j === 0 || j === colsCountZ - 1;
        if (isPerimeter) {
          const footing = new THREE.Mesh(footingGeo, footingCoreMat);
          const footingEdges = new THREE.LineSegments(footingEdgesGeo, footingLineMat);
          footing.position.set(x, 0.06, z);
          footingEdges.position.set(x, 0.06, z);
          pillarsGroup.add(footing);
          pillarsGroup.add(footingEdges);
        }
      }
    }

    // Materiales de armaduras de techo
    const trussLineMat = new THREE.LineBasicMaterial({ color: 0x00e5ff, linewidth: 1.5 });
    const ridgeLineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });
    const purlinLineMat = new THREE.LineBasicMaterial({ color: 0x0ea5e9, linewidth: 1.2 });
    const bracingLineMat = new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 2 }); // Guayas en Ámbar

    // Vigas maestras perimetrales longitudinales en alero (Canales)
    for (let i = 0; i < colsCountX; i++) {
      const x = -halfW + i * spacingX;
      const longBeamGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, gutterHeightM, -halfL),
        new THREE.Vector3(x, gutterHeightM, halfL),
      ]);
      pillarsGroup.add(new THREE.Line(longBeamGeo, trussLineMat));
    }

    // Viga maestra de Cumbrera (Ridge Beam)
    const ridgeBeamGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, ridgeHeightM, -halfL),
      new THREE.Vector3(0, ridgeHeightM, halfL),
    ]);
    pillarsGroup.add(new THREE.Line(ridgeBeamGeo, ridgeLineMat));

    // Correas longitudinales intermedias de techo (Purlins)
    const purlinFractions = [0.33, 0.66];
    purlinFractions.forEach((frac) => {
      // Faldón Derecho (+X)
      const xR = halfW * (1 - frac);
      const yR = gutterHeightM + (ridgeHeightM - gutterHeightM) * frac;
      const purlinGeoR = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(xR, yR, -halfL),
        new THREE.Vector3(xR, yR, halfL),
      ]);
      pillarsGroup.add(new THREE.Line(purlinGeoR, purlinLineMat));

      // Faldón Izquierdo (-X)
      const xL = -halfW * (1 - frac);
      const yL = gutterHeightM + (ridgeHeightM - gutterHeightM) * frac;
      const purlinGeoL = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(xL, yL, -halfL),
        new THREE.Vector3(xL, yL, halfL),
      ]);
      pillarsGroup.add(new THREE.Line(purlinGeoL, purlinLineMat));
    });

    // Cerchas a dos aguas (Tijerales de techo) en cada pórtico Z
    for (let j = 0; j < colsCountZ; j++) {
      const z = -halfL + j * spacingZ;
      const trussPoints = [
        new THREE.Vector3(-halfW, gutterHeightM, z),
        new THREE.Vector3(0, ridgeHeightM, z),
        new THREE.Vector3(halfW, gutterHeightM, z),
        new THREE.Vector3(-halfW, gutterHeightM, z), // Tirante horizontal inferior
        new THREE.Vector3(0, gutterHeightM, z),
        new THREE.Vector3(0, ridgeHeightM, z),      // Pendolón central
      ];
      const trussGeo = new THREE.BufferGeometry().setFromPoints(trussPoints);
      pillarsGroup.add(new THREE.Line(trussGeo, trussLineMat));
    }

    // Cruces de San Andrés / Tensores de Viento en Fachada Este (Refuerzo Quíbor 27 km/h)
    const bracingPoints = [
      // Cruces en primer tramo Este
      new THREE.Vector3(halfW, 0, -halfL),
      new THREE.Vector3(halfW, gutterHeightM, -halfL + spacingZ),
      new THREE.Vector3(halfW, 0, -halfL + spacingZ),
      new THREE.Vector3(halfW, gutterHeightM, -halfL),
      // Cruces en tramo central Este
      new THREE.Vector3(halfW, 0, -spacingZ / 2),
      new THREE.Vector3(halfW, gutterHeightM, spacingZ / 2),
      new THREE.Vector3(halfW, 0, spacingZ / 2),
      new THREE.Vector3(halfW, gutterHeightM, -spacingZ / 2),
      // Cruces en tramo final Este
      new THREE.Vector3(halfW, 0, halfL - spacingZ),
      new THREE.Vector3(halfW, gutterHeightM, halfL),
      new THREE.Vector3(halfW, 0, halfL),
      new THREE.Vector3(halfW, gutterHeightM, halfL - spacingZ),
    ];
    const bracingGeo = new THREE.BufferGeometry().setFromPoints(bracingPoints);
    pillarsGroup.add(new THREE.LineSegments(bracingGeo, bracingLineMat));

    // 9. Cobertura de Malla 50 Mesh (Volumen Exacto con BufferGeometry sin rotaciones complejas)
    const meshGroup = new THREE.Group();
    meshGroupRef.current = meshGroup;
    scene.add(meshGroup);

    const meshMaterial = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
      wireframe: false,
    });
    meshMatsRef.current = [meshMaterial];

    const meshWireMat = new THREE.LineBasicMaterial({ color: 0x60a5fa, linewidth: 1.2 });

    // Helper para generar cuadriláteros exactos 3D
    const addQuadMesh = (p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3, p4: THREE.Vector3) => {
      const vertices = new Float32Array([
        p1.x, p1.y, p1.z,
        p2.x, p2.y, p2.z,
        p3.x, p3.y, p3.z,

        p1.x, p1.y, p1.z,
        p3.x, p3.y, p3.z,
        p4.x, p4.y, p4.z,
      ]);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geo.computeVertexNormals();

      const mesh = new THREE.Mesh(geo, meshMaterial);
      meshGroup.add(mesh);

      // Edges perimetrales limpios sin diagonal
      const edgesGeo = new THREE.EdgesGeometry(geo, 1);
      const edges = new THREE.LineSegments(edgesGeo, meshWireMat);
      meshGroup.add(edges);
    };

    // Helper para generar triángulos exactos 3D (Frontispicios de cumbrera)
    const addTriangleMesh = (p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3) => {
      const vertices = new Float32Array([
        p1.x, p1.y, p1.z,
        p2.x, p2.y, p2.z,
        p3.x, p3.y, p3.z,
      ]);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geo.computeVertexNormals();

      const mesh = new THREE.Mesh(geo, meshMaterial);
      meshGroup.add(mesh);

      const edgesGeo = new THREE.EdgesGeometry(geo, 1);
      const edges = new THREE.LineSegments(edgesGeo, meshWireMat);
      meshGroup.add(edges);
    };

    // Pared Este (Barlovento X = +halfW)
    addQuadMesh(
      new THREE.Vector3(halfW, 0, -halfL),
      new THREE.Vector3(halfW, gutterHeightM, -halfL),
      new THREE.Vector3(halfW, gutterHeightM, halfL),
      new THREE.Vector3(halfW, 0, halfL)
    );

    // Pared Oeste (Sotavento X = -halfW)
    addQuadMesh(
      new THREE.Vector3(-halfW, 0, -halfL),
      new THREE.Vector3(-halfW, 0, halfL),
      new THREE.Vector3(-halfW, gutterHeightM, halfL),
      new THREE.Vector3(-halfW, gutterHeightM, -halfL)
    );

    // Pared Frontal (Z = +halfL)
    addQuadMesh(
      new THREE.Vector3(-halfW, 0, halfL),
      new THREE.Vector3(halfW, 0, halfL),
      new THREE.Vector3(halfW, gutterHeightM, halfL),
      new THREE.Vector3(-halfW, gutterHeightM, halfL)
    );

    // Pared Posterior (Z = -halfL)
    addQuadMesh(
      new THREE.Vector3(-halfW, 0, -halfL),
      new THREE.Vector3(-halfW, gutterHeightM, -halfL),
      new THREE.Vector3(halfW, gutterHeightM, -halfL),
      new THREE.Vector3(halfW, 0, -halfL)
    );

    // Faldón de Techo Derecho (Este: de x=0 a x=+halfW)
    addQuadMesh(
      new THREE.Vector3(halfW, gutterHeightM, -halfL),
      new THREE.Vector3(0, ridgeHeightM, -halfL),
      new THREE.Vector3(0, ridgeHeightM, halfL),
      new THREE.Vector3(halfW, gutterHeightM, halfL)
    );

    // Faldón de Techo Izquierdo (Oeste: de x=-halfW a x=0)
    addQuadMesh(
      new THREE.Vector3(-halfW, gutterHeightM, -halfL),
      new THREE.Vector3(-halfW, gutterHeightM, halfL),
      new THREE.Vector3(0, ridgeHeightM, halfL),
      new THREE.Vector3(0, ridgeHeightM, -halfL)
    );

    // Frontispicio Triangular Frontal (Z = +halfL)
    addTriangleMesh(
      new THREE.Vector3(-halfW, gutterHeightM, halfL),
      new THREE.Vector3(halfW, gutterHeightM, halfL),
      new THREE.Vector3(0, ridgeHeightM, halfL)
    );

    // Frontispicio Triangular Posterior (Z = -halfL)
    addTriangleMesh(
      new THREE.Vector3(halfW, gutterHeightM, -halfL),
      new THREE.Vector3(-halfW, gutterHeightM, -halfL),
      new THREE.Vector3(0, ridgeHeightM, -halfL)
    );

    // 10. Capa de Cultivo en Hileras Técnicas CAD
    const cropGroup = new THREE.Group();
    cropGroupRef.current = cropGroup;
    scene.add(cropGroup);

    const plantHeight = 1.3;
    const plantRadius = 0.3;
    const plantConeGeo = new THREE.ConeGeometry(plantRadius, plantHeight, 6);
    const plantConeEdges = new THREE.EdgesGeometry(plantConeGeo);
    const plantCoreMat = new THREE.MeshBasicMaterial({ color: 0x052e16 });
    const plantLineMat = new THREE.LineBasicMaterial({ color: 0x10b981, linewidth: 1.5 });

    // Hileras dobles agronómicas con pasillo central técnico
    for (let x = -halfW + 1.8; x <= halfW - 1.8; x += 2.0) {
      if (Math.abs(x) < 0.6) continue; // Pasillo central de trabajo libre
      for (let z = -halfL + 2.5; z <= halfL - 2.5; z += 1.4) {
        const plantMesh = new THREE.Mesh(plantConeGeo, plantCoreMat);
        const plantEdges = new THREE.LineSegments(plantConeEdges, plantLineMat);
        plantMesh.position.set(x, plantHeight / 2, z);
        plantEdges.position.set(x, plantHeight / 2, z);
        cropGroup.add(plantMesh);
        cropGroup.add(plantEdges);
      }
    }

    // 11. Capa de Cotas y Dimensiones Técnicas (Annotations / Dimensions)
    const dimsGroup = new THREE.Group();
    dimsGroupRef.current = dimsGroup;
    scene.add(dimsGroup);

    const dimLineMat = new THREE.LineBasicMaterial({ color: 0x00e5ff });

    // Cota de Ancho (Frontal X)
    const dimWidthPoints = [
      new THREE.Vector3(-halfW, 0.05, halfL + 3.5),
      new THREE.Vector3(halfW, 0.05, halfL + 3.5),
      // Ticks
      new THREE.Vector3(-halfW, 0.05, halfL + 3.0),
      new THREE.Vector3(-halfW, 0.05, halfL + 4.0),
      new THREE.Vector3(halfW, 0.05, halfL + 3.0),
      new THREE.Vector3(halfW, 0.05, halfL + 4.0),
    ];
    dimsGroup.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(dimWidthPoints), dimLineMat));
    const labelWidth = createTextSprite(`ANCHO: ${widthM.toFixed(1)} m`);
    labelWidth.position.set(0, 0.7, halfL + 3.5);
    dimsGroup.add(labelWidth);

    // Cota de Largo (Lateral Z)
    const dimLengthPoints = [
      new THREE.Vector3(-halfW - 3.5, 0.05, -halfL),
      new THREE.Vector3(-halfW - 3.5, 0.05, halfL),
      // Ticks
      new THREE.Vector3(-halfW - 4.0, 0.05, -halfL),
      new THREE.Vector3(-halfW - 3.0, 0.05, -halfL),
      new THREE.Vector3(-halfW - 4.0, 0.05, halfL),
      new THREE.Vector3(-halfW - 3.0, 0.05, halfL),
    ];
    dimsGroup.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(dimLengthPoints), dimLineMat));
    const labelLength = createTextSprite(`LARGO: ${lengthM.toFixed(1)} m`);
    labelLength.position.set(-halfW - 3.5, 0.7, 0);
    dimsGroup.add(labelLength);

    // Cota de Altura Alero
    const dimGutterPoints = [
      new THREE.Vector3(halfW + 3.5, 0, -halfL),
      new THREE.Vector3(halfW + 3.5, gutterHeightM, -halfL),
      new THREE.Vector3(halfW + 3.0, gutterHeightM, -halfL),
      new THREE.Vector3(halfW + 4.0, gutterHeightM, -halfL),
    ];
    dimsGroup.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(dimGutterPoints), dimLineMat));
    const labelGutter = createTextSprite(`ALERO: ${gutterHeightM.toFixed(2)} m`);
    labelGutter.position.set(halfW + 3.5, gutterHeightM / 2, -halfL);
    dimsGroup.add(labelGutter);

    // Cota de Altura Cumbrera
    const dimRidgePoints = [
      new THREE.Vector3(0, 0, halfL + 6),
      new THREE.Vector3(0, ridgeHeightM, halfL + 6),
      new THREE.Vector3(-0.8, ridgeHeightM, halfL + 6),
      new THREE.Vector3(0.8, ridgeHeightM, halfL + 6),
    ];
    dimsGroup.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(dimRidgePoints), dimLineMat));
    const labelRidge = createTextSprite(`CUMBRERA: ${ridgeHeightM.toFixed(2)} m`, '#38bdf8');
    labelRidge.position.set(0, ridgeHeightM * 0.7, halfL + 6);
    dimsGroup.add(labelRidge);

    // 12. Vector de Viento Dominante del ESTE (Quíbor 88%)
    const windDir = new THREE.Vector3(-1, 0, 0);
    const windOrigin = new THREE.Vector3(halfW + 9, gutterHeightM * 0.85, 0);
    const arrowLength = 7.5;
    const arrowColor = 0x38bdf8;
    const windArrow = new THREE.ArrowHelper(windDir, windOrigin, arrowLength, arrowColor, 2.0, 1.0);
    dimsGroup.add(windArrow);

    const labelWind = createTextSprite('BARLOVENTO: 88% ESTE (27 km/h)', '#38bdf8');
    labelWind.position.set(halfW + 7, gutterHeightM * 0.85 + 1.8, 0);
    dimsGroup.add(labelWind);

    // Redimensionamiento responsive del canvas
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Loop de renderizado y animación de cámara
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Transición suave de cámara hacia preset CAD
      if (isTransitioningCam.current) {
        camera.position.lerp(targetCamPos.current, 0.08);
        controls.target.lerp(targetLookAt.current, 0.08);

        if (
          camera.position.distanceTo(targetCamPos.current) < 0.1 &&
          controls.target.distanceTo(targetLookAt.current) < 0.1
        ) {
          isTransitioningCam.current = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [widthM, lengthM, gutterHeightM, ridgeHeightM]);

  // Manejadores reactivos de capas y toggles
  useEffect(() => {
    if (pillarsGroupRef.current) pillarsGroupRef.current.visible = showPillars;
  }, [showPillars]);

  useEffect(() => {
    if (meshGroupRef.current) meshGroupRef.current.visible = showMesh;
  }, [showMesh]);

  useEffect(() => {
    if (cropGroupRef.current) cropGroupRef.current.visible = showCrop;
  }, [showCrop]);

  useEffect(() => {
    if (dimsGroupRef.current) dimsGroupRef.current.visible = showDimensions;
  }, [showDimensions]);

  useEffect(() => {
    meshMatsRef.current.forEach((mat) => {
      mat.wireframe = wireframeOnly;
      mat.opacity = wireframeOnly ? 0.0 : 0.16;
    });
  }, [wireframeOnly]);

  return (
    <div className={`position-relative w-100 rounded-3 overflow-hidden border border-secondary border-opacity-50 ${className}`} style={{ backgroundColor: '#0a0f1d' }}>
      {/* Canvas Three.js CAD Viewport */}
      <div ref={mountRef} style={{ width: '100%', height: '530px', cursor: 'grab' }} />

      {/* Top HUD: Barra de Herramientas CAD & Capas (Layers Palette) */}
      <div className="position-absolute top-0 start-0 m-3 d-flex flex-wrap align-items-center gap-2 z-3">
        {/* Layer Manager Panel */}
        <div className="d-flex align-items-center gap-1.5 p-1.5 rounded-3 bg-dark bg-opacity-90 backdrop-blur border border-secondary border-opacity-50 shadow-sm">
          <span className="text-secondary small font-monospace px-1.5 d-none d-sm-inline-flex align-items-center gap-1">
            <span className="material-symbols-outlined text-info" style={{ fontSize: '16px' }}>layers</span>
            <span className="text-light fw-semibold text-xs">CAPAS CAD</span>
          </span>

          {/* Capa 01: Estructura Pilares & Cerchas */}
          <button
            type="button"
            onClick={() => setShowPillars(!showPillars)}
            title="Alternar Capa 01: Estructura de Acero Sch 40"
            className="btn btn-sm px-2.5 py-1 rounded-2 text-xs font-monospace d-flex align-items-center gap-1.5 transition-all shadow-none"
            style={{
              backgroundColor: showPillars ? 'rgba(0, 229, 255, 0.18)' : 'rgba(15, 23, 42, 0.6)',
              color: showPillars ? '#00e5ff' : '#94a3b8',
              border: `1px solid ${showPillars ? '#00e5ff' : 'rgba(148, 163, 184, 0.3)'}`,
              fontWeight: showPillars ? 'bold' : 'normal',
            }}
          >
            <span
              className="d-inline-block rounded-circle"
              style={{ width: '8px', height: '8px', backgroundColor: showPillars ? '#00ffff' : '#64748b' }}
            />
            <span>01_ESTRUCTURA</span>
          </button>

          {/* Capa 02: Malla 50 Mesh */}
          <button
            type="button"
            onClick={() => setShowMesh(!showMesh)}
            title="Alternar Capa 02: Malla Anti-insectos"
            className="btn btn-sm px-2.5 py-1 rounded-2 text-xs font-monospace d-flex align-items-center gap-1.5 transition-all shadow-none"
            style={{
              backgroundColor: showMesh ? 'rgba(96, 165, 250, 0.18)' : 'rgba(15, 23, 42, 0.6)',
              color: showMesh ? '#60a5fa' : '#94a3b8',
              border: `1px solid ${showMesh ? '#60a5fa' : 'rgba(148, 163, 184, 0.3)'}`,
              fontWeight: showMesh ? 'bold' : 'normal',
            }}
          >
            <span
              className="d-inline-block rounded-circle"
              style={{ width: '8px', height: '8px', backgroundColor: showMesh ? '#60a5fa' : '#64748b' }}
            />
            <span>02_MALLA</span>
          </button>

          {/* Capa 03: Cultivo */}
          <button
            type="button"
            onClick={() => setShowCrop(!showCrop)}
            title="Alternar Capa 03: Cultivo Orgánico"
            className="btn btn-sm px-2.5 py-1 rounded-2 text-xs font-monospace d-flex align-items-center gap-1.5 transition-all shadow-none"
            style={{
              backgroundColor: showCrop ? 'rgba(34, 197, 94, 0.18)' : 'rgba(15, 23, 42, 0.6)',
              color: showCrop ? '#22c55e' : '#94a3b8',
              border: `1px solid ${showCrop ? '#22c55e' : 'rgba(148, 163, 184, 0.3)'}`,
              fontWeight: showCrop ? 'bold' : 'normal',
            }}
          >
            <span
              className="d-inline-block rounded-circle"
              style={{ width: '8px', height: '8px', backgroundColor: showCrop ? '#22c55e' : '#64748b' }}
            />
            <span>03_CULTIVO</span>
          </button>

          {/* Capa 04: Cotas y Dimensiones */}
          <button
            type="button"
            onClick={() => setShowDimensions(!showDimensions)}
            title="Alternar Capa 04: Cotas y Flechas de Viento"
            className="btn btn-sm px-2.5 py-1 rounded-2 text-xs font-monospace d-flex align-items-center gap-1.5 transition-all shadow-none"
            style={{
              backgroundColor: showDimensions ? 'rgba(245, 158, 11, 0.18)' : 'rgba(15, 23, 42, 0.6)',
              color: showDimensions ? '#f59e0b' : '#94a3b8',
              border: `1px solid ${showDimensions ? '#f59e0b' : 'rgba(148, 163, 184, 0.3)'}`,
              fontWeight: showDimensions ? 'bold' : 'normal',
            }}
          >
            <span
              className="d-inline-block rounded-circle"
              style={{ width: '8px', height: '8px', backgroundColor: showDimensions ? '#f59e0b' : '#64748b' }}
            />
            <span>04_COTAS</span>
          </button>

          {/* Modo Shading: Sólido vs Alambre Puro */}
          <button
            type="button"
            onClick={() => setWireframeOnly(!wireframeOnly)}
            title="Alternar Modo Visual: Render Técnico Sombreado vs Alambre CAD Puro"
            className="btn btn-sm px-2 py-1 rounded-2 text-xs font-monospace d-flex align-items-center gap-1 ms-1 shadow-none"
            style={{
              backgroundColor: wireframeOnly ? '#00e5ff' : 'rgba(30, 41, 59, 0.8)',
              color: wireframeOnly ? '#0a0f1d' : '#e2e8f0',
              border: '1px solid rgba(148, 163, 184, 0.35)',
              fontWeight: 'bold',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
              {wireframeOnly ? 'grid_3x3' : 'view_in_ar'}
            </span>
            <span className="d-none d-md-inline">{wireframeOnly ? 'ALAMBRE PURO' : 'SOMBREADO'}</span>
          </button>
        </div>
      </div>

      {/* Top Right: AutoCAD ViewCube / Quick Views */}
      <div className="position-absolute top-0 end-0 m-3 z-3">
        <div className="btn-group btn-group-sm p-1 rounded-3 bg-dark bg-opacity-90 backdrop-blur border border-secondary border-opacity-50 shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setCameraPreset('iso')}
            className={`btn btn-sm px-2 py-1 text-xs font-monospace fw-semibold ${
              activeView === 'iso' ? 'btn-info text-dark' : 'btn-dark text-secondary border-0'
            }`}
            title="Vista Axonométrica 3D Isometric"
          >
            ISO 3D
          </button>
          <button
            type="button"
            onClick={() => setCameraPreset('top')}
            className={`btn btn-sm px-2 py-1 text-xs font-monospace fw-semibold ${
              activeView === 'top' ? 'btn-info text-dark' : 'btn-dark text-secondary border-0'
            }`}
            title="Vista de Planta Superior (Cenital)"
          >
            PLANTA
          </button>
          <button
            type="button"
            onClick={() => setCameraPreset('east')}
            className={`btn btn-sm px-2 py-1 text-xs font-monospace fw-semibold ${
              activeView === 'east' ? 'btn-info text-dark' : 'btn-dark text-secondary border-0'
            }`}
            title="Fachada Este: Barlovento Viento Quíbor"
          >
            ESTE (88%)
          </button>
          <button
            type="button"
            onClick={() => setCameraPreset('front')}
            className={`btn btn-sm px-2 py-1 text-xs font-monospace fw-semibold ${
              activeView === 'front' ? 'btn-info text-dark' : 'btn-dark text-secondary border-0'
            }`}
            title="Fachada Frontal a Dos Aguas"
          >
            FRONTAL
          </button>
        </div>
      </div>

      {/* Bottom Status Bar: Lecturas Técnicas CAD (AutoCAD Prompt Style) */}
      <div className="position-absolute bottom-0 start-0 end-0 p-2.5 z-3 d-flex flex-wrap justify-content-between align-items-center gap-2 bg-dark bg-opacity-90 backdrop-blur border-top border-secondary border-opacity-40">
        <div className="d-flex align-items-center gap-2 text-xs font-monospace text-secondary">
          <span className="badge bg-secondary bg-opacity-25 text-info border border-info border-opacity-30 px-2 py-1">
            UCS: MUNDO (WCS)
          </span>
          <span className="d-none d-sm-inline text-light">
            MALLA: <strong>50 MESH BLANCA</strong>
          </span>
          <span className="d-none d-md-inline text-secondary">|</span>
          <span className="d-none d-md-inline text-light">
            ESTRUCTURA: <strong>108 PILARES SCH 40 + CERCHAS</strong>
          </span>
        </div>

        <div className="d-flex align-items-center gap-2 font-monospace text-xs">
          <div className="badge bg-dark bg-opacity-80 border border-info border-opacity-40 text-info px-2.5 py-1 d-flex align-items-center gap-1">
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>air</span>
            <span>VIENTO: <strong>27 km/h ESTE</strong></span>
          </div>
          <div className="badge bg-success bg-opacity-20 border border-success border-opacity-40 text-success px-2 py-1">
            FS ≥ 1.5 OK
          </div>
        </div>
      </div>
    </div>
  );
};
