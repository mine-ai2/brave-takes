import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TemplatesClient from './TemplatesClient'

export default async function TemplatesPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get all templates for filtering on client
  const { data: templates } = await supabase
    .from('templates')
    .select('*')

  // Get unique filter options
  const platforms = [...new Set(templates?.map(t => t.platform).filter(Boolean))]
  const contentTypes = [...new Set(templates?.map(t => t.content_type).filter(Boolean))]
  const tones = [...new Set(templates?.map(t => t.tone).filter(Boolean))]

  return (
    <TemplatesClient
      templates={templates || []}
      platforms={platforms as string[]}
      contentTypes={contentTypes as string[]}
      tones={tones as string[]}
    />
  )
}
