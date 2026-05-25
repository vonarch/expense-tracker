const express = require('express');
const {
  getGoals,
  createGoal,
  updateGoalProgress,
  deleteGoal,
} = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getGoals);
router.post('/', createGoal);
router.patch('/:id/progress', updateGoalProgress);
router.delete('/:id', deleteGoal);

module.exports = router;
