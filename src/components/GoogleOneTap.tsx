"use client";

import { useEffect, useCallback, useState, memo, useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import Script from "next/script";

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (moment: any) => void) => void;
          cancel: () => void;
          revoke: (hint: string, callback: () => void) => void;
          renderButton?: (parent: HTMLElement, options: any) => void;
        };
      };
    };
  }
}

const GoogleOneTap = () => {
  const { data: session } = useSession();
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleCredentialResponse = useCallback((response: any) => {
    signIn("google", {
      credential: response.credential,
      redirect: false,
    }).catch((error) => {
      console.error("Error signing in:", error);
    });
  }, []);

  const renderFallbackButton = useCallback(() => {
    if (buttonRef.current && window.google?.accounts.id.renderButton) {
      if (buttonRef.current.childNodes.length === 0) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
        });
      }
    }
  }, []);

  const initializeGoogleOneTap = useCallback(() => {
    if (!window.google || session || initialized) return;

    try {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleCredentialResponse,
        context: "signin",
        ux_mode: "popup",
        auto_select: false,
        use_fedcm_for_prompt: true,
      });

      window.google.accounts.id.prompt((moment: any) => {
        switch (moment.momentType) {
          case "display":
            console.log("One Tap displayed");
            break;
          case "skipped":
            console.log("One Tap skipped", moment);
            renderFallbackButton();
            break;
          case "dismissed":
            console.log("One Tap dismissed", moment);
            renderFallbackButton();
            break;
          default:
            console.log("Unhandled One Tap moment:", moment);
            renderFallbackButton();
        }
      });

      setInitialized(true);
    } catch (error) {
      console.error("Error initializing One Tap:", error);
      renderFallbackButton();
    }
  }, [session, initialized, handleCredentialResponse, renderFallbackButton]);

  useEffect(() => {
    if (isGoogleScriptLoaded) {
      initializeGoogleOneTap();
    }
  }, [isGoogleScriptLoaded, initializeGoogleOneTap]);

  useEffect(() => {
    if (session) {
      console.log("User signed in, cancelling One Tap");
      window.google?.accounts.id.cancel();
    }
  }, [session]);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        async
        defer
        onLoad={() => setIsGoogleScriptLoaded(true)}
        strategy="afterInteractive"
      />
      {/* ✅ Fallback login button container */}
      <div ref={buttonRef} className="flex justify-center mt-4" />
    </>
  );
};

GoogleOneTap.displayName = "GoogleOneTap";

export default memo(GoogleOneTap);
