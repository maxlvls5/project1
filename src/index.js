const BASE_URL = "http://localhost:3000/games";

handleForm();

function createButtons() {
  document
    .getElementById("mmorpg")
    .addEventListener("click", () => getFilteredGameData("mmorpg"));
  document
    .getElementById("RPG")
    .addEventListener("click", () => getFilteredGameData("RPG"));
  document
    .getElementById("moba")
    .addEventListener("click", () => getFilteredGameData("moba"));
  document
    .getElementById("all-games")
    .addEventListener("click", () => getGameData());
}
createButtons();

function getGameData() {
  renderDefaultData();
  document.getElementById("game-list").innerHTML = "";
  fetch(BASE_URL)
    .then((response) => response.json())
    .then((gameData) => gameData.forEach(renderGameData));
}

getGameData();

function renderDefaultData() {
  document.getElementById("delete-button").innerHTML = "";
  const detImg = document.querySelector(".game-image");
  detImg.src = "./src/gamer.jpg";

  const detName = document.querySelector(".name");
  detName.innerText = "";

  const detType = document.querySelector(".type");
  detType.innerText = "";

  const detRating = document.querySelector("#rating-display");
  detRating.innerText = "-";

  const detComment = document.querySelector("#comment-display");
  detComment.innerText = "";
}

function renderGameData(gameData) {
  const img = document.createElement("img");
  img.src = gameData.image;
  img.id = gameData.id;
  document.querySelector("#game-list").appendChild(img);

  // click on an img element
  img.addEventListener("click", (event) => {
    document.getElementById("delete-button").innerHTML = "";
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete Game";
    document.getElementById("delete-button").appendChild(deleteButton);
    deleteButton.addEventListener("click", (event) => {
      const confirmDeletion = confirm("Are you sure about that?");
      if (confirmDeletion) {
        handleDelete(gameData.id);
      }
    });

    const { image, name, type, rating, comment } = gameData;

    const detImg = document.querySelector(".game-image");
    detImg.src = image;

    const detName = document.querySelector(".name");
    detName.innerText = name;

    const detType = document.querySelector(".type");
    detType.innerText = type;

    const detRating = document.querySelector("#rating-display");
    detRating.innerText = rating;

    const detComment = document.querySelector("#comment-display");
    detComment.innerText = comment;
  });
}

function getFilteredGameData(type) {
  document.getElementById("game-list").innerHTML = "";
  renderDefaultData();
  fetch(BASE_URL)
    .then((response) => response.json())
    .then((gameData) => {
      const filteredGames = gameData.filter((game) => game.type === type);
      filteredGames.forEach(renderGameData);
    });
}

function handleForm() {
  const newGameForm = document.getElementById("new-game");

  newGameForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const newName = event.target["new-name"].value;
    const newType = event.target["new-type"].value;
    const newImg = event.target["new-image"].value;
    const newRating = event.target["new-rating"].value;
    const newComment = event.target["new-comment"].value;

    const newGame = {
      name: newName,
      type: newType,
      image: newImg,
      rating: newRating,
      comment: newComment,
    };

    fetch(BASE_URL, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(newGame),
    })
      .then((r) => r.json())
      .then((newEntity) => renderGameData(newEntity))
      .catch((error) => console.error(error));

    event.target.reset();
  });
}
function handleDelete(id) {
  document.getElementById("new-gameDelete");
  document.addEventListener("click", () => {
    fetch(BASE_URL + "/" + id, {
      method: "DELETE",
    })
      .then((res) => res.text()) // or res.json()
      .then((res) => {
        renderDefaultData();
        document.getElementById(id).remove();
      });
  });
}
