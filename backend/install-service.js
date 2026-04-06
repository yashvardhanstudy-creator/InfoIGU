const { Service } = require("node-windows");
const path = require("path");

// Create a new service object
const svc = new Service({
  name: "InfoIGU Backend",
  description: "The Node.js API backend for the InfoIGU platform.",
  script: path.join(__dirname, "server.js"),
  env: [
    {
      name: "NODE_ENV",
      value: "production",
    },
  ],
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on("install", function () {
  console.log("InfoIGU Backend service installed successfully!");
  svc.start();
  console.log("InfoIGU Backend service started!");
});

svc.on("alreadyinstalled", function () {
  console.log("This service is already installed.");
});

svc.install();
