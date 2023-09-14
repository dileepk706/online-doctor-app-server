"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan")); // Middleware to log incoming requests
// const  { Socket } =require('socket.io')  
const dbConfig_1 = __importDefault(require("./infra/database/dbConfig"));
const user_1 = __importDefault(require("./interface/routes/user"));
const admin_1 = __importDefault(require("./interface/routes/admin"));
const doctor_1 = __importDefault(require("./interface/routes/doctor"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Enable CORS for all routes
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
//mogodb connection
//setup routes
app.use('/api', user_1.default);
app.use('/api/admin', admin_1.default);
app.use('/api/doctor', doctor_1.default);
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads'))); //serving static files 
//page not found error handling
app.use((req, res, next) => {
    res.send(new http_errors_1.default.NotFound());
});
const errorHandler = (error, req, res, next) => {
    res.status(error.status || 500);
    res.send({
        status: res.status || 500,
        message: error.message
    });
};
app.use(errorHandler);
const PORT = Number(process.env.PORT) || 3002;
(0, dbConfig_1.default)(process.env.MONGODB_CONNECTION_URL || '');
const server = app.listen(PORT, () => { console.log(`server is runnin on port ${PORT}`); });
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'https://docktor-link-a0rh1q3h2-dileepk706.vercel.app'
        // http://localhost:3000
    }
});
const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();
io.on("connection", (socket) => {
    console.log(`Socket Connected`, socket.id);
    socket.on("room:join", (data) => {
        console.log('room:join');
        const { email, room } = data;
        emailToSocketIdMap.set(email, socket.id);
        socketidToEmailMap.set(socket.id, email);
        io.to(room).emit("user:joined", { email, id: socket.id });
        socket.join(room);
        io.to(socket.id).emit("room:join", data);
    });
    socket.on("user:call", ({ to, offer }) => {
        console.log('user calling ');
        io.to(to).emit("incomming:call", { from: socket.id, offer });
    });
    socket.on("call:ended", ({ to }) => {
        io.to(to).emit("call:ended", { from: socket.id });
        // You can also clean up any resources related to the call here
    });
    socket.on("user:end", ({ to }) => {
        console.log('user:end');
        io.to(to).emit("incomming:end", { from: socket.id });
    });
    socket.on("call:accepted", ({ to, ans }) => {
        io.to(to).emit("call:accepted", { from: socket.id, ans });
    });
    socket.on("peer:nego:needed", ({ to, offer }) => {
        io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
    });
    socket.on("peer:nego:done", ({ to, ans }) => {
        io.to(to).emit("peer:nego:final", { from: socket.id, ans });
    });
});
// io.on("connection", (socket:Socket) => {
// 	socket.emit("me", socket.id);
//     console.log('connected socket',socket.id )
// 	socket.on("disconnect", () => {
// 		console.log('callEnded')
// 		socket.broadcast.emit("callEnded")
// 	})
// 	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
// 		console.log('user called ')
// 		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
// 	});
// 	socket.on("answerCall", (data) => {
// 		console.log('callAccepted')
// 		io.to(data.to).emit("callAccepted", data.signal)
// 	});
// });
