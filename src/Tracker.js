import Storage from "./Storage.js";

class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit();
    this._totalCalories = Storage.getTotalCalories();
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();

    this._displayCaloriesLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgressBar();

    document.getElementById("limit").value = this._calorieLimit;
  }

  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveMeal(meal);
    this._displayNewItem("meal", meal);
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveWorkout(workout);
    this._displayNewItem("workout", workout);
    this._render();
  }

  removeItem(type, id) {
    if (type === "meal") {
      const index = this._meals.findIndex((meal) => meal.id === id);

      if (index != -1) {
        const meal = this._meals[index];
        this._totalCalories -= meal.calories;
        Storage.updateTotalCalories(this._totalCalories);
        this._meals.splice(index, 1);
        Storage.removeMeal(id);
        this._render();
      }
    } else {
      const index = this._workouts.findIndex((workout) => workout.id === id);

      if (index != -1) {
        const workout = this._workouts[index];
        this._totalCalories += workout.calories;
        Storage.updateTotalCalories(this._totalCalories);
        this._workouts.splice(index, 1);
        Storage.removeWorkout(id);
        this._render();
      }
    }
  }

  reset() {
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    Storage.clearStorage();
    this._render();
  }

  setLimit(calorieLimit) {
    this._calorieLimit = calorieLimit;
    Storage.setCalorieLimit(calorieLimit);
    this._displayCaloriesLimit();
    this._render();
  }

  loadItems() {
    this._meals.forEach((meal) => this._displayNewItem("meal", meal));
    this._workouts.forEach((workout) =>
      this._displayNewItem("workout", workout)
    );
  }

  _displayCaloriesTotal() {
    const totalCaloriesEl = document.getElementById("calories-total");
    totalCaloriesEl.innerHTML = this._totalCalories;
  }

  _displayCaloriesLimit() {
    const calorieLimitEl = document.getElementById("calories-limit");
    calorieLimitEl.innerHTML = this._calorieLimit;
  }

  _displayCaloriesConsumed() {
    const caloriesConsumedEl = document.getElementById("calories-consumed");

    const consumed = this._meals.reduce(
      (total, meal) => total + meal.calories,
      0
    );

    caloriesConsumedEl.innerHTML = consumed;
  }

  _displayCaloriesBurned() {
    const caloriesBurnedEl = document.getElementById("calories-burned");

    const burned = this._workouts.reduce(
      (total, workout) => total + workout.calories,
      0
    );

    caloriesBurnedEl.innerHTML = burned;
  }

  _displayCaloriesRemaining() {
    const caloriesRemainingEl = document.getElementById("calories-remaining");
    const progressBarEl = document.getElementById("calorie-progress");

    const remaining = this._calorieLimit - this._totalCalories;

    caloriesRemainingEl.innerHTML = remaining;

    if (remaining <= 0) {
      caloriesRemainingEl.parentElement.parentElement.classList.add("red");
      progressBarEl.classList.remove("green");
      progressBarEl.classList.add("red");
    } else {
      caloriesRemainingEl.parentElement.parentElement.classList.remove("red");
      progressBarEl.classList.remove("red");
      progressBarEl.classList.add("green");
    }
  }

  _displayCaloriesProgressBar() {
    const progressBarEl = document.getElementById("calorie-progress");
    const percentage = (this._totalCalories / this._calorieLimit) * 100;
    const width = Math.min(percentage, 100);
    progressBarEl.style.width = `${width}%`;
  }

  _displayNewItem(type, obj) {
    const itemsEl = document.getElementById(`${type}-items`);

    const itemEl = document.createElement("div");
    itemEl.classList.add("new-item-card");
    itemEl.setAttribute("data-id", obj.id);
    itemEl.innerHTML = `
                    <h4>${obj.name}</h4>
                    <div
                      class="${type === "meal" ? "meal" : "workout"}-calorie"
                    >
                     ${obj.calories}
                    </div>
                    <button class="delete">
                    &#10005;
                    </button>       
      `;

    itemsEl.appendChild(itemEl);
  }

  _render() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgressBar();
  }
}

export default CalorieTracker;
