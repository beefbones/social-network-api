const router = require('express').Router();
const {
  getAllThought,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  createReaction,
  deleteReaction
} = require('../../controllers/thought-controller');

router.get('/', getAllThought);
router.post('/', createThought);
router.get('/:id', getThoughtById);
router.put('/:id', updateThought);
router.delete('/:id', deleteThought);
router.post('/:thoughtId/reactions', createReaction);
router.delete('/:thoughtId/reactions/:reactionId', deleteReaction);

module.exports = router;