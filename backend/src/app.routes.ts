import express from "express";
import NovAuthSDK, {
  Pairing,
  PairingOperation,
  PushAuthenticationOperation,
} from "@novauth/sdk-node";
import UserModel from "./models/users.model.js";
import OperationModel from "./models/operations.model.js";
import {
  SerializedAppAPIPairingResultRequest,
  AppAPIPushAuthenticationResultRequest,
} from "@novauth/sdk-node";
import { io } from "./index.js";
import { SerializedPairing } from "@novauth/sdk-node/lib/pairing/Pairing";

console.log(process.env.NOVAUTH_APP_ORIGIN);

const novauth = new NovAuthSDK(String(process.env.NOVAUTH_TOKEN), {
  app: {
    /* Provided by the NovAuth API when you register a new App with your account */
    id: String(process.env.NOVAUTH_APP_ID),
    /* The name which will be displayed on the authenticator app */
    name: "NovAuth Demo",
    /* eg. https://demo-novauth.herokuapp.com */
    origin: String(process.env.NOVAUTH_APP_ORIGIN),
    /* eg. demo-novauth.herokuapp.com */
    domain: String(process.env.NOVAUTH_APP_DOMAIN),
    webhook: "/api/webhook",
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
      const pairing: SerializedPairing = JSON.parse(user.pairing);
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

router.put(
  "/webhook",
  async function (
    req: express.Request<
      any,
      any,
      | SerializedAppAPIPairingResultRequest
      | AppAPIPushAuthenticationResultRequest
    >,
    res: express.Response,
    next: express.NextFunction
  ) {
    switch (req.body.type) {
      // pairing result
      case "pair_result": {
        try {
          // retrieve operation from db
          const operation = await OperationModel.findOne({
            id: req.body.data.operationID,
          });
          if (operation !== null) {
            const parsedOperation: PairingOperation = JSON.parse(
              operation.json
            );
            console.log(parsedOperation);
            console.log(req.body.data);
            // verify the pairing with the credentials received from the client
            const pairing = await novauth.pairingVerify(
              parsedOperation,
              req.body.data
            );
            // delete the operation
            await OperationModel.findOneAndDelete({
              id: req.body.data.operationID,
            });
            // update the pairing associated with the user
            const user = await UserModel.findOneAndUpdate(
              {
                id: parsedOperation.data.userId,
              },
              { $set: { pairing } }
            );
            // notify the browser that the pairing was successful
            if (user !== null)
              await io.to(user?.username).emit("pairing_verified");
            // notify the authenticator app about the successful pairing
            return res.status(200).json({});
          } else
            return res.status(400).json({ message: "Invalid Operation ID" });
        } catch (error) {
          console.log(error);
        }
        break;
      }
      // push authentication result
      case "push_authentication_result": {
        const operation = await OperationModel.findOne({
          id: req.body.data.operationId,
        });
        if (operation !== null) {
          const parsedOperation: PushAuthenticationOperation = JSON.parse(
            operation.json
          );
          // verify the push auth with the credentials received from the client
          const pairing = await novauth.pushAuthenticationVerify(
            parsedOperation,
            req.body.data
          );
          // delete the operation
          await OperationModel.findOneAndDelete({
            id: req.body.data.operationId,
          });
          // update the pairing associated with the user
          await UserModel.findOneAndUpdate(
            {
              username: parsedOperation.data.pairing.userID,
            },
            { $set: { pairing } }
          );
          return res.status(200).json({});
        } else return res.status(400).json({ message: "Invalid Operation ID" });
      }
    }
  }
);
export default router;
