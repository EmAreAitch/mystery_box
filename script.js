// DOM elements - Challenge
const startBtn = document.getElementById('start-btn');
const drawAgainBtn = document.getElementById('draw-again-btn');
const resetBtn = document.getElementById('reset-btn');
const introSection = document.getElementById('intro-section');
const drawingSection = document.getElementById('drawing-section');
const resultSection = document.getElementById('result-section');
const combinationNumber = document.getElementById('combination-number');
const combinationItems = document.getElementById('combination-items');
const countdownElement = document.getElementById('countdown');
const mysteryBox = document.querySelector('.mystery-box');
const combinationsCountEl = document.getElementById('combinations-count');

// DOM elements - Admin & Navigation Tabs
const navTabs = document.querySelector('.nav-tabs');
const challengeTab = document.getElementById('challenge-tab');
const adminTab = document.getElementById('admin-tab');
const resultsTab = document.getElementById('results-tab');
const challengeSection = document.getElementById('challenge-section');
const adminSection = document.getElementById('admin-section');

// DOM elements - Admin Form
const combinationNumberInput = document.getElementById('combination-number-input');
const item1Input = document.getElementById('item1-input');
const item2Input = document.getElementById('item2-input');
const item3Input = document.getElementById('item3-input');
const addCombinationBtn = document.getElementById('add-combination-btn');
const bulkImportTextarea = document.getElementById('bulk-import');
const importBtn = document.getElementById('import-btn');
const combinationsTable = document.getElementById('combinations-table');
const combinationsTbody = document.getElementById('combinations-tbody');
const noCombinationsMsg = document.getElementById('no-combinations-msg');
const clearAllBtn = document.getElementById('clear-all-btn');
const addSampleBtn = document.getElementById('add-sample-btn');

// DOM elements - Results Section
const resultsSection = document.getElementById('results-section');
const resultRoundNumber = document.getElementById('result-round-number');
const resultTeamCombination = document.getElementById('result-team-combination');
const prevResultBtn = document.getElementById('prev-result-btn');
const nextResultBtn = document.getElementById('next-result-btn');

// Global arrays and counters
let combinations = [];
let usedCombinations = [];
let roundResults = []; // To store each round's result along with team info
let currentRound = 1;  // Increments with each drawn round
let currentResultIndex = 0; // For navigating round results

// Sample combinations for quick setup
const sampleCombinations = [
  { number: 1, items: ["Shoe", "Flashlight", "Compass"] },
  { number: 2, items: ["Watch", "Stethoscope", "Language Translator"] },
  { number: 3, items: ["Bicycle", "Solar Charger", "Refrigerator"] },
  { number: 4, items: ["Pen", "Voice Recorder", "Language Translator"] },
  { number: 5, items: ["Umbrella", "Bluetooth Speaker", "Water Bottle"] }
];

// Local Storage Functions
function loadCombinations() {
  const savedCombinations = localStorage.getItem('mysteryCombinations');
  if (savedCombinations) {
    combinations = JSON.parse(savedCombinations);
    updateCombinationsTable();
    updateCombinationsCount();
  }
}

function saveCombinations() {
  localStorage.setItem('mysteryCombinations', JSON.stringify(combinations));
  updateCombinationsCount();
}

function updateCombinationsCount() {
  combinationsCountEl.textContent = `Current combinations: ${combinations.length}`;
}

// Initialize UI
loadCombinations();
updateCombinationsCount();

// Tab Navigation
challengeTab.addEventListener('click', () => {
  challengeTab.classList.add('active');
  adminTab.classList.remove('active');
  resultsTab.classList.remove('active');

  challengeSection.classList.remove('hidden');
  adminSection.classList.add('hidden');
  resultSection.classList.add('hidden');
  resultsSection.classList.add('hidden');
  navTabs.classList.remove('hidden'); // Ensure nav tabs are visible
});

adminTab.addEventListener('click', () => {
  adminTab.classList.add('active');
  challengeTab.classList.remove('active');
  resultsTab.classList.remove('active');

  adminSection.classList.remove('hidden');
  challengeSection.classList.add('hidden');
  resultSection.classList.add('hidden');
  resultsSection.classList.add('hidden');
  navTabs.classList.remove('hidden');
});

resultsTab.addEventListener('click', () => {
  resultsTab.classList.add('active');
  challengeTab.classList.remove('active');
  adminTab.classList.remove('active');

  resultsSection.classList.remove('hidden');
  challengeSection.classList.add('hidden');
  adminSection.classList.add('hidden');
  resultSection.classList.add('hidden');
  navTabs.classList.remove('hidden');

  // Show the latest round result
  currentResultIndex = 0
  updateResultsCard();
});

// Update Combinations Table (Admin Section)
function updateCombinationsTable() {
  if (combinations.length === 0) {
    noCombinationsMsg.classList.remove('hidden');
    combinationsTable.classList.add('hidden');
    return;
  }
  noCombinationsMsg.classList.add('hidden');
  combinationsTable.classList.remove('hidden');

  // Sort combinations by number
  combinations.sort((a, b) => a.number - b.number);
  combinationsTbody.innerHTML = '';

  combinations.forEach(combo => {
    const row = document.createElement('tr');

    const numberCell = document.createElement('td');
    numberCell.textContent = combo.number;
    row.appendChild(numberCell);

    const itemsCell = document.createElement('td');
    itemsCell.textContent = combo.items.join(', ');
    row.appendChild(itemsCell);

    const actionsCell = document.createElement('td');
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteCombination(combo.number));
    actionsCell.appendChild(deleteBtn);
    row.appendChild(actionsCell);

    combinationsTbody.appendChild(row);
  });
}

// Add a single combination (Admin Section)
function addCombination() {
  const number = parseInt(combinationNumberInput.value);
  const item1 = item1Input.value.trim();
  const item2 = item2Input.value.trim();
  const item3 = item3Input.value.trim();

  if (isNaN(number) || number <= 0) {
    alert('Please enter a valid combination number.');
    return;
  }

  if (!item1 || !item2 || !item3) {
    alert('Please enter all three items.');
    return;
  }

  const existingIndex = combinations.findIndex(c => c.number === number);
  if (existingIndex >= 0) {
    combinations[existingIndex].items = [item1, item2, item3];
  } else {
    combinations.push({ number: number, items: [item1, item2, item3] });
  }

  // Clear inputs
  combinationNumberInput.value = '';
  item1Input.value = '';
  item2Input.value = '';
  item3Input.value = '';
  
  updateCombinationsTable();
  saveCombinations();
}

function deleteCombination(number) {
  combinations = combinations.filter(c => c.number !== number);
  updateCombinationsTable();
  saveCombinations();
}

function clearAllCombinations() {
  if (combinations.length === 0) return;
  if (confirm('Are you sure you want to delete all combinations?')) {
    combinations = [];
    updateCombinationsTable();
    saveCombinations();
  }
}

function importCombinations() {
  const bulkText = bulkImportTextarea.value.trim();
  if (!bulkText) {
    alert('Please enter combinations to import.');
    return;
  }
  const lines = bulkText.split('\n');
  let importCount = 0;
  lines.forEach(line => {
    const match = line.match(/Combination\s+(\d+):\s+(.+)/i);
    if (match) {
      const number = parseInt(match[1]);
      const itemsText = match[2];
      const items = itemsText.split(',').map(item => item.trim()).filter(item => item);
      if (items.length >= 3) {
        const itemsToAdd = items.slice(0, 3);
        const existingIndex = combinations.findIndex(c => c.number === number);
        if (existingIndex >= 0) {
          combinations[existingIndex].items = itemsToAdd;
        } else {
          combinations.push({ number: number, items: itemsToAdd });
        }
        importCount++;
      }
    }
  });
  if (importCount > 0) {
    updateCombinationsTable();
    saveCombinations();
    bulkImportTextarea.value = '';
    alert(`Successfully imported ${importCount} combinations.`);
  } else {
    alert('No valid combinations found. Please check the format and try again.');
  }
}

function addSampleCombinations() {
  sampleCombinations.forEach(sample => {
    if (!combinations.some(c => c.number === sample.number)) {
      combinations.push(sample);
    }
  });
  updateCombinationsTable();
  saveCombinations();
}

// Challenge Functions
function startDrawing() {
  if (combinations.length === 0) {
    alert('Please add combinations in the Manage tab first.');
    adminTab.click(); // Switch to admin tab if no combinations exist
    return;
  }
  // Hide intro and result sections, show drawing section, and hide nav tabs
  introSection.classList.add('hidden');
  resultSection.classList.add('hidden');
  drawingSection.classList.remove('hidden');
  navTabs.classList.add('hidden');
  
  mysteryBox.classList.remove('open-box');
  let count = 3;
  countdownElement.textContent = count;
  
  const countdownInterval = setInterval(() => {
    count--;
    countdownElement.textContent = count;
    if (count === 0) {
      clearInterval(countdownInterval);
      mysteryBox.classList.add('open-box');
      setTimeout(() => {
        showResult();
      }, 1000);
    }
  }, 1000);
}

function showResult() {
  const randomCombination = getRandomCombination();
  combinationNumber.textContent = `Team ${currentRound} - Combination #${randomCombination.number}`;
  combinationItems.innerHTML = '';
  randomCombination.items.forEach(item => {
    const itemSpan = document.createElement('span');
    itemSpan.className = 'item';
    itemSpan.textContent = item;
    combinationItems.appendChild(itemSpan);
  });

  // Determine team label based on current round (odd: Team 1, even: Team 2)
  const teamLabel = `Team ${currentRound}`

  // Store result with round number, team, and combination details
  roundResults.push({
    round: currentRound,
    team: teamLabel,
    combination: randomCombination
  });
  currentRound++;

  drawingSection.classList.add('hidden');
  resultSection.classList.remove('hidden');
}

function getRandomCombination() {
  if (usedCombinations.length >= combinations.length) {
    usedCombinations = [];
  }
  let availableCombinations = combinations.filter(combo => !usedCombinations.includes(combo.number));
  if (availableCombinations.length === 0) {
    usedCombinations = [];
    availableCombinations = combinations;
  }
  const randomIndex = Math.floor(Math.random() * availableCombinations.length);
  const selectedCombination = availableCombinations[randomIndex];
  usedCombinations.push(selectedCombination.number);
  return selectedCombination;
}

function resetChallenge() {
  // Reset to initial state: show intro and reveal nav tabs
  resultSection.classList.add('hidden');
  introSection.classList.remove('hidden');
  navTabs.classList.remove('hidden');
}

// Event Listeners - Challenge
startBtn.addEventListener('click', startDrawing);
drawAgainBtn.addEventListener('click', startDrawing);
resetBtn.addEventListener('click', resetChallenge);

// Event Listeners - Admin
addCombinationBtn.addEventListener('click', addCombination);
importBtn.addEventListener('click', importCombinations);
clearAllBtn.addEventListener('click', clearAllCombinations);
addSampleBtn.addEventListener('click', addSampleCombinations);

// Results Navigation Functions
function updateResultsCard() {
  if (roundResults.length === 0) {
    resultRoundNumber.textContent = "No results yet.";
    resultTeamCombination.innerHTML = "";
    return;
  }
  resultTeamCombination.innerHTML = "";
  const currentResult = roundResults[currentResultIndex];
  
  // Display team label and combination number similar to challenge display
  resultRoundNumber.textContent = `${currentResult.team} - Combination #${currentResult.combination.number}`;
  
  // Create item spans as in the challenge results
  currentResult.combination.items.forEach(item => {
    const itemSpan = document.createElement('span');
    itemSpan.className = 'item';
    itemSpan.textContent = item;
    resultTeamCombination.appendChild(itemSpan);
  });
}

prevResultBtn.addEventListener('click', () => {
  if (roundResults.length === 0) return;
  currentResultIndex = (currentResultIndex - 1 + roundResults.length) % roundResults.length;
  updateResultsCard();
});

nextResultBtn.addEventListener('click', () => {
  if (roundResults.length === 0) return;
  currentResultIndex = (currentResultIndex + 1) % roundResults.length;
  updateResultsCard();
});
