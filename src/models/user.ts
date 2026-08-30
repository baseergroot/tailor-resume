import { Document, Model, Schema, model, models } from "mongoose";

export interface IUser {
  clerkUserId: string;
  firstName?: string;
  lastName?: string;
  email: string;
  resume: {
    resumeText: string
  }
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document { }

const UserSchema: Schema<IUserDocument> = new Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    firstName: {
      type: String,
    },

    lastName: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      index: true,
    },
    resume: {
      resumeText: {
        type: String,
      }
    }
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUserDocument> =
  models.User ||
  model<IUserDocument>("User", UserSchema);