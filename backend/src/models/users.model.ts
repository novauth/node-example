import mongoose from "mongoose";
import type { Query, Document, Model } from "mongoose";

/**
 * The User type used in the data model
 */
interface User {
  // the id is present when querying the db but not when creating new documents
  _id?: string;
  username: string;
  // for simplicity, here we store the pairing as json
  pairing: string;
}

const schema = new mongoose.Schema<
  User,
  Model<User, UserQueryHelpers>,
  any,
  any
>({
  username: { type: String, required: true, unique: true },
  pairing: { type: String, required: false, unique: false },
});

interface UserQueryHelpers {
  byUsername(username: string): Query<any, Document<User>> & UserQueryHelpers;
}

schema.query.byUsername = function (
  username: string
): Query<any, Document<User>> & UserQueryHelpers {
  return this.findOne({ username });
};

// 2nd param to `model()` is the Model class to return.
const model = mongoose.model<User, Model<User, UserQueryHelpers>>(
  "User",
  schema
);

export default model;
export { User };
