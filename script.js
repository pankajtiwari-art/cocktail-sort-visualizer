// --- DOM Elements ---
const container = document.getElementById('visualization-container');
const btnGenerate = document.getElementById('btn-generate');
const btnStart = document.getElementById('btn-start');
const btnPause = document.getElementById('btn-pause');
const sizeSlider = document.getElementById('size-slider');
const speedSlider = document.getElementById('speed-slider');
const sizeVal = document.getElementById('size-val');
const speedVal = document.getElementById('speed-val');
const soundToggle = document.getElementById('sound-toggle');

const statusText = document.getElementById('status-text');
const directionText = document.getElementById('direction-text');
const compCountEl = document.getElementById('comp-count');
const swapCountEl = document.getElementById('swap-count');

// --- Global State ---
let array = [];
let barElements = [];
let isSorting = false;
let isPaused = false;
let abortSort = false;
let delay = parseInt(speedSlider.value);
let comparisons = 0;
let swaps = 0;
let audioCtx = null;

// --- Initialize ---
function init() {
    generateArray();
    
    // Event Listeners
    btnGenerate.addEventListener('click', () => {
        if (isSorting) abortSort = true;
        generateArray();
    });
    
    // FIX: Initialize Audio exactly on Start Button Click to bypass browser restrictions
    btnStart.addEventListener('click', () => {
        initAudio(); 
        startSort();
    });
    
    btnPause.addEventListener('click', () => {
        isPaused = !isPaused;
        btnPause.innerText = isPaused ? "Resume" : "Pause";
        statusText.innerText = isPaused ? "Paused" : "Sorting...";
        statusText.style.color = isPaused ? "#f59e0b" : "#3b82f6";
    });

    sizeSlider.addEventListener('input', (e) => {
        if (!isSorting) {
            sizeVal.innerText = e.target.value;
            generateArray();
        }
    });

    speedSlider.addEventListener('input', (e) => {
        delay = e.target.value;
        let speedText = delay < 50 ? "Fast" : delay > 150 ? "Slow" : "Medium";
        speedVal.innerText = speedText;
        document.documentElement.style.setProperty('--transition-speed', `${delay / 1000}s`);
    });
}

// --- Audio System (FIXED) ---
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playSound(type, val = 50) {
    if (!soundToggle.checked || !audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (type === 'compare') {
        osc.type = 'sawtooth'; // Sawtooth jyada clear sunai deta hai
        osc.frequency.setValueAtTime(200 + (val * 8), audioCtx.currentTime); 
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime); // Volume increased
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.05);
    } else if (type === 'swap') {
        osc.type = 'square'; // Swap ke liye thoda bhari sound
        osc.frequency.setValueAtTime(100, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime); // Volume increased
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.1);
    }
}

// --- Helper Functions ---
async function sleep() {
    while (isPaused && !abortSort) {
        await new Promise(r => setTimeout(r, 50));
    }
    if (abortSort) throw new Error("Sort Aborted");
    return new Promise(resolve => setTimeout(resolve, delay));
}

function updateCounters() {
    compCountEl.innerText = comparisons;
    swapCountEl.innerText = swaps;
}

// --- Core Logic ---
function generateArray() {
    container.innerHTML = '';
    array = [];
    barElements = [];
    comparisons = 0;
    swaps = 0;
    updateCounters();
    
    statusText.innerText = "Idle";
    statusText.style.color = "var(--text-main)";
    directionText.innerText = "-";
    container.className = 'visualization-container'; 
    
    btnStart.disabled = false;
    btnPause.disabled = true;
    sizeSlider.disabled = false;
    isSorting = false;
    isPaused = false;
    abortSort = false;
    btnPause.innerText = "Pause";

    const size = parseInt(sizeSlider.value);
    const barWidth = 100 / size;

    for (let i = 0; i < size; i++) {
        const val = Math.floor(Math.random() * 90) + 10;
        array.push(val);

        const bar = document.createElement('div');
        bar.classList.add('bar');
        
        bar.style.height = `${val}%`;
        bar.style.width = `${barWidth - 0.2}%`;
        bar.style.left = `${i * barWidth}%`;
        
        container.appendChild(bar);
        barElements.push(bar);
    }
}

async function swapBars(i, j) {
    swaps++;
    updateCounters();
    playSound('swap');

    let barI = barElements[i];
    let barJ = barElements[j];

    barI.classList.add('swapping');
    barJ.classList.add('swapping');

    let tempLeft = barI.style.left;
    barI.style.left = barJ.style.left;
    barJ.style.left = tempLeft;

    await sleep();

    barElements[i] = barJ;
    barElements[j] = barI;
    
    let tempVal = array[i];
    array[i] = array[j];
    array[j] = tempVal;

    barI.classList.remove('swapping');
    barJ.classList.remove('swapping');
}

// --- Cocktail Sort Algorithm ---
async function startSort() {
    isSorting = true;
    abortSort = false;
    btnStart.disabled = true;
    btnGenerate.disabled = true;
    btnPause.disabled = false;
    sizeSlider.disabled = true;
    
    statusText.innerText = "Sorting...";
    statusText.style.color = "var(--bar-default)";

    let start = 0;
    let end = array.length - 1;
    let swapped = true;

    try {
        while (swapped && start <= end) {
            swapped = false;

            // FORWARD PASS
            directionText.innerText = "Forward (→)";
            directionText.style.color = "var(--bar-default)";
            container.className = 'visualization-container forward-pass';

            for (let i = start; i < end; i++) {
                comparisons++;
                updateCounters();
                
                barElements[i].classList.add('comparing');
                barElements[i+1].classList.add('comparing');
                playSound('compare', array[i]);
                
                await sleep();

                if (array[i] > array[i + 1]) {
                    await swapBars(i, i + 1);
                    swapped = true;
                }

                barElements[i].classList.remove('comparing');
                barElements[i+1].classList.remove('comparing');
            }

            if (!swapped) break;
            
            barElements[end].classList.add('sorted');
            swapped = false;
            end--;

            // BACKWARD PASS
            directionText.innerText = "Backward (←)";
            directionText.style.color = "#a855f7"; 
            container.className = 'visualization-container backward-pass';

            for (let i = end - 1; i >= start; i--) {
                comparisons++;
                updateCounters();

                barElements[i].classList.add('comparing');
                barElements[i+1].classList.add('comparing');
                playSound('compare', array[i]);

                await sleep();

                if (array[i] > array[i + 1]) {
                    await swapBars(i, i + 1);
                    swapped = true;
                }

                barElements[i].classList.remove('comparing');
                barElements[i+1].classList.remove('comparing');
            }
            
            barElements[start].classList.add('sorted');
            start++;
        }

        // Green fill effect at the end
        for(let i = start; i <= end; i++) {
             barElements[i].classList.add('sorted');
             playSound('compare', array[i]);
             await sleep();
        }

        statusText.innerText = "Completed! 🎉";
        statusText.style.color = "var(--bar-sorted)";
        directionText.innerText = "Done";
        container.className = 'visualization-container';

    } catch (error) {
        console.log("Process stopped by user.");
    } finally {
        isSorting = false;
        btnStart.disabled = false;
        btnGenerate.disabled = false;
        btnPause.disabled = true;
        sizeSlider.disabled = false;
    }
}

// Start the app
init();
