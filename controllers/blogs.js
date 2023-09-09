const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
	response.json(blogs);
});

blogRouter.post("/", async (request, response, next) => {
	const body = request.body || request.query;

	const user = await User.find({}).populate("blogs");

	console.log("users", user);
	console.log("first user", user[0]);

	console.log("first users blogs", user[0].blogs);

	const blog = new Blog({
		title: body.title,
		user: user[0]._id,
		url: body.url,
		likes: body.likes,
	});

	try {
		const savedBlog = await blog.save();
		console.log(savedBlog);
		user[0].blogs = user[0].blogs.concat(savedBlog._id);
		await user[0].save();
		response.status(201).json(savedBlog);
	} catch (exception) {
		next(exception);
	}
});

blogRouter.delete("/:id", async (request, response) => {
	await Blog.findByIdAndRemove(request.params.id);
	response.status(204).end();
});

blogRouter.put("/:id", async (request, response) => {
	const updatedLikes = {
		likes: request.body.likes,
	};

	const updatedBlog = await Blog.findByIdAndUpdate(
		request.params.id,
		updatedLikes
	);
	response.status(204).json(updatedBlog);
});

module.exports = blogRouter;
