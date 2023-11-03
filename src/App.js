import CalorieTracker from "./Tracker.js";
import { Workout, Meal } from "./Items.js";

class App {
  constructor() {
    this._tracker = new CalorieTracker();
    this._loadEventListeners();
    this._tracker.loadItems();
  }

  _loadEventListeners() {
    document
      .getElementById("meal-form")
      .addEventListener("submit", this._newItem.bind(this, "meal"));
    document
      .getElementById("workout-form")
      .addEventListener("submit", this._newItem.bind(this, "workout"));
    document
      .getElementById("meal-items")
      .addEventListener("click", this._removeItem.bind(this, "meal"));
    document
      .getElementById("workout-items")
      .addEventListener("click", this._removeItem.bind(this, "workout"));
    document
      .getElementById("filter-meals")
      .addEventListener("keyup", this._filterItems.bind(this, "meal"));
    document
      .getElementById("filter-workouts")
      .addEventListener("keyup", this._filterItems.bind(this, "workout"));
    document
      .getElementById("reset")
      .addEventListener("click", this._reset.bind(this));
    document
      .getElementById("limit-form")
      .addEventListener("submit", this._setLimit.bind(this));
    const collapse = document.querySelectorAll("#btn-collapse");
    for (let i = 0; i < collapse.length; i++) {
      collapse[i].addEventListener("click", this._collapseButton.bind(this));
    }
    document
      .getElementById("modal")
      .addEventListener("click", this._toggleModal.bind(this));
    const closeModal = document.querySelectorAll("#close-modal");
    for (let i = 0; i < closeModal.length; i++) {
      closeModal[i].addEventListener("click", this._toggleModal.bind(this));
    }
  }

  _toggleModal() {
    const modal = document.querySelector("#modal-body");
    const overlay = document.querySelector("#overlay");

    modal.classList.toggle("hide");
    overlay.classList.toggle("hide");
  }

  _collapseButton(e) {
    if (e.target.innerText.indexOf("Workout") > 1) {
      const form = document.getElementById(`workout-form-container`);
      if (form.style.display === "block") {
        form.style.display = "none";
      } else {
        form.style.display = "block";
      }
    }

    if (e.target.innerText.indexOf("Meal") > 1) {
      const form = document.getElementById(`meal-form-container`);
      if (form.style.display === "block") {
        form.style.display = "none";
      } else {
        form.style.display = "block";
      }
    }
  }

  _newItem(type, e) {
    e.preventDefault();

    const name = document.getElementById(`${type}-name`);
    const calories = document.getElementById(`${type}-calories`);

    if (name.value === "" || calories.value === "") {
      alert("Please fill in all fields");
      return;
    }

    if (type === "meal") {
      const meal = new Meal(name.value, +calories.value);
      this._tracker.addMeal(meal);
      const form = document.getElementById(`meal-form-container`);
      form.style.display = "none";
    } else {
      const workout = new Workout(name.value, +calories.value);
      this._tracker.addWorkout(workout);
      const form = document.getElementById(`workout-form-container`);
      form.style.display = "none";
    }

    name.value = "";
    calories.value = "";
  }

  _removeItem(type, e) {
    if (e.target.classList.contains("delete")) {
      if (confirm("Are you sure?")) {
        const id = e.target.closest(".new-item-card").getAttribute("data-id");

        this._tracker.removeItem(type, id);
        e.target.closest(".new-item-card").remove();
      }
    }
  }

  _filterItems(type, e) {
    const text = e.target.value.toLowerCase();

    document
      .querySelectorAll(`#${type}-items .new-item-card`)
      .forEach((item) => {
        const name = item.firstElementChild.textContent;

        if (name.toLowerCase().indexOf(text) !== -1) {
          item.style.display = "flex";
        } else {
          item.style.display = "none";
        }
      });
  }

  _reset() {
    this._tracker.reset();
    document.getElementById("meal-items").innerHTML = "";
    document.getElementById("workout-items").innerHTML = "";
    document.getElementById("filter-meals").value = "";
    document.getElementById("filter-workouts").value = "";
  }

  _setLimit(e) {
    e.preventDefault();

    const limit = document.getElementById("limit");

    if (limit.value === "") {
      alert("Please add a limit");
      return;
    }

    this._tracker.setLimit(+limit.value);
    limit.value = "";
  }
}

const app = new App();
