import * as tslib_1 from "tslib";
import { fireCommand } from "./command-registry";
function handlePush(e) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var json;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!e.data) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, e.data.json()];
                case 1:
                    json = _a.sent();
                    if (json.data && json.data.payload) {
                        // This is specific to pushkin and how Firebase Cloud Messaging sends payloads.
                        // Maybe we can standardise this at some point.
                        json = JSON.parse(json.data.payload);
                    }
                    if (!json.__workerCommandPayload) {
                        return [2 /*return*/];
                    }
                    console.info("Received push payload", json.__workerCommandPayload);
                    return [4 /*yield*/, fireCommand(json.__workerCommandPayload)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
export function setup() {
    self.addEventListener("push", function (e) {
        e.waitUntil(handlePush(e));
    });
}
