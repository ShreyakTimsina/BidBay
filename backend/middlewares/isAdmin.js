const User = require("../models/User");

module.exports = async (req, res, next) => {
	const user = await User.findById(req.user.id);

	if (user && user.isAdmin) {
		next();
	} else {
		res
			.status(401)
			.json({ errors: [{ msg: "Unauthorized Request" }] });
	}
};
