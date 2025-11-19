import {
  ClerkProvider, // Wrap your app (usually in _app.js)
  SignedIn, // Render content only if user is signed in
  SignedOut, // Render content only if user is signed out
  SignIn, // SignIn form component
  SignUp, // SignUp form component
} from '@clerk/nextjs'
export default function Home() {
  return (
    // <div className="min-h-screen flex justify-center items-center">
    //   {/* Render content if user is signed in */}
    //   <SignedIn>
    //     <h1 className="text-2xl font-bold">Welcome to your dashboard!</h1>
    //   </SignedIn>

    //   {/* Render sign-in form if user is signed out */}
    //   <SignedOut>
    //     <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    //   </SignedOut>
    // </div>
    <div></div>
  )
}
