import * as THREE from 'three'

export function initScene(container) {
  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 8

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.appendChild(renderer.domElement)

  const count = 2000
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 30
  }
  const particlesGeo = new THREE.BufferGeometry()
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const colors = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const r = Math.random()
    colors[i * 3]     = 0.4 + r * 0.2
    colors[i * 3 + 1] = 0.3 + r * 0.2
    colors[i * 3 + 2] = 0.8 + r * 0.2
  }
  particlesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const particlesMat = new THREE.PointsMaterial({
    size: 0.035,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  })
  const particlesMesh = new THREE.Points(particlesGeo, particlesMat)
  scene.add(particlesMesh)

  const ringPos = { x: 10, y: 3.9, z: 0 }

  const ringGeo = new THREE.TorusGeometry(1, 0.015, 16, 100)
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x6c63ff,
    transparent: true,
    opacity: 0.15,
    wireframe: true,
  })
  const ring = new THREE.Mesh(ringGeo, ringMat)
  ring.position.set(ringPos.x, ringPos.y, ringPos.z)
  ring.rotation.x = Math.PI / 3
  ring.rotation.z = Math.PI / 4
  scene.add(ring)

  const ring2Geo = new THREE.TorusGeometry(1.5, 0.01, 16, 120)
  const ring2Mat = new THREE.MeshBasicMaterial({
    color: 0xe040fb,
    transparent: true,
    opacity: 0.1,
    wireframe: true,
  })
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat)
  ring2.position.set(ringPos.x, ringPos.y, ringPos.z)
  ring2.rotation.x = Math.PI / 2.5
  ring2.rotation.z = Math.PI / 3
  scene.add(ring2)

  const ring3Geo = new THREE.TorusGeometry(0.50, 0.008, 12, 80)
  const ring3Mat = new THREE.MeshBasicMaterial({
    color: 0x00e5ff,
    transparent: true,
    opacity: 0.12,
    wireframe: true,
  })
  const ring3 = new THREE.Mesh(ring3Geo, ring3Mat)
  ring3.position.set(ringPos.x, ringPos.y, ringPos.z)
  ring3.rotation.x = Math.PI / 4
  ring3.rotation.z = Math.PI / 2
  scene.add(ring3)

  const mouse = { x: 0, y: 0 }
  document.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
  })

  function animate() {
    requestAnimationFrame(animate)

    particlesMesh.rotation.x += 0.0002
    particlesMesh.rotation.y += 0.0004

    ring.rotation.x  += 0.002
    ring.rotation.y  += 0.003
    ring2.rotation.x -= 0.0015
    ring2.rotation.y += 0.002
    ring3.rotation.x += 0.003
    ring3.rotation.y -= 0.002

    camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.02
    camera.position.y += (-mouse.y * 0.5 - camera.position.y) * 0.02
    camera.lookAt(scene.position)

    renderer.render(scene, camera)
  }
  animate()

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  window.addEventListener('resize', onResize)

  return () => {
    window.removeEventListener('resize', onResize)
    renderer.dispose()
  }
}
