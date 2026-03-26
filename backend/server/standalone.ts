import "dotenv/config";
import { createServer } from "./index";

const app = createServer();
const port = Number(process.env.BACKEND_PORT ?? 5000);

app.listen(port, () => {
  console.log(`Backend API running on http://localhost:${port}`);
});

