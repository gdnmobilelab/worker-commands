import * as tslib_1 from "tslib";
import { registerCommand } from "../command-registry";
function filterURL(url, options) {
    var editable = new URL(url);
    if (options.ignoreQuery === true) {
        editable.search = "";
    }
    if (options.ignoreHash === true) {
        editable.hash = "";
    }
    return editable.href;
}
function getExistingWindow(url, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var clients, urlToSearch;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, self.clients.matchAll({
                        includeUncontrolled: true
                    })];
                case 1:
                    clients = _a.sent();
                    urlToSearch = filterURL(url, options);
                    return [2 /*return*/, clients.find(function (c) { return filterURL(c.url, options) === url && c instanceof WindowClient; })];
            }
        });
    });
}
function focusWindow(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var allClients, firstClient, absoluteURL, match;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(!options || !options.url)) return [3 /*break*/, 3];
                    return [4 /*yield*/, self.clients.matchAll()];
                case 1:
                    allClients = _a.sent();
                    firstClient = allClients.find(function (c) { return c instanceof WindowClient; });
                    if (!firstClient) {
                        throw new Error("Tried to focus, but there were no client windows");
                    }
                    return [4 /*yield*/, firstClient.focus()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
                case 3:
                    absoluteURL = new URL(options.url, self.location.href).href;
                    return [4 /*yield*/, getExistingWindow(absoluteURL, options)];
                case 4:
                    match = _a.sent();
                    if (!match) return [3 /*break*/, 6];
                    return [4 /*yield*/, match.focus()];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 6:
                    if (!(options.openIfNotExisting === true)) return [3 /*break*/, 8];
                    return [4 /*yield*/, self.clients.openWindow(absoluteURL)];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 8:
                    console.error("Tried to focus a window that didn't exist! " + absoluteURL);
                    _a.label = 9;
                case 9: return [2 /*return*/];
            }
        });
    });
}
function openWindow(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var absoluteURL, match;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    absoluteURL = new URL(options.url, self.location.href).href;
                    if (!!options.focusIfExisting) return [3 /*break*/, 2];
                    return [4 /*yield*/, self.clients.openWindow(options.url)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 2: return [4 /*yield*/, getExistingWindow(absoluteURL, options)];
                case 3:
                    match = _a.sent();
                    if (!match) return [3 /*break*/, 5];
                    return [4 /*yield*/, match.focus()];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, self.clients.openWindow(options.url)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
export function setup() {
    registerCommand("browser.focus", focusWindow);
    registerCommand("browser.open", openWindow);
}
