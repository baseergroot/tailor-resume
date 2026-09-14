import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import { User } from "@/models/user";
import ResumeUploadForm from "@/components/forms/resumeUploadForm";
import ResumeAnalyzer from "@/components/ResumeAnalyzer";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  await connectDB();
  const user = await User.findOne({ clerkUserId: userId }).lean();
  const hasResume = Boolean(user?.resume?.resumeText);

  return (
    <main className="min-h-screen bg-mm-canvas">
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10 space-y-8">
        {/* Header */}
        <div>
          <h1 className="mm-heading-lg text-mm-ink mb-2">Resume Dashboard</h1>
          <p className="text-mm-steel">
            Upload your resume and analyze it against any job description.
          </p>
        </div>

        {/* Upload */}
        {hasResume ? (
          <div className="mm-card p-6 text-center">
            <span className="mm-badge mm-badge-success mb-3">Resume Uploaded</span>
            <p className="text-sm text-mm-steel mt-2">
              Your resume is ready. Paste a job description below to get started.
            </p>
          </div>
        ) : (
          <ResumeUploadForm />
        )}

        {/* Analyzer */}
        {hasResume && <ResumeAnalyzer />}
      </div>
    </main>
  );
}
