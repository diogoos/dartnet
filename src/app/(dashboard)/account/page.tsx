'use client'

import {useEffect, useState} from 'react'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {Card, CardContent} from '@/components/ui/card'
import {Textarea} from '@/components/ui/textarea'
import {Separator} from '@/components/ui/separator'
import {Plus, X} from 'lucide-react'
import {useSession} from "next-auth/react";
import {type UserWithClubs} from "@/lib/types"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {PageHeader} from "@/components/page-header";
import {redirect, RedirectType} from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<UserWithClubs | null>(null)
  const [loading, setLoading] = useState(false)
  const session = useSession()

  useEffect(() => {
    if (!session.data) return;

    fetch('/api/user?id=' + session.data.user.id)
      .then(res => res.json())
      .then(setUser)
  }, [session, loading])

  const handleUpdate = async () => {
    setLoading(true)

    const result = await fetch('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })

    if (result.ok) alert("Profile updated successfully.")
      else alert("There was an unexpected issue updating your profile.")

    window.location.reload()
  }

  const updateField = (key: keyof UserWithClubs, value: unknown) => {
    setUser((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  const removeClub = (clubId: number) => {
    setUser((prev) =>
      prev
        ? { ...prev, clubs: prev.clubs.filter(({ club }) => club.id !== clubId) }
        : prev
    )
  }

  const handleArrayChange = (
    key: 'favThings' | 'roles',
    index: number,
    value: string
  ) => {
    if (!user) return
    const arr = [...user[key]]
    arr[index] = value
    updateField(key, arr)
  }

  const addArrayItem = (key: 'favThings' | 'roles') => {
    if (!user) return
    updateField(key, [...user[key], ''])
  }

  const removeArrayItem = (key: 'favThings' | 'roles', index: number) => {
    if (!user) return
    const arr = [...user[key]]
    arr.splice(index, 1)
    updateField(key, arr)
  }

  if (!user) {
    return (<>
      <PageHeader breadcrumbs={[
        { href: '#', label: 'Edit profile' },
      ]}/>
      <p className="p-6">Loading...</p>
    </>)
  }

  return <>
    <PageHeader breadcrumbs={[
      { href: '#', label: 'Edit profile' },
    ]}/>

    <Card className="mx-5 md:mx-auto md:w-auto lg:min-w-2xl mt-0 mb-12 px-6 py-4 space-y-6">
      <CardContent className="space-y-4 pt-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={ user.img ?? undefined } alt={`${user.name}'s Profile`} />
            <AvatarFallback>{ user.name[0] }</AvatarFallback>
          </Avatar>

          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Major</label>
            <Input
              value={user.major}
              onChange={(e) => updateField('major', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Minor</label>
            <Input
              value={user.minor || ''}
              onChange={(e) => updateField('minor', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Birthday</label>
            <Input
              value={user.birthday}
              onChange={(e) => updateField('birthday', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Locale</label>
            <Input
              value={user.locale}
              onChange={(e) => updateField('locale', e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Tradition</label>
            <Input
              value={user.tradition}
              onChange={(e) => updateField('tradition', e.target.value)}
            />
          </div>
        </div>

        <Separator />

        <div>
          <label>Quote</label>
          <Textarea
            value={user.quote}
            onChange={(e) => updateField('quote', e.target.value)}
          />
        </div>

        <Separator />

        <div>
          <label>Favorite Things</label>
          {user.favThings.map((item, i) => (
            <div key={i} className="flex items-center gap-2 my-1">
              <Input
                value={item}
                onChange={(e) =>
                  handleArrayChange('favThings', i, e.target.value)
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeArrayItem('favThings', i)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => addArrayItem('favThings')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        <div>
          <label>Roles</label>
          {user.roles.map((role, i) => (
            <div key={i} className="flex items-center gap-2 my-1">
              <Input
                value={role}
                onChange={(e) =>
                  handleArrayChange('roles', i, e.target.value)
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeArrayItem('roles', i)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => addArrayItem('roles')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        <Separator />

        <div>
          <label>Clubs</label>
          <p className="text-sm text-muted-foreground mb-2">Be sure to save changes after leaving a club</p>
          <div className="space-y-2">
            {user.clubs.map(({ club }) => (
              <div
                key={club.id}
                className="flex items-center justify-between p-2 border rounded"
              >
                <span>{club.name}</span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeClub(club.id)}
                >
                  Leave
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleUpdate} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  </>
}