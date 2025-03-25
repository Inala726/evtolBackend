import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler } from "./utils/errorhandler.util";
import userRouter from "./routes/user.routes";
// import evtolRoutes from "./routes/evtol.routes";
// import medicationRoutes from "./routes/medication.routes";
// import orderRoutes from "./routes/order.routes";

dotenv.config();

const portEnv = process.env.PORT;

if (!portEnv) {
  console.error("Error: PORT IS NOT DEFINED IN .env FILE");
  process.exit(1);
}

const PORT: number = parseInt(portEnv, 10);
if (isNaN(PORT)) {
  console.error("ERROR: PORT IS NOT A NUMBER IN .env file");
  process.exit(1);
}

const app = express();
const corsOption = {
  origin: "*",
  Credentials: true,
  allowedHeaders: "*",
  methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
};

app.use(cors(corsOption));

app.use(express.json());

// app.use("/api/v1/evtol", evtolRoutes);
// app.use("/api/v1/medications", medicationRoutes);
// app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/users", userRouter)

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});