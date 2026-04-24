"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const errorParam = searchParams.get("error");
        if (errorParam) {
          const errorDescriptions: Record<string, string> = {
            "auth_callback_failed": "Authentication failed. Please try again.",
            "unexpected_error": "An unexpected error occurred.",
            "cancelled": "Sign-in was cancelled.",
            "OAuth error": "OAuth provider error. Please try again.",
          };
          toast.error(errorDescriptions[errorParam] || "Authentication failed.");
          setStatus("error");
          setTimeout(() => router.push("/sign-in"), 2000);
          return;
        }

        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          toast.error(error.message || "Authentication failed.");
          setStatus("error");
          setTimeout(() => router.push("/sign-in"), 2000);
          return;
        }

        if (data.session) {
          setStatus("success");
          toast.success("Identity verified. Access granted.");
          setTimeout(() => router.push("/dashboard"), 500);
        } else {
          toast.error("No session received. Please try again.");
          setStatus("error");
          setTimeout(() => router.push("/sign-in"), 2000);
        }
      } catch (err) {
        console.error("Unexpected error in auth callback:", err);
        toast.error("An unexpected error occurred.");
        setStatus("error");
        setTimeout(() => router.push("/sign-in"), 2000);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-dark">
      <div className="text-center">
        {status === "loading" && (
          <>
            <div className="mb-4 h-12 w-12 mx-auto animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">Verifying identity...</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="mb-4 h-12 w-12 mx-auto rounded-full bg-success/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-medium text-success uppercase tracking-widest">Identity verified</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="mb-4 h-12 w-12 mx-auto rounded-full bg-error/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-sm font-medium text-error uppercase tracking-widest">Authentication failed</p>
          </>
        )}
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-dark">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 mx-auto animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
        <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">Verifying identity...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthCallbackContent />
    </Suspense>
  );
}