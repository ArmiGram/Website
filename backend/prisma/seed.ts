import { PrismaClient, MediaType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const alice = await prisma.user.upsert({
    where: { username: 'alice' },
    update: {},
    create: {
      username: 'alice',
      email: 'alice@example.com',
      passwordHash,
      displayName: 'Alice',
      bio: 'Photographer & traveler 📷',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
    },
  });

  const bob = await prisma.user.upsert({
    where: { username: 'bob' },
    update: {},
    create: {
      username: 'bob',
      email: 'bob@example.com',
      passwordHash,
      displayName: 'Bob',
      bio: 'Video creator 🎬',
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
    },
  });

  await prisma.post.deleteMany({
    where: { authorId: { in: [alice.id, bob.id] } },
  });

  await prisma.post.createMany({
    data: [
      {
        authorId: alice.id,
        caption: 'Sunset by the sea 🌅',
        mediaUrl: 'https://picsum.photos/seed/sunset/600/800',
        mediaType: MediaType.IMAGE,
      },
      {
        authorId: alice.id,
        caption: 'Morning coffee ☕',
        mediaUrl: 'https://picsum.photos/seed/coffee/600/800',
        mediaType: MediaType.IMAGE,
      },
      {
        authorId: bob.id,
        caption: 'Big Buck Bunny clip 🐰',
        mediaUrl:
          'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
        mediaType: MediaType.VIDEO,
      },
      {
        authorId: bob.id,
        caption: 'City lights 🌃',
        mediaUrl: 'https://picsum.photos/seed/city/600/800',
        mediaType: MediaType.IMAGE,
      },
    ],
  });

  await prisma.follow.upsert({
    where: {
      followerId_followingId: { followerId: alice.id, followingId: bob.id },
    },
    update: {},
    create: { followerId: alice.id, followingId: bob.id },
  });

  // eslint-disable-next-line no-console
  console.log('Seed complete. Login with alice/bob and password "password123"');
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
