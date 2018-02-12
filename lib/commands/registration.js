import * as tslib_1 from "tslib";
import { registerCommand } from "../command-registry";
function update() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, self.registration.update()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function unregister() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, self.registration.unregister()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
export function setup() {
    registerCommand("registration.update", update);
    registerCommand("registration.unregister", unregister);
}
