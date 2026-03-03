import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navigation from '@/components/Navigation'
import VaultClient from './VaultClient'

export interface VaultItem {
  id: string
  user_id: string
  category: string
  content: string
  created_at: string
}

export default async function VaultPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get all vault items for user
  const { data: items } = await supabase
    .from('vault_items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <>
      <VaultClient 
        initialItems={(items || []) as VaultItem[]} 
        userId={user.id}
      />
      <Navigation current="vault" />
    </>
  )
}
