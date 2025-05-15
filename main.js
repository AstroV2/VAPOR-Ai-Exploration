//Stable Vanilla Classic

import * as THREE from 'three';
import { LightProbeGenerator } from 'three/examples/jsm/lights/LightProbeGenerator.js';
import { PMREMGenerator } from 'three';

// --- Playlist Manager ---

const playlistFiles = [
`1. Chemical Or9 - Glizzies & 'rizz - Glizzies & 'rizz.mp3`,
`2. Chemical Or9 - The Dogs Go Home - Glizzies & 'rizz.mp3`,
`3. Chemical Or9 - It's Our Life To Live - Glizzies & 'rizz.mp3`,
`4. Chemical Or9 - Morning Do - Glizzies & 'rizz.mp3`,
`5. Chemical Or9 - Little Meltdown - Glizzies & 'rizz.mp3`,
`6. Chemical Or9 - Beatvoxing - Glizzies & 'rizz.mp3`,
`7. Chemical Or9 - Electric Chemistry - Glizzies & 'rizz.mp3`,
`A Better Day - Scribble Down.mp3`,
`A Heroes Burden.mp3`,
`AI Absurdities ft. Lexicorvus.mp3`,
`Alive II.mp3`,
`Alive.mp3`,
`Arise Within.mp3`,
`At Sundown We Ride II.mp3`,
`At Sundown We Ride.mp3`,
`Audiodose [Headphones Required].mp3`,
`Biting Bullets.mp3`,
`Boofing Gremlins I.mp3`,
`Boofing Gremlins II.mp3`,
`Boofing Gremlins III.mp3`,
`Boofing Gremlins IV.mp3`,
`Boofing Gremlins V.mp3`,
`Boss Battle Showdown Finale.mp3`,
`Boss Battle Showdown Intro.mp3`,
`Boss Battle Showdown Intro.mp3`,
`Boss Battle Showdown Midway.mp3`,
`Boss Battle Showdown.mp3`,
`Break The Chain.mp3`,
`Broken Promise Land.mp3`,
`Christmas Melodies IX.mp3`,
`Christmas Yodeling.mp3`,
`Cold Wind Blows.mp3`,
`Do Your Part [WBPR Remix].mp3`,
`Emojiland01.mp3`,
`Emojiland02.mp3`,
`Emojiland03.mp3`,
`Emojiland04.mp3`,
`Emojiland05.mp3`,
`Emojiland10.mp3`,
`Emojiland11.mp3`,
`Emojiland12.mp3`,
`Emojiland13.mp3`,
`Emojiland14.mp3`,
`Emojiland15.mp3`,
`Fatemaster Intro.mp3`,
`First Encounter.mp3`,
`Forest Castle Theme.mp3`,
`Furrowed Tale.mp3`,
`Ghostly Echo ft. Lexicorvus.mp3`,
`Grubstep.mp3`,
`Hardware Meatware.mp3`,
`Heroic Swagger.mp3`,
`Heroic Swagger.mp3`,
`Insect Pie.mp3`,
`Intro Theme.mp3`,
`It's Beautiful To Me.mp3`,
`Jibberjazzle.mp3`,
`Kablooey Jigglepants Splishytoodle.mp3`,
`Knees Bruise.mp3`,
`Losing Faith.mp3`,
`Making Time - Scribble Down.mp3`,
`Mid-Boss Showdown.mp3`,
`Moving Out - Scribble Down.mp3`,
`Never Cry Again (Accappella).mp3`,
`Ninja Ninja.mp3`,
`Numba Muncha (Remastered).mp3`,
`Protagonist Theme.mp3`,
`Restoring Faith.mp3`,
`Save The World.mp3`,
`Scribble Down - Scribble Down.mp3`,
`Shadows Hunger.mp3`,
`Shelter Tonight.mp3`,
`Sip of Life.mp3`,
`Snowfall On The Page ft. Lexicorvus.mp3`,
`Snurflerific.mp3`,
`SpaceVibe.mp3`,
`Strange Business Partners 01.mp3`,
`Strange Business Partners 02.mp3`,
`Strange Business Partners 03.mp3`,
`Strange Business Partners 04.mp3`,
`Strange Business Partners 05.mp3`,
`Strange Business Partners 06.mp3`,
`Strange Business Partners 07.mp3`,
`Strange Business Partners 08.mp3`,
`Strange Business Partners 09.mp3`,
`Strange Business Partners 10.mp3`,
`Strange Business Partners 11.mp3`,
`Strange Business Partners 12.mp3`,
`Strange Business Partners 13.mp3`,
`Strange Business Partners 14.mp3`,
`Strange Business Partners 15.mp3`,
`Strange Business Partners 16.mp3`,
`Strange Business Partners 17.mp3`,
`Strange Business Partners 18.mp3`,
`Strange Business Partners 19.mp3`,
`Strange Business Partners 20.mp3`,
`Strange Business Partners 21.mp3`,
`Strange Business Partners.mp3`,
`Swing Badda (Uncover).mp3`,
`Tender Loving Care - Scribble Down.mp3`,
`Terminal Tune.mp3`,
`The Afterlife.mp3`,
`The Bells Toll.mp3`,
`The Cost of Living.mp3`,
`The Final Showdown.mp3`,
`The Hero's Burden.mp3`,
`The Knife From Your Back.mp3`,
`The One (Remastered).mp3`,
`The Protagonist.mp3`,
`The Spinning Torment (WBPR).mp3`,
`Under the Rug.mp3`,
`Unfuzzen Floopenstink.mp3`,
`Welcome to Tomorrow.mp3`,
`Where We Belong - Scribble Down.mp3`,
`With You.mp3`,
`World's Edge.mp3`,
`Yard Seed - Scribble Down.mp3`,
`Zero Hour (Radio Edit).mp3`
];

class PlaylistManager {
    constructor(audioElement, masterGainNode, files = []) {
        this.audioElement = audioElement;
        this.masterGainNode = masterGainNode; // Controls the overall volume
        this.files = files;
        this.currentIndex = -1;
        this.isPlaying = false;
        this.isShuffled = false; // To keep track if shuffle was applied

        // The audio element's volume is always 1, we control volume via the Web Audio API GainNode
        this.audioElement.volume = 1;

        // Create an AudioContext and connect the audio element
        this.audioContext = this.masterGainNode.context; // Reuse existing context
        this.mediaElementSource = this.audioContext.createMediaElementSource(this.audioElement);
        this.mediaElementSource.connect(this.masterGainNode); // Connect music source to master gain
    }

    init() {
        if (this.files.length === 0) {
            console.warn("Playlist is empty. Add MP3 file paths to 'playlistFiles' in main.js.");
            return;
        }

        this.shuffle(); // Shuffle initially
        this.currentIndex = 0; // Start from the first track after shuffling

        // Play next song when the current one ends
        this.audioElement.addEventListener('ended', () => {
            this.next();
        });

        // Autoplay the first track if desired (optional)
        this.play();
    }

    shuffle() {
        // Fisher-Yates (aka Knuth) Shuffle
        for (let i = this.files.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.files[i], this.files[j]] = [this.files[j], this.files[i]];
        }
        this.isShuffled = true;
        this.currentIndex = -1; // Reset index after shuffle
        console.log("Playlist shuffled:", this.files);
    }

    play(index) {
        // Resume AudioContext if suspended
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        if (this.files.length === 0) return;

        if (typeof index === 'number' && index >= 0 && index < this.files.length) {
            this.currentIndex = index;
        } else if (this.currentIndex === -1) {
            // If starting fresh (or after shuffle), start at 0
            this.currentIndex = 0;
        } else {
            // If play() is called without an index, resume current track or start from current index if paused
        }

        // Ensure currentIndex is valid
        if (this.currentIndex < 0 || this.currentIndex >= this.files.length) {
            this.currentIndex = 0; // Fallback to the first track
        }

        const trackSrc = this.files[this.currentIndex];

        // Only change src if it's different or if the element doesn't have a src yet
        if (this.audioElement.currentSrc !== trackSrc || !this.audioElement.currentSrc) {
             if (!trackSrc) {
                console.error("Invalid track source at index", this.currentIndex);
                return;
            }
            this.audioElement.src = trackSrc;
        }


        this.audioElement.play()
            .then(() => {
                this.isPlaying = true;
                console.log(`Playing: ${this.files[this.currentIndex]}`);
                this.updateUI(); // Update play/pause button state
            })
            .catch(error => {
                console.error("Error playing audio:", error);
                this.isPlaying = false; // Ensure state is correct on error
                this.updateUI();
            });
    }

    pause() {
        this.audioElement.pause();
        this.isPlaying = false;
        console.log("Music paused");
        this.updateUI();
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    next() {
        if (this.files.length === 0) return;
        this.currentIndex = (this.currentIndex + 1) % this.files.length;
        this.play(this.currentIndex);
    }

    previous() {
        if (this.files.length === 0) return;
        this.currentIndex = (this.currentIndex - 1 + this.files.length) % this.files.length;
        this.play(this.currentIndex);
    }

    // Method to update the Play/Pause button icon in settings
    updateUI() {
        const playPauseButton = document.getElementById('music-play-pause');
        if (playPauseButton) {
            playPauseButton.innerHTML = this.isPlaying ?
                `<svg viewBox="0 0 24 24"><path d="M14,19H18V5H14M6,19H10V5H6V19Z" /></svg>` : // Pause Icon
                `<svg viewBox="0 0 24 24"><path d="M8,5.14V19.14L19,12.14L8,5.14Z" /></svg>`; // Play Icon
        }
    }
}


class VaporAdventure {
    constructor() {
        this.language = 'en';
        this.container = document.getElementById('panorama-container');
        this.camera = null;
        this.scene = null;
        this.renderer = null;
        this.isUserInteracting = false;
        this.longitude = 0; 
        this.latitude = -45; // Leave This ALONE
        this.phi = 0;
        this.theta = 0;
        this.onPointerDownPointerX = 0;
        this.onPointerDownPointerY = 0;
        this.onPointerDownLongitude = 0;
        this.onPointerDownLatitude = 0;
// Variable holding the current game state location
this.currentLocation = {
    title: "True Sight",
    description: `The room is dark and a single shaft of light shines down upon a pedestal. On the pedestal is an augmented reality headset prototype unlike anything the world has ever seen. It's capable of fully AI generated realms and sensory stimulation using the latest code to skull technology. When worn the user is presented with a large selection of games that parody real world games with Unique Portmanteau names. There is also a 'load more' option to endlessly load new games.`
};

// Configuration object defining the new story parameters
this.storyConfig = {
    genre: ``,
    setting: ``,
    protagonist: ``,
    quest: ``,
    motivation: ``,
    coreThreats: ``,
    consequences: ``
};

// Prompt to generate the overall story idea/context for the new narrative
this.customStoryPrompt = `
        Generate an immersive thrilling adventure with these elements:
        - Genre: ${this.storyConfig.genre}
        - Setting: ${this.storyConfig.setting}
        - Main Character: ${this.storyConfig.protagonist}
        - Quest: ${this.storyConfig.quest}
        - Motivation: ${this.storyConfig.motivation}
        - Core Threats: ${this.storyConfig.coreThreats}
        - Potential Consequences: ${this.storyConfig.consequences}
    `;

// Prompt to generate starting story.
this.customStartPrompt = `You are a text adventure game location generator. Generate the starting location description based on 
        the provided story elements. Emphasize the atmosphere and characters if any.
        Respond directly with JSON, following this JSON schema, and no other text:
        {
            "title": "string", // Use title from this.currentLocation: "${this.currentLocation.title}"
            "description": "string" // Use description from this.currentLocation: "${this.currentLocation.description}"
        }
    `;

        this.newLocationPrompt = `Generate a new location or modify the current based on the player's choice. Ensure the location is vivid, atmospheric and maintains current context especially if it's an actionable phrase. Think of the plausability and consequences and describe the results in detail. Time should pass appropriately for each action. Respond directly with JSON, following this JSON schema, and no other text:
                    Respond directly with JSON, following this JSON schema, and no other text:
                    {
                      "title": "string",
                      "description": "string"
                    }
                    The "title" should be a short, evocative name for the location or result (3-5 words).
                    The "description" should be a vivid, detailed description of the location (60-100 words).`;


        this.suggestionPrompt = `Analyze the provided image to suggest 12 scene-appropriate short phrase (3-5 words) tasks the player could take. Maintain the story arc to accomplish goals, quests, and genre goals. Determine logical placement as if a thought bubble were projected on 180 degree hemisphere. Keep a margin of space around each so they don't overlap and vary the x coordinate so they are staggered slightly. Avoid placing at the extreme edges.
                    Respond directly with JSON, following this JSON schema, and no other text:
                    {
                      "directions": [
                        {
                          "text": "string",
                          "position": {
                            "x": number,  // -1.0 to 1.0 (left to right)
                            "y": number,  // -1.0 to 1.0 (down to up)
                            "z": number   // -1.0 to 1.0 (back to front)
                          }
                        }
                      ]
                    }
                    The "text" should be a short direction (e.g. "Into the forest", "Across the bridge").
                    The "position" should place the direction bubble in a logical location in the scene derived from the image (e.g., a path leading left might be at {x: -0.7, y: 0.1, z: 0.9}).
        `;
        this.startingLocation = this.currentLocation;
        this.locationPrompt = "180 degree panoramic hemispherical first person view of ";
        this.panoramaUrl = null;
        this.history = [];
        this.isBlinking = false;
        this.blinkTimer = null;
        this.scheduleBlink();
        
        // Idle animation variables
        this.idleTime = 0;
        this.lastInteractionTime = Date.now();
        this.breathingPhase = 0;
        this.isWandering = false;
        this.wanderTargetLongitude = 0;
        this.wanderTargetLatitude = 0;
        this.wanderPhase = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.isInitialScan = false;
        this.scanPhase = 0;
        this.scanPattern = [];
        this.fullScreen = null;
        this.crtEffect = null;
        this.crtUniforms = null;
        this.panoramaLoaded = false;
        this.directions = [];
        this.isNavigating = false;
        this.locationHistory = [];
        this.maxRetries = 7;
        this.audioContext = null;
        this.masterGainNode = null; // Master volume control
        this.ambientGainNode = null; // For ambient sounds
        this.currentAmbience = null;
        this.playlistManager = null; // Playlist manager instance

        this.raycaster = new THREE.Raycaster();
        this.isStorytelling = false;
        this.customStory = false;
        this.settings = {
            fullScreen: false,
            crtEffect: true,
            scanlineIntensity: 0.05,
            noiseIntensity: 0.05,
            distortion: 0.224,
            bubbleSize: 2.0,
            bubbleFontSize: 0.7,
            autoplay: false,
            autoplayInterval: 30,
            lightMapping: true,
            vignette: 0.1,
            chroma: 0.001,
            anistropy: 4,
            vibrance: 1.5,
            flashlightOn: true,
            flashlightIntensity: 100,
            flashlightDistance: 1200,
            flashlightAngle: Math.PI / 8,
            flashlightPenumbra: 0.5,
            flashlightDecay: 0.5,
            flashlightHue: 60,
            flashlightColor: new THREE.Color().setHSL(60 / 360, 1, 0.8).getHex(),
            ambientLightColor: 0xffffff,
            ambientLightIntensity: 2.3,
            ambientLightHue: 0,
            masterVolume: 0.75,
            ambientSoundVolume: 0.07
        };
        this.firstLoad = true;
        this.customBubbleEditor = null;
        this.thoughtHistory = [];
        this.init();
    }

    async init() {
        this.initAudio(); // Initialize audio first
        this.setupScene();
        this.setupEvents();
        await this.generateInitialPanorama();
        this.generateCharacterThoughts();
        this.updateStoryBubble();
        if (this.currentLocation.title === this.startingLocation.title) {
            //don't scan
        } else {
            this.startInitialScan();
        }
        // Start music playback after splash screen fades (or immediately if no splash)
        // Ensure playlistManager is initialized before trying to play
        if (this.playlistManager) {
             // Check if splash screen exists and add listener, otherwise play directly
            const splashScreen = document.getElementById('splash-screen');
             if (splashScreen && splashScreen.style.opacity !== '0') {
                 // Use a transitionend listener for reliability
                 splashScreen.addEventListener('transitionend', () => {
                     if(splashScreen.style.opacity === '0' && !this.playlistManager.isPlaying) {
                          this.playlistManager.play();
                     }
                 }, { once: true });
             } else if (!this.playlistManager.isPlaying) {
                 // If splash is already gone or never existed, play now
                 this.playlistManager.play();
             }
        }
    }

    setupScene() {
        //Start camera POV at 180 to create warp-in effect at page load. When the scene loads it'll fly in to 75 degrees.
        this.camera = new THREE.PerspectiveCamera(180, window.innerWidth / window.innerHeight, 1, 1100);
        // Create scene and add an ambient light
        this.scene = new THREE.Scene();
        const ambientLight = new THREE.AmbientLight(this.settings.ambientLightColor, this.settings.ambientLightIntensity);
        this.scene.add(ambientLight);
        
        // Initialize renderer and enable shadows
        this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.container.appendChild(this.renderer.domElement);
        this.setupCRTEffect();
        this.createControlPanel();
        // Create a spotlight that acts like a flashlight attached to the camera
        this.flashlight = new THREE.SpotLight(
            this.settings.flashlightColor,
            this.settings.flashlightIntensity,
            this.settings.flashlightDistance,
            this.settings.flashlightAngle,
            this.settings.flashlightPenumbra,
            this.settings.flashlightDecay
        );
        this.flashlight.visible = this.settings.flashlightOn;
        // Enable shadows for the flashlight and configure its shadow properties
        this.flashlight.castShadow = true;
        this.flashlight.shadow.mapSize.width = 1024;
        this.flashlight.shadow.mapSize.height = 1024;
        this.flashlight.shadow.camera.near = 1;
        this.flashlight.shadow.camera.far = 1000;
        this.flashlight.position.copy(this.camera.position);
        // Create a target object for the spotlight
        this.flashlight.target = new THREE.Object3D();
        this.flashlight.target.position.set(0, 0, -1);
        this.scene.add(this.flashlight.target);
        this.scene.add(this.flashlight);
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    setupCRTEffect() {
        // CRT shader uniforms
        this.crtUniforms = {
            tDiffuse: { value: null },
            time: { value: 0 },
            resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            scanlineIntensity: { value: 0.15 },
            scanlineCount: { value: window.innerHeight / 3 },
            noiseIntensity: { value: 0.08 },
            distortion: { value: 0.04 },
            vignette: { value: 0.2 },
            chromaAmount: { value: 1.103 },
            vibranceAmount: { value: 1.0 }
        };
        
        const crtMaterial = new THREE.ShaderMaterial({
            // Add the new uniform here!
            uniforms: {
                ...this.crtUniforms, // Spread your existing uniforms
                neonGreenWobbleAmount: { value: 0.006 }, // Keep the previous addition
                fieryEffectAmount: { value: 0.004 }    // Add the new uniform for fire effect
                // Ensure tDiffuse, time, resolution etc. are in this.crtUniforms
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float time;
                uniform vec2 resolution;
                uniform float scanlineIntensity;
                uniform float scanlineCount;
                uniform float noiseIntensity;
                uniform float distortion;
                uniform float vignette;
                uniform float chromaAmount;
                uniform float vibranceAmount;
                uniform float neonGreenWobbleAmount;
                uniform float fieryEffectAmount; // <-- New uniform for fire

                varying vec2 vUv;

                float random(vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
                }

                vec3 rgb2hsv(vec3 c) {
                    vec4 K = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
                    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
                    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
                    float d = q.x - min(q.w, q.y);
                    float h = abs(q.z + (q.w - q.y)/(6.0*d+1e-7));
                    return vec3(h, d/(q.x+1e-7), q.x);
                }

                vec3 hsv2rgb(vec3 c) {
                    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
                    vec3 p = abs(fract(c.xxx+K.xyz)*6.0 - K.www);
                    return c.z * mix(K.xxx, clamp(p-K.xxx, 0.0, 1.0), c.y);
                }

                void main() {
                    vec2 uv = vUv;
                    vec2 center = vec2(0.5);
                    vec2 coords = uv - center;
                    float coordDot = dot(coords, coords);
                    vec2 distortedUv = uv + coords * (distortion * coordDot);

                    if(distortedUv.x < 0.0 || distortedUv.x > 1.0 || distortedUv.y < 0.0 || distortedUv.y > 1.0) {
                        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
                        return;
                    }

                    vec2 redOffset = vec2(chromaAmount, 0.0);
                    vec2 greenOffset = vec2(0.0, 0.0);
                    vec2 blueOffset = vec2(-chromaAmount, 0.0);

                    float r = texture2D(tDiffuse, distortedUv + redOffset).r;
                    float g = texture2D(tDiffuse, distortedUv + greenOffset).g;
                    float b = texture2D(tDiffuse, distortedUv + blueOffset).b;

                    float scanline = sin(distortedUv.y * scanlineCount * 6.28318) * 0.5 + 0.5;
                    scanline = 1.0 - scanline * scanlineIntensity;
                    float noise = random(distortedUv + time * 0.001) * noiseIntensity;
                    float vignetteAmount = clamp(1.0 - coordDot * (1.0 + vignette), 0.0, 1.0);

                    vec3 finalColor = vec3(r, g, b) * scanline + noise;
                    finalColor *= vignetteAmount;
                    finalColor *= 0.9 + 0.1 * sin(time * 0.2);

                    vec3 hsvColor = rgb2hsv(finalColor);
                    float saturation = hsvColor.y;
                    float maxVal = max(finalColor.r, max(finalColor.g, finalColor.b));
                    float avg = (finalColor.r + finalColor.g + finalColor.b) / 3.0;
                    float amount = (maxVal - avg);
                    float boostFactor = 1.0 + vibranceAmount * amount;
                    hsvColor.y = clamp(saturation * boostFactor, 0.0, 1.0);
                    vec3 dynColor = hsv2rgb(hsvColor);

                    // --- Dynamic movement effect for bright pixels ---
                    float brightness = max(dynColor.r, max(dynColor.g, dynColor.b));
                    if(brightness > 0.95) {
                        vec2 moveOffset = vec2(0.0);
                        float moveAmount = 0.005; // Default amount, will be overridden

                        if(dynColor.r > dynColor.g && dynColor.r > dynColor.b) {
                            // --- MODIFIED Red-dominant (fiery rise) pixels ---
                            float wobbleX = sin(time * 4.0 + vUv.y * 15.0); // Horizontal wobble
                            // Vertical component: Base upward motion + faster oscillation for flicker
                            // Using positive Y offset to suggest rising. cos(...) adds flicker/turbulence.
                            // (1.0 + cos(...)) ensures the offset is primarily positive (upward in texture space)
                            float riseY = 1.0 + cos(time * 7.0 + vUv.x * 12.0);
                            moveOffset = vec2(wobbleX, riseY); // Combine horizontal wobble and vertical rise/flicker
                            moveAmount = fieryEffectAmount; // Use the specific uniform for fire amount
                            // --- End of modification ---
                        } else if(dynColor.b > dynColor.r && dynColor.b > dynColor.g) {
                            // Blue-dominant (water-like) pixels: move vertically.
                            moveOffset = vec2(0.0, cos(time * 4.0 + vUv.x * 30.0));
                            moveAmount = 0.005; // Keep default or add specific uniform if needed
                        } else if(dynColor.g > dynColor.r && dynColor.g > dynColor.b) {
                            // Green-dominant (neon wobble) pixels
                            float wobbleX = sin(time * 5.0 + vUv.y * 10.0);
                            float wobbleY = cos(time * 3.0 + vUv.x * 15.0);
                            moveOffset = vec2(wobbleX, wobbleY);
                            moveAmount = neonGreenWobbleAmount;
                        }

                        moveOffset *= moveAmount; // Apply the calculated amount

                        // Sample the texture again at the offset position
                        vec3 movedColor;
                        movedColor.r = texture2D(tDiffuse, distortedUv + redOffset + moveOffset).r;
                        movedColor.g = texture2D(tDiffuse, distortedUv + greenOffset + moveOffset).g;
                        movedColor.b = texture2D(tDiffuse, distortedUv + blueOffset + moveOffset).b;

                        // Mix the original vibrant color with the color sampled at the offset position
                        dynColor = mix(dynColor, movedColor, 0.5); // Adjust mix factor as needed
                    }

                    // Final output color
                    gl_FragColor = vec4(dynColor, 1.0);
                }`});

        
        // Create a fullscreen quad to render the effect
        const plane = new THREE.PlaneGeometry(2, 2);
        this.crtEffect = new THREE.Mesh(plane, crtMaterial);
        
        // Create a separate scene and camera for post-processing
        this.effectScene = new THREE.Scene();
        this.effectCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.effectScene.add(this.crtEffect);

        this.renderTarget = new THREE.WebGLRenderTarget(
            window.innerWidth, 
            window.innerHeight, 
            {
                minFilter: THREE.NearestFilter,
                magFilter: THREE.NearestFilter,
                anistropy: this.settings.anistropy,
                toneMapping: THREE.AgXToneMapping,
                //antialias: true
            }
        );

        this.updateCRTEffectSettings();
    }

    updateCRTEffectSettings() {
        if (this.crtUniforms) {
            if (!this.settings.crtEffect) {
                this.crtUniforms.scanlineIntensity.value = 0;
                this.crtUniforms.noiseIntensity.value = 0;
                this.crtUniforms.distortion.value = 0;
                this.crtUniforms.vignette.value = 0;
                this.crtUniforms.chromaAmount.value = 0;
                this.crtUniforms.vibranceAmount.value = 0;
            } else {
                this.crtUniforms.scanlineIntensity.value = this.settings.scanlineIntensity;
                this.crtUniforms.noiseIntensity.value = this.settings.noiseIntensity;
                // If in fullscreen, force distortion to 0; otherwise, use the configured value.
                if (document.fullscreenElement) {
                    this.crtUniforms.distortion.value = 0;
                } else {
                    this.crtUniforms.distortion.value = this.settings.distortion;
                }
                this.crtUniforms.vignette.value = this.settings.vignette; 
                this.crtUniforms.chromaAmount.value = this.settings.chroma; 
                this.crtUniforms.vibranceAmount.value = this.settings.vibrance;   
            }
        }
    }

    updateLightMappingEffect() {
        // Remove any existing light mapping nodes
        this.scene.children.slice().forEach(child => {
            if (child.userData && child.userData.isLightMapping) {
                this.scene.remove(child);
            }
        });
        // If light mapping is enabled, add a new light probe based on the current panorama texture
        if (this.settings.lightMapping) {
            const panoramaSphere = this.scene.getObjectByName('panoramaSphere');
            if (panoramaSphere && panoramaSphere.material && panoramaSphere.material.map) {
                const texture = panoramaSphere.material.map;
                const lightProbeTexture = texture.clone();
                lightProbeTexture.repeat.x = -1;
                lightProbeTexture.offset.x = 1;
                lightProbeTexture.needsUpdate = true;
                const cubeImages = [
                    lightProbeTexture.image,
                    lightProbeTexture.image,
                    lightProbeTexture.image,
                    lightProbeTexture.image,
                    lightProbeTexture.image,
                    lightProbeTexture.image
                ];
                const cubeTexture = new THREE.CubeTexture(cubeImages);
                cubeTexture.needsUpdate = true;
                const lightProbe = new THREE.LightProbe();
                lightProbe.copy( LightProbeGenerator.fromCubeTexture(cubeTexture) );
                lightProbe.userData.isLightMapping = true;
                this.scene.add(lightProbe);
            }
        }
    }

    createControlPanel() {
        // Create control panel container
        const controlPanel = document.createElement('div');
        controlPanel.id = 'control-panel';
        document.body.appendChild(controlPanel);
        
        const languageSelect = document.createElement('select');
        languageSelect.id = 'language-select';
        const languages = [
            { "code": "en", "label": "English" },
            { "code": "zh", "label": "Chinese" },
            { "code": "hi", "label": "Hindi" },
            { "code": "es", "label": "Spanish" },
            { "code": "ar", "label": "Arabic" },
            { "code": "bn", "label": "Bengali" },
            { "code": "pt", "label": "Portuguese" },
            { "code": "ru", "label": "Russian" },
            { "code": "pa", "label": "Punjabi" },
            { "code": "de", "label": "German" },
            { "code": "ko", "label": "Korean" },
            { "code": "fr", "label": "French" },
            { "code": "uk", "label": "Ukrainian" },
            { "code": "de", "label": "Swedish" },
            {"code": "tur", "label": "Turkish"}
        ];
        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.code;
            option.textContent = lang.label;
            languageSelect.appendChild(option);
        });
        languageSelect.addEventListener('change', (e) => {
            this.language = e.target.value;
            this.regenerateLanguageContent();
        });
        controlPanel.appendChild(languageSelect);
        
        // Helper function to create control icons
        const createControlIcon = (svgPath, clickHandler) => {
            const icon = document.createElement('div');
            icon.className = 'control-icon';
            icon.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="${svgPath}" />
                </svg>
            `;
            icon.addEventListener('click', clickHandler);
            controlPanel.appendChild(icon);
            return icon;
        };
        
        // Create save/disk icon for screenshots
        createControlIcon(
            "M20,4H16.83L15,2H9L7.17,4H4C2.9,4 2,4.9 2,6V18C2,19.1 2.9,20 4,20H20C21.1,20 22,19.1 22,18V6C22,4.9 21.1,4 20,4M12,17C9.24,17 7,14.76 7,12C7,9.24 9.24,7 12,7C14.76,7 17,9.24 17,12C17,14.76 14.76,17 12,17M12,9C10.34,9 9,10.34 9,12C9,13.66 10.34,15 12,15C13.66,15 15,13.66 15,12C15,10.34 13.66,9 12,9Z",
            () => this.saveScreenshot()
        );

        // Create landscape icon for panorama-only screenshots
        createControlIcon(
            "M21,15H23V17H21V15M21,11H23V13H21V11M23,19H21V21C22,21 23,20 23,19M13,3H15V5H13V3M21,7H23V9H21V7M21,3V5H23C23,4 22,3 21,3M1,7H3V9H1V7M17,3H19V5H17V3M17,19H19V21H17V19M3,3C2,3 1,4 1,5H3V3M9,3H11V5H9V3M5,3H7V5H5V3M1,11V19C1,20.1 1.9,21 3,21H15V11H1Z",
            () => this.saveLandscapeImage()
        );
        
        // Create gear icon for settings
        createControlIcon(
            "M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,18.95 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z",
            () => this.openSettingsPanel()
        );
        
        // Create refresh icon
        createControlIcon(
            "M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z",
            () => this.refreshScene()
        );
    }

    openSettingsPanel() {
        if (!document.getElementById('settings-panel')) {
            const settingsPanel = document.createElement('div');
            settingsPanel.id = 'settings-panel';
            
            const panelContent = document.createElement('div');
            panelContent.className = 'settings-panel-content';
            
            const title = document.createElement('h2');
            title.textContent = 'Settings';
            panelContent.appendChild(title);
            
            const createSettingItem = (labelText, type, options) => {
                const item = document.createElement('div');
                item.className = 'setting-item';
                
                const label = document.createElement('label');
                label.textContent = labelText;
                
                const input = document.createElement('input');
                input.type = type;
                
                if (type === 'checkbox') {
                    input.checked = options.checked;
                    input.addEventListener('change', options.onChange);
                } else if (type === 'range') {
                    input.min = options.min;
                    input.max = options.max;
                    input.step = options.step;
                    input.value = options.value;
                    input.addEventListener('input', options.onChange);
                }
                
                item.appendChild(label);
                item.appendChild(input);
                
                if (options.id) {
                    input.id = options.id;
                }
                
                return item;
            };

            const createSettingsGroup = (title, items) => {
                const group = document.createElement('div');
                group.className = 'settings-group';
                
                const groupTitle = document.createElement('h3');
                groupTitle.textContent = title;
                group.appendChild(groupTitle);
                
                items.forEach(item => {
                    group.appendChild(item);
                });
                
                return group;
            };

            // Visual Settings Group
            const visualItems = [
                createSettingItem('Full Screen', 'checkbox', {
                    checked: this.settings.fullScreen,
                    id: 'fullscreen-toggle',
                    onChange: (e) => {
                        this.settings.fullScreen = e.target.checked;
                        this.toggleFullscreen();
                    }
                }),
                createSettingItem('CRT Effect', 'checkbox', {
                    checked: this.settings.crtEffect,
                    onChange: (e) => {
                        this.settings.crtEffect = e.target.checked;
                        this.updateCRTEffectSettings();
                    }
                }),
                createSettingItem('Scanline Intensity', 'range', {
                    min: '0',
                    max: '0.5',
                    step: '0.01',
                    value: this.settings.scanlineIntensity,
                    onChange: (e) => {
                        this.settings.scanlineIntensity = parseFloat(e.target.value);
                        this.updateCRTEffectSettings();
                    }
                }),
                createSettingItem('Noise Intensity', 'range', {
                    min: '0',
                    max: '0.3',
                    step: '0.01',
                    value: this.settings.noiseIntensity,
                    onChange: (e) => {
                        this.settings.noiseIntensity = parseFloat(e.target.value);
                        this.updateCRTEffectSettings();
                    }
                }),
                createSettingItem('Distortion', 'range', {
                    min: '0',
                    max: '3.0',
                    step: '0.005',
                    value: this.settings.distortion,
                    onChange: (e) => {
                        this.settings.distortion = parseFloat(e.target.value);
                        this.updateCRTEffectSettings();
                    }
                }),
                createSettingItem('Vignette', 'range', {
                    min: '0',
                    max: '10.0',
                    step: '0.1',
                    value: this.settings.vignette,
                    onChange: (e) => {
                        this.settings.vignette = parseFloat(e.target.value);
                        this.updateCRTEffectSettings();
                    }
                }),
                createSettingItem('Chroma', 'range', {
                    min: '0.003',
                    max: '0.1',
                    step: '0.001',
                    value: this.settings.chroma,
                    onChange: (e) => {
                        this.settings.chroma = parseFloat(e.target.value);
                        this.updateCRTEffectSettings();
                    }
                }),
                createSettingItem('Light Mapping', 'checkbox', {
                    checked: this.settings.lightMapping,
                    onChange: (e) => {
                        this.settings.lightMapping = e.target.checked;
                        this.updateLightMappingEffect();
                    }
                }),
                createSettingItem('Vibrance', 'range', {
                    min: '0',
                    max: '100.0',
                    step: '0.01',
                    value: this.settings.vibrance,
                    onChange: (e) => {
                        this.settings.vibrance = parseFloat(e.target.value);
                        this.updateCRTEffectSettings();
                    }
                })
            ];
            panelContent.appendChild(createSettingsGroup('Visual Effects', visualItems));
            
            // Flashlight Settings Group
            const flashlightItems = [
                createSettingItem('Flashlight Enabled', 'checkbox', {
                    checked: this.settings.flashlightOn,
                    onChange: (e) => {
                        this.settings.flashlightOn = e.target.checked;
                        if(this.flashlight) {
                            this.flashlight.visible = this.settings.flashlightOn;
                        }
                    }
                }),
                createSettingItem('Flashlight Intensity', 'range', {
                    min: '0',
                    max: '50',
                    step: '0.1',
                    value: this.settings.flashlightIntensity,
                    onChange: (e) => {
                        this.settings.flashlightIntensity = parseFloat(e.target.value);
                        if(this.flashlight) {
                            this.flashlight.intensity = this.settings.flashlightIntensity;
                        }
                    }
                }),
                createSettingItem('Flashlight Hue', 'range', {
                    min: '0',
                    max: '360',
                    step: '1',
                    value: this.settings.flashlightHue,
                    onChange: (e) => {
                        this.settings.flashlightHue = parseInt(e.target.value, 10);
                        this.settings.flashlightColor = new THREE.Color().setHSL(this.settings.flashlightHue / 360, 1, 0.5).getHex();
                        if(this.flashlight) {
                            this.flashlight.color.setHex(this.settings.flashlightColor);
                        }
                    }
                })
            ];
            panelContent.appendChild(createSettingsGroup('Flashlight Settings', flashlightItems));
            
            // Bubble Settings Group
            const bubbleItems = [
                createSettingItem('Bubble Size', 'range', {
                    min: '0.5',
                    max: '2.0',
                    step: '0.1',
                    value: this.settings.bubbleSize,
                    onChange: (e) => {
                        this.settings.bubbleSize = parseFloat(e.target.value);
                        this.updateBubbleSettings();
                    }
                }),
                createSettingItem('Bubble Font Size', 'range', {
                    min: '0.5',
                    max: '2.0',
                    step: '0.1',
                    value: this.settings.bubbleFontSize,
                    onChange: (e) => {
                        this.settings.bubbleFontSize = parseFloat(e.target.value);
                        this.refreshScene();
                    }
                })
            ];
            panelContent.appendChild(createSettingsGroup('Bubble Settings', bubbleItems));

            // Autoplay Settings Group
            const autoplayItems = [
                createSettingItem('Autoplay', 'checkbox', {
                    checked: this.settings.autoplay,
                    onChange: (e) => {
                        this.settings.autoplay = e.target.checked;
                    }
                }),
                createSettingItem('Autoplay Interval (sec)', 'range', {
                    min: '30',
                    max: '120',
                    step: '1',
                    value: this.settings.autoplayInterval,
                    onChange: (e) => {
                        this.settings.autoplayInterval = parseInt(e.target.value, 10);
                    }
                })
            ];
            panelContent.appendChild(createSettingsGroup('Autoplay Settings', autoplayItems));

            // Audio Settings Group
            const audioItems = [
                createSettingItem('Master Volume', 'range', { // Changed label
                    min: '0',
                    max: '1',
                    step: '0.01',
                    value: this.settings.masterVolume, // Keep using this setting name for now
                    onChange: (e) => {
                        this.settings.masterVolume = parseFloat(e.target.value);
                        if (this.masterGainNode) {
                            // Control the master gain node instead
                            this.masterGainNode.gain.setTargetAtTime(this.settings.masterVolume, this.audioContext.currentTime, 0.01);
                        }
                        // Update the old slider value for compatibility if needed
                        const oldSlider = document.querySelector('#audio-controls input[type="range"]');
                        if (oldSlider) oldSlider.value = this.settings.masterVolume;
                    }
                })
            ];
            panelContent.appendChild(createSettingsGroup('Audio Settings', audioItems));

             // --- Music Controls Group ---
            const musicGroup = document.createElement('div');
            musicGroup.className = 'settings-group';
            const musicTitle = document.createElement('h3');
            musicTitle.textContent = 'Music Player';
            musicGroup.appendChild(musicTitle);

            const musicControlsContainer = document.createElement('div');
            musicControlsContainer.className = 'music-controls';

            // Previous Button
            const prevButton = document.createElement('button');
            prevButton.className = 'music-button';
            prevButton.innerHTML = `<svg viewBox="0 0 24 24"><path d="M6,18V6H8V18H6M9.5,12L18,18V6L9.5,12Z" /></svg>`;
            prevButton.addEventListener('click', () => this.playlistManager?.previous());
            musicControlsContainer.appendChild(prevButton);

            // Play/Pause Button
            const playPauseButton = document.createElement('button');
            playPauseButton.id = 'music-play-pause'; // ID for updating icon
            playPauseButton.className = 'music-button';
            // Initial icon set by PlaylistManager.updateUI()
            playPauseButton.innerHTML = `<svg viewBox="0 0 24 24"><path d="M8,5.14V19.14L19,12.14L8,5.14Z" /></svg>`; // Play Icon default
            playPauseButton.addEventListener('click', () => this.playlistManager?.togglePlayPause());
            musicControlsContainer.appendChild(playPauseButton);
             if(this.playlistManager) this.playlistManager.updateUI(); // Set initial state


            // Next Button
            const nextButton = document.createElement('button');
            nextButton.className = 'music-button';
            nextButton.innerHTML = `<svg viewBox="0 0 24 24"><path d="M16,18H18V6H16M6,18L14.5,12L6,6V18Z" /></svg>`;
            nextButton.addEventListener('click', () => this.playlistManager?.next());
            musicControlsContainer.appendChild(nextButton);

            musicGroup.appendChild(musicControlsContainer);
            panelContent.appendChild(musicGroup);
            // --- End Music Controls Group ---


            // Ambient Light Settings Group
            const ambientLightItems = [
                createSettingItem('Ambient Light Intensity', 'range', {
                    min: '0',
                    max: '5',
                    step: '0.1',
                    value: this.settings.ambientLightIntensity,
                    onChange: (e) => {
                        this.settings.ambientLightIntensity = parseFloat(e.target.value);
                        this.scene.children.forEach(child => {
                            if (child instanceof THREE.AmbientLight) {
                                child.intensity = this.settings.ambientLightIntensity;
                            }
                        });
                    }
                }),
                createSettingItem('Ambient Light Hue', 'range', {
                    min: '0',
                    max: '360',
                    step: '1',
                    value: this.settings.ambientLightHue,
                    onChange: (e) => {
                        this.settings.ambientLightHue = parseInt(e.target.value, 10);
                        const color = new THREE.Color().setHSL(this.settings.ambientLightHue / 360, 0.5, 0.5);
                        this.settings.ambientLightColor = color.getHex();
                        this.scene.children.forEach(child => {
                            if (child instanceof THREE.AmbientLight) {
                                child.color.set(color);
                            }
                        });
                    }
                })
            ];
            panelContent.appendChild(createSettingsGroup('Ambient Light Settings', ambientLightItems));
            
            const createButton = (text, onClick) => {
                const button = document.createElement('button');
                button.textContent = text;
                button.addEventListener('click', onClick);
                return button;
            };
            
            const controls = document.createElement('div');
            controls.className = 'settings-controls';
            
            controls.appendChild(createButton('Restart Game', () => {
                if (confirm("Are you sure you want to restart the game?")) {
                    window.location.reload();
                }
            }));
            
            controls.appendChild(createButton('Close', () => this.closeSettingsPanel()));
            
            panelContent.appendChild(controls);
            
            settingsPanel.appendChild(panelContent);
            document.body.appendChild(settingsPanel);
        }
        
        const settingsPanel = document.getElementById('settings-panel');
        settingsPanel.classList.add('visible');
    }

    closeSettingsPanel() {
        const settingsPanel = document.getElementById('settings-panel');
        if (settingsPanel) {
            settingsPanel.classList.remove('visible');
        }
    }

    async refreshScene() {
        if (this.isNavigating) return;
        
        const eyeMask = document.getElementById('eye-mask');
        eyeMask.classList.add('eye-closed');
        
        this.scene.children.forEach(child => {
            if (child.userData && (child.userData.type === 'directionBubble' || child.userData.type === 'storyBubble')) {
                if (child.material && child.material.map) {
                    child.material.map.dispose();
                    child.material.dispose();
                }
                if (child.geometry) child.geometry.dispose();
                return false;
            }
            return true;
        });
        
        try {
            const panoramaPrompt = `${this.locationPrompt} ${this.currentLocation.description}. ${this.getStoryContext()}`;
            const result = await this.requestPanorama();
            this.panoramaUrl = result.url;
            this.createPanoramaSphere();
        } catch (error) {
            console.error('Error generating new panorama image:', error);
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (isMobile) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        
        setTimeout(() => {
            this.generateNavigationOptions();
            this.updateStoryBubble();
            this.generateCharacterThoughts();
            setTimeout(() => {
                eyeMask.classList.remove('eye-closed');
                this.startInitialScan();
            }, 300);
        }, 600);
    }

    setupEvents() {
        const canvas = this.renderer.domElement;
        
        canvas.addEventListener('pointerdown', this.onPointerDown.bind(this));
        document.addEventListener('pointermove', this.onPointerMove.bind(this));
        document.addEventListener('pointerup', this.onPointerUp.bind(this));
        document.addEventListener('wheel', this.onDocumentMouseWheel.bind(this));
        
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        
        canvas.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
        canvas.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        canvas.addEventListener('touchend', this.onTouchEnd.bind(this));
        
        canvas.addEventListener('click', this.onCanvasClick.bind(this));
        // NEW: Listen for global keydown events for custom bubble input
        document.addEventListener('keydown', this.onKeyDown.bind(this));

        // NEW: If the user taps the UI panel at the bottom, open the custom bubble editor.
        const uiOverlay = document.getElementById('ui-overlay');
        if (uiOverlay) {
            uiOverlay.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showCustomBubbleEditor();
            });
        }
        
        document.addEventListener('fullscreenchange', () => {
            // Update the internal settings.fullScreen based on whether an element is in fullscreen
            this.settings.fullScreen = !!document.fullscreenElement;
            // Update the fullscreen toggle checkbox if it exists
            const fsToggle = document.getElementById('fullscreen-toggle');
            if (fsToggle) {
                fsToggle.checked = this.settings.fullScreen;
            }
            // When in fullscreen mode, hide top UI elements, the Vibe Jam tab, and the Inspired By element;
            // Otherwise, restore their display.
            if (document.fullscreenElement) {
                const controlPanel = document.getElementById('control-panel');
                if (controlPanel) controlPanel.style.display = 'none';
                const audioControls = document.getElementById('audio-controls');
                if (audioControls) audioControls.style.display = 'none';
                const inspiredBy = document.getElementById('inspired-by');
                if (inspiredBy) inspiredBy.style.display = 'none';
                const vibeTab = document.querySelector('.vibe');
                if (vibeTab) vibeTab.style.display = 'none';
            } else {
                const controlPanel = document.getElementById('control-panel');
                if (controlPanel) controlPanel.style.display = '';
                const audioControls = document.getElementById('audio-controls');
                if (audioControls) audioControls.style.display = '';
                const inspiredBy = document.getElementById('inspired-by');
                if (inspiredBy) inspiredBy.style.display = '';
                const vibeTab = document.querySelector('.vibe');
                if (vibeTab) vibeTab.style.display = '';
            }
            // Update CRT effect settings after fullscreen change.
            this.updateCRTEffectSettings();
        });
    }

    onKeyDown(event) {
        // If an input is already focused, do not intercept
        if (document.activeElement.tagName.toLowerCase() === 'input') return;
        if (event.key === '`') {
            event.preventDefault();
            this.showCustomBubbleEditor();
        }
        if (event.key === 'f' || event.key === 'F') {
            event.preventDefault();
            this.toggleFlashlight();
        }
    }
    
    toggleFlashlight() {
        this.settings.flashlightOn = !this.settings.flashlightOn;
        if (this.flashlight) {
            this.flashlight.visible = this.settings.flashlightOn;
        }
    }

    showCustomBubbleEditor() {
        if (this.customBubbleEditor) return; // already active
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'custom-bubble-input';
        input.placeholder = '';
        input.value = '';
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const text = input.value.trim();
                if (text !== '') {
                    this.executeCustomBubbleCommand(text);
                }
                document.body.removeChild(input);
                this.customBubbleEditor = null;
            } else if (e.key === 'Escape') {
                document.body.removeChild(input);
                this.customBubbleEditor = null;
            }
        });
        document.body.appendChild(input);
        input.focus();
        this.customBubbleEditor = input;
    }
    
    async executeCustomBubbleCommand(text) {

        const eyeMask = document.getElementById('eye-mask');
        eyeMask.classList.add('eye-closed');

        // Save current location with custom command as the chosen direction
        this.locationHistory.push({
            location: { ...this.currentLocation },
            panoramaUrl: this.panoramaUrl,
            directionChosen: {
                text: text,
                description: "Player custom command",
                position: { x: 0, y: 0.2, z: 1 }  // dummy forward position
            }
        });

        try {
            // Generate a new location based on the player's custom command text
            const completion = await this.makeLLMRequest([
                {
                    role: "system",
                    content: this.newLocationPrompt
                },
                {
                    role: "user",
                    content: `Location: ${this.currentLocation.title}\n Location Description: ${this.currentLocation.description}\n${this.getStoryContext()}\nCustom Command: ${text}`
                }
            ], true);
            const result = JSON.parse(completion.content);
            this.currentLocation = {
                title: result.title,
                description: result.description
            };

            const imageResult = await  this.requestPanorama();
            
            this.panoramaUrl = imageResult.url;
            
            this.createPanoramaSphere();
            
            document.getElementById('location-title').textContent = this.currentLocation.title;
            
            await this.generateCharacterThoughts();
            this.generateNavigationOptions();
        } catch (error) {
            console.error('Error executing custom bubble command:', error);
        } finally {
            setTimeout(() => {
                eyeMask.classList.remove('eye-closed');
            }, 600);
        }
    }

    onCanvasClick(event) {
        const movementThreshold = 10; 
        const dx = event.clientX - this.onPointerDownPointerX;
        const dy = event.clientY - this.onPointerDownPointerY;
        if (Math.sqrt(dx * dx + dy * dy) > movementThreshold) {
            return;
        }
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        const intersects = raycaster.intersectObjects(this.scene.children);
        
        // Filter out intersections on bubbles where the clicked pixel is transparent
        const validIntersects = intersects.filter(intersection => {
            const obj = intersection.object;
            if (obj.userData && (obj.userData.type === 'storyBubble' || obj.userData.type === 'directionBubble')) {
                const uv = intersection.uv;
                if (!uv) return false;
                const map = obj.material.map;
                if (map && map.image instanceof HTMLCanvasElement) {
                    const canvas = map.image;
                    const ctx = canvas.getContext('2d');
                    const pixelX = Math.floor(uv.x * canvas.width);
                    // Note: In canvas, y=0 is at the top so flip the v coordinate.
                    const pixelY = Math.floor((1 - uv.y) * canvas.height);
                    let pixelData;
                    try {
                        pixelData = ctx.getImageData(pixelX, pixelY, 1, 1).data;
                    } catch (e) {
                        // On error reading data, assume opaque
                        return true;
                    }
                    // Consider the pixel transparent if its alpha is less than 128.
                    if (pixelData[3] < 128) return false;
                }
            }
            return true;
        });
        
        // Use validIntersects in place of intersects from here on.
        const hasEnlargedBubble = this.scene.children.some(child => 
            child.userData && child.userData.isEnlarged
        );
        
        if (hasEnlargedBubble) {
            this.scene.children.forEach(child => {
                if (child.userData && child.userData.isEnlarged) {
                    if (validIntersects.length > 0 && validIntersects[0].object === child) {
                        if (child.userData.type === 'storyBubble') {
                            this.openStoryPanel();
                            return;
                        } else if (child.userData.type === 'directionBubble') {
                            this.navigateToDirection(child.userData.index);
                            return;
                        }
                    } else {
                        this.restoreBubble(child);
                    }
                }
            });
            
            if (
                validIntersects.length === 0 || 
                !validIntersects[0].object.userData || 
                (validIntersects[0].object.userData.type !== 'storyBubble' &&
                 validIntersects[0].object.userData.type !== 'directionBubble')
            ) {
                return;
            }
        }
        
        if (validIntersects.length > 0) {
            const object = validIntersects[0].object;
            if (object.userData && (object.userData.type === 'storyBubble' || object.userData.type === 'directionBubble')) {
                const intersection = validIntersects[0];
                const uv = intersection.uv;
                const dx = (uv.x - 0.5) * 2; 
                const dy = (uv.y - 0.5) * 2; 
                const distFromCenter = Math.sqrt(dx * dx + dy * dy);
                if (distFromCenter <= 0.9) { 
                    this.enlargeBubble(object);
                }
            }
        }
    }

    enlargeBubble(bubble) {
        if (!bubble.userData.originalPosition) {
            bubble.userData.originalPosition = bubble.position.clone();
        }
        this.scene.children.forEach(child => {
            if (child !== bubble && child.userData && child.userData.isEnlarged) {
                this.restoreBubble(child);
            }
        });
        
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);
        const distance = 200; 
        const targetPosition = new THREE.Vector3().copy(this.camera.position).add(
            cameraDirection.multiplyScalar(distance)
        );
        
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const scaleFactor = isMobile ? 1.5 : 3;
        bubble.userData.enlargementFactor = scaleFactor;
        const targetScale = new THREE.Vector3(
            bubble.userData.baseScale * scaleFactor,
            bubble.userData.baseScale * scaleFactor,
            bubble.userData.baseScale * scaleFactor
        );
        
        this.scene.children.forEach(child => {
            if (child !== bubble && child.userData && child.userData.isEnlarged) {
                this.restoreBubble(child);
            }
        });
        
        this.animateBubble(bubble, targetPosition, targetScale, true);
    }

    restoreBubble(bubble) {
        if (bubble.userData.originalPosition && bubble.userData.baseScale) {
            delete bubble.userData.enlargementFactor;
            const targetScale = new THREE.Vector3(
                bubble.userData.baseScale,
                bubble.userData.baseScale,
                bubble.userData.baseScale
            );
            this.animateBubble(bubble, bubble.userData.originalPosition, targetScale, false);
        }
    }

    animateBubble(bubble, targetPosition, targetScale, setEnlarged) {
        const startPosition = bubble.position.clone();
        const startScale = bubble.scale.clone();
        const startQuaternion = bubble.quaternion.clone();
        const startTime = Date.now();
        const duration = 800; 
        
        let targetQuaternion;
        if (setEnlarged) {
            const dummy = new THREE.Object3D();
            dummy.position.copy(targetPosition);
            dummy.lookAt(this.camera.position);
            targetQuaternion = dummy.quaternion.clone();
        } else {
            targetQuaternion = bubble.userData.originalQuaternion ? bubble.userData.originalQuaternion.clone() : bubble.quaternion.clone();
        }

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = this.easeInOutCubic(progress);
          
            bubble.position.lerpVectors(startPosition, targetPosition, easedProgress);
            bubble.scale.lerpVectors(startScale, targetScale, progress);
            const q = new THREE.Quaternion().copy(startQuaternion).slerp(targetQuaternion, easedProgress);
            bubble.quaternion.copy(q);

            if (progress < 1) {
                bubble.userData.animationId = requestAnimationFrame(animate);
            } else {
                bubble.userData.isEnlarged = setEnlarged;
                bubble.userData.animationId = null;
            }
        };
        
        if (bubble.userData.animationId) {
            cancelAnimationFrame(bubble.userData.animationId);
        }
        
        if (setEnlarged) {
            bubble.userData.isEnlarged = true;
        }
        
        bubble.userData.animationId = requestAnimationFrame(animate);
    }

    async generateInitialPanorama() {
        const panoramaPrompt = `${this.locationPrompt} ${this.currentLocation.description}. ${this.getStoryContext()}`;
        try {
            const result = await this.requestPanorama();
            this.panoramaUrl = result.url;
            this.createPanoramaSphere();
            document.getElementById('location-title').textContent = this.currentLocation.title;
            this.generateAmbience(this.currentLocation.description);
            setTimeout(() => {
                const splashScreen = document.getElementById('splash-screen');
                splashScreen.style.opacity = '0';
                if (this.panoramaLoaded) {
                    const eyeMask = document.getElementById('eye-mask');
                    eyeMask.classList.remove('eye-closed');
                    this.startInitialScan();
                }
                setTimeout(() => {
                    splashScreen.style.display = 'none';
                    this.generateNavigationOptions();
                }, 1000);
            }, 500);
            this.animate();
        } catch (error) {
            console.error('Error generating panorama:', error);
            this.animate();
        }
    }
    
    async generateNavigationOptions() {
        if (this.isNavigating) return;
        this.isNavigating = true;

        this.scene.children = this.scene.children.filter(child => {
            if (child.userData && child.userData.type === 'directionBubble') {
                if (child.material && child.material.map) {
                    child.material.map.dispose();
                    child.material.dispose();
                }
                if (child.geometry) child.geometry.dispose();
                return false;
            }
            return true;
        });

        const existingBubbles = document.getElementById('direction-bubbles');
        if (existingBubbles) { existingBubbles.remove(); }

        try {
            // Get the previous 2 location names and direction choices
            const recentLocations = this.locationHistory.slice(-2).map(entry => ({
                location: entry.location.title,
                direction: entry.directionChosen ? entry.directionChosen.text : "Unknown"
            }));

            // Get the recent thoughts, limited to last 12
            const recentThoughts = this.thoughtHistory.slice(-12);

            // Prepare the prompt content
            const textContent = `Current Location: ${this.currentLocation.title}
                  Location Description: ${this.currentLocation.description}
                  Previous locations and choices: ${JSON.stringify(recentLocations)}
                  Recent character thoughts: ${JSON.stringify(recentThoughts)}
                  ${this.getStoryContext()}
                  `;

            let messages = [
                {
                    role: "system",
                    content: this.suggestionPrompt
                },
                {
                    role: "user",
                    content: [] // Initialize content as an array
                }
            ];

            // Add text part first
            messages[1].content.push({ type: "text", text: textContent });

            // Attempt to get image data URL
            let imageDataUrl = null;
            try {
                if (this.panoramaUrl) {
                    imageDataUrl = await this.convertImageToDataURL(this.panoramaUrl);
                }
            } catch (imgError) {
                console.error("Error converting panorama to data URL for suggestions:", imgError);
            }

            // Add image part if available
            if (imageDataUrl) {
                messages[1].content.push({ type: "image_url", image_url: { url: imageDataUrl } });
            } else {
                 // Add a note if image is missing
                 messages[1].content.push({ type: "text", text: "\n(Image not available for analysis)" });
            }

            // Make the LLM request
            const completion = await this.makeLLMRequest(messages, true);

            let directionsResult;
            try {
                directionsResult = JSON.parse(completion.content);
            } catch (parseError) {
                console.error("Error parsing suggestions response:", parseError, completion.content);
                throw new Error("Failed to parse suggestions from LLM.");
            }

            let directions = directionsResult.directions;

            if (!directions || directions.length < 1) {
                console.warn("LLM returned no valid directions, using defaults.");
                const defaultDirections = ['Explore the north', 'Explore the east', 'Explore the south', 'Explore the west'];
                directions = []; // Ensure directions is an array
                for (let i = directions.length; i < 6; i++) {
                    directions.push({
                        text: defaultDirections[i % defaultDirections.length],
                        description: "Discover what lies in this direction.",
                        position: {
                            x: Math.sin((i / 6) * Math.PI * 2) * 0.8, // Spread out defaults a bit
                            y: 0.2,
                            z: Math.cos((i / 6) * Math.PI * 2) * 0.8
                        }
                    });
                }
            }

            this.directions = directions;
            if (this.locationHistory.length > 0) {
                this.directions.push({
                    text: "Return the way you came",
                    description: `Return to ${this.locationHistory[this.locationHistory.length - 1].location.title}`,
                    isBackOption: true,
                    position: {
                        x: 0,
                        y: -0.7, // Move back button lower
                        z: -0.7
                    }
                });
            }

    
            this.displayDirections3D();

        } catch (error) {
            console.error('Error generating navigation options:', error);
            // Fallback to default directions on error
            console.log("Falling back to default navigation options.");
            const defaultDirections = ['Look around', 'Move forward', 'Investigate nearby', 'Consider options'];
            this.directions = defaultDirections.map((text, i) => ({
                text: text,
                description: "Explore the surroundings.",
                position: {
                    x: Math.sin((i / defaultDirections.length) * Math.PI * 1.5 - Math.PI * 0.75), // Arrange in a semi-circle
                    y: 0.1,
                    z: Math.cos((i / defaultDirections.length) * Math.PI * 1.5 - Math.PI * 0.75)
                }
            }));
             if (this.locationHistory.length > 0) {
                this.directions.push({
                    text: "Return the way you came",
                    description: `Return to ${this.locationHistory[this.locationHistory.length - 1].location.title}`,
                    isBackOption: true,
                    position: { x: 0, y: -0.7, z: -0.7 }
                });
            }
            this.displayDirections3D(); // Display the fallback directions
        } finally {
            this.isNavigating = false; // Ensure this is always reset
        }
    }

    displayDirections3D() {
        this.directions.forEach((direction, index) => {
            const texture = this.createBubbleTexture(direction.text, 'directionBubble');
            
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const bubbleWidth = isMobile ? 150 : 50;
            const bubbleHeight = isMobile ? 120 : 40;
            const geometry = new THREE.PlaneGeometry(bubbleWidth, bubbleHeight);
            const material = new THREE.MeshPhongMaterial({ 
                map: texture,
                transparent: true,
                alphaTest: 0.1,
                side: THREE.DoubleSide,
                opacity: 0
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            
            const pos = direction.position;
            
            const distance = isMobile ? 450 : 350; 
            const phi = Math.acos(pos.y); 
            const theta = Math.atan2(pos.x, pos.z); 
            
            const maxAngle = Math.PI * 0.75; 
            const adjustedTheta = Math.max(-maxAngle, Math.min(maxAngle, theta));
            const adjustedPhi = Math.max(Math.PI * 0.25, Math.min(Math.PI * 0.75, phi)); 
            
            const x = distance * Math.sin(adjustedPhi) * Math.cos(adjustedTheta);
            const y = distance * Math.cos(adjustedPhi);
            const z = distance * Math.sin(adjustedPhi) * Math.sin(adjustedTheta);

            let finalPosition = this.checkBubbleOverlap({ x, y, z }, index);
            mesh.position.set(finalPosition.x, finalPosition.y, finalPosition.z);
            
            mesh.lookAt(0, 0, 0);
            
            mesh.scale.set(this.settings.bubbleSize, this.settings.bubbleSize, this.settings.bubbleSize);
            
            mesh.userData = { 
                type: 'directionBubble', 
                index: index,
                creationTime: Date.now(), 
                originalY: finalPosition.y, 
                originalX: finalPosition.x, 
                direction: direction,
                baseScale: this.settings.bubbleSize,  // used for consistent bubble sizing
                originalQuaternion: mesh.quaternion.clone()
            };
            
            mesh.name = `directionBubble-${index}`;
            
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            
            this.scene.add(mesh);
            
            this.animateDirectionBubble(mesh, material, index);
        });
        
        this.isNavigating = false; 
        // --- New: If autoplay is enabled, schedule automatic bubble selection ---
        if (this.settings.autoplay) {
            setTimeout(() => {
                this.autoPickAndNavigate();
            }, this.settings.autoplayInterval * 1000);
        }
    }
    
    checkBubbleOverlap(position, currentIndex) {
        const minDistance = 80; 
        let adjustedPosition = { ...position };
        let needsAdjustment = false;
        
        this.scene.children.forEach(child => {
            if (child.userData && child.userData.type === 'directionBubble' && 
                child.userData.index < currentIndex) { 
                
                const otherPos = child.position;
                const distance = Math.sqrt(
                    Math.pow(position.x - otherPos.x, 2) + 
                    Math.pow(position.y - otherPos.y, 2) + 
                    Math.pow(position.z - otherPos.z, 2)
                );
                
                if (distance < minDistance) {
                    needsAdjustment = true;
                    
                    const dirVector = {
                        x: position.x - otherPos.x,
                        y: position.y - otherPos.y,
                        z: position.z - otherPos.z
                    };
                    
                    const dirLength = Math.sqrt(dirVector.x * dirVector.x + dirVector.y * dirVector.y + dirVector.z * dirVector.z);
                    const normalizedDir = {
                        x: dirVector.x / dirLength,
                        y: dirVector.y / dirLength,
                        z: dirVector.z / dirLength
                    };
                    
                    const moveDistance = minDistance - distance;
                    adjustedPosition.x += normalizedDir.x * moveDistance;
                    adjustedPosition.y += normalizedDir.y * moveDistance;
                    adjustedPosition.z += normalizedDir.z * moveDistance;
                }
            }
        });
        
        if (needsAdjustment) {
            const distanceFromCenter = Math.sqrt(
                adjustedPosition.x * adjustedPosition.x + 
                adjustedPosition.y * adjustedPosition.y + 
                adjustedPosition.z * adjustedPosition.z
            );
            
            const targetDistance = 350; 
            const scale = targetDistance / distanceFromCenter;
            
            adjustedPosition.x *= scale;
            adjustedPosition.y *= scale;
            adjustedPosition.z *= scale;
        }
        
        return adjustedPosition;
    }
    
    animateDirectionBubble(mesh, material, index) {
        setTimeout(() => {
            const fadeInDuration = 1000; 
            const startTime = Date.now();
            
            const fadeIn = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / fadeInDuration, 1);
                
                material.opacity = this.easeInOutCubic(progress);
                
                if (progress < 1) {
                    requestAnimationFrame(fadeIn);
                }
            };
            
            fadeIn();
            
            mesh.userData.floatPhase = index * 0.7; 
        }, 300 * index);
    }
    
    createBubbleTexture(text, type) {
        const canvas = document.createElement('canvas');
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        canvas.width = isMobile ? 768 : 256;  
        canvas.height = isMobile ? 768 : 256; 
        const context = canvas.getContext('2d');
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        if (typeof text === 'string') {
            text = text.trim().replace(/^(\n|<br\s*\/?>)+/i, '');
        } else {
            text = type === 'storyBubble' ? 'Tell a story' : 'Explore';
        }
        
        const centerX = isMobile ? 384 : 128;
        const centerY = isMobile ? 360 : 120;
        
        context.fillStyle = 'white';
        context.beginPath();
        
        const minWidth = isMobile ? 300 : 140;
        const maxWidth = isMobile ? 600 : 200;
        const padding = isMobile ? 180 : 60;
        
        let bubbleWidthRadius, bubbleHeightRadius;
        
        const baseFontSize = isMobile ? (type === 'storyBubble' ? 64 : 64) : 28;
        const fontSize = baseFontSize * this.settings.bubbleFontSize;
        context.font = `bold ${fontSize}px VT323, monospace`;
        
        const words = text.split(/\s+/).filter(Boolean);
        let lines = [];
        if (words.length === 0) {
            lines.push("");
        } else {
            let currentLine = words[0];
            const threshold = 10;  // (retain the original threshold value)
            for (let i = 1; i < words.length; i++) {
                const testLine = currentLine + ' ' + words[i];
                if (testLine.length > threshold) {
                    lines.push(currentLine);
                    currentLine = words[i];
                } else {
                    currentLine = testLine;
                }
            }
            lines.push(currentLine);
        }
        
        const lineHeight = isMobile ? 90 : 30;
        const totalTextHeight = lineHeight * lines.length;
        
        bubbleWidthRadius = Math.min(maxWidth, Math.max(minWidth, Math.max(...lines.map(line => context.measureText(line).width)) + padding)) / 2.0;
        bubbleHeightRadius = Math.min(maxWidth, Math.max(minWidth, totalTextHeight + (isMobile ? 90 : 30))) / 2;
        
        context.ellipse(centerX, centerY, bubbleWidthRadius, bubbleHeightRadius * 0.8, 0, 0, Math.PI * 2);
        context.fill();
        
        const bubble1Radius = isMobile ? 45 : 15;
        const bubble2Radius = isMobile ? 30 : 10;
        const bubble3Radius = isMobile ? 15 : 5;
        const bubbleOffset1 = isMobile ? 30 : 10;
        const bubbleOffset2 = isMobile ? 105 : 35;
        const bubbleOffset3 = isMobile ? 165 : 55;
        
        context.beginPath();
        context.arc(centerX, centerY + bubbleHeightRadius + bubbleOffset1, bubble1Radius, 0, Math.PI * 2);
        context.fill();
        
        context.beginPath();
        context.arc(centerX - 8 * (isMobile ? 3 : 1), centerY + bubbleHeightRadius + bubbleOffset2, bubble2Radius, 0, Math.PI * 2);
        context.fill();
        
        context.beginPath();
        context.arc(centerX - 18 * (isMobile ? 3 : 1), centerY + bubbleHeightRadius + bubbleOffset3, bubble3Radius, 0, Math.PI * 2);
        context.fill();
        
        context.fillStyle = '#222';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        const startY = centerY - (totalTextHeight / 2) + (lineHeight / 2);
        
        lines.forEach((lineText, index) => {
            context.fillText(lineText, centerX, startY + (index * lineHeight));
        });
        
        return new THREE.CanvasTexture(canvas);
    }

    updateStoryBubble() {
        this.scene.children = this.scene.children.filter(child => {
            if (child.name === 'storyBubble' || (child.userData && child.userData.type === 'storyBubble')) {
                if (child.material && child.material.map) {
                    child.material.map.dispose();
                    child.material.dispose();
                }
                if (child.geometry) child.geometry.dispose();
                return false;
            }
            return true;
        });
        
        // Do not show the "Tell a story" bubble after a custom story has started.
        if (this.customStory) return;
        
        if (this.currentLocation.title === this.startingLocation.title) {
            
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const bubbleWidth = isMobile ? 150 : 50;
            const bubbleHeight = isMobile ? 120 : 40;
            const geometry = new THREE.PlaneGeometry(bubbleWidth, bubbleHeight);
            const texture = this.createBubbleTexture('Tell a story', 'storyBubble');
            
            const material = new THREE.MeshPhongMaterial({ 
                map: texture,
                transparent: true,
                alphaTest: 0.1,
                side: THREE.DoubleSide,
                opacity: 0
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            
            const phi = THREE.MathUtils.degToRad(105 - this.latitude);
            const theta = THREE.MathUtils.degToRad(this.longitude);
            const distance = isMobile ? 450 : 350; 
            
            const x = distance * Math.sin(phi) * Math.cos(theta);
            const y = distance * Math.cos(phi);
            const z = distance * Math.sin(phi) * Math.sin(theta);

            mesh.position.set(x, y, z);
            mesh.name = 'storyBubble';
            
            mesh.scale.set(this.settings.bubbleSize, this.settings.bubbleSize, this.settings.bubbleSize);
            
            mesh.userData = { 
                type: 'storyBubble',
                creationTime: Date.now(), 
                originalY: y, 
                originalX: x, 
                baseScale: this.settings.bubbleSize,
                originalQuaternion: mesh.quaternion.clone()
            };
            
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            
            this.scene.add(mesh);
            
            this.animateDirectionBubble(mesh, material, 0);
        }
    }

    navigateToDirection(index) {
        if (this.isNavigating) return;
        this.isNavigating = true;
        const selectedDirection = this.directions[index];
        const eyeMask = document.getElementById('eye-mask');
        eyeMask.classList.add('eye-closed');
        
        this.scene.children = this.scene.children.filter(child => {
            if (child.userData && (child.userData.type === 'directionBubble' || child.userData.type === 'storyBubble')) {
                if (child.material && child.material.map) {
                    child.material.map.dispose();
                    child.material.dispose();
                }
                if (child.geometry) child.geometry.dispose();
                return false;
            }
            return true;
        });
        
        const bubblesContainer = document.getElementById('direction-bubbles');
        if (bubblesContainer) { bubblesContainer.remove(); }
        setTimeout(async () => {
            if (selectedDirection.isBackOption) {
                if (this.locationHistory.length > 0) {
                    // Show location history panel instead of automatically returning
                    this.openLocationHistoryPanel();
                }
            } else {
                this.locationHistory.push({
                    location: { ...this.currentLocation },
                    panoramaUrl: this.panoramaUrl,
                    directionChosen: selectedDirection
                });
                await this.generateNewLocation(selectedDirection);
                this.generateAmbience(this.currentLocation.description);
                this.resetCameraPosition();
                
                setTimeout(() => {
                    const splashScreen = document.getElementById('splash-screen');
                    splashScreen.style.opacity = '0';
                    if (this.panoramaLoaded) {
                        const eyeMask = document.getElementById('eye-mask');
                        eyeMask.classList.remove('eye-closed');
                        this.startInitialScan();
                    }
                    setTimeout(() => {
                        splashScreen.style.display = 'none';
                        this.isNavigating = false;
                        this.updateStoryBubble();
                        this.generateNavigationOptions();
                    }, 1000);
                }, 600);
            }
        }, 600);
    }

    async generateNewLocation(selectedDirection) {
        
        try {
            const completion = await this.makeLLMRequest([
                {
                    role: "system",
                    content: this.newLocationPrompt
                },
                {
                    role: "user",
                    content: `Current location: ${this.currentLocation.title}
Player chose to: ${selectedDirection.text}
Additional context about this action: ${selectedDirection.description}
Previous locations (from most recent to oldest):
${this.getPreviousLocations(12)}
StoryContext: ${this.getStoryContext()}.`
                }
            ], true);
            
            const result = JSON.parse(completion.content);
            this.currentLocation = {
                title: result.title,
                description: result.description
            };
                      
            const imageResult = await this.requestPanorama();
            
            this.panoramaUrl = imageResult.url;
            
            this.createPanoramaSphere();
            
            document.getElementById('location-title').textContent = this.currentLocation.title;
            
            this.generateCharacterThoughts();
            
            this.updateStoryBubble();

        } catch (error) {
            console.error('Error generating new location:', error);
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (isMobile) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            this.currentLocation = {
                title: "Mysterious Area",
                description: "You've arrived at a mysterious area. The details are hard to make out, but you sense there's more to explore around you."
            };
            
            document.getElementById('location-title').textContent = this.currentLocation.title;
            
            this.isNavigating = false; 
        }
    }
    
    getPreviousLocations(count) {
        if (this.locationHistory.length === 0) {
            return "No previous locations.";
        }
        
        const locations = this.locationHistory.slice(-count).reverse();
        
        let locationText = "";
        locations.forEach((entry, index) => {
            locationText += `Location ${index + 1}: ${entry.location.title} - ${entry.location.description}\n`;
            if (entry.directionChosen) {
                locationText += `    Direction chosen: ${entry.directionChosen.text} - ${entry.directionChosen.description}\n`;
            }
        });
        
        return locationText;
    }

    createPanoramaSphere() {
        this.panoramaLoaded = false;
        
        const eyeMask = document.getElementById('eye-mask');
        eyeMask.classList.add('eye-closed');
        
        this.scene.children.forEach(child => {
            if (child.name === 'panoramaSphere') {
                this.scene.remove(child);
                if (child.material && child.material.map) {
                    child.material.map.dispose();
                    child.material.dispose();
                }
                child.geometry.dispose();
            }
        });

        const geometry = new THREE.SphereGeometry(500,32,32, 0,  Math.PI*2, 0, Math.PI);
        geometry.scale(-2.0, 1, 1.314); 
        geometry.rotateY(Math.PI); 
        geometry.computeVertexNormals();

        const textureLoader = new THREE.TextureLoader();
        textureLoader.setCrossOrigin('anonymous');
        
        const textureUrl = this.panoramaUrl + (this.panoramaUrl.includes('?') ? '&' : '?') + 'cache=' + Date.now();
        
        textureLoader.load(textureUrl, (texture) => {
            texture.minFilter = THREE.NearestFilter;
            texture.magFilter = THREE.NearestFilter;
            texture.generateMipmaps = false;
            const material = new THREE.MeshPhongMaterial({
                map: texture,
                side: THREE.DoubleSide,
                // Adding a slight emissive term to avoid complete darkness in shadows
                emissive: new THREE.Color(0x111111)
            });
            // Ensure that lighting (and shadows) affect both sides of the panorama
            material.shadowSide = THREE.DoubleSide;
            const mesh = new THREE.Mesh(geometry, material);
            mesh.name = 'panoramaSphere';
            mesh.receiveShadow = true;  

            this.scene.add(mesh);
            
            if (this.settings.lightMapping) {
                this.updateLightMappingEffect();
            }
            
            this.panoramaLoaded = true;
            eyeMask.classList.remove('eye-closed');
            
            //this.createSignpost();
            this.startInitialScan();
        }, 
        undefined, 
        (error) => {
            console.error('Error loading panorama texture:', error);
        });
    }
    
    createSignpost() {
        // Remove previous signpost if it exists.
        const oldSign = this.scene.getObjectByName("locationSignpost");
        if (oldSign) {
            this.scene.remove(oldSign);
        }
        
        // Create a canvas to draw the signpost texture.
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext("2d");
        
        // Helper to draw a rounded rectangle.
        function roundRect(ctx, x, y, width, height, radius) {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            ctx.fill();
        }
        
        // Draw sign background using a wood-tone gradient.
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "#a0522d");  // sienna
        gradient.addColorStop(1, "#8b4513");  // saddle brown
        ctx.fillStyle = gradient;
        roundRect(ctx, 0, 0, canvas.width, canvas.height, 20);
        
        // Draw a white border.
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 4;
        ctx.stroke();
        
        // Write the location name (current location title) in the center.
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 24px VT323, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const text = this.currentLocation.title || "Unknown Location";
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        
        // Create texture and mesh for the signpost.
        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        
        const signGeometry = new THREE.PlaneGeometry(20, 10);
        const signMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
        const signpost = new THREE.Mesh(signGeometry, signMaterial);
        signpost.name = "locationSignpost";
        
        // Position the signpost in the scene (e.g. to the left at a distance).
        const distance = 100;
        const angle = 90 * (Math.PI / 180);  // -30 degrees
        const x = distance * Math.sin(angle);
        const z = distance * Math.cos(angle);
        const y = -30;  // adjust vertical position as desired
        signpost.position.set(x, y, -z);
        signpost.lookAt(0, 0, 0);
        
        this.scene.add(signpost);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        if (this.crtUniforms) {
            this.crtUniforms.resolution.value.set(window.innerWidth, window.innerHeight);
            this.crtUniforms.scanlineCount.value = window.innerHeight / 3;
        }
        
        if (this.renderTarget) {
            this.renderTarget.setSize(window.innerWidth, window.innerHeight);
        }
    }

    onPointerDown(event) {
        if (event.isPrimary === false) return;
        
        if (this.isInitialScan) {
            this.isInitialScan = false;
        }
        
        this.isUserInteracting = true;
        this.onPointerDownPointerX = event.clientX;
        this.onPointerDownPointerY = event.clientY;
        this.onPointerDownLongitude = this.longitude;
        this.onPointerDownLatitude = this.latitude;
        
        this.lastInteractionTime = Date.now();
        this.isWandering = false;
    }

    onPointerMove(event) {
        if (event.isPrimary === false) return;
        if (!this.isUserInteracting) return;

        const sensitivity = event.pointerType === 'touch' ? 0.5 : 0.2;
        const newLongitude = (this.onPointerDownPointerX - event.clientX) * sensitivity + this.onPointerDownLongitude;
        
        this.longitude = Math.max(-90, Math.min(90, newLongitude));
        
        this.latitude = (event.clientY - this.onPointerDownPointerY) * sensitivity + this.onPointerDownLatitude;
        
        this.latitude = Math.max(-45, Math.min(45, this.latitude));
    }

    onMouseMove(event) {
        this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouseY = -((event.clientY / window.innerHeight) * 2 - 1);
    }

    onPointerUp() {
        this.isUserInteracting = false;
        this.lastInteractionTime = Date.now();
    }

    onDocumentMouseWheel(event) {
        if (this.isInitialScan) {
            this.isInitialScan = false;
        }
        
        const fov = this.camera.fov + event.deltaY * 0.05;
        this.camera.fov = Math.max(20, Math.min(75, fov));
        this.camera.updateProjectionMatrix();
        
        this.lastInteractionTime = Date.now();
        this.isWandering = false;
    }
    
    onTouchStart(e) {
        e.preventDefault();
        if (e.touches && e.touches.length > 0) {
            const touch = e.touches[0];
            // Create a synthetic pointer event object and delegate to onPointerDown
            this.onPointerDown({
                clientX: touch.clientX,
                clientY: touch.clientY,
                isPrimary: true,
                pointerType: 'touch'
            });
        }
    }

    onTouchMove(e) {
        e.preventDefault();
        if (e.touches && e.touches.length > 0) {
            const touch = e.touches[0];
            // Delegate the touch move to the pointer move handler
            this.onPointerMove({
                clientX: touch.clientX,
                clientY: touch.clientY,
                isPrimary: true,
                pointerType: 'touch'
            });
        }
    }

    onTouchEnd(e) {
        e.preventDefault();
        // End the touch interaction by calling the pointer up handler
        this.onPointerUp();
        
        // If this was a tap without much movement, treat it like a click
        if (e.changedTouches && e.changedTouches.length > 0) {
            const touch = e.changedTouches[0];
            const dx = touch.clientX - this.onPointerDownPointerX;
            const dy = touch.clientY - this.onPointerDownPointerY;
            if (Math.sqrt(dx * dx + dy * dy) < 10) {
                // Create a synthetic click event
                this.onCanvasClick({
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
            }
        }
    }
    
    scheduleBlink() {
        clearTimeout(this.blinkTimer);
        
        const nextBlinkTime = 8000 + Math.random() * 15000;
        
        this.blinkTimer = setTimeout(() => {
            this.blink();
        }, nextBlinkTime);
    }
    
    blink() {
        if (this.isBlinking) return;
        this.isBlinking = true;
        
        const eyeMask = document.getElementById('eye-mask');
        
        eyeMask.classList.add('eye-closed');
        
        setTimeout(() => {
            eyeMask.classList.remove('eye-closed');
            this.isBlinking = false;
            
            this.scheduleBlink();
            
            if (Math.random() < 0.1) {
                setTimeout(() => {
                    this.blink();
                }, 150 + Math.random() * 100);
            }
        }, 120 + Math.random() * 60);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.update();
    }

    update() {
        const currentTime = Date.now();
        this.idleTime = (currentTime - this.lastInteractionTime) / 1000; 
        
        if (!this.isUserInteracting) {
            if (this.isInitialScan) {
                this.executeInitialScan();
            } else {
                this.applyBreathingMotion();
                
                if (this.idleTime > 10 && !this.isWandering && !this.isInitialScan) {
                    this.startWandering();
                }
                
                if (this.isWandering && !this.isInitialScan) {
                    this.applyWanderingMotion();
                }
            }
        }

        this.latitude = Math.max(-35, Math.min(35, this.latitude));
        this.phi = THREE.MathUtils.degToRad(90 - this.latitude);
        this.theta = THREE.MathUtils.degToRad(this.longitude);
        const x = 500 * Math.sin(this.phi) * Math.cos(this.theta);
        const y = 500 * Math.cos(this.phi);
        const z = 500 * Math.sin(this.phi) * Math.sin(this.theta);

        this.camera.lookAt(x, y, z);
        
        this.scene.children.forEach(child => {
            if (child.userData && (child.userData.type === 'storyBubble' || child.userData.type === 'directionBubble')) {
                if (!child.userData.isEnlarged) {
                    child.lookAt(this.camera.position);
                }
                
                if (child.userData.originalY !== undefined && !child.userData.isEnlarged) {
                    const time = (Date.now() - child.userData.creationTime) / 1000;
                    const phase = child.userData.floatPhase || 0;
                    const floatOffsetY = Math.sin((time + phase) * 0.5) * 5; 
                    const floatOffsetX = Math.sin((time - phase) * 0.7) * 3; 
                    child.position.y = child.userData.originalY + floatOffsetY;
                    child.position.x = child.userData.originalX + floatOffsetX;
                }
            }
        });
        
        if (this.crtUniforms) {
            this.crtUniforms.time.value += 0.016; 
        }
        
        if (this.flashlight) {
            this.flashlight.position.copy(this.camera.position);
            // Use mouse raycast for flashlight target
            this.raycaster.setFromCamera(new THREE.Vector2(this.mouseX, this.mouseY), this.camera);
            const panoramaSphere = this.scene.getObjectByName('panoramaSphere');
            let intersectionPoint = null;
            if (panoramaSphere) {
                const intersects = this.raycaster.intersectObject(panoramaSphere, true);
                if (intersects.length > 0) {
                    intersectionPoint = intersects[0].point;
                }
            }
            if (!intersectionPoint) {
                intersectionPoint = this.raycaster.ray.origin.clone().add(
                    this.raycaster.ray.direction.clone().multiplyScalar(1000)
                );
            }
            this.flashlight.target.position.copy(intersectionPoint);
            this.flashlight.target.updateMatrixWorld();
        }
        
        this.renderer.setRenderTarget(this.renderTarget);
        this.renderer.render(this.scene, this.camera);
        
        this.crtUniforms.tDiffuse.value = this.renderTarget.texture;
        
        this.renderer.setRenderTarget(null);
        this.renderer.render(this.effectScene, this.effectCamera);
    }
    
    applyBreathingMotion() {
        this.breathingPhase += 0.005;
        
        const breathingAmplitude = 0.4; 
        const breathingOffset = Math.sin(this.breathingPhase) * breathingAmplitude;
        
        const swayAmplitude = 0.3; 
        const swayOffset = Math.sin(this.breathingPhase * 0.6) * swayAmplitude;
        
        if (!this.isWandering) {
            this.latitude += breathingOffset * 0.01;
            this.longitude += swayOffset * 0.01;
        }
    }
    
    startWandering() {
        this.isWandering = true;
        this.wanderPhase = 0;
        
        const currentLongitude = this.longitude;
        const currentLatitude = this.latitude;
        
        this.onPointerDownLongitude = currentLongitude;
        this.onPointerDownLatitude = currentLatitude;
        
        const followMouse = Math.random() < 0.7; 
        
        if (followMouse && (Math.abs(this.mouseX) > 0.1 || Math.abs(this.mouseY) > 0.1)) {
            this.wanderTargetLongitude = this.mouseX * 90;
            
            this.wanderTargetLatitude = this.mouseY * 45;
            
            this.wanderTargetLongitude += (Math.random() * 30 - 15);
            this.wanderTargetLatitude += (Math.random() * 20 - 10);
        } else {
            if (Math.random() < 0.25) {
                this.wanderTargetLongitude = -90 + Math.random() * 45;
            } else if (Math.random() < 0.5) {
                this.wanderTargetLongitude = -45 + Math.random() * 45;
            } else if (Math.random() < 0.75) {
                this.wanderTargetLongitude = Math.random() * 45;
            } else {
                this.wanderTargetLongitude = 45 + Math.random() * 45;
            }
            
            this.wanderTargetLatitude = this.onPointerDownLatitude + (Math.random() * 50 - 25);
        }
        
        this.wanderTargetLongitude = Math.max(-90, Math.min(90, this.wanderTargetLongitude));
        this.wanderTargetLatitude = Math.max(-45, Math.min(45, this.wanderTargetLatitude));
    }
    
    applyWanderingMotion() {
        this.wanderPhase += 0.002;
        
        if (this.wanderPhase >= 1.0) {
            this.isWandering = false;
            this.lastInteractionTime = Date.now(); 
            
            setTimeout(() => {
                if (this.idleTime > 3) { 
                    this.startWandering();
                }
            }, 3000 + Math.random() * 10000); 
            
            return;
        }
        
        const eased = this.easeInOutCubic(this.wanderPhase);
        
        this.longitude = this.onPointerDownLongitude + 
            (this.wanderTargetLongitude - this.onPointerDownLongitude) * eased;
        
        this.latitude = this.onPointerDownLatitude + 
            (this.wanderTargetLatitude - this.onPointerDownLatitude) * eased;
    }
    
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Master Gain Node - controls overall volume
            this.masterGainNode = this.audioContext.createGain();
            this.masterGainNode.gain.value = this.settings.masterVolume || 0.75;
            this.masterGainNode.connect(this.audioContext.destination);

            // Ambient Sound Gain Node - connect this to the master gain
            this.ambientGainNode = this.audioContext.createGain();
            this.ambientGainNode.gain.value = 0.07; // Ambient volume relative to master
            this.ambientGainNode.connect(this.masterGainNode);

            // Playlist Manager Initialization
            const audioElement = document.getElementById('background-music');
            if (!audioElement) {
                console.error("Audio element #background-music not found!");
                return; // Stop if audio element is missing
            }
            this.playlistManager = new PlaylistManager(audioElement, this.masterGainNode, playlistFiles);
            this.playlistManager.init(); // Initialize playlist (shuffle, set up events)


            // Keep the creation of audio controls but make them hidden via CSS
            this.createAudioControls(); // This needs to update the master gain now

            // Add event listener to resume audio context on user interaction
            document.addEventListener('click', () => {
                if (this.audioContext && this.audioContext.state === 'suspended') {
                    this.audioContext.resume().then(() => {
                        console.log("AudioContext resumed successfully.");
                        // Try playing music again if it wasn't playing due to suspension
                        if(this.playlistManager && !this.playlistManager.isPlaying && playlistFiles.length > 0) {
                            // Optional: Automatically play on first interaction if desired
                            // this.playlistManager.play();
                        }
                    }).catch(e => console.error("Error resuming AudioContext:", e));
                }
            }, { once: true });

        } catch (error) {
            console.error('Web Audio API is not supported in this browser:', error);
        }
    }

    createAudioControls() {
        const audioControls = document.createElement('div');
        audioControls.id = 'audio-controls';
        document.body.appendChild(audioControls);
        
        const volumeControl = document.createElement('div');
        volumeControl.className = 'volume-control';
        
        const volumeIcon = document.createElement('div');
        volumeIcon.className = 'volume-icon';
        volumeIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M12,4L9,7H5V17H9L12,20V4Z"/>
                <path fill="currentColor" d="M15,8V16H18V8H15Z"/>
            </svg>
        `;
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '1';
        slider.step = '0.01';
        slider.value = this.masterGainNode ? this.masterGainNode.gain.value : 0.07; // Reflect master gain
        slider.addEventListener('input', (e) => {
            const newVolume = parseFloat(e.target.value);
            this.settings.ambientSoundVolume = newVolume; // Update setting
            if (this.masterGainNode) {
                 // Use setTargetAtTime for smooth volume changes
                 this.masterGainNode.gain.setTargetAtTime(newVolume, this.audioContext.currentTime, 0.01);
            }
             // Update settings panel slider if it exists
             const settingsSlider = document.querySelector('.settings-panel-content input[type="range"]');
              if (settingsSlider && settingsSlider.previousElementSibling?.textContent === 'Master Volume') {
                   settingsSlider.value = newVolume;
              }
        });

        volumeControl.appendChild(volumeIcon);
        volumeControl.appendChild(slider);
        audioControls.appendChild(volumeControl);
    }

    async generateAmbience(locationDescription) {
        if (!this.audioContext) return;

        // Ensure ambientGainNode exists before connecting to it
        if (!this.ambientGainNode) {
            console.error("Ambient Gain Node not initialized.");
            this.playDefaultAmbience(); // Fallback
            return;
        }

        try {
            const completion = await this.makeLLMRequest([
                {
                    role: "system",
                    content: `You are an audio environment designer. Based on the location description, 
                    create parameters for an ambient sound generator. Think about appropriate sounds that would 
                    be heard in this environment. Respond directly with JSON, following this JSON schema, and no other text:
                    {
                      "baseFrequency": number, 
                      "noiseLevel": number, 
                      "modulation": number, 
                      "modulationSpeed": number, 
                      "pulseRate": number, 
                      "lowPassFilter": number, 
                      "highPassFilter": number, 
                      "echoPower": number, 
                      "echoTime": number, 
                      "description": string 
                    }
                    The "baseFrequency" should be a base frequency for the ambient sound (100-200 Hz).
                    The "noiseLevel" should be a noise level for the ambient sound (0.0-0.5).
                    The "modulation" should be a modulation amount for the ambient sound (0.0-1.0).
                    The "modulationSpeed" should be a modulation speed for the ambient sound (0.1-1.0).
                    The "pulseRate" should be a pulse rate for the ambient sound (0.1-2.0 Hz).
                    The "lowPassFilter" should be a low-pass filter cutoff frequency for the ambient sound (100-2000 Hz).
                    The "highPassFilter" should be a high-pass filter cutoff frequency for the ambient sound (100-2000 Hz).
                    The "echoPower" should be an echo power for the ambient sound (0.0-1.0).
                    The "echoTime" should be an echo time for the ambient sound (0.1-2.0 seconds).
                    The "description" should be a short description of the ambient sound.
                    `
                },
                {
                    role: "user",
                    content: locationDescription
                }
            ], true);
            
            const params = JSON.parse(completion.content);
            
            this.playGeneratedAmbience(params);
        } catch (error) {
            console.error('Error generating ambience:', error);
            this.playDefaultAmbience();
        }
    }

    playGeneratedAmbience(params) {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        if (this.ambienceNode) {
            this.ambienceNode.stop();
            this.ambienceNode.disconnect();
        }
        
        const noiseNode = this.createNoiseNode();
        const oscillator = this.audioContext.createOscillator();
        const modulatorGain = this.audioContext.createGain();
        const pulseNode = this.audioContext.createGain();
        const lowPassFilter = this.audioContext.createBiquadFilter();
        const highPassFilter = this.audioContext.createBiquadFilter();
        const delayNode = this.audioContext.createDelay();
        const feedbackNode = this.audioContext.createGain();
        const mainGain = this.audioContext.createGain();
        const windGain = this.audioContext.createGain();
        
        const melodicOscillator = this.audioContext.createOscillator();
        const melodicGain = this.audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = params.baseFrequency || 100;
        if (params.modulation > 0) {
            this.modulateOscillator(oscillator.frequency, params.modulation, params.modulationSpeed || 0.5);
        }
        oscillator.start();
        
        melodicOscillator.type = 'sine';
        melodicOscillator.start();
        melodicGain.gain.value = 0; 
        
        noiseNode.gain.value = params.noiseLevel * 0.8;
        
        pulseNode.gain.value = 1;
        if (params.pulseRate > 0) {
            this.setupPulse(pulseNode.gain, params.pulseRate * 0.7); 
        }
        
        lowPassFilter.type = 'lowpass';
        lowPassFilter.frequency.value = params.lowPassFilter;
        lowPassFilter.Q.value = 0.8;  
        
        highPassFilter.type = 'highpass';
        highPassFilter.frequency.value = params.highPassFilter;
        highPassFilter.Q.value = 0.6;  
        
        delayNode.delayTime.value = params.echoTime;
        feedbackNode.gain.value = params.echoPower * 0.8; 
        
        windGain.gain.value = 0;
        
        mainGain.gain.value = 0;
        
        noiseNode.connect(windGain);
        noiseNode.connect(mainGain);
        oscillator.connect(modulatorGain);
        modulatorGain.gain.value = 0.2; 
        modulatorGain.connect(mainGain);
        
        melodicOscillator.connect(melodicGain);
        melodicGain.connect(lowPassFilter);
        
        windGain.connect(highPassFilter);
        
        mainGain.connect(pulseNode);
        pulseNode.connect(lowPassFilter);
        lowPassFilter.connect(highPassFilter);
        
        highPassFilter.connect(delayNode);
        delayNode.connect(feedbackNode);
        feedbackNode.connect(delayNode);
        
        highPassFilter.connect(this.ambientGainNode);
        delayNode.connect(this.ambientGainNode);

        mainGain.gain.setValueAtTime(0, this.audioContext.currentTime);
        mainGain.gain.linearRampToValueAtTime(0.35, this.audioContext.currentTime + 3.0); // Fade in ambient sound

        this.scheduleWindGusts(windGain);

        this.scheduleMelodicElements(melodicOscillator, melodicGain);

        this.ambienceNode = noiseNode.source; // Keep track of the source for stopping
        this.currentAmbience = {
            mainOutputNode: this.ambientGainNode, // Store the node connected to ambientGainNode
            noiseNode: noiseNode,
            oscillator: oscillator,
            gainNodes: [mainGain, modulatorGain, pulseNode, feedbackNode, windGain, melodicGain],
            filters: [lowPassFilter, highPassFilter],
            delayNode: delayNode,
            melodicOscillator: melodicOscillator
        };
    }

    modulateOscillator(frequencyParam, amount, speed) {
        const now = this.audioContext.currentTime;
        
        for (let i = 0; i < 100; i++) {
            const startTime = now + (i * speed * 1.5); 
            const nextTime = now + ((i + 1) * speed * 1.5);
            
            const direction = Math.random() > 0.6 ? 1 : -1;
            const modAmount = amount * (0.3 + Math.random() * 0.4) * direction; 
            const baseFreq = frequencyParam.value;
            
            frequencyParam.setValueAtTime(baseFreq, startTime);
            frequencyParam.exponentialRampToValueAtTime(
                baseFreq + modAmount, 
                startTime + (speed * 0.8)
            );
            frequencyParam.exponentialRampToValueAtTime(
                baseFreq,
                nextTime
            );
        }
    }
    
    scheduleWindGusts(windGain) {
        const now = this.audioContext.currentTime;
        let time = now;
        
        for (let i = 0; i < 12; i++) { 
            const waitTime = 2 + Math.random() * 6;
            time += waitTime;
            
            const gustDuration = 1 + Math.random() * 3; 
            
            const gustIntensity = 0.05 + Math.random() * 0.45;
            
            windGain.gain.setValueAtTime(0.01, time);
            windGain.gain.linearRampToValueAtTime(gustIntensity, time + (gustDuration * 0.4));
            windGain.gain.exponentialRampToValueAtTime(0.01, time + gustDuration);
        }
        
        setTimeout(() => {
            if (this.ambienceNode && this.ambienceNode.context.state === 'running') {
                this.scheduleWindGusts(windGain);
            }
        }, 45000); 
    }
    
    scheduleMelodicElements(oscillator, gainNode) {
        const now = this.audioContext.currentTime;
        let time = now;
        
        const notes = [
            220.00, 
            246.94, 
            261.63, 
            293.66, 
            329.63, 
            349.23, 
            392.00, 
            440.00, 
            493.88, 
            523.25  
        ];
        
        const chords = [
            [0, 2, 4], 
            [2, 4, 7], 
            [4, 7, 9], 
            [7, 9, 0]  
        ];
        
        for (let i = 0; i < 10; i++) {
            const waitTime = 8 + Math.random() * 12;
            time += waitTime;
            
            const playChord = Math.random() < 0.7; 
            
            if (playChord) {
                const chordIndex = Math.floor(Math.random() * chords.length);
                const chord = chords[chordIndex];
                
                chord.forEach((noteIndex, index) => {
                    const noteTime = time + (index * 0.15); 
                    const noteDuration = 1.5 + Math.random() * 2; 
                    
                    oscillator.frequency.setValueAtTime(notes[noteIndex], noteTime);
                    
                    gainNode.gain.setValueAtTime(0, noteTime);
                    gainNode.gain.linearRampToValueAtTime(0.1, noteTime + 0.2); 
                    gainNode.gain.exponentialRampToValueAtTime(0.001, noteTime + noteDuration); 
                });
            } else {
                const noteIndex = Math.floor(Math.random() * notes.length);
                const noteDuration = 0.8 + Math.random() * 3; 
                
                oscillator.frequency.setValueAtTime(notes[noteIndex], time);
                
                gainNode.gain.setValueAtTime(0, time);
                gainNode.gain.linearRampToValueAtTime(0.15, time + 0.3); 
                gainNode.gain.exponentialRampToValueAtTime(0.001, time + noteDuration); 
            }
        }
        
        setTimeout(() => {
            if (this.currentAmbience && this.currentAmbience.melodicOscillator) {
                this.scheduleMelodicElements(oscillator, gainNode);
            }
        }, 60000); 
    }

    createNoiseNode() {
        const bufferSize = 2 * this.audioContext.sampleRate;
        const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        let lastOut = 0;
        const pinkFactor = 0.08;  
        
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut + (pinkFactor * white)) / (1 + pinkFactor);
            lastOut = output[i];
            output[i] *= 0.4;
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;
        noise.start();
        
        const noiseGain = this.audioContext.createGain();
        noise.connect(noiseGain);
        
        return noiseGain;
    }
    
    setupPulse(gainParam, rate) {
        const pulseTime = 1 / rate;
        const now = this.audioContext.currentTime;
        
        for (let i = 0; i < 100; i++) {
            const pulseStart = now + i * pulseTime * (1 + (Math.random() * 0.7 - 0.25));
            
            const peakValue = 0.2 + (Math.random() * 0.5);
            const decayTime = pulseTime * (Math.random() * 0.6 + 0.4); 
            
            gainParam.setValueAtTime(0.05, pulseStart);
            gainParam.linearRampToValueAtTime(peakValue, pulseStart + 0.05 + (Math.random() * 0.1));
            gainParam.exponentialRampToValueAtTime(0.01, pulseStart + decayTime);
        }
    }
    
    playDefaultAmbience() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        if (this.ambienceNode) {
            this.ambienceNode.stop();
            this.ambienceNode.disconnect();
        }
        
        const noiseNode = this.createNoiseNode();
        if (!noiseNode) return; // Check if noise node creation failed

        const gain = this.audioContext.createGain();

        noiseNode.gain.value = 0.1; // Lower default noise level
        gain.gain.value = 1.0; // This gain node connects to ambientGainNode

        noiseNode.connect(gain);
        // Connect to the dedicated ambientGainNode
        gain.connect(this.ambientGainNode);

        this.ambienceNode = noiseNode.source; // The actual source node
        this.currentAmbience = {
            mainOutputNode: gain, // The node connected to ambientGainNode
            noiseNode: noiseNode,
            gainNodes: [gain],
            filters: [],
            delayNode: null,
            melodicOscillator: null
        };
    }
    // Function to convert an image URL to data URL
    async convertImageToDataURL(imageUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                try {
                    const dataURL = canvas.toDataURL('image/jpeg');
                    resolve(dataURL);
                } catch (e) {
                    reject(new Error('Could not convert image to data URL: ' + e.message));
                }
            };
            img.onerror = function() {
                reject(new Error('Failed to load image'));
            };
            img.src = imageUrl;
        });
    }
  
    async generateCharacterThoughts() {
        let thoughtsElement = document.getElementById('character-thoughts');
        if (!thoughtsElement) {
            thoughtsElement = document.createElement('div');
            thoughtsElement.id = 'character-thoughts';
            document.getElementById('location-info').appendChild(thoughtsElement);
        }
        
        try {
            const previousThoughts = (this.thoughtHistory && this.thoughtHistory.length > 0) ?
                "Take these internal thoughts into context: " + this.thoughtHistory.join(" | ") + ".\n" : "";
            
            // Get the most recent navigation choice if available
            const previousChoice = this.locationHistory.length > 0 ? 
                `You just chose: "${this.locationHistory[this.locationHistory.length-1].directionChosen?.text || 'unknown'}" to get here.\n` : "";
                
            const locationContext = `Current location: ${this.currentLocation.title}\nDescription: ${this.currentLocation.description}\n`;
            
            // Get image from the current panorama if available
            let imageDataUrl = await this.convertImageToDataURL(this.panoramaUrl);
                
            const systemPrompt = `You are a first-person narrator in a ${this.storyConfig.genre} adventure. Previous thoughts: ${previousThoughts}
Previous Choices: ${previousChoice} ${locationContext}
Write a brief internal thought (1-2 sentences) of what the character is feeling or thinking at this location. Use vivid, evocative, comedic language. Keep it brief, sarcastic and in context. Do not include commentary; stay in character.

Story Context:
${this.getStoryContext()}`;
            
            let completion;
            
                const userPrompt = `The character is looking at: ${this.currentLocation.description}`;
                completion = await this.makeLLMRequest([
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ]);
            
            const thought = completion.content.trim();
            thoughtsElement.textContent = thought;
            thoughtsElement.style.display = 'block';
            
            // Append new thought to the history and limit to the most recent 12 entries
            this.thoughtHistory.push(thought);
            if (this.thoughtHistory.length > 12) {
                this.thoughtHistory.shift();
            }
          
          //Generate speech
          const result = await websim.textToSpeech({
            text: thought,
            voice: `${this.language}-female`
          });
          
          this.masterGainNode.gain.value = 0.10;
          
          // Play the audio
          const audio = new Audio(result.url);
          audio.play().catch(er => {
               console.error(`Caught: ${er}`);
          });
      
        } catch (e) {
            console.error("Error generating character thoughts:", e);
            //thoughtsElement.textContent = "I wonder what lies ahead...";
        }
        this.masterGainNode.gain.value = this.settings.masterVolume;
    }
  
    // makes playing audio return a promise
    playAudio(audio){
      return new Promise(res=>{
        audio.play();
        audio.onended = res;
      });
    }
  
    async makeLLMRequest(messages, json = false) {
        let retries = 0;
        messages.push({
            role: "user",
            content: `Please respond in this language: ${this.getLanguageName(this.language)}`
          });
        while (retries < this.maxRetries) {
            try {
                const completion = await websim.chat.completions.create({
                    messages: messages,
                    json: json
                });
                return completion;
            } catch (error) {
                console.error(`LLM request error (attempt ${retries + 1}/${this.maxRetries}):`, error);
                retries++;
                
                if (retries >= this.maxRetries) {
                    throw new Error(`Failed after ${this.maxRetries} attempts: ${error.message}`);
                }
                
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }

    }
    getLanguageName(code) {
        const mapping = {
'en':'English',
'zh':'Chinese',
'hi':'Hindi',
'es':'Spanish',
'ar':'Arabic',
'bn':'Bengali',
'pt':'Portuguese',
'ru':'Russian',
'pa':'Punjabi',
'de':'German',
'ko':'Korean',
'fr':'French',
'uk':'Ukrainian',
'de':'Swedish',
'tur':'Turkish'
        };


      
        return mapping[code] || code;
    }
      cancelStoryPanel() {
        this.closeStoryPanel();
        this.updateStoryBubble();
        this.generateNavigationOptions();
        this.isStorytelling = false;
    }
  
    openStoryPanel() {
        if (this.isNavigating || this.isStorytelling) return;
        this.isStorytelling = true;
        
        this.scene.children = this.scene.children.filter(child => {
            if (child.userData && (child.userData.type === 'directionBubble' || child.userData.type === 'storyBubble')) {
                if (child.material && child.material.map) {
                    child.material.map.dispose();
                    child.material.dispose();
                }
                if (child.geometry) child.geometry.dispose();
                return false;
            }
            return true;
        });
        
        const storyPanel = document.createElement('div');
        storyPanel.id = 'story-panel';
        
        const panelContent = document.createElement('div');
        panelContent.className = 'story-panel-content';
        
        const title = document.createElement('h2');
        title.textContent = 'Create Your Adventure';
        panelContent.appendChild(title);
        
        const storyOptions = {
            genre: [
                { value: 'comedy', label: 'Comedy' },
              { value: 'satire', label: 'Satire' },
              {value: 'romance', label: 'Romance'},
              {value: 'gameshow', label: 'Gameshow'},
              {value: 'soapopera', label: 'Soap Opera'},
              {value: 'newscast', label: 'Newscast'},
              {value: 'documentary', label: 'Documentary'},
              {value: 'surveillancecam', label: 'Surveillance Camera'},
              {value: 'webcams', label: 'Webcams'},
              {value: 'retrogame', label: 'Retro Game'},
              {value: 'thriller', label: 'Thriller'},
              {value: 'comingofage', label: 'Coming of Age'},
              {value: 'visionquest', label: 'Vision Quest'},
                { value: 'cultclassic', label: 'Cult Classic' },
                { value: 'environmentalpuzzle', label: 'Env. Puzzle' },
                { value: 'dieselpunk', label: 'Dieselpunk' },
                { value: 'biopunk', label: 'Biopunk' },
                { value: 'splatterpunk', label: 'Splatterpunk' },
                { value: 'weirdwest', label: 'Weird West' },
                { value: 'grimdark', label: 'Grimdark' },
                { value: 'solarpunk', label: 'Solarpunk' },
                { value: 'mythicfiction', label: 'Mythic Fiction' },
                { value: 'swordandsorcery', label: 'Sword and Sorcery' },
                { value: 'magicalrealism', label: 'Magical Realism' },
                { value: 'urbanfantasy', label: 'Urban Fantasy' },
                { value: 'gaslampfantasy', label: 'Gaslamp Fantasy' },
                { value: 'militarysf', label: 'Military SF' },
                { value: 'hardsciencefiction', label: 'Hard Science Fiction' },
                { value: 'softsciencefiction', label: 'Soft Science Fiction' },
                { value: 'spacewestern', label: 'Space Western' },
                { value: 'cyberfantasy', label: 'Cyberfantasy' },
                { value: 'silkpunk', label: 'Silkpunk' },
                { value: 'hopepunk', label: 'Hopepunk' },
                { value: 'gothicfiction', label: 'Gothic Fiction' },
                { value: 'lovecraftianhorror', label: 'Lovecraftian Horror' },
                { value: 'newweird', label: 'New Weird' },
                { value: 'darkacademia', label: 'Dark Academia' },
                { value: 'cozyfantasy', label: 'Cozy Fantasy' },
                { value: 'mythopoeia', label: 'Mythopoeia' },
                { value: 'renaissancepunk', label: 'Renaissancepunk' },
                { value: 'afrofuturism', label: 'Afrofuturism' },
                { value: 'indianfuturism', label: 'Indian Futurism' },
                { value: 'cli-fi', label: 'Cli-Fi' },
                { value: 'mundanesf', label: 'Mundane SF' }
            ],
            setting: [
                { value: 'bedroom', label: 'Bedroom' },
              { value: 'carnival', label: 'Carnival' },
              { value: 'theatre', label: 'Theatre' },
              { value: 'datefestival', label: 'Date Festival' },
                { value: 'frontline', label: 'Frontline' },
                { value: 'prison', label: 'Prison' },
                { value: 'sciencelab', label: 'Science Lab' },
                { value: 'microscopicscale', label: 'Microscopic Scale' },
                { value: 'nanoscale', label: 'Nano Scale' },
                { value: 'beehive', label: 'Beehive' },
                { value: 'anthill', label: 'Ant Hill' },
                { value: 'egyptianpyramid', label: 'Egyptian Pyramid' },
                { value: 'metaverse', label: 'Metaverse' },
                { value: 'thefrontline', label: 'Frontline' },
                { value: 'backrooms', label: 'Backrooms' },
                { value: 'pearlygates', label: 'Pearly Gates' },
              { value: 'redlightdistrict', label: 'Redlight District' },
                { value: 'inferno', label: 'Dantes Inferno' },
                { value: 'beowulf', label: 'Beowulf' },
                { value: 'minecraft', label: 'Minecraft' },
                { value: 'oregontrail', label: 'Oregon Trail' },
                { value: 'elmstreet', label: 'Elmstreet' },
                { value: 'biblical', label: 'Biblical' },
                { value: 'prehistoric', label: 'Prehistoric' },
                { value: 'hauntedmansion', label: 'Haunted Mansion' },
                { value: 'underwatercity', label: 'Underwater City' },
                { value: 'spacecolony', label: 'Space Colony' },
                { value: 'ancienttemple', label: 'Ancient Temple' },
                { value: 'postapocalypticwasteland', label: 'Post-Apocalyptic Wasteland' },
                { value: 'steampunkairship', label: 'Steampunk Airship' },
                { value: 'cyberpunkmegacity', label: 'Cyberpunk Megacity' },
                { value: 'magicalforest', label: 'Magical Forest' },
                { value: 'desertoasis', label: 'Desert Oasis' },
                { value: 'arcticresearchstation', label: 'Arctic Research Station' },
                { value: 'volcanicisland', label: 'Volcanic Island' },
                { value: 'dreamrealm', label: 'Dream Realm' },
                { value: 'paralleluniverse', label: 'Parallel Universe' },
                { value: 'timeperiod', label: 'Different Time Period' },
                { value: 'smalltownusa', label: 'Small Town, USA' },
                { value: 'aboardagenerationship', label: 'Aboard a Generation Ship' },
                { value: 'amusementpark', label: 'Abandoned Amusement Park' },
                { value: 'themoon', label: 'The Moon' },
                { value: 'mars', label: 'Mars' },
                { value: 'venus', label: 'Venus' },
                { value: 'undergroundbunker', label: 'Underground Bunker' },
                { value: 'militarybase', label: 'Secret Military Base' },
                { value: 'lostworld', label: 'Lost World' },
                { value: 'transientghostship', label: 'Transient Ghost Ship' },
                { value: 'virtualreality', label: 'Virtual Reality' },
                { value: 'carnival', label: 'Traveling Carnival' },
                { value: 'monastery', label: 'Remote Mountain Monastery' },
                { value: 'prehistoricearth', label: 'Prehistoric Earth' },
                { value: 'fantasticalacademy', label: 'Fantastical Academy' },
                { value: 'movingcity', label: 'A City on the Move' }
            ],
            protagonist: [
               {value: 'ghost', label: 'Ghost'},
                {value: 'insect', label: 'Insect'},
                {value: 'ant', label: 'Ant'},
                {value: 'bee', label: 'Bee'},
                {value: 'bird', label: 'Bird'},
                { value: 'nerd', label: 'Nerd' },
                { value: 'gamer', label: 'Gamer' },
                { value: 'administrator', label: 'Administrator' },
                { value: 'wizard', label: 'Wizard' },
                { value: 'cleric', label: 'Cleric' },
                { value: 'rogue', label: 'Rogue' },
                { value: 'warrior', label: 'Warrior' },
                { value: 'hacker', label: 'Hacker' },
                { value: 'explorer', label: 'Explorer' },
                { value: 'philosopher', label: 'Philosopher' },
                { value: 'detective', label: 'Detective' },
                { value: 'activist', label: 'Activist' },
                { value: 'soldier', label: 'Soldier' },
                { value: 'prisoner', label: 'Prisoner' },
                { value: 'refugee', label: 'Refugee' },
                { value: 'reluctanthero', label: 'Reluctant Hero' },
                { value: 'chosenone', label: 'Chosen One' },
                { value: 'orphanedprotagonist', label: 'Orphaned Protagonist' },
                { value: 'redeemedvillain', label: 'Redeemed Villain' },
                { value: 'scientist', label: 'Brilliant but Mad Scientist' },
                { value: 'detective', label: 'Hard-Boiled Detective' },
                { value: 'cyborg', label: 'Cyborg Bounty Hunter' },
                { value: 'wizard', label: 'Wise Old Wizard' },
                { value: 'timeTraveler', label: 'Time Traveler from the Future' },
                { value: 'alien', label: 'Alien Explorer' },
                { value: 'amnesiac', label: 'Amnesiac Wanderer' },
                { value: 'robot', label: 'Sentient Robot' },
                { value: 'ghost', label: 'Ghostly Observer' },
                { value: 'bandit', label: 'Charming Rogue/Bandit' },
                { value: 'scholar', label: 'Bookish Scholar' },
                { value: 'artist', label: 'Struggling Artist' },
                { value: 'musician', label: 'Traveling Musician' },
                { value: 'explorer', label: 'Fearless Explorer' },
                { value: 'soldier', label: 'Disillusioned Soldier' },
                { value: 'assassin', label: 'Highly Trained Assassin' },
                { value: 'politician', label: 'Corrupt Politician Seeking Redemption' },
                { value: 'revolutionary', label: 'Idealistic Revolutionary' },
                { value: 'inventor', label: 'Eccentric Inventor' },
                { value: 'dreamer', label: 'Visionary Dreamer' },
                { value: 'hermit', label: 'Reclusive Hermit' },
                { value: 'criminal', label: 'Small-Time Criminal' },
                { value: 'psychic', label: 'Gifted Psychic' },
                { value: 'ceo', label: 'Ruthless CEO' },
                { value: 'doctor', label: 'Compassionate Doctor' },
              { value: 'performer', label: 'Performer' },
                { value: 'teacher', label: 'Dedicated Teacher' }
            ],
            quest: [
              { value: 'artifact', label: 'Find the Artifact' },
                { value: 'rescue', label: 'Rescue Mission' },
                { value: 'escape', label: 'Escape to Freedom' },
                { value: 'revenge', label: 'Seek Revenge' },
                { value: 'cure', label: 'Find the Cure' },
                { value: 'mystery', label: 'Solve the Mystery' },
                { value: 'treasure', label: 'Hunt for Treasure' },
                { value: 'survival', label: 'Survival Challenge' },
                { value: 'rebellion', label: 'Lead the Rebellion' },
                { value: 'restoration', label: 'Restore the Balance' },
                { value: 'exploration', label: 'Explore the Unknown' },
                { value: 'negotiation', label: 'Diplomatic Mission' },
                { value: 'infiltration', label: 'Infiltrate the Fortress' },
                { value: 'competition', label: 'Win the Competition' },
                { value: 'conspiracy', label: 'Uncover the Conspiracy' },
                { value: 'prophecy', label: 'Fulfill the Prophecy' },
                { value: 'corruption', label: 'Fight the Corruption' },
                { value: 'transformation', label: 'Complete the Transformation' },
                { value: 'recoverartifact', label: 'Recover a Lost Artifact' },
                { value: 'slaymonster', label: 'Slay a Fearsome Monster' },
                { value: 'saveprincess', label: 'Rescue a Kidnapped Princess' },
                { value: 'delivermessage', label: 'Deliver a Crucial Message' },
                { value: 'avengedeath', label: 'Avenge a Wrongful Death' },
                { value: 'findcure', label: 'Discover a Cure for a Disease' },
                { value: 'exploreunknown', label: 'Explore Uncharted Territories' },
                { value: 'defendhomeland', label: 'Defend the Homeland from Invasion' },
                { value: 'uncoverconspiracy', label: 'Uncover a Dark Conspiracy' },
                { value: 'retrieveinformation', label: 'Retrieve Stolen Information' },
                { value: 'escortvip', label: 'Escort a VIP Through Dangerous Lands' },
                { value: 'winTournament', label: 'Win a Prestigious Tournament' },
                { value: 'stopCult', label: 'Stop a Doomsday Cult' },
                { value: 'findLostCity', label: 'Find a Lost City of Gold' },
                { value: 'securePeace', label: 'Secure Peace Between Warring Factions' },
                { value: 'collectDebts', label: 'Collect Overdue Debts' },
                { value: 'smuggleGoods', label: 'Smuggle Contraband Across Borders' },
                { value: 'solveMystery', label: 'Solve a Baffling Mystery' },
                { value: 'huntTreasure', label: 'Hunt Buried Treasure' },
                { value: 'buildCommunity', label: 'Build a Thriving Community' },
                { value: 'repairRelic', label: 'Repair a Broken/Ancient Relic' },
                { value: 'performRitual', label: 'Perform a Sacred Ritual' },
                { value: 'negotiateTreaty', label: 'Negotiate a Vital Treaty' },
                { value: 'exposeCorruption', label: 'Expose Government Corruption' },
                { value: 'proveInnocence', label: 'Prove One\'s Innocence' },
                { value: 'winElection', label: 'Win a Crucial Election' },
                { value: 'createArt', label: 'Create a Masterpiece of Art' },
                { value: 'masterSkill', label: 'Master a Difficult Skill' },
                { value: 'findlove', label: 'Find True Love' },
                { value: 'seektruth', label: 'Seek Ultimate Truth or Enlightenment' },
                { value: 'photocontestsubmission', label: 'Photo Contest Submission' }
            ]
        };
        
        Object.entries(storyOptions).forEach(([category, options]) => {
            panelContent.appendChild(this.createOptionGroup(category, options));
        });
        
        const controls = this.createStoryControls();
        
        panelContent.appendChild(controls);
        
        storyPanel.appendChild(panelContent);
        document.body.appendChild(storyPanel);
        
        setTimeout(() => {
            storyPanel.classList.add('visible');
        }, 10);
        
        // Updated event listener: on cancel, reload the bubbles via cancelStoryPanel()
        document.getElementById('story-cancel').addEventListener('click', () => {
            this.cancelStoryPanel();
        });
        
        document.getElementById('story-begin').addEventListener('click', () => {
            this.beginCustomStory();
        });
    }

    createOptionGroup(category, options) {
        const group = document.createElement('div');
        group.className = 'story-option-group';
        
        const heading = document.createElement('h3');
        heading.textContent = `Choose a ${category.charAt(0).toUpperCase() + category.slice(1)}`;
        group.appendChild(heading);
        
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'story-options';
        optionsContainer.id = `${category}-options`;
        
        options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'story-option';
            optionElement.dataset.value = option.value;
            optionElement.textContent = option.label;
            
            optionElement.addEventListener('click', () => {
                optionsContainer.querySelectorAll('.story-option').forEach(el => 
                    el.classList.remove('selected'));
                const customInput = optionsContainer.querySelector('.custom-input');
                if (customInput) {
                    customInput.value = '';
                }
                optionElement.classList.add('selected');
                this.storyConfig[category] = option.value;
                this.checkAllOptionsSelected();
            });
            
            optionsContainer.appendChild(optionElement);
        });
        
        const customContainer = document.createElement('div');
        customContainer.className = 'custom-input-container';
        
        const customLabel = document.createElement('label');
        customLabel.textContent = 'Custom:';
        customLabel.setAttribute('for', `${category}-custom`);
        
        const customInput = document.createElement('input');
        customInput.type = 'text';
        customInput.id = `${category}-custom`;
        customInput.className = 'custom-input';
        customInput.placeholder = `Enter custom ${category}`;
        
        customInput.addEventListener('focus', () => {
            optionsContainer.querySelectorAll('.story-option').forEach(el => el.classList.remove('selected'));
        });
        
        customInput.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            this.storyConfig[category] = value !== '' ? value : null;
            this.checkAllOptionsSelected();
        });
        
        customContainer.appendChild(customLabel);
        customContainer.appendChild(customInput);
        optionsContainer.appendChild(customContainer);
        
        group.appendChild(optionsContainer);
        return group;
    }
    
    createStoryControls() {
        const controls = document.createElement('div');
        controls.className = 'story-controls';
        
        const cancelButton = document.createElement('button');
        cancelButton.id = 'story-cancel';
        cancelButton.textContent = 'Cancel';

        const beginButton = document.createElement('button');
        beginButton.id = 'story-begin';
        beginButton.textContent = 'Begin Adventure';
        beginButton.disabled = true;

        controls.appendChild(cancelButton);
        controls.appendChild(beginButton);
        
        return controls;
    }
    
    checkAllOptionsSelected() {
        const beginButton = document.getElementById('story-begin');
        if (this.storyConfig.genre && this.storyConfig.setting && 
            this.storyConfig.protagonist && this.storyConfig.quest) {
            beginButton.removeAttribute('disabled');
        }
    }
    
    closeStoryPanel() {
        const storyPanel = document.getElementById('story-panel');
        if (storyPanel) {
            storyPanel.classList.remove('visible');
            setTimeout(() => {
                storyPanel.remove();
                this.isStorytelling = false;
            }, 500);
        }
    }

    async requestPanorama(){
      
      
      let retries = 0;
        
        while (retries < this.maxRetries) {
            try {
                const panoramaPrompt = `${this.locationPrompt} ${this.currentLocation.description}. ${this.getStoryContext()}`;
                const imageResult = await websim.imageGen({
                  prompt: panoramaPrompt,
                  width: 2146,
                  height: 1282
                });
                return imageResult;
            } catch (error) {
                console.error(`Image generation error (attempt ${retries + 1}/${this.maxRetries}):`, error);
                retries++;
                
                if (retries >= this.maxRetries) {
                    throw new Error(`Failed image generation after ${this.maxRetries} attempts: ${error.message}`);
                }
                
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
        
    }
  
    async beginCustomStory() {
        if (!this.storyConfig.genre || !this.storyConfig.setting || 
            !this.storyConfig.protagonist || !this.storyConfig.quest) {
            return;
        }
        
        this.closeStoryPanel();
        
        // Clear existing scene elements related to navigation/story
        this.scene.children = this.scene.children.filter(child => {
            if (child.userData && (child.userData.type === 'directionBubble' || child.userData.type === 'storyBubble')) {
                if (child.material && child.material.map) {
                    child.material.map.dispose();
                    child.material.dispose();
                }
                if (child.geometry) child.geometry.dispose();
                return false; // Remove bubble
            }
            return true; // Keep other scene objects
        });
        
        const eyeMask = document.getElementById('eye-mask');
        eyeMask.classList.add('eye-closed');
        
        // --- Reset Game State ---
        this.locationHistory = [];
        this.thoughtHistory = [];
        this.directions = [];
        this.currentLocation = { title: "Generating...", description: "..." }; // Placeholder
        document.getElementById('location-title').textContent = this.currentLocation.title;
        document.getElementById('character-thoughts').textContent = '';
        // Reset customStoryPrompt based on selected config
        this.customStoryPrompt = `
            Generate an immersive adventure with these elements:
            - Genre: ${this.storyConfig.genre}
            - Setting: ${this.storyConfig.setting}
            - Main Character: ${this.storyConfig.protagonist}
            - Quest: ${this.storyConfig.quest}
        `;
        // --- End Reset ---
        
        try {
            // Generate the *new* starting location based ONLY on the custom story config
            const completion = await this.makeLLMRequest([
                {
                    role: "system",
                    content: this.customStartPrompt // This prompt uses customStoryPrompt which is now updated
                },
                {
                    role: "user",
                    content: this.customStoryPrompt // Pass the updated config prompt
                }
            ], true);
            
            const result = JSON.parse(completion.content);
            
            // Set the *actual* starting location
            this.currentLocation = {
                title: result.title,
                description: result.description
            };
            this.startingLocation = { ...this.currentLocation }; // Store the *new* starting point
            this.customStory = true; // Mark that we are now in a custom story

            // Generate the panorama for the new starting location
            const imageResult = await this.requestPanorama();
            this.panoramaUrl = imageResult.url;
            
            // Display the new scene
            this.createPanoramaSphere();
            document.getElementById('location-title').textContent = this.currentLocation.title;
            
            // Generate initial thoughts for the new story
            await this.generateCharacterThoughts(); // Use await here
            
            // Update story bubble (should be hidden now due to customStory = true)
            this.updateStoryBubble();
            
            // Fade in the view and generate navigation options
            setTimeout(() => {
                eyeMask.classList.remove('eye-closed');
                // Delay navigation options generation until after fade-in
                setTimeout(() => {
                     this.generateNavigationOptions();
                }, 600); 
            }, 600); // Initial delay for eye closing/opening effect
            
        } catch (error) {
            console.error('Error generating custom story:', error);
            
            // Fallback location if generation fails
            this.currentLocation = {
                title: "Adventure Initialization Error",
                description: "Something went wrong while starting your custom adventure. Please try again or choose different options."
            };
            this.startingLocation = { ...this.currentLocation };
            this.customStory = false; // Reset custom story flag on error
            
            this.createPlaceholderSphere(); // Show a placeholder
            document.getElementById('location-title').textContent = this.currentLocation.title;
            document.getElementById('character-thoughts').textContent = "An unexpected problem occurred.";
            
            // Still allow fade-in and try to generate basic navigation
            setTimeout(() => {
                const eyeMask = document.getElementById('eye-mask');
                eyeMask.classList.remove('eye-closed');
                this.generateNavigationOptions(); // Generate default/fallback options
            }, 500);
        }
    }
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
    startInitialScan() {
        if (this.isInitialScan) return;
        
        this.resetCameraPosition();
        
        this.isUserInteracting = false;
        this.isWandering = false;
        this.isInitialScan = true;
        this.scanPhase = 0;
        
        this.scanPattern = [
            {longitude:0, latitude:-45,duration:5.0},
            {longitude:-95, latitude:-25,duration:10.0},
            {longitude:0, latitude:45,duration:5.0},
            {longitude:95, latitude:-25,duration:10.0},
            {longitude:0, latitude:-45,duration:5.0}
        ];
      
        if (Math.random() > 0.5){
          //do nothing
        } else{
          this.scanPattern = [...this.scanPattern].reverse();
        }

        if(this.firstLoad){
            this.scanPattern = [{longitude:0, latitude:-25,duration:5.0}];
            this.firstLoad = false; 
        }
      
        this.scanStartLongitude = this.longitude;
        this.scanStartLatitude = this.latitude;
        this.scanStartTime = Date.now();
        this.scanDuration = this.scanPattern[0].duration * 1000;
        this.scanTarget = this.scanPattern[0];
    }

    executeInitialScan() {
        if (this.isUserInteracting) {
            this.isInitialScan = false;
            this.lastInteractionTime = Date.now();
            return;
        }
        
        const currentTime = Date.now();
        const elapsedTime = (currentTime - this.scanStartTime) / 1000;
        const phaseDuration = this.scanDuration / 1000;
        
        let progress = Math.min(elapsedTime / phaseDuration, 1.0);
        
        progress = this.easeInOutCubic(progress);
        
        if (this.scanPhase < this.scanPattern.length) {
            const target = this.scanPattern[this.scanPhase];
            
            this.longitude = this.scanStartLongitude + (target.longitude - this.scanStartLongitude) * progress;
            this.latitude = this.scanStartLatitude + (target.latitude - this.scanStartLatitude) * progress;
            
            const breathingOffset = Math.sin(elapsedTime * 0.8) * 0.2;
            this.latitude += breathingOffset;
            
            if (progress >= 1.0) {
                this.scanPhase++;
                
                if (this.scanPhase < this.scanPattern.length) {
                    this.scanStartLongitude = this.longitude;
                    this.scanStartLatitude = this.latitude;
                    this.scanStartTime = currentTime;
                    this.scanDuration = this.scanPattern[this.scanPhase].duration * 1000;
                } else {
                    this.isInitialScan = false;
                    this.lastInteractionTime = Date.now(); 
            
                    this.onPointerDownLongitude = this.longitude;
                    this.onPointerDownLatitude = this.latitude;
                    
                    setTimeout(() => {
                        this.lastInteractionTime = Date.now();
                    }, 3000);
                }
            }
        }
    }

    resetCameraPosition() {
        const startLongitude = this.longitude;
        const startLatitude = this.latitude;
        const startFov = this.camera.fov;
        
        const targetLongitude = 0;
        const targetLatitude = -45;
        const targetFov = 75;
        
        const startTime = Date.now();
        const duration = 1500; 
        
        const animateReset = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = this.easeInOutCubic(progress);
            
            this.longitude = startLongitude + (targetLongitude - startLongitude) * easedProgress;
            this.latitude = startLatitude + (targetLatitude - startLatitude) * easedProgress;
            this.camera.fov = startFov + (targetFov - startFov) * easedProgress;
            this.camera.updateProjectionMatrix();
            
            if (progress < 1) {
                requestAnimationFrame(animateReset);
            } else {
                this.longitude = targetLongitude;
                this.latitude = targetLatitude;
                this.camera.fov = targetFov;
                this.camera.updateProjectionMatrix();
            }
        };
        
        animateReset();
    }

    getStoryContext() {
        return `Story settings: Genre: ${this.storyConfig.genre || "N/A"}, Setting: ${this.storyConfig.setting || "N/A"}, Protagonist: ${this.storyConfig.protagonist || "N/A"}, Quest: ${this.storyConfig.quest || "N/A"}.`;
    }

    async autoPickAndNavigate() {
        try {
            const promptMessages = [
                {
                    role: "system",
                    content: "You are an AI navigator for an adventure game. Given the available direction options, choose the index (zero-based) of the bubble that best continues the adventure. Respond directly with JSON in the format: {\"chosenIndex\": number} with no extra text."
                },
                {
                    role: "user",
                    content: "Available options: " + JSON.stringify(this.directions)
                }
            ];
            const response = await this.makeLLMRequest(promptMessages, true);
            const result = JSON.parse(response.content);
            const index = result.chosenIndex;
            if (typeof index === 'number' && index >= 0 && index < this.directions.length) {
                this.navigateToDirection(index);
            } else {
                console.error("Autoplay returned an invalid index, selecting a random option instead.");
                const randIndex = Math.floor(Math.random() * this.directions.length);
                this.navigateToDirection(randIndex);
            }
        } catch (error) {
            console.error("Error during autoplay selection:", error);
            const randIndex = Math.floor(Math.random() * this.directions.length);
            this.navigateToDirection(randIndex);
        }
    }
  regenerateLanguageContent() {
        (async () => {
            // Translate and update the location title
            try {
                const translatedTitle = await this.translateText(this.currentLocation.title, this.language);
                document.getElementById('location-title').textContent = translatedTitle;
            } catch (e) {
                console.error("Translation failed:", e);
            }
            // Regenerate direction bubbles (which also removes the old ones)
            await this.generateNavigationOptions();
            // Regenerate character thoughts in the selected language
            await this.generateCharacterThoughts();
        })();
    }

    async translateText(text, targetLanguage) {
        const langName = this.getLanguageName(targetLanguage);
        try {
            const completion = await this.makeLLMRequest([
                {
                    role: "system",
                    content: `Translate the following text into ${langName}. Respond with only the translated text.`
                },
                {
                    role: "user",
                    content: text
                }
            ], true);
            return completion.content.trim();
        } catch (error) {
            console.error("Translation error:", error);
            return text;
        }
    }
  
saveScreenshot() {
    // Temporarily hide UI elements
    const controlPanel = document.getElementById('control-panel');
    const audioControls = document.getElementById('audio-controls');
    const inspiredBy = document.getElementById('inspired-by');
    const uiOverlay = document.getElementById('ui-overlay');
    
    // Store original visibility
    const originalVisibility = {
        controlPanel: controlPanel.style.display,
        audioControls: audioControls.style.display,
        inspiredBy: inspiredBy.style.display,
        uiOverlay: uiOverlay.style.display
    };
    
    // Hide elements
    controlPanel.style.display = 'none';
    audioControls.style.display = 'none';
    inspiredBy.style.display = 'none';
    uiOverlay.style.display = 'none';
    
    // Wait for the next frame to ensure UI is hidden
    requestAnimationFrame(() => {
        // Take screenshot
        const screenshot = this.renderer.domElement.toDataURL('image/jpeg');
        
        // Create a temporary link element and trigger download
        const link = document.createElement('a');
        link.href = screenshot;
        link.download = `vapor-${this.currentLocation.title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.jpg`;
        link.click();
        
        // Restore UI elements
        controlPanel.style.display = originalVisibility.controlPanel;
        audioControls.style.display = originalVisibility.audioControls;
        inspiredBy.style.display = originalVisibility.inspiredBy;
        uiOverlay.style.display = originalVisibility.uiOverlay;
        
        // Show notification
        this.showDownloadNotification();
    });
}

showDownloadNotification() {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    notification.style.color = '#7df9ff';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.fontFamily = 'VT323, monospace';
    notification.style.fontSize = '20px';
    notification.style.zIndex = '100';
    notification.textContent = 'Screenshot saved';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 1s ease';
        setTimeout(() => notification.remove(), 1000);
    }, 2000);
}

  saveLandscapeImage() {
    // Find the panorama sphere texture
    const panoramaSphere = this.scene.getObjectByName('panoramaSphere');
    if (!panoramaSphere || !panoramaSphere.material || !panoramaSphere.material.map) {
        console.error('Cannot find panorama texture');
        return;
    }
    
    // Create a temporary canvas to draw the texture
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // Use original panorama dimensions
    const texture = panoramaSphere.material.map;
    const image = texture.image;
    canvas.width = image.width;
    canvas.height = image.height;
    
    // Draw the image to the canvas
    context.drawImage(image, 0, 0);
    
    // Create download link
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/jpeg');
    link.download = `vapor-landscape-${this.currentLocation.title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.jpg`;
    link.click();
    
    // Show notification
    this.showDownloadNotification('Landscape saved');
}

    openLocationHistoryPanel() {
        // Create the location history panel if it doesn't exist
        if (!document.getElementById('location-history-panel')) {
            const historyPanel = document.createElement('div');
            historyPanel.id = 'location-history-panel';
            
            const panelContent = document.createElement('div');
            panelContent.className = 'location-history-content';
            
            const title = document.createElement('h2');
            title.textContent = 'Previous Locations';
            panelContent.appendChild(title);
            
            // Display location history in reverse chronological order (newest first)
            this.locationHistory.slice().reverse().forEach((entry, index) => {
                const actualIndex = this.locationHistory.length - 1 - index; // Actual index in the original array
                const locationEntry = document.createElement('div');
                locationEntry.className = 'location-entry';
                locationEntry.dataset.index = actualIndex;
                
                const locationTitle = document.createElement('h3');
                locationTitle.textContent = entry.location.title;
                locationEntry.appendChild(locationTitle);
                
                const locationDesc = document.createElement('p');
                locationDesc.textContent = entry.location.description.substring(0, 100) + '...';
                locationEntry.appendChild(locationDesc);
                
                if (entry.directionChosen) {
                    const directionTaken = document.createElement('p');
                    directionTaken.className = 'direction-taken';
                    directionTaken.textContent = `You chose: ${entry.directionChosen.text}`;
                    locationEntry.appendChild(directionTaken);
                }
                
                locationEntry.addEventListener('click', () => {
                    this.returnToLocation(actualIndex);
                });
                
                panelContent.appendChild(locationEntry);
            });
            
            const controls = document.createElement('div');
            controls.className = 'history-controls';
            
            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.addEventListener('click', () => {
                this.closeLocationHistoryPanel();
            });
            
            controls.appendChild(cancelButton);
            panelContent.appendChild(controls);
            
            historyPanel.appendChild(panelContent);
            document.body.appendChild(historyPanel);
        }
        
        // Show the panel
        const historyPanel = document.getElementById('location-history-panel');
        historyPanel.classList.add('visible');
        this.isNavigating = false;
    }

    closeLocationHistoryPanel() {
        const historyPanel = document.getElementById('location-history-panel');
        if (historyPanel) {
            historyPanel.classList.remove('visible');
            setTimeout(() => {
                historyPanel.remove();
                // Reset navigation state and regenerate bubbles
                this.isNavigating = false;
                this.updateStoryBubble();
                this.generateNavigationOptions();
                const eyeMask = document.getElementById('eye-mask');
                eyeMask.classList.remove('eye-closed');
            }, 500);
        }
    }

    returnToLocation(index) {
        if (index >= 0 && index < this.locationHistory.length) {
            const entry = this.locationHistory[index];
            
            // Remove all locations after the selected one
            this.locationHistory = this.locationHistory.slice(0, index + 1);
            
            // Set the current location to the selected one
            this.currentLocation = entry.location;
            this.panoramaUrl = entry.panoramaUrl;
            
            // Close the panel
            this.closeLocationHistoryPanel();
            
            // Create the panorama and update UI
            document.getElementById('location-title').textContent = this.currentLocation.title;
            this.createPanoramaSphere();
            this.generateAmbience(this.currentLocation.description);
            this.generateCharacterThoughts();
            
            // Reset custom story mode when returning to a previous (non-custom) location
            this.customStory = false;
            this.resetCameraPosition();
        }
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const vapor = new VaporAdventure();
});
