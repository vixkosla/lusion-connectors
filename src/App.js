// https://twitter.com/lusionltd/status/1701534187545636964
// https://lusion.co

import * as THREE from 'three'
import { useRef, useReducer, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, MeshTransmissionMaterial, Environment, Lightformer } from '@react-three/drei'
import { CuboidCollider, BallCollider, Physics, RigidBody } from '@react-three/rapier'
import { EffectComposer, N8AO } from '@react-three/postprocessing'
import { easing, geometry } from 'maath'

const accents = ['#fff', '#00ffd7', '#ff4031']
const shuffle = (accent = 0) => [
  { color: 'white', roughness: 0.1 },
  { color: 'white', roughness: 0.75 },
  { color: 'white', roughness: 0.75 },
  { color: 'white', roughness: 0.1 },
  { color: 'white', roughness: 0.75 },
  { color: 'white', roughness: 0.1 },
  { color: accents[accent], roughness: 0.1, accent: true },
  { color: accents[accent], roughness: 0.75, accent: true },
  { color: accents[accent], roughness: 0.1, accent: true }
]


export const App = () => (
  <div className="container">
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
  return (
    <Canvas onClick={click} shadows dpr={[1, 1.5]} gl={{ antialias: false }} camera={{ position: [0, 0, 15], fov: 27.5, near: 1, far: 40 }} {...props}>
      <color attach="background" args={['#fff']} />
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <Physics /*debug*/ gravity={[0, 0, 0]} colliders={false}
      // numAdditionalFrictionIterations={0}
      // numSolverIterations={1}

      // updateLoop={"independent"}
      // timeStep={1 / 15}
      // frameloop="demand"
      >
        {/* numAdditionalFrictionIterations = 4 */}
        {/* numSolverIterations={8} */}
        <Pointer />
        {connectors.map((props, i) => <Connector key={i} {...props} />) /* prettier-ignore */}
        {/* {connectors.map((props, i) => <ConnectorV key={i} {...props} />) /* prettier-ignore */} */}
        {connectors.map((props, i) => <Connector key={i} {...props} />) /* prettier-ignore */}
        {connectors.map((props, i) => <Connector key={i} {...props} />) /* prettier-ignore */}

        {/* <ConnectorV position={[0, 0, 5]}>
          <TModel>
            <MeshTransmissionMaterial clearcoat={1} thickness={0.1} anisotropicBlur={0.1} chromaticAberration={0.1} samples={8} resolution={1024} />
          </TModel>
        </ConnectorV>
        <Connector position={[0, -2, 5]}>
          <Model>
            <MeshTransmissionMaterial clearcoat={1} thickness={0.1} anisotropicBlur={0.1} chromaticAberration={0.1} samples={8} resolution={1024} />
          </Model>
        </Connector> */}
      </Physics>
      <EffectComposer disableNormalPass multisampling={8}>
        <N8AO distanceFalloff={1} aoRadius={1} intensity={4} />
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

function Connector({ position, children, vec = new THREE.Vector3(), scale, r = THREE.MathUtils.randFloatSpread, accent, ...props }) {
  const api = useRef()
  const pos = useMemo(() => position || [r(10), r(10), r(10)], [])
  useFrame((state, delta) => {
    delta = Math.min(0.1, delta)
    api.current?.applyImpulse(vec.copy(api.current.translation()).negate().multiplyScalar(0.5))
  })
  return (
    <RigidBody linearDamping={8} angularDamping={8} friction={0.9} position={pos} ref={api} colliders={false} restitution={0}>
      {/* gravityScale={5} */}
      {/* <CuboidCollider args={[0.38, 1.27, 0.38]} /> */}
      {/* <CuboidCollider args={[1.27, 0.38, 0.38]} /> */}
      {/* <CuboidCollider args={[0.38, 0.38, 1.27]} /> */}
      {/* <CuboidCollider type="trimesh" /> */}
      {/* Пересчитать значения, и ввести руками, для уменьшения нагрузки */}
      {/* <CuboidCollider/> */}
      <CuboidCollider args={[0.35, 1.35, 0.45]} />
      {children ? children : <Model {...props} />}
      {accent && <pointLight intensity={4} distance={2.5} color={props.color} />}
    </RigidBody>
  )
}


function ConnectorV({ position, children, vec = new THREE.Vector3(), scale, r = THREE.MathUtils.randFloatSpread, accent, ...props }) {
  const api = useRef()
  const pos = useMemo(() => position || [r(10), r(10), r(10)], [])
  useFrame((state, delta) => {
    delta = Math.min(0.1, delta)
    api.current?.applyImpulse(vec.copy(api.current.translation()).negate().multiplyScalar(1.1))
  })
  return (
    <RigidBody linearDamping={4} angularDamping={1} friction={0.1} position={pos} ref={api} colliders={false} restitution={0}>
      {/* gravityScale={5} */}
      {/* <CuboidCollider args={[0.38, 1.27, 0.38]} /> */}
      {/* <CuboidCollider args={[1.27, 0.38, 0.38]} /> */}
      {/* <CuboidCollider args={[0.38, 0.38, 1.27]} /> */}
      {/* Пересчитать значения, и ввести руками, для уменьшения нагрузки */}
      <BallCollider args={[1.8]} />
      {children ? children : <TModel {...props} />}
      {accent && <pointLight intensity={4} distance={2.5} color={props.color} />}
    </RigidBody>
  )
}

function Pointer({ vec = new THREE.Vector3() }) {
  const ref = useRef()
  useFrame(({ mouse, viewport }) => {
    ref.current?.setNextKinematicTranslation(vec.set((mouse.x * viewport.width) / 8, (mouse.y * viewport.height) / 8, 0))
  })
  return (
    <RigidBody position={[0, 0, 0]} type="kinematicPosition" colliders={false} ref={ref} restitution={0}>
      <BallCollider args={[1]} />
    </RigidBody>
  )
}

function TModel({ children, color = 'white', roughness = 0, ...props }) {
  const ref = useRef()
  const { nodes, materials } = useGLTF('tobacco-container-v2-v7.glb')

  useFrame((state, delta) => {
    easing.dampC(ref.current.material.color, color, 0.2, delta)
  })

  return (
    <mesh ref={ref} castShadow receiveShadow scale={1.25} geometry={nodes.Banca_tabac.geometry}>
      <meshStandardMaterial metalness={0.2} roughness={roughness} map={materials.map} />
      {/* <meshStandardMaterial metalness={0.2} roughness={roughness} /> */}
      {children}
    </mesh>
  )
}

function SModel({ children, color = 'white', roughness = 0, ...props }) {
  const ref = useRef()
  // const { nodes, materials } = useGLTF('c-flaconb-v1.glb')
  // const { nodes, materials } = useGLTF('c-transformed.glb')
  const { nodes, materials } = useGLTF('flacon-v1.glb')
  // const { nodes, materials } = useGLTF('tobacco-v1.glb')
  console.log(materials)

  // useFrame((state, delta) => {
  //   easing.dampC(ref.current.material.color, color, 0.2, delta)
  // })
  return (
    <mesh ref={ref} scale={0.3} geometry={nodes.Circle003.geometry}>
      <MeshTransmissionMaterial resolution={128} />
      {/* clearcoat={1} thickness={0.1} anisotropicBlur={0.1} chromaticAberration={0.1} samples={8} */}
      {/* <meshStandardMaterial metalness={0.2} roughness={roughness} map={materials.map} /> */}
      {/* <meshStandardMaterial metalness={0.2} roughness={roughness} /> */}
      {children}
    </mesh>
  )
}

function Model({ children, color = 'white', roughness = 0, ...props }) {
  const ref = useRef()
  // const { nodes, materials } = useGLTF('c-flaconb-v1.glb')
  // const { nodes, materials } = useGLTF('c-transformed.glb')
  const { nodes, materials } = useGLTF('flacon-v1-v3.glb')
  // const { nodes, materials } = useGLTF('tobacco-v1.glb')
  console.log(materials)
  console.log(geometry)

  useFrame((state, delta) => {
    easing.dampC(ref.current.material.color, color, 0.2, delta)
  })
  return (
    <mesh ref={ref} castShadow receiveShadow scale={0.3} geometry={nodes.Circle003.geometry}>
      <meshStandardMaterial metalness={0.2} roughness={roughness} map={materials.map} />
      {/* <meshStandardMaterial metalness={0.2} roughness={roughness} /> */}
      {children}
    </mesh>
  )
}
