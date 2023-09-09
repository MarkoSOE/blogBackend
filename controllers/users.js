const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
	const { username, name, password } = request.body;
	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(password, saltRounds);

	if (password.length < 3) {
		response.status(400).json({
			error: "minimum allowed length is 3",
		});
	}

	const user = new User({
		username,
		name,
		passwordHash,
	});

	const savedUser = await user.save();

	response.status(201).json(savedUser);
});

usersRouter.get("/", async (request, response) => {
	const listofUsers = await User.find({}).populate("blogs", {
		title: 1,
		url: 1,
		likes: 1,
	});

	response.status(200).json(listofUsers);
});

module.exports = usersRouter;
