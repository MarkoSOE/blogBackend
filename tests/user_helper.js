const User = require("../models/user");

const usersinDb = async () => {
	const users = await User.find({});
	return users.map((user) => user.toJSON());
};

module.exports = {
	usersinDb,
};
