import { Prisma } from "@prisma/client";

// Typescript doesn't expect the 'author' field, so we have to work around this
// with a prisma generator type that includes posts

const postWithAuthor = Prisma.validator<Prisma.PostDefaultArgs>()({
  include: { author: { select: { id: true, name: true, img: true } } },
});

export type PostWithAuthor = Prisma.PostGetPayload<typeof postWithAuthor>
