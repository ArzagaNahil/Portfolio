import * as THREE from 'three'

const gsap = window.gsap || null

const vertexShader = `
varying vec2 v_uv;

void main() {
    v_uv = uv;
    vec3 pos = position;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`

const gooeyShader = `
uniform sampler2D u_map;
uniform sampler2D u_hovermap;

uniform float u_alpha;
uniform float u_time;
uniform float u_progressHover;
uniform float u_progressClick;

uniform vec2 u_res;
uniform vec2 u_mouse;
uniform vec2 u_ratio;
uniform vec2 u_hoverratio;

varying vec2 v_uv;

/* --- Simplex noise 3D (Ashima Arts / Stefan Gustavson), devuelto como snoise3 --- */
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise3(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857; // 1.0/7.0
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

/* --- Efecto wave (Codrops: Gooey Image Hover Effects — 4ª tarjeta "Sand & Deserts") --- */
float circle(in vec2 _st, in float _radius, in float blurriness) {
    vec2 dist = _st - vec2(0.5);
    return 1. - smoothstep(_radius - (_radius * blurriness), _radius + (_radius * blurriness), dot(dist, dist) * 4.0);
}

void main() {
    vec2 resolution = u_res * PR;
    float time = u_time * 0.05;
    float progress = u_progressClick;
    float progressHover = u_progressHover;

    vec2 uv = v_uv;
    vec2 uv_h = v_uv;

    vec2 st = gl_FragCoord.xy / resolution.xy - vec2(.5);
    st.y *= resolution.y / resolution.x;

    vec2 mouse = vec2((u_mouse.x / u_res.x) * 2. - 1., -(u_mouse.y / u_res.y) * 2. + 1.) * -.5;
    mouse.y *= resolution.y / resolution.x;

    float offX = uv.x * .3 - time * 0.3;
    float offY = uv.y + sin(uv.x * 5.) * .1 - sin(time * 0.5) + snoise3(vec3(uv.x, uv.y, time) * 0.5);
    offX += snoise3(vec3(offX, offY, time) * 5.) * .3;
    offY += snoise3(vec3(offX, offX, time * 0.3)) * .1;
    float nc = (snoise3(vec3(offX, offY, time * .5) * 8.)) * progressHover;
    float nh = (snoise3(vec3(offX, offY, time * .5) * 2.)) * .03;

    nh *= smoothstep(nh, 0.5, 0.6);

    uv_h -= vec2(0.5);
    uv_h *= u_hoverratio;
    uv_h += vec2(0.5);

    uv -= vec2(0.5);
    uv *= u_ratio;
    uv += vec2(0.5);

    vec4 image = texture2D(u_map, uv_h + vec2(nc + nh) * progressHover);
    vec4 hover = texture2D(u_hovermap, uv + vec2(nc + nh) * progressHover * (1. - progress));

    vec4 finalImage = mix(image, hover, clamp(nh * (1. - progress) + progressHover, 0., 1.));

    gl_FragColor = vec4(finalImage.rgb, u_alpha);
}
`

function getRatio(size, img, r = 0) {
    const rad = (r * Math.PI) / 180
    const cos = Math.abs(Math.cos(rad))
    const sin = Math.abs(Math.sin(rad))
    const w = size.x * cos + size.y * sin
    const h = size.x * sin + size.y * cos
    const originalRatio = { w: w / img.width, h: h / img.height }
    const coverRatio = 1 / Math.max(originalRatio.w, originalRatio.h)
    return new THREE.Vector2(originalRatio.w * coverRatio, originalRatio.h * coverRatio)
}

class GooeyTile {

    constructor($el, scene, duration) {
        this.scene = scene
        this.$els = {
            el: $el,
            link: $el.querySelector('.tile__link'),
            img: $el.querySelector('.tile__img'),
        }
        this.duration = duration
        this.images = []
        this.sizes = new THREE.Vector2(0, 0)
        this.offset = new THREE.Vector2(0, 0)
        this.mouse = new THREE.Vector2(0, 0)

        this.clock = new THREE.Clock()
        this.isHovering = false
        this.mesh = null

        this.loader = new THREE.TextureLoader()
        this.preload([this.$els.img.src, this.$els.img.dataset.hover], () => this.initTile())

        this.bindEvent()
    }

    bindEvent() {
        window.addEventListener('resize', () => this.onResize())
        window.addEventListener('mousemove', (e) => this.onMouseMove(e))
        this.$els.link.addEventListener('mouseenter', () => this.onPointerEnter())
        this.$els.link.addEventListener('mouseleave', () => this.onPointerLeave())
    }

    onPointerEnter() {
        this.isHovering = true
        if (!this.mesh || !gsap) return
        gsap.to(this.uniforms.u_progressHover, this.duration, {
            value: 1,
            ease: 'power2.inOut',
        })
    }

    onPointerLeave() {
        if (!this.mesh || !gsap) return
        gsap.to(this.uniforms.u_progressHover, this.duration, {
            value: 0,
            ease: 'power2.inOut',
            onComplete: () => { this.isHovering = false },
        })
    }

    onMouseMove(e) {
        if (!gsap) return
        gsap.to(this.mouse, 0.5, { x: e.clientX, y: e.clientY, overwrite: 'auto' })
    }

    onResize() {
        this.getBounds()
        if (!this.mesh) return
        this.mesh.scale.set(this.sizes.x, this.sizes.y, 1)
        this.uniforms.u_res.value.set(window.innerWidth, window.innerHeight)
    }

    initTile() {
        const texture = this.images[0]
        const hoverTexture = this.images[1]

        this.getBounds()

        this.uniforms = {
            u_alpha: { value: 1 },
            u_map: { type: 't', value: texture },
            u_ratio: { value: getRatio(this.sizes, texture.image) },
            u_hovermap: { type: 't', value: hoverTexture },
            u_hoverratio: { value: getRatio(this.sizes, hoverTexture.image) },
            u_mouse: { value: this.mouse },
            u_progressHover: { value: 0 },
            u_progressClick: { value: 0 },
            u_time: { value: this.clock.getElapsedTime() },
            u_res: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        }

        this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1)

        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader,
            fragmentShader: gooeyShader,
            transparent: true,
            defines: {
                PI: Math.PI,
                PR: window.devicePixelRatio.toFixed(1),
            },
        })

        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.x = this.offset.x
        this.mesh.position.y = this.offset.y
        this.mesh.scale.set(this.sizes.x, this.sizes.y, 1)
        this.scene.add(this.mesh)

        this.$els.img.classList.add('is-loaded')
    }

    move() {
        if (!this.mesh) return
        this.getBounds()
        this.mesh.position.x = this.offset.x
        this.mesh.position.y = this.offset.y
    }

    update() {
        if (!this.mesh) return
        this.move()
        if (!this.isHovering) return
        this.uniforms.u_time.value += this.clock.getDelta()
    }

    getBounds() {
        const { width, height, left, top } = this.$els.img.getBoundingClientRect()
        this.sizes.set(width, height)
        this.offset.set(
            left - window.innerWidth / 2 + width / 2,
            -top + window.innerHeight / 2 - height / 2
        )
    }

    preload($els, done) {
        let loaded = 0
        const images = new Array($els.length)
        $els.forEach((src, i) => {
            this.loader.load(
                src,
                (image) => {
                    image.colorSpace = THREE.SRGBColorSpace
                    images[i] = image
                    loaded += 1
                    if (loaded === $els.length) {
                        this.images = images
                        done()
                    }
                }
            )
        })
    }

    dispose() {
        if (!this.mesh) return
        this.mesh.geometry.dispose()
        this.material.dispose()
    }
}

export function initGooey() {
    const els = document.querySelectorAll('.js-tile')
    if (!els.length) return () => {}

    const canvas = document.createElement('canvas')
    canvas.id = 'gooey-scene'
    document.body.appendChild(canvas)

    const perspective = 800
    const W = window.innerWidth
    const H = window.innerHeight

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(
        (180 * (2 * Math.atan(H / 2 / perspective))) / Math.PI,
        W / H,
        1,
        10000
    )
    camera.position.set(0, 0, perspective)

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.toneMapping = THREE.NoToneMapping
    renderer.outputColorSpace = THREE.SRGBColorSpace

    const tiles = Array.from(els).map(($el) => new GooeyTile($el, scene, 0.5))

    function resize() {
        renderer.setSize(window.innerWidth, window.innerHeight)
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        tiles.forEach((tile) => tile.onResize())
    }
    window.addEventListener('resize', resize)

    function render() {
        requestAnimationFrame(render)
        tiles.forEach((tile) => tile.update())
        renderer.render(scene, camera)
    }
    render()

    return () => {
        window.removeEventListener('resize', resize)
        tiles.forEach((tile) => tile.dispose())
        renderer.dispose()
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas)
    }
}