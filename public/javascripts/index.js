let workoutArray = [];

const mensCaloriesPerWorkout = {
  Walking: 10,
  Jogging: 12,
  Sprints: 15,
  ["Strength Training"]: 7,
  Yoga: 6,
  Dance: 10,
  Cycling: 13,
  Elliptical: 7,
  Crossfit: 16,
  ["Jump Rope"]: 17,
  Basketball: 10,
  Soccer: 8,
};

const womensCaloriesPerWorkout = {
  Walking: 8,
  Jogging: 10,
  Sprints: 14,
  ["Strength Training"]: 6,
  Yoga: 6,
  Dance: 10,
  Cycling: 11,
  Elliptical: 7,
  Crossfit: 14,
  ["Jump Rope"]: 17,
  Basketball: 8,
  Soccer: 7,
};

let WorkoutObject = function (
  bodyType,
  workoutType,
  workoutIntensity,
  workoutDuration
) {
  this.bodyType = bodyType;
  this.workoutType = workoutType;
  this.workoutIntensity = workoutIntensity;
  this.workoutDuration = workoutDuration;
  this.ID = Math.random().toString(16).slice(5);
  this.calories = CalculateCalories(
    bodyType,
    workoutType,
    workoutIntensity,
    workoutDuration
  );
  this.date = new Date().toLocaleDateString("en-US");

  function CalculateCalories(
    bodyType,
    workoutType,
    workoutIntensity,
    workoutDuration
  ) {
    return bodyType == "Man"
      ? Math.round(
          mensCaloriesPerWorkout[workoutType] *
            (workoutIntensity / 5) *
            workoutDuration
        )
      : Math.round(
          womensCaloriesPerWorkout[workoutType] *
            (workoutIntensity / 5) *
            workoutDuration
        );
  }

  return this;
};

document.addEventListener("DOMContentLoaded", function () {
  // add button events ************************************************************************

  document.getElementById("addBtn").addEventListener("click", function () {
    let newWorkout = new WorkoutObject(
      document.getElementById("body-type").value,
      document.getElementById("workout-type").value,
      document.getElementById("intensity").value,
      document.getElementById("workout-duration-input").value
    );

    $.ajax({
      url: "/AddWorkout",
      type: "POST",
      data: JSON.stringify(newWorkout),
      contentType: "application/json; charset=utf-8",
      success: function (result) {
        console.log(result.data);
        document.location.href = "index.html#show";
      },
    });
  });
  // also add the URL value

  // page before show code *************************************************************************
  $(document).on("pagebeforeshow", "#show", function (event) {
    // have to use jQuery
    createList();
  });

  // need one for our details page to fill in the info based on the passed in ID
  $(document).on("pagebeforeshow", "#details", function (event) {
    let now = new Date();
    console.log(localStorage);
    let workoutDate = localStorage.getItem("date");
    let workoutID = localStorage.getItem("parm"); // get the unique key back from the storage dictionairy
    let workoutTitle = localStorage.getItem("title");
    let workoutIntensity = localStorage.getItem("intensity");
    let workoutDuration = localStorage.getItem("duration");
    let calories = localStorage.getItem("calories");
    document.getElementById(
      "workout-date"
    ).innerHTML = `Date: ${now.toLocaleDateString("en-US")}`;
    document.getElementById(
      "workout-title"
    ).innerHTML = `Exercise: ${workoutTitle}`;
    document.getElementById(
      "workout-intensity"
    ).innerHTML = `Intensity (1-5): ${workoutIntensity}`;
    document.getElementById(
      "workout-duration"
    ).innerHTML = `Duration (minutes): ${workoutDuration}`;
    document.getElementById(
      "calories"
    ).innerHTML = `Calories Burned: ${calories}`;
  });

  // end of page before show code *************************************************************************
});

function deleteWorkout() {
  $.ajax({
    type: "DELETE",
    url: "/deleteWorkout",
    data: { id: localStorage.getItem("parm") },
    success: function () {
      document.location.href = "index.html#show";
    },
  });
}

function createList() {
  // clear prior data
  let theList = document.getElementById("myul");
  theList.innerHTML = "";

  $.get("/getAllWorkouts", function (data, status) {
    console.log(status);
    totalCalories = 0;
    workoutArray = data;

    workoutArray.forEach(function (element, i) {
      var ul = document.createElement("ul");

      var myLi = document.createElement("li");
      myLi.classList.add("workout-link");
      myLi.innerHTML =
        element.workoutType + ":  " + element.workoutDuration + " mins";

      // use the html5 "data-parm" to store the ID of this particular workout object
      // that we are currently building an li for so that I can later know which workout this li came from
      myLi.setAttribute("data-parm", element.ID);
      myLi.setAttribute("date", element.date);
      myLi.setAttribute("workout-title", element.workoutType);
      myLi.setAttribute("workout-intensity", element.workoutIntensity);
      myLi.setAttribute("workout-duration", element.workoutDuration);
      myLi.setAttribute("calories", element.calories);
      ul.appendChild(myLi);
      totalCalories += element.calories;
      document.getElementsByClassName(
        "total-calories"
      )[0].innerHTML = `Total Calories Burned: ${totalCalories}`;
      //calories

      theList.appendChild(myLi);

      var liList = document.getElementsByClassName("workout-link");

      let newWorkoutArray = Array.from(liList);

      newWorkoutArray.forEach(function (element, i) {
        element.addEventListener("click", function () {
          var parm = this.getAttribute("data-parm");
          let date = this.getAttribute("date");
          let title = this.getAttribute("workout-title");
          var intensity = this.getAttribute("workout-intensity");
          var duration = this.getAttribute("workout-duration");
          let calories = this.getAttribute("calories");

          localStorage.setItem("title", title);
          localStorage.setItem("date", date);
          localStorage.setItem("parm", parm);
          localStorage.setItem("intensity", intensity);
          localStorage.setItem("duration", duration);
          localStorage.setItem("calories", calories);
          document.location.href = "index.html#details";
        });
      });
    });
  });
}
