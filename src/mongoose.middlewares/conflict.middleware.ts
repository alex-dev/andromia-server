import { MongooseDocument } from "@tsed/mongoose";
import { NativeError } from "mongoose";
import { Conflict } from "ts-httpexceptions";

export function conflictMiddleware<T>(error: any, doc: MongooseDocument<T>, next: (err?: NativeError) => void) {
  if (error.name !== 'MongoError' || error.code !== 11000) {
    next();
  }

  next(new Conflict(error.message));
}
