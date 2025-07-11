import { PrismaClient, Role } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

interface ImportedProfile {
  name: string
  year: string
  dev: boolean
  des: boolean
  pm: boolean
  core: boolean
  mentor: boolean
  major: string
  minor: string | null
  birthday: string
  home: string
  quote: string
  'favorite thing 1': string
  'favorite thing 2': string
  'favorite thing 3': string
  'favorite dartmouth tradition': string | null
  'fun fact': string | null
  picture: string | null
}

async function main() {
  const jsonPath = path.join(__dirname, 'profiles.seed.json')
  const imported: ImportedProfile[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))

  const users = imported.map((person) => {
    const role: Role[] = []
    if (person.dev) role.push('DEV')
    if (person.des) role.push('DES')
    if (person.pm) role.push('PM')
    if (person.core) role.push('CORE')
    if (person.mentor) role.push('MENTOR')

    return {
      name: person.name,
      year: isNaN(Number(person.year)) ? null : Number(person.year),
      role,
      major: person.major,
      minor: person.minor?.trim() || null,
      birthday: person.birthday,
      locale: person.home,
      quote: person.quote,
      favThings: [
        person['favorite thing 1'],
        person['favorite thing 2'],
        person['favorite thing 3'],
      ],
      funFact: person['fun fact'] ?? '',
      tradition: person['favorite dartmouth tradition'] ?? '',
      img: person.picture ?? null,
    }
  })

  await prisma.user.createMany({ data: users })
  console.log(`✅ Seeded ${users.length} users.`)
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
