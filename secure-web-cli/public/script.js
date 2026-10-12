
const form = document.getElementById("command-form");
const input = document.getElementById("command");
const output = document.getElementById("output");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const command = input.value.trim();
  output.textContent = "Processing...";

  try {
    const response = await fetch("/api/command", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ command })
    });

    const data = await response.json();

    if (!response.ok) {
      output.textContent = "Error: " + data.error;
      return;
    }

    output.textContent = data.output;
  } catch (error) {
    output.textContent = "Unable to connect to the server.";
  }
});
