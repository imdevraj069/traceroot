import connectDB from "./src/configs/ConnectDb.js";
import app, { PORT } from "./src/app.js";

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Auth Service is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error("Database connection failed", err);
    process.exit(1);
});
