const User = require("../models/user");
const logger = require("./logger");
const jwt = require("jsonwebtoken");

const getTokenFrom = (request, response, next) => {
	const authorization = request.get("authorization");
	if (authorization && authorization.startsWith("Bearer ")) {
		return authorization.replace("Bearer ", "");
	}
	return null;
};

const requestLogger = (request, response, next) => {
	logger.info("Method:", request.method);
	logger.info("Path:  ", request.path);
	logger.info("Body:  ", request.body);
	logger.info("---");
	next();
};

const userExtractor = async (request, response, next) => {
	const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);

	if (!decodedToken.id) {
		return response.status(401).json({ error: "token invalid" });
	}

	const user = await User.findById(decodedToken.id).populate("blogs");

	return user;
};

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
	logger.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message });
	} else if (error.name === "JsonWebTokenError") {
		return response.status(401).json({ error: error.message });
	}

	next(error);
};

module.exports = {
	requestLogger,
	unknownEndpoint,
	errorHandler,
	getTokenFrom,
	userExtractor,
};
