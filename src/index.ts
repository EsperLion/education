import { platform, release } from "node:os";

console.log("Hello from src/index.ts");
console.log(`Node ${process.version} on ${platform()} ${release()}`);
