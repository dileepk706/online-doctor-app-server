import express,{ Application, NextFunction, Request,Response,ErrorRequestHandler} from "express";
import { Server } from "http";
import createHttpError from "http-errors";
import dotenv  from "dotenv";
import path from "path";
import bodyParser,{BodyParser} from "body-parser";
import cors from 'cors';
import morgan from 'morgan';// Middleware to log incoming requests
// const  { Socket } =require('socket.io')  

import connectDB from "./infra/database/dbConfig"
import userRoute from "./interface/routes/user";
import adminRout from "./interface/routes/admin";
import doctorRoute from "./interface/routes/doctor";
import { Socket } from "socket.io";


const app:Application=express()

app.use(express.json())
// Enable CORS for all routes
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

dotenv.config({ path: path.resolve(__dirname, '../.env')});

//mogodb connection

//setup routes
app.use('/api',userRoute)
app.use('/api/admin',adminRout)
app.use('/api/doctor',doctorRoute)



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));//serving static files 

 


//page not found error handling
app.use((req:Request,res:Response,next:NextFunction)=>{
    res.send(new createHttpError.NotFound())
})
const errorHandler:ErrorRequestHandler=(error,req,res,next)=>{
    res.status(error.status || 500)
    res.send({
        status:res.status || 500,
        message:error.message
    })
}
app.use(errorHandler)

const PORT:number = Number(process.env.PORT) || 3002
connectDB(process.env.MONGODB_CONNECTION_URL || '')

const server:Server=app.listen(PORT,()=>{console.log(`server is runnin on port ${PORT}`)})

const io=require('socket.io')(server , {
    pingTimeout:60000,
    cors:{
        origin:'http://localhost:3000'
    }
})


const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

io.on("connection", (socket:Socket) => {
  console.log(`Socket Connected`, socket.id);
  socket.on("room:join", (data) => {
    console.log('room:join')
    const { email, room } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    console.log('user calling ')
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });






  socket.on("call:ended", ({ to }) => {
    io.to(to).emit("call:ended", { from: socket.id });
  
    // You can also clean up any resources related to the call here
  });
  


  socket.on("user:end", ({ to }) => {
    console.log('user:end')
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