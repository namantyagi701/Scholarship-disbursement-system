import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import studentRouter from "./routes/studentRoutes.js";
import sagRouter from "./routes/sagRoutes.js";
import financeRouter from "./routes/financeRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

const app = express();
const port = process.env.PORT || 4000
connectDB();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  process.env.FRONTEND_URL
].filter(Boolean);
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins , credentials : true}));

app.get('/' , (req , res) => res.send("API Working")); //test
app.use('/api/auth' , authRouter)
app.use("/api/student", studentRouter);
app.use("/api/sag", sagRouter);
app.use("/api/finance", financeRouter);
app.use("/api/admin", adminRouter);


app.listen(port , () => console.log(`Server started on PORT:${port}`));
