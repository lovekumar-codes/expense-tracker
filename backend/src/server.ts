import { env} from "./config/env"

import app from "./app";
import { connectDB } from "./config/db";
import seedCategories from "./utils/seedCategories";

const PORT = env.PORT ;

connectDB()
  .then(async() => {
    await seedCategories();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
    process.exit(1);
  });