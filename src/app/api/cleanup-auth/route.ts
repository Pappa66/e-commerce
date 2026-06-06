import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  try {
    const supabase = createAdminClient()

    const { data: users, error: listError } = await supabase.auth.admin.listUsers()
    if (listError) return NextResponse.json({ error: listError.message }, { status: 500 })

    if (!users?.users?.length) return NextResponse.json({ message: "No users to delete" })

    const emails: string[] = []
    for (const user of users.users) {
      const { error } = await supabase.auth.admin.deleteUser(user.id)
      if (error) return NextResponse.json({ error: `Failed to delete ${user.email}: ${error.message}` }, { status: 500 })
      emails.push(user.email!)
    }

    return NextResponse.json({ message: `Deleted ${emails.length} users`, users: emails })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
