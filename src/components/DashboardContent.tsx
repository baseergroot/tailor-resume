"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import { SignInButton, SignUpButton } from "@clerk/nextjs"
import ResumeUploadForm from "@/components/forms/resumeUploadForm"
import ResumeAnalyzer from "@/components/ResumeAnalyzer"
import { Button } from "@/components/ui/button"
import {
  getAnonymousTailorCount,
  getPendingResume,
  clearPendingResume,
} from "@/lib/anonymous-storage"
import { trackEventClient } from "@/lib/analytics/track-event-client"
import { savePendingResume } from "@/actions/savePendingResume"

export default function DashboardContent() {
  const { isLoaded, isSignedIn, userId } = useAuth()
  const [resumeText, setResumeText] = useState<string | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [hasResume, setHasResume] = useState(false)
  const [wasAnonymous, setWasAnonymous] = useState(false)

  // Derived state
  const isAnonymous = !isSignedIn

  useEffect(() => {
    if (!isLoaded) return

    if (isSignedIn && userId && wasAnonymous) {
      const pending = getPendingResume()
      if (pending) {
        savePendingResume(pending)
        clearPendingResume()
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setWasAnonymous(false)
      }
    } else if (!isSignedIn) {
      setWasAnonymous(true)
      const pending = getPendingResume()
      if (pending) {
        setResumeText(pending)
        setHasResume(true)
      }
    }
  }, [isLoaded, isSignedIn, userId, wasAnonymous])

  const handleResumeUploaded = (text: string) => {
    setResumeText(text)
    setHasResume(true)
    if (isAnonymous) {
      localStorage.setItem("novai_pending_resume", JSON.stringify({ resumeText: text, timestamp: Date.now() }))
    }
  }

  const handleTailoringComplete = async (success: boolean) => {
    if (success && isAnonymous) {
      const count = getAnonymousTailorCount()
      if (count === 0) {
        localStorage.setItem("novai_tailor_count", String(count + 1))
      }
    }
  }

  const handleLoginClick = () => {
    trackEventClient({
      event: "auth_started",
      path: "/dashboard",
    })
    setShowLoginModal(true)
  }

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-mm-canvas">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10 space-y-8 text-center">
          <div className="mm-card p-6">Loading…</div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-mm-canvas">
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10 space-y-8">
        {/* Header */}
        <div>
          <h1 className="mm-heading-lg text-mm-ink mb-2">Resume Dashboard</h1>
          <p className="text-mm-steel">
            Upload your resume and analyze it against any job description.
          </p>
          {isAnonymous && (
            <div className="mt-3 p-3 mm-card bg-mm-surface border-mm-coral">
              <p className="text-sm text-mm-steel">
                You&apos;re using a free anonymous session.{" "}
                <span className="font-medium">
                  {getAnonymousTailorCount() === 0
                    ? "Your first tailoring is free."
                    : "Sign in to continue tailoring."}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Upload */}
        {!hasResume ? (
          <ResumeUploadForm onUploadComplete={handleResumeUploaded} isAnonymous={isAnonymous} />
        ) : (
          <>
            <div className="mm-card p-6 text-center">
              <span className="mm-badge mm-badge-success mb-3">Resume Ready</span>
              <p className="text-sm text-mm-steel mt-2">
                Your resume is ready. Paste a job description below to get started.
              </p>
              {isAnonymous && (
                <p className="text-xs text-mm-muted mt-2">
                  Anonymous session — data stored locally in your browser
                </p>
              )}
            </div>

            {/* Analyzer */}
            <ResumeAnalyzer
              resumeText={resumeText}
              isAnonymous={isAnonymous}
              onTailoringComplete={handleTailoringComplete}
              showLoginModal={showLoginModal}
              onLoginClick={handleLoginClick}
            />
          </>
        )}

        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="mm-card w-full max-w-md p-6">
              <div className="text-center mb-6">
                <h2 className="mm-heading-md text-mm-ink mb-2">Create your free account</h2>
                <p className="text-sm text-mm-steel">
                  You&apos;ve used your free tailoring.
                  <br />
                  Sign in with Google to tailor more resumes and save your resume for future jobs.
                </p>
              </div>
              <div className="space-y-3">
                <SignInButton mode="modal">
                  <Button className="mm-btn mm-btn-primary w-full">Continue with Google</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="mm-btn mm-btn-secondary w-full">Sign Up with Email</Button>
                </SignUpButton>
              </div>
              <p className="text-center text-xs text-mm-muted mt-4">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}