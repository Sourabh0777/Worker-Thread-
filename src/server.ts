import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { Worker, workerData } from "worker_threads";

const app = express();
app.use(express.json());
app.use(cors());

// Create workers outside the loop
const worker1 = new Worker("./src/task.js", { workerData: "worker1" });
const worker2 = new Worker("./src/task.js", { workerData: "worker2" });
const worker3 = new Worker("./src/task.js", { workerData: "worker3" });

app.use("/", async (req: Request, res: Response) => {
  // Input array of 100 numbers
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let promises: Promise<any>[] = [];

  // Split the input array into chunks of 10
  for (let i = 0; i < array.length; i++) {
    // Pass the appropriate data to each worker
    worker1.postMessage(array[i]);
    worker2.postMessage(array[i + 1]);
    worker3.postMessage(array[i + 2]);

    const promise1 = new Promise((resolve, reject) => {
      worker1.on("message", (msg: any) => {
        resolve(msg);
      });
    });

    const promise2 = new Promise((resolve, reject) => {
      worker2.on("message", (msg: any) => {
        resolve(msg);
      });
    });

    const promise3 = new Promise((resolve, reject) => {
      worker3.on("message", (msg: any) => {
        resolve(msg);
      });
    });

    promises.push(promise1, promise2, promise3);
  }

  // Wait for all promises to resolve
  const results = await Promise.all(promises);

  return res.json({ array: results });
});

const server = app.listen(5000, () => {
  console.log(`Server is running on port ${5000}`);
});
