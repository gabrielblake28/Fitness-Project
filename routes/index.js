var express = require("express");
var router = express.Router();

let serverArray = [];

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

serverArray.push(new WorkoutObject("Man", "Sprints", 3, 45));
serverArray.push(new WorkoutObject("Woman", "Yoga", 3, 60));
serverArray.push(new WorkoutObject("Man", "CrossFit", 3, 75));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.sendFile("index.html");
});

router.get("/getAllWorkouts", function (req, res) {
  res.status(200).json(serverArray);
});

router.post("/AddWorkout", function (req, res) {
  const newWorkout = req.body;
  // newWorkout.ID = lastID++;
  serverArray.push(newWorkout);
  res.status(200).json(newWorkout);
});

router.delete("/deleteWorkout", function (req, res) {
  serverArray = serverArray.filter((data) => data.ID !== req.body.id);
  res.status(200).send("deleted array");
});

// router.delete("/DeleteWorkout", function () {});

module.exports = router;
