// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: "https://9f9be23af3957aea0fd7a8e50015a68b@o4510571575246848.ingest.us.sentry.io/4510571579375616",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  integrations: [
    Sentry.mongooseIntegration(),
  ],
});