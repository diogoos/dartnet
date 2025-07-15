'use client';

import { User } from '@prisma/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from "@/components/ui/button";

export default function ProfileView({ user }: { user: User }) {
  return (
    <Card className="max-w-md mx-auto mt-8 border-2 shadow-lg rounded-md">
      <CardHeader className="flex flex-col items-start space-y-0.5">

        <Avatar className="w-28 h-28">
          {user.img != null && (
            <AvatarImage src={user.img} alt={`${user.name}'s avatar`} />
          )}
          <AvatarFallback delayMs={600}>{user.name[0]}</AvatarFallback>
        </Avatar>

        <CardTitle className="text-2xl font-semibold">{user.name}</CardTitle>
        <CardDescription className="text-lg text-muted-foreground">{user.quote}</CardDescription>

        { user.roles.length > 0 &&
            <div className="flex flex-row gap-2">
              { user.roles.map(role  => <Button key={role} className="bg-teal-800">{role}</Button>) }
            </div>
        }
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">Academic Info</h3>
          <p>
            Major: <span className="font-medium">{user.major}</span>
          </p>
          <p>
            Minor: <span className="font-medium">{user.minor ?? 'N/A'}</span>
          </p>
          <p>
            Year: <span className="font-medium">{user.year ?? 'N/A'}</span>
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Personal Details</h3>
          <p>
            Birthday: <span className="font-medium">{user.birthday}</span>
          </p>
          <p>
            Locale: <span className="font-medium">{user.locale}</span>
          </p>
          <p>
            Fun Fact: <span className="font-medium">{user.funFact}</span>
          </p>
          <p>
            Tradition: <span className="font-medium">{user.tradition}</span>
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Favorite Things</h3>
          <ul className="list-disc list-inside">
            {user.favThings.length > 0 ? (
              user.favThings.map((thing, i) => <li key={i}>{thing}</li>)
            ) : (
              'N/A'
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
