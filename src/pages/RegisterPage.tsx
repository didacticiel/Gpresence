// src/pages/RegisterPage.tsx
import { RegisterForm } from "@/components/ui/register-form"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  )
}