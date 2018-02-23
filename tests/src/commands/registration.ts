import { sendCommand } from "../../../";
import { expect } from "chai";

describe("Registration", function() {
    xit("can update", function() {
        // Don't really see how to test this
    });
    it("can unregister", async () => {
        await sendCommand({
            command: "registration.unregister"
        });

        let reg = await navigator.serviceWorker.getRegistration();

        expect(reg).to.not.exist;
    });
});
