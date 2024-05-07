const { parentPort, workerData } = require("worker_threads");

// Function to increment each value by 1
const processArray = (array) => {
  return array.map((value) => value + 1);
};

// Listen for messages from the main thread
parentPort.on("message", ({ index }) => {
  // Process the chunk of array
  const result = processArray(workerData);
  // Send the processed chunk back to the main thread
  parentPort.postMessage(result);
});
