import { sendCommand } from "../../../";
import { expect } from "chai";

describe("Custom commands", function() {
  it("can send and receive", async () => {
    let result = await sendCommand({
      command: "test-command",
      options: {
        value: "test-value"
      }
    });

    expect(result).to.equal("test-value");
  });
});
