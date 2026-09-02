import { Webhook } from "svix"
import { headers } from "next/headers"
import { User } from "@/models/user"
import connectDB from "@/lib/db"
import getEnv from "@/helper/env"

export async function POST(req: Request) {
    console.log("webhook triggered to handle clerk webhook")
  const SIGNING_SECRET = getEnv.CLERK_WEBHOOK_SECRET

  const headerPayload = await headers()

  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing webhook headers", {
      status: 400,
    })
  }

  const payload = await req.text()

  console.log("WEBHOOK PAYLOAD:", payload)

  const wh = new Webhook(SIGNING_SECRET)

  let event: any

  try {
    event = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    })
  } catch (error) {
    console.error("Webhook verification failed", error)

    return new Response("Invalid signature", {
      status: 400,
    })
  }

  await connectDB()

  switch (event.type) {
    case "user.created": {
      const user = event.data

      const email = user.email_addresses?.find(
        (email: any) => email.id === user.primary_email_address_id
      )?.email_address

      await User.create({
        clerkUserId: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email,
      })

      console.log("Mongo user created:", user.id)

      break
    }

    case "user.updated": {
      const user = event.data

      const email = user.email_addresses?.find(
        (email: any) => email.id === user.primary_email_address_id
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

  return new Response("Webhook processed", {
    status: 200,
  })
}


// export async function GET() {
//     return new Response("Webhook processed", {
//         status: 200,
//     })
// }