import mongoose, { Schema, Document, Model } from "mongoose";
import type { UIMessage } from "ai";

export interface IChatSession {
  sessionId: string;
  messages: UIMessage[];
}

export interface IChatSessionDocument extends IChatSession, Document {}

const ChatSessionSchema: Schema<IChatSessionDocument> = new Schema(
  {
    // ✅ Use explicit configuration blocks instead of loose type objects
    sessionId: { 
      type: String, 
      required: true, 
      unique: true, 
      index: true 
    },
    // ✅ Fixes Array type error: explicit array declaration
    messages: [{ type: Schema.Types.Mixed, default: [] }],
  },
  { timestamps: true }
);

export const ChatSession: Model<IChatSessionDocument> =
  mongoose.models.ChatSession || mongoose.model<IChatSessionDocument>("ChatSession", ChatSessionSchema);
