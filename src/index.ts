import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { errorHandler } from "./utils/errorhandler.util";
// import userRouter from "./routes/user.routes";
import evtolRoutes from "./routes/evtol.routes";
// import medicationRoutes from "./routes/medication.routes";
// import orderRoutes from "./routes/order.routes";
import authRouter from "./routes/auth.routes";
// import authRoutes from "./routes/auth.routes";

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

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

// app.use("/evtol/v1/device", evtolRoutes);
// app.use("/evtol/v1/medications", medicationRoutes);
// app.use("/evtol/v1/orders", orderRoutes);
// app.use("/evtol/v1/users", userRouter)
app.use("/evtol/v1/authentication", authRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});