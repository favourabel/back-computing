import app from "./app.js";
import connectDB from "./config/database.js";
import { seedAdmin } from "./utils/seedAdmin.js";
import { PORT } from "./config/env.js";

const start = async () => {
  await connectDB();
  await seedAdmin();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

start();