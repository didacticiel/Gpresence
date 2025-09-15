// src/pages/LoginPage.tsx
import { LoginForm } from "@/components/ui/login-form"  

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Gpresence</h1>
          <p className="text-muted-foreground">Connectez-vous pour continuer</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}