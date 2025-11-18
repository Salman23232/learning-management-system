import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex justify-end items-center mt-20">
      <SignIn />
    </div>
  )
}
