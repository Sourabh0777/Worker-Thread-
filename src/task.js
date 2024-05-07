const { parentPort, workerData } = require("worker_threads");

// Function to increment the value by 1
const processValue = (value) => {
  return value + 1;
};
const workerId = workerData;
console.log("🚀 ~ workerId:", workerId);

// Listen for messages from the main thread
parentPort.on("message", (value) => {
  // Process the value
  const processedValue = processValue(value); // Send the processed value back to the main thread
  parentPort.postMessage(processedValue);
});
