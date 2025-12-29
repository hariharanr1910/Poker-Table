let players = [];
let dealerIndex = 0;
let handNumber = 1;
let history = [];

/* Load saved game */
function loadGame() {
  const data = JSON.parse(localStorage.getItem("pokerGame"));
  if (!data) return;

  players = data.players;
  dealerIndex = data.dealerIndex;
  handNumber = data.handNumber;
  history = data.history || [];
}

/* Save game */
function saveGame() {
  localStorage.setItem("pokerGame", JSON.stringify({
    players,
    dealerIndex,
    handNumber,
    history
  }));
}

/* Add player */
function addPlayer() {
  const input = document.getElementById("playerName");
  const name = input.value.trim();
  if (!name) return;

  players.push({ name, wins: 0 });
  input.value = "";
  saveGame();
  render();
}

/* Confirm winners */
function confirmWinners() {
  const checked = [...document.querySelectorAll("input[type=checkbox]:checked")]
    .map(cb => parseInt(cb.dataset.index));

  if (checked.length === 0) return;

  checked.forEach(i => players[i].wins++);

  history.push({
    winners: checked,
    dealerIndex
  });

  dealerIndex = (dealerIndex + 1) % players.length;
  handNumber++;

  saveGame();
  render();
}

/* Undo last hand */
function undoLastHand() {
  if (history.length === 0) return;

  const last = history.pop();
  last.winners.forEach(i => players[i].wins--);

  dealerIndex = last.dealerIndex;
  handNumber--;

  saveGame();
  render();
}

/* Render UI */
function render() {
  document.querySelector(".hand").innerText = `Hand #${handNumber}`;

  const list = document.querySelector(".players");
  list.innerHTML = "";

  players.forEach((p, i) => {
    let role = "";
    if (i === dealerIndex) role = "Dealer";
    else if (i === (dealerIndex + 1) % players.length) role = "SB";
    else if (i === (dealerIndex + 2) % players.length) role = "BB";

    list.innerHTML += `
      <div class="player ${role.toLowerCase()}">
        <label>
          <input type="checkbox" data-index="${i}">
          <span class="name">${p.name}</span>
        </label>
        <span class="role">${role}</span>
        <span class="wins">Wins: ${p.wins}</span>
      </div>
    `;
  });
}

/* Start */
loadGame();
render();
