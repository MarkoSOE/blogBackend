//dummy function that recieves an array and returns the value 1
var _ = require("lodash");

let blogs = [
	{
		_id: "5a422a851b54a676234d17f7",
		title: "React patterns",
		author: "Michael Chan",
		url: "https://reactpatterns.com/",
		likes: 7,
		__v: 0,
	},
	{
		_id: "5a422aa71b54a676234d17f8",
		title: "Go To Statement Considered Harmful",
		author: "Edsger W. Dijkstra",
		url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
		likes: 5,
		__v: 0,
	},
	{
		_id: "5a422b3a1b54a676234d17f9",
		title: "Canonical string reduction",
		author: "Edsger W. Dijkstra",
		url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
		likes: 12,
		__v: 0,
	},
	{
		_id: "5a422b891b54a676234d17fa",
		title: "First class tests",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
		likes: 10,
		__v: 0,
	},
	{
		_id: "5a422ba71b54a676234d17fb",
		title: "TDD harms architecture",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
		likes: 0,
		__v: 0,
	},
	{
		_id: "5a422bc61b54a676234d17fc",
		title: "Type wars",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
		likes: 2,
		__v: 0,
	},
];

const dummy = (blogs) => {
	return 1;
};

const totalLikes = (blogs) => {
	return blogs.reduce((accum, currentvalue) => currentvalue.likes + accum, 0);
};

const favoriteBlog = (blogs) => {
	let popularBlog = blogs[0];
	blogs.forEach((blog) => {
		if (blog.likes > popularBlog.likes) {
			popularBlog = blog;
		}
	});
	return {
		title: popularBlog.title,
		author: popularBlog.author,
		likes: popularBlog.likes,
	};
};

const mostBlogs = (blogs) => {
	//want end result to be {author: "", blogs: 1}

	return _.flattenDeep(blogs);

	// let hash = {};
	// blogs.forEach((blog) => {
	// 	//if there's no existing author in the map, hash[blog.author] == null, setting the value to be 0 + 1
	// 	// If there is an existing author in the map, hash[blog.author] will return the value (non-null) and add 1
	// 	hash[blog.author] = (hash[blog.author] ?? 0) + 1; //returns right when left is null or undefined
	// });

	// let hashtwo = [];
};

const test = {
	test: 1,
	new: 2,
};

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
};
