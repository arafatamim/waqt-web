importScripts("sw-toolbox.js");
toolbox.precache(["index.html", "styles/style.css", "scripts/script.js"]);
toolbox.router.get("assets/*", toolbox.cacheFirst);
toolbox.router.get("/*", toolbox.networkFirst, { networkTimeoutSeconds: 5 });
