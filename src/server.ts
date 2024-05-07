import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { Worker, workerData } from "worker_threads";

const PORT = 5500;
const app = express();
app.use(express.json());
app.use(cors());
app.use("/", async (req: Request, res: Response) => {
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const numWorkers = 3;
  const chunkSize = Math.ceil(array.length / numWorkers);
  const workers: Worker[] = [];

  // Create workers
  for (let i = 0; i < numWorkers; i++) {
    const start = i * chunkSize;
    const end = start + chunkSize;
    const chunk = array.slice(start, end);

    const worker = new Worker("./src/task.js", { workerData: chunk });
    workers.push(worker);
  }
  //array of promises to retrieve data from workers
  const promises = workers.map((worker) => {
    return new Promise<any>((resolve) => {
      worker.on("message", resolve);
    });
  });

  // Send messages to workers
  workers.forEach((worker, index) => {
    worker.postMessage({ index });
  });

  // Wait for all promises to resolve
  const results = await Promise.all(promises);

  // Flatten and return the results
  return res.json({ array: results.flat() });
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
