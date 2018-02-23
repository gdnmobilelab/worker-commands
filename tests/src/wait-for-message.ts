export async function waitForMessage() {
    return new Promise<any>((fulfill, reject) => {
        function listener(e: any) {
            navigator.serviceWorker.removeEventListener("message", listener);
            fulfill(e.data);
        }

        navigator.serviceWorker.addEventListener("message", listener);
    });
}
