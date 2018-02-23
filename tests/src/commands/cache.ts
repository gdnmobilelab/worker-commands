import { sendCommand } from "../../../";
import { expect } from "chai";

describe("Cache", function() {
  afterEach(async () => {
    let allCaches = await caches.keys();
    await Promise.all(allCaches.map(cacheName => caches.delete(cacheName)));
  });

  it("Should cache a file", async () => {
    await sendCommand({
      command: "cache.add",
      options: {
        cacheName: "test-cache",
        urls: ["test-file.txt"]
      }
    });

    let cache = await caches.open("test-cache");
    let match = await cache.match("test-file.txt");
    expect(match).to.exist;
  });

  it("Should delete a cached file", async () => {
    let cache = await caches.open("test-cache");
    await cache.add("test-file.txt");

    await sendCommand({
      command: "cache.delete",
      options: {
        cacheName: "test-cache",
        urls: ["test-file.txt"]
      }
    });

    let match = await caches.match("test-file.txt");

    expect(match).to.not.exist;
  });

  it("Should delete a whole cache", async () => {
    let cache = await caches.open("test-cache");
    await cache.add("test-file.txt");

    await sendCommand({
      command: "cache.delete",
      options: {
        cacheName: "test-cache",
        deleteWholeCache: true
      }
    });

    let match = await caches.match("test-file.txt");

    expect(match).to.not.exist;
  });
});
