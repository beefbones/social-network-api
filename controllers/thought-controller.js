const { User, Thought } = require('../models');

const thoughtController = {
  getAllThought: async (req, res) => {
    try {
      const dbThoughtData = await Thought.find({})
        .populate({
          path: 'reactions',
          select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1 });
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  getThoughtById: async ({ params }, res) => {
    try {
      const dbThoughtData = await Thought.findOne({ _id: params.id })
        .populate({
          path: 'reactions',
          select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1 });
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No thoughts found with that id!' });
        return;
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  createThought: async ({ body }, res) => {
    try {
      const { _id } = await Thought.create(body);
      const dbThoughtData = await User.findOneAndUpdate(
        { _id: body.userId },
        { $push: { thoughts: _id } },
        { new: true }
      );
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  updateThought: async ({ params, body }, res) => {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: params.id },
        body,
        { new: true, runValidators: true }
      );
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No thoughts found with that id!' });
        return;
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  deleteThought: async ({ params }, res) => {
    try {
      const dbThoughtData = await Thought.findOneAndDelete({ _id: params.id });
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No thoughts found with that id!' });
        return;
      }
      const dbUserData = await User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { thoughts: params.id } },
        { new: true }
      );
      if (!dbUserData) {
        res.status(404).json({ message: 'No User found with this id!' });
        return;
      }
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  createReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .populate({ path: 'reactions', select: '-__v' })
      .select('-__v')
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No thoughts with this ID.' });
        }
        return res.json(dbThoughtData);
      })
      .catch((err) => res.status(400).json(err));
  },

  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'Nope!' });
        }
        return res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },
};

module.exports = thoughtController;