const { User, Thought } = require('../models');

const handleErrors = (err, res) => {
  console.log(err);
  res.sendStatus(400);
};

const userController = {
  getAllUser: (req, res) => {
    User.find({})
      .select('-__v')
      .sort({ _id: -1 })
      .then((users) => res.json(users))
      .catch((err) => handleErrors(err, res));
  },

  getUserById: ({ params }, res) => {
    User.findOne({ _id: params.id })
      .populate({ path: 'thoughts', select: '-__v' })
      .populate({ path: 'friends', select: '-__v' })
      .then((user) => {
        if (!user) return res.status(404).json({ message: 'No User found with this id!' });
        res.json(user);
      })
      .catch((err) => handleErrors(err, res));
  },

  createUser: ({ body }, res) => {
    User.create(body)
      .then((user) => res.json(user))
      .catch((err) => res.json(err));
  },

  updateUser: ({ params, body }, res) => {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then((user) => {
        if (!user) return res.status(404).json({ message: 'No User found with this id!' });
        res.json(user);
      })
      .catch((err) => res.json(err));
  },

  deleteUser: ({ params }, res) => {
    Thought.deleteMany({ userId: params.id })
      .then(() => User.findOneAndDelete({ _id: params.id }))
      .then((user) => {
        if (!user) return res.status(404).json({ message: 'No User found with this id!' });
        res.json(user);
      })
      .catch((err) => handleErrors(err, res));
  },

  addFriend: ({ params }, res) => {
    User.findOneAndUpdate({ _id: params.userId }, { $push: { friends: params.friendId } }, { new: true })
      .then((user) => {
        if (!user) return res.status(404).json({ message: 'No user found with this id' });
        res.json(user);
      })
      .catch((err) => res.status(400).json(err));
  },

  deleteFriend: ({ params }, res) => {
    User.findOneAndUpdate({ _id: params.userId }, { $pull: { friends: params.friendId } }, { new: true })
      .then((user) => {
        if (!user) return res.status(404).json({ message: 'No user found with this id' });
        res.json(user);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = userController;
