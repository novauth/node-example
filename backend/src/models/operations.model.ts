import mongoose from "mongoose";
import type { Query, Document, Model } from "mongoose";

/**
 * The Operation type used in the data model
 */
interface Operation {
  // the id is present when querying the db but not when creating new documents
  _id?: string;
  id: string;
  // for simplicity, here we store the operation as JSON
  json: string;
}

const schema = new mongoose.Schema<
  Operation,
  Model<Operation, OperationQueryHelpers>,
  any,
  any
>({
  id: { type: String, required: true, unique: true },
  json: { type: String, required: true },
});

interface OperationQueryHelpers {
  byId(id: string): Query<any, Document<Operation>> & OperationQueryHelpers;
}

schema.query.byId = function (
  id: string
): Query<any, Document<Operation>> & OperationQueryHelpers {
  return this.findOne({ id });
};

// 2nd param to `model()` is the Model class to return.
const model = mongoose.model<
  Operation,
  Model<Operation, OperationQueryHelpers>
>("Operation", schema);

export default model;
export { Operation };
