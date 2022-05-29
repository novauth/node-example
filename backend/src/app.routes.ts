import express from "express";
import NovAuthSDK, { Pairing } from "@novauth/sdk-node";
import UserModel from "./models/users.model.js";
import OperationModel from "./models/operations.model.js";

console.log(process.env.NOVAUTH_APP_ORIGIN);

const novauth = new NovAuthSDK(String(process.env.NOVAUTH_TOKEN), {
  app: {
    /* Provided by the NovAuth API when you register a new App with your account */
    id: String(process.env.NOVAUTH_APP_ID),
    /* The name which will be displayed on the authenticator app */
    name: "NovAuth Demo",
    /* eg. https://demo-novauth.herokuapp.com */
    origin: String(process.env.NOVAUTH_APP_ORIGIN),
    webhook: "/webhook",
  },
  /* Type of authentication mechanism.
  "device" requires the authenticator app to use a verification method embedded in the user's device
  (eg. fingerprint, face recognition, etc.) */
  authenticator: "device",
});

const router = express.Router();

/* GET home page. */
router.get(
  "/",
  function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.status(200).json({ name: "NovAuth Authentication Example API" });
  }
);

router.post(
  "/sign-in",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    // retrieve the user from the db
    const user = await UserModel.findOne().byUsername(req.body.username);
    if (user !== null) {
      // retrieve pairing data
      const pairing: Pairing = JSON.parse(user.pairing);
      // start a pairing authentication
      const intent = await novauth.pushAuthenticationIntent(pairing);
      // store the push authentication operation in the db for later use
      await OperationModel.create({
        id: intent.operation.id,
        json: JSON.stringify(intent.operation),
      });
      // report to the client that a push authentication has started
      return res
        .status(200)
        .json({ message: "Push Authentication initiated." });
    }
    // user not found
    else return res.status(404).json({ message: "User not found." });
  }
);

router.post(
  "/sign-up",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    // create new user
    const user = await UserModel.create({ username: req.body.username });
    // generate new pairing operation
    const intent = await novauth.pairingIntent({
      id: user.id,
      displayName: user.username,
      name: user.username,
    });
    // store the pairing operation in the db for later use
    OperationModel.create({
      id: intent.operation.id,
      json: JSON.stringify(intent.operation),
    });
    // send the pairing operation back to the client
    return res
      .status(200)
      .json({ message: "Pending device registration", qrCode: intent.qrCode });
  }
);

router.post(
  "/webhook",
  function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    //TODO: implement webhook
  }
);
export default router;
