var express = require('express');
var router = express.Router();


let serverArray = [];

// const mensCaloriesPerWorkout = {
//   Walking: 10,
//   Jogging: 12,
//   Sprints: 15,
//   Strength_Training: 4,
//   Yoga: 6,
//   Dance: 10,
//   Cycling: 13,
//   Elliptical: 7,
//   Crossfit: 16,
//   Jump_Rope: 17,
//   Basketball: 10,
//   Soccer: 8,
// };

// const womensCaloriesPerWorkout = {
//   Walking: 8,
//   Jogging: 10,
//   Sprints: 13,
//   Strength_Training: 4,
//   Yoga: 6,
//   Dance: 10,
//   Cycling: 11,
//   Elliptical: 7,
//   Crossfit: 14,
//   Jump_Rope: 17,
//   Basketball: 8,
//   Soccer: 7,
// };

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
serverArray.push(new WorkoutObject("Man", "Strength_Training", 3, 75));



/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile("index.html");
});

router.get('/getAllWorkouts', function(req, res) {
  res.status(200).json(serverArray);
})

router.post('/AddWorkout', function(req, res) {
  const newWorkout = req.body;
  // newWorkout.ID = lastID++;
  serverArray.push(newWorkout);
  res.status(200).json(newWorkout);
})



module.exports = router;
