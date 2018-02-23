import { registerCommand, fireCommand } from "../command-registry";

declare var self: ServiceWorkerGlobalScope;

interface MatchOptions {
  ignoreQuery?: boolean;
  ignoreHash?: boolean;
}

interface FocusOptions extends MatchOptions {
  url?: string;
  openIfNotExisting?: boolean;
}

function filterURL(url: string, options: MatchOptions) {
  let editable = new URL(url);
  if (options.ignoreQuery === true) {
    editable.search = "";
  }
  if (options.ignoreHash === true) {
    editable.hash = "";
  }
  return editable.href;
}

async function getExistingWindow(url: string, options: MatchOptions) {
  const clients = await self.clients.matchAll({
    includeUncontrolled: true
  });

  let urlToSearch = filterURL(url, options);

  return clients.find(c => filterURL(c.url, options) === url && c instanceof WindowClient) as WindowClient | undefined;
}

async function focusWindow(options?: FocusOptions) {
  if (!options || !options.url) {
    let allClients = await self.clients.matchAll();
    let firstClient = allClients.find(c => c instanceof WindowClient) as WindowClient | undefined;
    if (!firstClient) {
      throw new Error("Tried to focus, but there were no client windows");
    }
    await firstClient.focus();
    return;
  }

  const absoluteURL = new URL(options.url, self.location.href).href;

  let match = await getExistingWindow(absoluteURL, options);

  if (match) {
    await match.focus();
  } else if (options.openIfNotExisting === true) {
    await self.clients.openWindow(absoluteURL);
  } else {
    console.error("Tried to focus a window that didn't exist! " + absoluteURL);
  }
}

interface OpenOptions extends MatchOptions {
  url: string;
  focusIfExisting?: boolean;
}

async function openWindow(options: OpenOptions) {
  const absoluteURL = new URL(options.url, self.location.href).href;

  if (!options.focusIfExisting) {
    await self.clients.openWindow(options.url);
  } else {
    let match = await getExistingWindow(absoluteURL, options);
    if (match) {
      await match.focus();
    } else {
      await self.clients.openWindow(options.url);
    }
  }
}

interface PostMessageOptions {
  url?: string;
  message: any;
}

async function postMessage(options: PostMessageOptions) {
  let allClients = await self.clients.matchAll();
  if (options.url) {
    allClients = allClients.filter(c => c.url === options.url);
  }

  allClients.forEach(c => c.postMessage(options.message));
}

export function setup() {
  registerCommand("client.focus", focusWindow);
  registerCommand("client.open", openWindow);
  registerCommand("client.post-message", postMessage);
}
