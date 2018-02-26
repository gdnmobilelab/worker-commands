# worker-commands

A library of useful Service Worker commands, wrapped up in an interface that can be called from a page, or in response to a push or notification event.

## Why would I want to use it?

Service workers can be shut down at any time, at which point they lose any variables and listeners attached to it. So, while you might think you can do this:

    function notifyUser() {
        self.registration.showNotification({ body : "test" })
        self.addEventListener("notificationclick", () => {
            // act on the notification click
        })
    }

Hours might pass between the time you show the notification and the time the user clicks on it - at which point, the worker will be re-initialised with no listener attached. However, notifications have a `data` property allowing you to store information along with a notification, and retrieve it later. `worker-commands` uses this to attach declarative events when showing a notification. It isn't as flexible as a custom function, but it does allow you to, for example, update the worker in response to a push event without having to set up a specific listener.

## Setup

To start using the library, just run the `setup()` function in the script that starts your worker:

    import { setup } from 'worker-commands';
    setup();

## Command structure

At the centre of `worker-commands` is the `RunCommand` interface, which is simply an object with two properties, `command` and `options`:

    const commandToRun = {
        command: "notification.show",
        options: {
            title: "Alert!",
            body: "This is an alert"
        }
    }

### Firing a command in the worker

To fire a command, you just use the `fireCommand` method inside your worker:

    import { fireCommand } from 'worker-commands';

    await fireCommand(commandToRun);

You can also provide an array of `RunCommand`s to `fireCommand` (and all of the other options listed below) and it will execute all of them, unless one encounters an error. It returns a promise.

### Firing from a client web page

Although things like the Cache API are available on clients the `worker-commands` library only works when set up inside a service worker. But you can call a command from a page, by running this:

    import { sendClient } from 'worker-commands';

    await sendClient({
        command: "notification.show",
        options: {
            title: "Alert from client"
        }
    })

If your build process doesn't involve tree-shaking you'll end up with the entire `worker-commands` library in your client JS. If you'd like to avoid that extra processing, just call the specially constructed `send-command.js` file:

    const workerClient = require('workercommands/send-command');

    await workerClient.sendClient({
        command: "notification.show",
        options: {
            title: "Alert from client"
        }
    })

### Commands via push events

By default `worker-commands` hooks into a worker's `push` event to execute commands sent via push message. To use it, send a JSON payload with a `__workerCommandPayload`, like so:

    {
        __workerCommandPayload: {
            command: "notification.show",
            options: {
                title: "Push alert received!"
            }
        }
    }

### Commands as events

Because `RunCommand` is a serialisable object, we can store in the `data` attribute of a notification. This allows us to run commands in response to events, by adding additional options like so:

```
fireCommand({
    command: "notification.show",
    options: {
        title: "Alert!",
        body: "This is an alert",
        actions: [
            {
                action: "openlink",
                title: "Open Link"
            }
        ],
        events: {
            onclick: {
                command: "notification.close"
            },
            onopenlink: [
                {
                    command: "notification.close"
                },
                {
                    command: "client.open",
                    options: {
                        url: "http://www.example.org"
                    }
                }
            ]
        }
    }
});
```

These handlers can survive the worker being destroyed and recreated, because they are stored with the notification.

## Available commands

There aren't too many yet, but:

* Notifications
    * `notification.show`: the options parameter accepts all values used in the [Notification constructor](https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification) as well as a `title` attribute, and an `events` object with commands to be triggered `onclick`, `onclose` and `on[id of action]`.
    * `notification.close`: if this is called in response to a notification event (i.e. `notificationclick` or `notificationclose`) it will remove the active notification. Options has one parameter - `tag`. If provided, it'll close all notifications with this tag instead of the active notification.
* Cache
    * `cache.add`: options has two parameters - `cacheName` to control which cache to add to, `urls`, which is an array of URLs to cache.
    * `cache.delete`: same as above, except it removes items from the cache.
* Client
    * `client.open`: opens a new browser window with the URL specified in `options.url`. If `options.focusIfExisting` is `true` and a window already exists with this URL, it will focus instead of opening a new window.
    * `client.focus`: the reverse of the above. Focuses an active window. If there isn't one with this URL and `options.openIfNotExisting` is `true`, it'll open a new one.
    * `client.post-message`: runs `postMessage()` on all clients matching the URL provided in `options.url`. Sends `options.message` to the clients.
* Registration
    * `registration.update`: tries to update the current worker by running `self.registration.update()`. Any subsequent commands on this command chain will still run in the old worker, though.
    * `registration.unregister`: remove this worker registration from the browser.

## Tests

There's a small library for testing the parts of the library we can easily test. Just run

    npm run test

and point your browser to `http://localhost:4567` to load them.
