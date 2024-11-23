// https://twitter.com/lusionltd/status/1701534187545636964
// https://lusion.co

import * as THREE from 'three'
import { useRef, useReducer, useMemo, forwardRef, useImperativeHandle } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, MeshTransmissionMaterial, Environment, Lightformer, RoundedBox, Sky, Box, Circle } from '@react-three/drei'
import { CuboidCollider, BallCollider, Physics, RigidBody } from '@react-three/rapier'
import { EffectComposer, N8AO } from '@react-three/postprocessing'
import { easing, geometry } from 'maath'

const accents = ['#fff', '#00ffd7', '#ff4031']
const shuffle = (accent = 0) => [
  { color: 'white', roughness: 0.1 },
  { color: 'black', roughness: 0.75 },
  { color: 'white', roughness: 0.1 },
  { color: 'white', roughness: 0.1 },
  { color: 'black', roughness: 0.75 },
  { color: 'white', roughness: 0.75 },
  { color: 'white', roughness: 0.1 },
  { color: 'white', roughness: 0.75 },
  { color: 'white', roughness: 0.75 },
  { color: 'white', roughness: 0.1 },
  { color: 'white', roughness: 0.75 },
  { color: 'black', roughness: 0.1 },
  { color: 'white', roughness: 0.1 },
  { color: 'white', roughness: 0.75 },
  { color: 'white', roughness: 0.75 },
  { color: 'black', roughness: 0.1 },
  { color: 'white', roughness: 0.75 },
  { color: 'white', roughness: 0.75 },
  { color: 'white', roughness: 0.1 },
  { color: 'white', roughness: 0.75 },
  { color: 'black', roughness: 0.1 },
  { color: 'white', roughness: 0.1 },
  { color: 'white', roughness: 0.75 },
  { color: 'white', roughness: 0.75 },



  { color: accents[accent], roughness: 0.1, accent: true },
  { color: accents[accent], roughness: 0.75, accent: true },
  { color: accents[accent], roughness: 0.1, accent: true }
]


export const App = () => (
  <div className="container">
    {/* //   <div class="background-container">
  //   </div>
  //   <div class="cover-container">
  //   </div> */}
    {/* <div className="nav">
      <h1 className="label" />
      <div />
      <span className="caption" />
      <div />
      <a href="https://lusion.co/">
        <div className="button">VISIT LUSION</div>
      </a>
      <div className="button gray">///</div>
    </div> */}
    <Scene style={{ borderRadius: 0 }} />
  </div>
)

function Scene(props) {
  const [accent, click] = useReducer((state) => ++state % accents.length, 0)
  const connectors = useMemo(() => shuffle(accent), [accent])
  const totalModels = [Model, TModel]
  return (
    <Canvas onClick={click} shadows dpr={[1, 1.5]} gl={{ antialias: false }} camera={{ position: [0, 0, 10], rotation: [0, 0, 0], fov: 25.5, near: 1, far: 35 }} {...props}>
      {/* <Sky
        distance={450000}   // This controls the size of the sky
        sunPosition={[0, 1, 0]}   // Position of the sun
        // inclination={0.5}   // This changes the angle of the sun
        // azimuth={0.25}      // This changes the sun's position on the horizon
        // turbidity={10}      // This controls how hazy the sky is
        // rayleigh={10}        // This controls the color of the sky (higher = more blue)
        mieCoefficient={0.5}   // This controls the intensity of the sun rays
        mieDirectionalG={0.8}   //
      /> */}
      <Sky
        distance={450000} // Радиус купола
        sunPosition={[0, 1, 0]} // Позиция солнца
        inclination={1} // Наклон (0-1)
        azimuth={0.25} // Угол (0-1)
        rayleigh={0.3}        // This controls the color of the sky (higher = more blue)

      />
      <color attach="background" args={['blue']} />
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.1} castShadow />
      <Physics /*debug*/
        gravity={[0, 0, 0]}
      // numAdditionalFrictionIterations={0}
      // numSolverIterations={1}

      // updateLoop={"independent"}
      // timeStep={1 / 15}
      // frameloop="demand"
      >
        {/* numAdditionalFrictionIterations = 4 */}
        {/* numSolverIterations={8} */}
        <Pointer />

        <RigidBody type="fixed">
          <RoundedBox receiveShadow args={[5, 3, 1]} radius={[0.1]} opacity={0.85} position={[0, 0, 2]} >
            <shadowMaterial transparent color="#251005" roughness={[0.75]}  />

          </RoundedBox>
          <Circle args={[0.5]} position={[0, 0, -5]} opacity={[1]}>
            <meshBasicMaterial color="black" roughness={[0.75]} metalness={0.2}/>
            {/* <shadowMaterial transparent color="#251005" opacity={1.85} /> */}


          </Circle>
        </RigidBody>


        {connectors.map((props, i) => <Connector models={totalModels} key={i} index={i} {...props} />) /* prettier-ignore */}
        {/* <ConnectorV position={[0, 0, 0]}>
          <TModel>
            <MeshTransmissionMaterial clearcoat={1} thickness={0.1} anisotropicBlur={0.1} chromaticAberration={0.1} samples={8} resolution={1024} />
          </TModel>
        </ConnectorV>  */}
      </Physics>
      <EffectComposer disableNormalPass multisampling={0.01}>
        <N8AO distanceFalloff={0.3} aoRadius={0.25} intensity={1.3} />
      </EffectComposer>
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
        </group>
      </Environment>
    </Canvas>
  )
}

function Connector({ index, position, rotation, children, vec = new THREE.Vector3(), models = [], r = THREE.MathUtils.randFloatSpread, accent, ...props }) {
  const api = useRef()
  const meshRef = useRef()
  const pos = useMemo(() => position || [r(3), r(2), r(1)], [])
  const size = [7, 3, 2]
  // const modelsPerAxis = [3, 3, ]
  const totalModels = 27

  // Функция для равномерного распределения по кубу


  // Получаем позицию для модели с индексом
  // const pos = useMemo(() => generatePositionForModel(props.index || 0, totalModels, size), [props.index]);  // const rot = useMemo(() => rotation || [r(2 * Math.PI, 2 * Math.PI, 2 * Math.PI)])

  // console.log(pos)

  const scale = 2;

  useFrame((state, delta) => {
    delta = Math.min(0.01, delta)

    const connectorWorldPosition = new THREE.Vector3();

    if (meshRef.current) {
      meshRef.current.getWorldPosition(connectorWorldPosition);
    }

    const offset = new THREE.Vector3(
      pos[0] - connectorWorldPosition.x,
      pos[1] - connectorWorldPosition.y,
      pos[2] - connectorWorldPosition.z
    );

    const force = offset.length(); // Расстояние до изначальной точки
    if (force > 0.1) { // Применять импульс только при значительном отклонении

      offset.normalize()
        .multiply(({ x: -0.02 * delta * scale, y: -0.2 * delta * scale, z: -0.55 * delta * scale }))

      api.current?.applyImpulse(
        vec.copy(offset)
          .normalize()
          .multiplyScalar(-force),
        true
      );
    }


    // api.current?.applyImpulse(vec.copy(new THREE.Vector3(pos[0] - connectorWorldPosition.x, pos[1] - connectorWorldPosition.x, pos[2] - connectorWorldPosition.z))
    //   .normalize()
    //   .multiply({ x: -0.05 * delta * scale, y: -0.6 * delta * scale, z: -0.25 * delta * scale }))
  })

  const ModelComponent = models[index % models.length];

  return (
    <RigidBody linearDamping={8.85} angularDamping={10.2} position={pos} rotation={[2 * Math.PI, 2 * Math.PI, 2 * Math.PI]} friction={10.3} ref={api} RigidBodyAutoCollider={true} dispose={null}>
      {/* gravityScale={5} */}
      {/* enabledRotations={[true, true, true]}  */}
      {/* <BallCollider args={[ 0.38]} /> */}
      {/* <CuboidCollider args={[1.27, 0.38, 0.38]} /> */}
      {/* <CuboidCollider args={[0.38, 0.38, 1.27]} /> */}
      {/* <CuboidCollider type="trimesh" /> */}
      {/* Пересчитать значения, и ввести руками, для уменьшения нагрузки */}
      {/* <CuboidCollider args={[0.273, 1.58, 0.273,]}/> */}
      {/* <CuboidCollider args={[0.35, 1.35, 0.45]} /> */}
      {children ? children : <ModelComponent ref={meshRef} {...props} />}
      {<pointLight position={[0, 0.2, 0]} intensity={0.5} distance={0.5} color={props.color} />}
    </RigidBody>
  )
}


function ConnectorV({ position, children, vec = new THREE.Vector3(), r = THREE.MathUtils.randFloatSpread, accent, ...props }) {
  const api = useRef()
  const pos = useMemo(() => position || [r(10), r(5), r(2)], [])
  // const rot = useMemo(() => rotation || [r(2 * Math.PI, 2 * Math.PI, 2 * Math.PI)])
  const scale = 5.5;
  useFrame((state, delta) => {
    delta = Math.min(0.1, delta)
    api.current?.applyImpulse(vec.copy(api.current.translation()).normalize().multiply({ x: -1 * delta * scale, y: -2 * delta * scale, z: -3 * delta * scale }))
  })
  return (
    <RigidBody linearDamping={5.35} angularDamping={0.15} position={pos} friction={0.3} ref={api} RigidBodyAutoCollider={true} dispose={null}>
      {/* gravityScale={5} */}
      {/* <CuboidCollider args={[0.38, 1.27, 0.38]} /> */}
      {/* <CuboidCollider args={[1.27, 0.38, 0.38]} /> */}
      {/* <CuboidCollider args={[0.38, 0.38, 1.27]} /> */}
      {/* Пересчитать значения, и ввести руками, для уменьшения нагрузки */}
      {/* <BallCollider args={[1.8]} /> */}
      {children ? children : <TModel {...props} />}
      {/* {accent && <pointLight intensity={4} distance={2.5} color={props.color} />} */}
    </RigidBody>
  )
}

function ConnectorS({ position, children, vec = new THREE.Vector3(), scale, r = THREE.MathUtils.randFloatSpread, accent, ...props }) {
  const api = useRef()
  const pos = useMemo(() => position || [r(10), r(5), r(2)], [])
  useFrame((state, delta) => {
    delta = Math.min(0.1, delta)
    console.log(delta)
    api.current?.applyImpulse(vec.copy(api.current.translation()).normalize().multiply({ x: -5 * delta, y: -15 * delta, z: -5 * delta }))
  })
  return (
    <RigidBody enabledRotations={[true, true, true]} linearDamping={20} angularDamping={200} friction={40} position={pos} ref={api} colliders="cuboid" restitution={0}>
      {/* gravityScale={5} */}
      {/* <CuboidCollider args={[0.38, 1.27, 0.38]} /> */}
      {/* <CuboidCollider args={[1.27, 0.38, 0.38]} /> */}
      {/* <CuboidCollider args={[0.38, 0.38, 1.27]} /> */}
      {/* Пересчитать значения, и ввести руками, для уменьшения нагрузки */}
      {/* <BallCollider args={[1.8]} /> */}
      {children ? children : <SModel {...props} />}
      {/* {accent && <pointLight intensity={4} distance={2.5} color={props.color} />} */}
    </RigidBody>
  )
}

function Pointer({ vec = new THREE.Vector3() }) {
  const ref = useRef()
  useFrame(({ mouse, viewport }) => {
    vec.lerp({ x: (mouse.x * viewport.width) / 2, y: (mouse.y * viewport.height) / 2, z: 0 }, 0.5)
    ref.current?.setTranslation(vec)
  })

  return (
    <RigidBody position={[100, 100, 100]} colliders={false} ref={ref}>
      <BallCollider args={[0.8]} />
    </RigidBody>
  )
}

const TModel = forwardRef(({ children, color = 'white', roughness = 0, scale = 1.25, ...props }, externalRef) => {
  const localRef = useRef(); // Локальный реф внутри компонента
  const { nodes, materials } = useGLTF('tobacco-container-v2-v8-v2.glb'); // Загрузка модели

  // Привязываем локальный реф к внешнему
  useImperativeHandle(externalRef, () => localRef.current);

  // Анимация изменения цвета
  useFrame((state, delta) => {
    if (localRef.current) {
      easing.dampC(localRef.current.material.color, new THREE.Color(color), 0.2, delta);
    }
  });

  return (
    <mesh
      ref={localRef}
      geometry={nodes.Banca_tabac.geometry} // Привязка геометрии
      scale={scale} // Масштаб модели
      receiveShadow
      {...props} // Передача остальных пропсов
    >
      {/* Настройка материала */}
      <meshStandardMaterial
        metalness={0.2} // Металличность
        roughness={roughness} // Шероховатость
        map={materials.map} // Текстура материала
      />
      {/* Дочерние элементы */}
      {children}
    </mesh>
  );
});

function SModel({ children, color = 'white', roughness = 0, ...props }) {
  const ref = useRef()
  const { nodes, materials } = useGLTF('tobacco-container-v2-v8-v2.glb')

  useFrame((state, delta) => {
    easing.dampC(ref.current.material.color, color, 0.2, delta)
  })

  return (
    <mesh ref={ref} castShadow receiveShadow scale={1.25} geometry={nodes.Banca_tabac.geometry}>
      {/* castShadow  */}
      {/* <meshStandardMaterial metalness={0.2} roughness={roughness} map={materials.map} /> */}
      {/* <shadowMaterial transparent color="#251005" opacity={0.15} /> */}
      {/* <MeshTransmissionMaterial clearcoat={1} thickness={0.1} anisotropicBlur={0.1} chromaticAberration={0.1} samples={1} resolution={128} /> */}
      <meshPhysicalMaterial color="#efefef" transmission={0.1} roughness={0.25} thickness={15} envMapIntensity={1} />

      {/* <meshStandardMaterial metalness={0.2} roughness={roughness} /> */}
      {children}
    </mesh>
  )
}

const Model = forwardRef(({ children, color = 'white', roughness = 0, ...props }, ref) => {
  const { nodes, materials } = useGLTF('flacon-v1-v6-v1.glb');

  useFrame((state, delta) => {
    if (ref?.current) {
      easing.dampC(ref.current.material.color, color, 0.2, delta);
    }
  });

  return (
    <mesh
      ref={ref}
      castShadow
      receiveShadow
      scale={0.3}
      geometry={nodes.Circle003.geometry}
    >
      <meshStandardMaterial
        metalness={0.2}
        roughness={roughness}
        map={materials.map}
      />
      {children}
    </mesh>
  );
});

