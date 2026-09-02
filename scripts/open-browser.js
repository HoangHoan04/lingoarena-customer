const { exec } = require("child_process");
const http = require("http");

const ports = [2504, 3000, 3001, 3002, 3003, 3004];
const maxAttempts = 30;

function checkPort(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}`, (res) => {
      resolve(port);
    });
    req.on("error", () => resolve(null));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(null);
    });
  });
}

async function findActivePort() {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    for (const port of ports) {
      const active = await checkPort(port);
      if (active) return active;
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return 3000;
}

async function openBrowser() {
  const port = await findActivePort();
  const url = `http://localhost:${port}`;
  const platform = process.platform;

  let command;
  if (platform === "win32") {
    command = `start "" "${url}"`;
  } else if (platform === "darwin") {
    command = `open "${url}"`;
  } else {
    command = `xdg-open "${url}"`;
  }

  exec(command, (err) => {
    if (err) {
      console.error("Không thể tự mở trình duyệt:", err.message);
    } else {
      console.log("Đã mở trình duyệt tại:", url);
    }
  });
}

openBrowser();
