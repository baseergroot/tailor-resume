import { Document, Model, Schema, model, models } from "mongoose";

export interface IAppointment {
  clientName: string;
  clientEmail: string;
  startTime: string;       // full ISO UTC string, e.g. "2026-08-20T04:00:00.000Z"
  calBookingUid: string;   // Cal.com's booking uid, for cancel/reschedule later
  bookingUrl?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: Date;
}

export interface IAppointmentDocument extends IAppointment, Document {}

const AppointmentSchema: Schema<IAppointmentDocument> = new Schema(
  {
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true, index: true },
    startTime: { type: String, required: true },
    calBookingUid: { type: String, required: true, index: true },
    bookingUrl: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

export const Appointment: Model<IAppointmentDocument> =
  models.Appointment ||
  model<IAppointmentDocument>("Appointment", AppointmentSchema);