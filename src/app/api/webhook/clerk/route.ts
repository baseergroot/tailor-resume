import { verifyWebhook } from "@clerk/nextjs/webhooks"
import { User } from "@/models/user"
import connectDB from "@/lib/db"
import { NextRequest } from "next/server"
import { trackEvent } from "@/lib/analytics/track-event"

export async function POST(req: NextRequest) {
  console.log("Webhook triggered")

  try {
    const event = await verifyWebhook(req)

    console.log("Event verified successfully:", event.type)

    await connectDB()

    switch (event.type) {
      case "user.created": {
        const user = event.data

        if (!user.email_addresses || user.email_addresses.length === 0) {
          console.log("User has no email addresses:", user.id)
          break
        }

        if (!user.first_name || !user.last_name) {
          console.log("User has no first name or last name:", user.id)
          break
        }

        const email = user.email_addresses?.find(
          (email) => email.id === user.primary_email_address_id
        )?.email_address

        await User.create({
          clerkUserId: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email,
        })

        console.log("Mongo user created:", user.id)

        trackEvent({
          event: "signup_completed",
          clerkUserId: user.id,
          path: "/sign-up",
        })
        break
      }

      case "user.updated": {
        const user = event.data

        const email = user.email_addresses?.find(
          (email) => email.id === user.primary_email_address_id
        )?.email_address

        await User.findOneAndUpdate(
          { clerkUserId: user.id },
          {
            firstName: user.first_name,
            lastName: user.last_name,
            email,
          },
          { new: true }
        )

        console.log("Mongo user updated:", user.id)
        break
      }

      case "user.deleted": {
        const user = event.data

        await User.findOneAndDelete({
          clerkUserId: user.id,
        })

        console.log("Mongo user deleted:", user.id)
        break
      }

      default:
        console.log("Unhandled Clerk event:", event.type)
    }

    return new Response("Webhook processed", { status: 200 })
  } catch (error) {
    console.error("Webhook verification/processing failed:", error)

    return new Response("Invalid webhook", { status: 400 })
  }
}