'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/lib/actions"
import { toast } from "sonner"
import { Store, Mail, Lock } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success("Berhasil masuk!")
    router.push("/")
    router.refresh()
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gradient-to-b from-emerald-50/30 to-white py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold">
            <div className="h-10 w-10 rounded-xl bg-brand-gradient flex items-center justify-center">
              <Store className="h-5 w-5 text-white" />
            </div>
            <span className="text-gradient">D2C Pro</span>
          </Link>
          <p className="text-gray-500 text-sm mt-3">Masuk ke akun Anda</p>
        </div>

        <div className="bg-white rounded-2xl p-6 elevated-shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="nama@email.com" className="pl-9 rounded-xl" />
              </div>
            </div>
            <div>
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="********" className="pl-9 rounded-xl" />
              </div>
            </div>
            <Button type="submit" className="w-full bg-brand-gradient hover:opacity-90 text-white shadow-sm rounded-xl h-11" disabled={loading}>
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Belum punya akun?{" "}
          <Link href="/register" className="text-emerald-600 font-medium hover:underline">Daftar</Link>
        </p>
      </div>
    </div>
  )
}
