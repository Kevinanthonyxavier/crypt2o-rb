/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// If `onRequest` is unused, remove the import:
// Remove the logger import if unused
// import * as logger from "firebase-functions/logger";

// If you plan to use `logger`, include an example usage like this:
import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";

export const helloWorld = onRequest((req, res) => {
  logger.info("Request received", { method: req.method, path: req.path }); // Log details from req
  res.send("Hello, world!");
});

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
