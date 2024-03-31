const express = require("express");
require("dotenv").config();
const connectDb = require("./db/dbconnect");
const { createServer } = require("http");
const multer = require("multer");
const socketio = require("./socket");
const cookieParser = require("cookie-parser");
var cors = require("cors");

const app = express();
app.use(cookieParser());
const server = createServer(app);
const io = socketio.init(server);
const adIo = socketio.initAdIo(server, "/socket/adpage");
const upload = multer({ dest: "uploads/" });

// Body parser
app.use(express.json());

// CORS
app.use(cors());

// Default route
app.get("/", (req, res, next) => {
	res.send("Server running");
});

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));
app.use("/ad", require("./routes/ad"));
app.use("/bid", require("./routes/bid"));
app.use("/room", require("./routes/room"));
app.use("/auction", require("./routes/auction"));
app.use("/upload", require("./routes/uploads"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.get("/api/config/paypal", (req, res) =>
	res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

// Socket.io setup
const PORT = process.env.PORT || 5173;
io.on("connection", (socket) => {
	// console.log('### Socket IO client connected');
	socket.on("disconnect", (reason) => {
		// console.log('### Socket IO client disconnected');
	});
	socket.on("leaveHome", () => {
		socket.disconnect();
	});
});
adIo.on("connect", (socket) => {
	// socket.join('testroom')
	socket.on("joinAd", ({ ad }) => {
		socket.join(ad.toString());
		// console.log(`User joined room ${ad}`);
	});
	socket.on("leaveAd", ({ ad }) => {
		socket.leave(ad.toString());
		// console.log(`Left room ${ad}`);
	});
	socket.on("disconnect", () => {
		// console.log('User has disconnect from ad');
	});
});
// Connect DB and Initialize server
connectDb();
server.listen(PORT, () => {
	console.log(`### Server running on port ${PORT}`);
});
