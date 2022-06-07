let workoutArray = [];

const mensCaloriesPerWorkout = {
  Walking: 10,
  Jogging: 12,
  Sprints: 15,
  Strength_Training: 4,
  Yoga: 6,
  Dance: 10,
  Cycling: 13,
  Elliptical: 7,
  Crossfit: 16,
  Jump_Rope: 17,
  Basketball: 10,
  Soccer: 8,
};

const womensCaloriesPerWorkout = {
  Walking: 8,
  Jogging: 10,
  Sprints: 13,
  Strength_Training: 4,
  Yoga: 6,
  Dance: 10,
  Cycling: 11,
  Elliptical: 7,
  Crossfit: 14,
  Jump_Rope: 17,
  Basketball: 8,
  Soccer: 7,
};

let WorkoutObject = function (
  bodyType,
  workoutType,
  workoutIntensity,
  workoutDuration
) {
  let self = this;
  this.bodyType = bodyType;
  this.workoutType = workoutType;
  this.workoutIntensity = workoutIntensity;
  this.workoutDuration = workoutDuration;
  this.ID = Math.random().toString(16).slice(5);

  this.MAX_OUTPUT = 5;
  this.CaloriesPerMinute = () => {
    return this.bodyType === "Man"
      ? mensCaloriesPerWorkout[this.workoutType]
      : womensCaloriesPerWorkout[this.workoutType];
  };
  this.CalculateCalories = () => {
    return Math.round(
      self.CaloriesPerMinute() *
        (self.workoutIntensity / self.MAX_OUTPUT) *
        self.workoutDuration
    );
  };

  return this;
};

workoutArray.push(new WorkoutObject("Man", "Sprints", 3, 45));
workoutArray.push(new WorkoutObject("Woman", "Yoga", 3, 60));
workoutArray.push(new WorkoutObject("Man", "Strength_Training", 3, 75));

document.addEventListener("DOMContentLoaded", function () {
  createList();

  // add button events ************************************************************************

  document.getElementById("addBtn").addEventListener("click", function () {
    workoutArray.push(
      new WorkoutObject(
        document.getElementById("body-type").value,
        document.getElementById("workout-type").value,
        document.getElementById("intensity").value,
        document.getElementById("workout-duration-input").value
      )
    );
  });
  // document.location.href = "index.html#ListAll";
  // also add the URL value

  // page before show code *************************************************************************
  $(document).on("pagebeforeshow", "#show", function (event) {
    // have to use jQuery
    createList();
  });

  // need one for our details page to fill in the info based on the passed in ID
  $(document).on("pagebeforeshow", "#details", function (event) {
    console.log(localStorage);
    let workoutID = localStorage.getItem("parm"); // get the unique key back from the storage dictionairy
    let workoutTitle = localStorage.getItem("title");
    let workoutIntensity = localStorage.getItem("intensity");
    let workoutDuration = localStorage.getItem("duration");
    let calories = localStorage.getItem("calories");
    document.getElementById("workout-id").innerHTML = workoutID;
    document.getElementById(
      "workout-title"
    ).innerHTML = `Workout Type: ${workoutTitle}`;
    document.getElementById(
      "workout-intensity"
    ).innerHTML = `Workout Intensity (1-5): ${workoutIntensity}`;
    document.getElementById(
      "workout-duration"
    ).innerHTML = `Workout Duration(in minutes): ${workoutDuration}`;
    document.getElementById(
      "calories"
    ).innerHTML = `Total Calories Burned: ${calories}`;
  });

  // end of page before show code *************************************************************************
});

function getCalories() {}

function createList() {
  // clear prior data
  let theList = document.getElementById("myul");
  theList.innerHTML = "";

  workoutArray.forEach(function (element, i) {
    // use handy array forEach method
    var myLi = document.createElement("li");
    myLi.classList.add("workout-link");
    myLi.innerHTML =
      element.workoutType + ":  " + element.workoutDuration + " mins";

    // use the html5 "data-parm" to store the ID of this particular workout object
    // that we are currently building an li for so that I can later know which workout this li came from
    myLi.setAttribute("data-parm", element.ID);
    myLi.setAttribute("workout-title", element.workoutType);
    myLi.setAttribute("workout-intensity", element.workoutIntensity);
    myLi.setAttribute("workout-duration", element.workoutDuration);
    myLi.setAttribute("calories", element.CalculateCalories());

    theList.appendChild(myLi);

    var liList = document.getElementsByClassName("workout-link");

    let newWorkoutArray = Array.from(liList);

    newWorkoutArray.forEach(function (element, i) {
      element.addEventListener("click", function () {
        var parm = this.getAttribute("data-parm");
        let title = this.getAttribute("workout-title");
        // var duration = this.getAttribute("workout-duration");
        var intensity = this.getAttribute("workout-intensity");
        var duration = this.getAttribute("workout-duration");
        let calories = this.getAttribute("calories");

        localStorage.setItem("title", title);
        localStorage.setItem("parm", parm);
        localStorage.setItem("intensity", intensity);
        localStorage.setItem("duration", duration);
        localStorage.setItem("calories", calories);
        document.location.href = "index.html#details";
      });
    });
  });
}
