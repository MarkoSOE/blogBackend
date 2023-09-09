const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const userHelper = require("./user_helper");
const bcrypt = require("bcrypt");

const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");

beforeEach(async () => {
	await Blog.deleteMany({});
	let blogObject = new Blog(helper.initialBlogs[0]);
	await blogObject.save();
	blogObject = new Blog(helper.initialBlogs[1]);
	await blogObject.save();
});

test("all blogs are returned", async () => {
	const response = await api.get("/api/blogs");
	expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("a specific blog is within the returned blogs", async () => {
	const response = await api.get("/api/blogs");

	const contents = response.body.map((r) => r.title);
	expect(contents).toContain("Go To Statement Considered Harmful");
});

test("verifies the unique ID property of the blog posts is named id", async () => {
	const response = await api.get("/api/blogs");
	expect(response.body[0]._id).toBeDefined();
});

test("verify that a blog has been successfully added", async () => {
	const testBlog = {
		title: "testing blog",
		author: "Testing blog",
		url: "https://testtterns.com/",
		likes: 2,
	};
	await api
		.post("/api/blogs")
		.send(testBlog)
		.expect(201)
		.expect("Content-Type", /application\/json/);

	const blogsAtEnd = await helper.blogsInDb();
	expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

	const contents = blogsAtEnd.map((r) => r.title);
	expect(contents).toContain("testing blog");
});

test("verify that if the likes property is missing from the request, it will default to the value 0", async () => {
	const testBlog = {
		title: "testing blog",
		author: "Testing blog",
		url: "https://testtterns.com/",
	};
	await api
		.post("/api/blogs")
		.send(testBlog)
		.expect(201)
		.expect("Content-Type", /application\/json/);

	const blogsAtEnd = await helper.blogsInDb();

	expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0);
});

test("Verify that if the url or title are missing then return error code 400", async () => {
	const testBlogNoTitle = {
		author: "Testing blog",
		url: "https://testtterns.com/",
	};

	const testBlogNoURL = {
		title: "testing blog",
		author: "Testing blog",
	};

	await api.post("/api/blogs").send(testBlogNoTitle).expect(400);
	await api.post("/api/blogs").send(testBlogNoURL).expect(400);

	const blogsAtEnd = await helper.blogsInDb();

	console.log(blogsAtEnd);
}, 10000);

describe("Deletion of a note", () => {
	test("verify that the document has been deleted", async () => {
		const testid = helper.initialBlogs[0]._id;

		await api.delete(`/api/blogs/${testid}`).expect(204);

		const blogsatEnd = await helper.blogsInDb();

		expect(blogsatEnd.length).toBe(helper.initialBlogs.length - 1);

		const contents = blogsatEnd.map((r) => r.title);

		expect(contents).not.toContain(helper.initialBlogs[0].title);
	});
});

test("verify that a blog has been updated", async () => {
	const route = `/api/blogs/${helper.initialBlogs[0]._id}`;
	const data = {
		likes: 999,
	};

	await api.put(route).send(data).expect(204);

	const updateBlogs = await helper.blogsInDb();
	const content = updateBlogs.map((r) => r.likes);

	expect(content[0]).toBe(999);
});

describe("When there is initially one user in the database", () => {
	beforeEach(async () => {
		await User.deleteMany({});

		const passwordHash = await bcrypt.hash("sekret", 10);

		const user = new User({ username: "root", passwordHash });

		await user.save();
	});
	test("creation succeeds with a fresh username", async () => {
		const usersatStart = await userHelper.usersinDb();

		const newUser = {
			username: "mluukai",
			name: "Matt Luuka",
			password: "asdijo",
		};

		await api
			.post("/api/users")
			.send(newUser)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const usersatEnd = await userHelper.usersinDb();
		expect(usersatEnd).toHaveLength(usersatStart.length + 1);

		const usernames = usersatEnd.map((u) => u.username);
		expect(usernames).toContain(newUser.username);
	});
	test("creation fails with the proper statuscode and message if username is already taken", async () => {
		const usersAtStart = await userHelper.usersinDb();

		const newUser = {
			username: "root",
			name: "superuser",
			password: "salaasd",
		};

		const result = await api
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.expect("Content-Type", /application\/json/);

		expect(result.body.error).toContain("expected `username` to be unique");
		const usersAtEnd = await userHelper.usersinDb();
		expect(usersAtEnd).toEqual(usersAtStart);
	});
	test("tests if the username minlength requirement is working", async () => {
		const usersAtStart = await userHelper.usersinDb();

		const newUser = {
			username: "la",
			name: "lalaland",
			password: "lalaland",
		};

		const result = await api
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.expect("Content-Type", /application\/json/);

		expect(result.body.error).toContain("minimum allowed length");

		const usersAtEnd = await userHelper.usersinDb();

		expect(usersAtEnd).toEqual(usersAtStart);
	});
	test("tests if the password minlength requirement is working", async () => {
		const usersAtStart = await userHelper.usersinDb();

		const newUser = {
			username: "lalalala",
			name: "lalaland",
			password: "la",
		};

		const result = await api
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.expect("Content-Type", /application\/json/);

		expect(result.body.error).toContain("minimum allowed length");

		const usersAtEnd = await userHelper.usersinDb();

		expect(usersAtEnd).toEqual(usersAtStart);
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});
