'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { register } from "@/lib/actions"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const result = await register(email, password, name)
    setLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success("Akun berhasil dibuat! Silakan cek email untuk verifikasi.")
    router.push("/login")
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-emerald-600">D2C</span> Pro
          </Link>
          <p className="text-gray-500 text-sm mt-2">Buat akun baru</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} required placeholder="Nama Anda" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="nama@email.com" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min. 6 karakter" minLength={6} />
          </div>
          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
            {loading ? "Memproses..." : "Daftar"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-emerald-600 hover:underline">Masuk</Link>
        </p>
      </div>
    </div>
  )
}
