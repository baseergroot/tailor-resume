import mongoose, { Schema, Document, Model } from "mongoose";
import type { UIMessage } from "ai";

export interface IChat {
  chatId: string;
  clientEmail?: string;
  messages: UIMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatDocument extends IChat, Document {}

const ChatSchema: Schema<IChatDocument> = new Schema(
  {
    chatId: { type: String, required: true, unique: true, index: true },
    clientEmail: { type: String, index: true },
    messages: { type: Schema.Types.Mixed, default: [] },
  },
  { timestamps: true }
);

export const Chat: Model<IChatDocument> =
  mongoose.models.Chat || mongoose.model<IChatDocument>("Chat", ChatSchema);