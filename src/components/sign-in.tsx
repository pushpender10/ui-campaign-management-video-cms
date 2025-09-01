import { signIn } from "@/lib/auth"

interface IPropsGoogleSignIn {
  callbackUrl: string;
  children: React.ReactNode;
}

export const GoogleSignIn = ({callbackUrl, children}:IPropsGoogleSignIn) => {
  return (
    <form
      action={async () => {
        // "use server"
        await signIn("google", {callbackUrl:callbackUrl})
      }}
    >
      <button className="w-full border rounded py-2" type="submit">{children}</button>
    </form>
  )
}