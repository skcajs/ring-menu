import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import GUI from 'lil-gui'
import gsap from 'gsap'

/**
 * Debug
 */
const gui = new GUI()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Base
 */
const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()
scene.fog = new THREE.Fog( 0xcccccc, 10, 15 );

/**
 * Objects
 */
const objects = new THREE.Group()

const cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({color: 'blue'}))
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 16 ), new THREE.MeshBasicMaterial({color: 'green'}))
const pyramid = new THREE.Mesh(new THREE.ConeGeometry(0.5,1,4), new THREE.MeshBasicMaterial({color: 'yellow'}))
const torus = new THREE.Mesh(new THREE.TorusKnotGeometry(0.5, 0.1, 100, 16), new THREE.MeshBasicMaterial({color: 'red'}))

objects.add(cube, sphere, pyramid, torus)

const angle = 2 * Math.PI / objects.children.length

for(let i = 0; i< objects.children.length; i++) {
    objects.children[i].position.x = Math.max(2.5, 0.5 * objects.children.length) * Math.sin(angle * i)
    objects.children[i].position.z = Math.max(2.5, 0.5 * objects.children.length) * Math.cos(angle * i)
}

let selectedObjectIndex = 0

scene.add(objects)

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = Math.max(5, objects.children.length)
camera.position.y = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)

/**
 * Rotation
 */
let isStatic = true
window.addEventListener('keydown', (event) => {
    if(event.key == 'd' && isStatic) {
        isStatic = false
        selectedObjectIndex = (selectedObjectIndex + 1) % objects.children.length
        gsap.to(objects.rotation, {duration: 0.25, y: `-=${angle}`, onComplete: () => {isStatic = true}})
    }
    else if(event.key == 'a' && isStatic) {
        isStatic = false
        selectedObjectIndex = (selectedObjectIndex - 1) % objects.children.length
        selectedObjectIndex = selectedObjectIndex < 0 ? objects.children.length + selectedObjectIndex : selectedObjectIndex
        gsap.to(objects.rotation, {duration: 0.25, y: `+=${angle}`, onComplete: () => {isStatic = true}})         
    }
})

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update
    // console.log(objects.children[selectedObjectIndex])
    objects.children[selectedObjectIndex].rotation.y = elapsedTime

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()