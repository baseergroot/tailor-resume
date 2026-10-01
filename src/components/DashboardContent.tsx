"use client"

import { useState, useEffect, Fragment } from "react"
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
import { fetchUserResume } from "@/actions/fetchUserResume"
function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
}

const steps = [
  { number: 1, label: "Upload Resume", description: "PDF or DOCX, up to 5MB" },
  { number: 2, label: "Paste Job Description", description: "Copy from any job posting" },
  { number: 3, label: "Get Results", description: "Tailored resume + ATS score + cover letter" },
]

export default function DashboardContent() {
  const { isLoaded, isSignedIn, userId } = useAuth()
  const [resumeText, setResumeText] = useState<string | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [hasResume, setHasResume] = useState(false)
  const [wasAnonymous, setWasAnonymous] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

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

  // Fetch user's resume from DB on initial load for authenticated users
  useEffect(() => {
    if (!isLoaded || !isSignedIn || hasResume) return

    let cancelled = false

    const loadResume = async () => {
      try {
        const { resumeText, error } = await fetchUserResume()
        if (!cancelled && resumeText) {
          setResumeText(resumeText)
          setHasResume(true)
          setCurrentStep(2)
        } else if (error) {
          console.error("Failed to fetch resume:", error)
        }
      } catch (err) {
        console.error("Failed to fetch resume:", err)
      }
    }

    loadResume()

    return () => { cancelled = true }
  }, [isLoaded, isSignedIn, hasResume])

  const handleResumeUploaded = (text: string) => {
    setResumeText(text)
    setHasResume(true)
    setCurrentStep(2)
    if (isAnonymous) {
      localStorage.setItem("novai_pending_resume", JSON.stringify({ resumeText: text, timestamp: Date.now() }))
    }
  }

  const handleTailoringComplete = async (success: boolean) => {
    if (success && isAnonymous) {
      const count = getAnonymousTailorCount()
      console.log("[DEBUG] handleTailoringComplete - current count:", count)
      if (count === 0) {
        localStorage.setItem("novai_tailor_count", String(count + 1))
        console.log("[DEBUG] Incremented count to:", count + 1)
      } else {
        console.log("[DEBUG] Count already >= 1, not incrementing")
      }
    }
    if (success) {
      setCurrentStep(3)
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
        {/* Social Proof Banner */}
        <div className="bg-mm-primary/5 border border-mm-primary/20 rounded-lg p-4 text-center">
          <p className="text-sm text-mm-steel">
            Join <span className="font-semibold text-mm-ink">2,000+</span> job seekers who landed more interviews with HireFit
          </p>
        </div>

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

        {/* Step Indicator */}
        <div className="hidden sm:block">
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, i) => (
              <Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-all ${
                      currentStep > step.number
                        ? "bg-mm-primary text-white"
                        : currentStep === step.number
                        ? "bg-mm-primary text-white ring-2 ring-mm-primary ring-offset-2"
                        : "bg-mm-surface text-mm-muted border border-mm-hairline"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className={`text-xs font-medium mt-1.5 transition-colors ${
                    currentStep >= step.number ? "text-mm-ink" : "text-mm-muted"
                  }`}>
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`hidden sm:block w-full h-1 mx-2 transition-colors ${
                      currentStep > step.number ? "bg-mm-primary" : "bg-mm-hairline"
                    }`}
                  />
                )}
              </Fragment>
            ))}
          </div>
        </div>

        {/* Mobile Step Indicator */}
        <div className="sm:hidden mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center flex-1">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-all ${
                    currentStep > step.number
                      ? "bg-mm-primary text-white"
                      : currentStep === step.number
                      ? "bg-mm-primary text-white ring-2 ring-mm-primary ring-offset-2"
                      : "bg-mm-surface text-mm-muted border border-mm-hairline"
                  }`}
                >
                  {currentStep > step.number ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <span className={`text-[10px] font-medium mt-1 transition-colors ${
                  currentStep >= step.number ? "text-mm-ink" : "text-mm-muted"
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upload */}
        {!hasResume ? (
          <ResumeUploadForm onUploadComplete={handleResumeUploaded} isAnonymous={isAnonymous} setCurrentStep={setCurrentStep} />
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

            {/* ATS Info Box */}
            <div className="mm-card bg-mm-surface/50 border-mm-coral/30 p-4">
              <div className="flex items-start gap-3">
                <InfoIcon className="w-5 h-5 text-mm-coral mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-mm-ink mb-1">What is ATS?</p>
                  <p className="text-sm text-mm-steel">
                    ATS (Applicant Tracking System) is software that filters resumes before humans see them.
                    <strong className="text-mm-ink">75% of resumes are rejected by ATS</strong> for missing keywords.
                    HireFit optimizes your resume with the exact keywords from the job description so you get seen.
                  </p>
                </div>
              </div>
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