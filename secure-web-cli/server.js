const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(helmet());
app.use(express.json({ limit: "2kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false
}));

const commands = {
  help: () => "Available commands: help, status, version",
  status: () => "System status: Secure Web CLI is running.",
  version: () => "Secure Web CLI version 1.0.0"
};

app.post("/api/command", (req, res) => {
  const { command } = req.body ?? {};

  if (typeof command !== "string") {
    return res.status(400).json({
      error: "Command must be a string."
    });
  }

  if (command.length === 0 || command.length > 50) {
    return res.status(400).json({
      error: "Command must contain 1–50 characters."
    });
  }

  if (!/^[a-z]+$/.test(command)) {
    return res.status(400).json({
      error: "Invalid input. Use letters only."
    });
  }

  if (!Object.hasOwn(commands, command)) {
    return res.status(400).json({
      error: "Command not allowed. Type help."
    });
  }

  return res.json({ output: commands[command]() });
});

app.listen(PORT, () => {
  console.log(`Secure Web CLI running at http://localhost:${PORT}`);
});

