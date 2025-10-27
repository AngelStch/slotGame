import { createServer } from "./server";

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

const app = createServer();

app.listen(PORT, () => {
  console.log(`[slot-backend] listening on http://localhost:${PORT}`);
});
