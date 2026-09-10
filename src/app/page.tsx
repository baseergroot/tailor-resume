import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import { User } from "@/models/user";
import ResumeUploadForm from "@/components/forms/resumeUploadForm";
import ResumeAnalyzer from "@/components/ResumeAnalyzer";
import { Card, CardContent } from "@/components/ui/card";


export default async function Page() {
  let hasResume = false

  try {
    const { userId } = await auth()

    if (userId) {
      await connectDB()
      const user = await User.findOne({ clerkUserId: userId }).lean()
      hasResume = Boolean(user?.resume?.resumeText)
    }
  } catch (error) {
    console.error("Failed to check resume status", error)
  }

  return (
    <main>
      <nav></nav>
      <head></head>
      <main className="flex flex-col items-center gap-6 px-4 py-8">
        {hasResume ? (
          <Card className="w-full max-w-3xl">
            <CardContent className="text-sm text-muted-foreground pt-0">
              Resume already uploaded.
            </CardContent>
          </Card>
        ) : (
          <ResumeUploadForm />
        )}
        <ResumeAnalyzer />
      </main>
    </main>
  )
}
