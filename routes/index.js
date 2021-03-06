var express = require("express");
var router = express.Router();
var fs = require("fs");

let serverArray = [];

let fileManager = {
  read: function () {
    var rawdata = fs.readFileSync("objectdata.json");
    let goodData = JSON.parse(rawdata);
    serverArray = goodData;
  },
  write: function () {
    let data = JSON.stringify(serverArray);
    fs.writeFileSync("objectdata.json", data);
  },
  validData: function () {
    var rawdata = fs.readFileSync("objectdata.json");
    console.log(rawdata.length);
    if (rawdata.length < 1) {
      return false;
    } else {
      return true;
    }
  },
};

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

if (!fileManager.validData()) {
  serverArray.push(new WorkoutObject("Man", "Sprints", 3, 45));
  serverArray.push(new WorkoutObject("Woman", "Yoga", 3, 60));
  serverArray.push(new WorkoutObject("Man", "Crossfit", 3, 75));
  fileManager.write();
} else {
  fileManager.read();
}

// serverArray.push(new WorkoutObject("Man", "Sprints", 3, 45));
// serverArray.push(new WorkoutObject("Woman", "Yoga", 3, 60));
// serverArray.push(new WorkoutObject("Man", "Crossfit", 3, 75));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.sendFile("index.html");
});

router.get("/getAllWorkouts", function (req, res) {
  fileManager.read();
  res.status(200).json(serverArray);
});

router.post("/AddWorkout", function (req, res) {
  const newWorkout = req.body;
  serverArray.push(newWorkout);
  fileManager.write();
  res.status(200).json(newWorkout);
});

router.delete("/deleteWorkout", function (req, res) {
  serverArray = serverArray.filter((data) => data.ID !== req.body.id);
  fileManager.write();
  res.status(200).send("deleted array");
});

module.exports = router;
