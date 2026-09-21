"use client"

const ANON_TAILOR_COUNT_KEY = "novai_tailor_count"
const PENDING_RESUME_KEY = "novai_pending_resume"

function isClient(): boolean {
  return typeof window !== "undefined"
}

function safeGetItem(key: string): string | null {
  if (!isClient()) return null
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSetItem(key: string, value: string): boolean {
  if (!isClient()) return false
  try {
    localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

function safeRemoveItem(key: string): void {
  if (!isClient()) return
  try {
    localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

export function getAnonymousTailorCount(): number {
  const value = safeGetItem(ANON_TAILOR_COUNT_KEY)
  if (!value) return 0
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? 0 : parsed
}

export function incrementAnonymousTailorCount(): number {
  const current = getAnonymousTailorCount()
  const next = current + 1
  safeSetItem(ANON_TAILOR_COUNT_KEY, String(next))
  return next
}

export function hasUsedAnonymousTailor(): boolean {
  return getAnonymousTailorCount() >= 1
}

export function resetAnonymousTailorCount(): void {
  safeRemoveItem(ANON_TAILOR_COUNT_KEY)
}

interface PendingResumeData {
  resumeText: string
  timestamp: number
}

export function savePendingResume(resumeText: string): boolean {
  const data: PendingResumeData = {
    resumeText,
    timestamp: Date.now(),
  }
  return safeSetItem(PENDING_RESUME_KEY, JSON.stringify(data))
}

export function getPendingResume(): string | null {
  const value = safeGetItem(PENDING_RESUME_KEY)
  if (!value) return null
  try {
    const data: PendingResumeData = JSON.parse(value)
    if (data && typeof data.resumeText === "string") {
      return data.resumeText
    }
  } catch {
    // ignore parse errors
  }
  return null
}

export function clearPendingResume(): void {
  safeRemoveItem(PENDING_RESUME_KEY)
}

export function hasPendingResume(): boolean {
  return getPendingResume() !== null
}