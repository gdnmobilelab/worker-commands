import { sendCommand } from "../../../";
import { expect } from "chai";
import { waitForMessage } from "../wait-for-message";

describe("Client", function() {
  it("can postMessage", async () => {
    await sendCommand({
      command: "client.post-message",
      options: {
        message: {
          test: "value"
        }
      }
    });

    let value = await waitForMessage();

    expect(value.test).to.equal("value");
  });
});
