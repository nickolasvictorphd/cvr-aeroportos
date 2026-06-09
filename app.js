const factors = {
  inicial: {
    baixa: 1.25,
    media: 1.5,
    alta: 1.8,
    muitoAlta: 2,
  },
  medio: {
    baixa: 1.5,
    media: 2,
    alta: 2.5,
    muitoAlta: 3,
  },
  avancado: {
    baixa: 2,
    media: 3,
    alta: 5,
    muitoAlta: 6,
  },
};

const stageLabels = {
  inicial: "Inicial",
  medio: "Médio",
  avancado: "Primária ou estágio avançado",
};

const priorityLabels = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
  muitoAlta: "Muito alta",
};

const treeFactors = {
  le5: 25,
  between: 15,
  ge20: 10,
};

const defaultSegments = [
  { area: 4, stage: "inicial", priority: "media" },
  { area: 3, stage: "medio", priority: "alta" },
];

let nextSegmentId = 1;

const form = document.querySelector("#cvrForm");
const segmentsList = document.querySelector("#segmentsList");
const addSegmentButton = document.querySelector("#addSegmentButton");
const resetButton = document.querySelector("#resetButton");

const inputs = {
  trees: document.querySelector("#treesInput"),
  threatened: document.querySelector("#threatenedInput"),
  coverage: document.querySelector("#coverageSelect"),
};

const output = {
  total: document.querySelector("#totalCvr"),
  area: document.querySelector("#areaCvr"),
  trees: document.querySelector("#treeCvr"),
  segmentCount: document.querySelector("#segmentCount"),
};

function numberValue(input) {
  const value = Number(input.value);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function formatHectares(value) {
  return `${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ha`;
}

function optionMarkup(options, selectedValue) {
  return Object.entries(options)
    .map(([value, label]) => `<option value="${value}" ${value === selectedValue ? "selected" : ""}>${label}</option>`)
    .join("");
}

function createSegmentRow(segment) {
  const id = nextSegmentId++;
  const row = document.createElement("div");
  row.className = "segment-row";
  row.dataset.segmentId = String(id);
  row.innerHTML = `
    <div class="segment-top">
      <span class="segment-title">Trecho ${id}</span>
      <button class="segment-remove" type="button" aria-label="Remover trecho ${id}">×</button>
    </div>
    <div class="segment-grid">
      <label>
        Área
        <span class="input-row">
          <input class="segment-area" type="number" min="0" step="0.1" value="${segment.area}" />
          <span>ha</span>
        </span>
      </label>
      <label>
        Estágio
        <select class="segment-stage">
          ${optionMarkup(stageLabels, segment.stage)}
        </select>
      </label>
      <label>
        Prioridade
        <select class="segment-priority">
          ${optionMarkup(priorityLabels, segment.priority)}
        </select>
      </label>
    </div>
    <p class="segment-result">Fator: 0× · CVR: 0,00 ha</p>
  `;
  segmentsList.append(row);
}

function getSegmentRows() {
  return [...segmentsList.querySelectorAll(".segment-row")];
}

function calculateAreaCvr() {
  return getSegmentRows().reduce((sum, row) => {
    const area = numberValue(row.querySelector(".segment-area"));
    const stage = row.querySelector(".segment-stage").value;
    const priority = row.querySelector(".segment-priority").value;
    const factor = factors[stage][priority];
    const segmentCvr = area * factor;
    row.querySelector(".segment-result").textContent = `Fator: ${factor.toLocaleString("pt-BR")}× · CVR: ${formatHectares(segmentCvr)}`;
    return sum + segmentCvr;
  }, 0);
}

function calculateCvr() {
  const areaCvr = calculateAreaCvr();
  const trees = numberValue(inputs.trees);
  const threatened = numberValue(inputs.threatened);
  const coverage = inputs.coverage.value;

  const regularTreeFactor = treeFactors[coverage];
  const treeCvr = (trees * regularTreeFactor + threatened * 30) / 1000;
  const total = areaCvr + treeCvr;
  const segmentCount = getSegmentRows().length;

  output.total.textContent = formatHectares(total);
  output.area.textContent = `Vegetação: ${formatHectares(areaCvr)}`;
  output.trees.textContent = `Árvores: ${formatHectares(treeCvr)}`;
  output.segmentCount.textContent = `${segmentCount} ${segmentCount === 1 ? "trecho" : "trechos"}`;
}

function addSegment(segment = { area: 1, stage: "inicial", priority: "baixa" }) {
  createSegmentRow(segment);
  calculateCvr();
}

function restoreDefaults() {
  segmentsList.replaceChildren();
  nextSegmentId = 1;
  defaultSegments.forEach(createSegmentRow);
  inputs.trees.value = 40;
  inputs.threatened.value = 0;
  inputs.coverage.value = "between";
  calculateCvr();
}

form.addEventListener("input", calculateCvr);
form.addEventListener("change", calculateCvr);
segmentsList.addEventListener("click", (event) => {
  const removeButton = event.target.closest(".segment-remove");
  if (!removeButton) return;
  const rows = getSegmentRows();
  if (rows.length === 1) return;
  removeButton.closest(".segment-row").remove();
  calculateCvr();
});
addSegmentButton.addEventListener("click", () => addSegment());
resetButton.addEventListener("click", restoreDefaults);

restoreDefaults();
