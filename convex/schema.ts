import { authTables } from '@convex-dev/auth/server';
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  ...authTables,

  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    clerkId: v.optional(v.string()),
  })
    .index('email', ['email'])
    .index('by_clerk_id', ['clerkId']),

  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    imageUrl: v.optional(v.string()),
    ownerId: v.id('users'),
    clerkId: v.optional(v.string()),
  })
    .index('by_owner', ['ownerId'])
    .index('by_slug', ['slug'])
    .index('by_clerk_id', ['clerkId']),

  memberships: defineTable({
    orgId: v.id('organizations'),
    userId: v.id('users'),
    role: v.union(v.literal('admin'), v.literal('member')),
  })
    .index('by_org', ['orgId'])
    .index('by_user', ['userId'])
    .index('by_user_org', ['userId', 'orgId'])
    .index('by_org_user', ['orgId', 'userId']),

  invitations: defineTable({
    orgId: v.id('organizations'),
    email: v.string(),
    role: v.union(v.literal('admin'), v.literal('member')),
    invitedBy: v.id('users'),
    token: v.string(),
  })
    .index('by_org', ['orgId'])
    .index('by_email', ['email'])
    .index('by_token', ['token']),

  boards: defineTable({
    title: v.string(),
    orgId: v.id('organizations'),
    authorId: v.id('users'),
    authorName: v.string(),
    imageUrl: v.string(),
  })
    .index('by_org', ['orgId'])
    .searchIndex('search_title', {
      searchField: 'title',
      filterFields: ['orgId'],
    }),

  userFavorites: defineTable({
    orgId: v.id('organizations'),
    userId: v.id('users'),
    boardId: v.id('boards'),
  })
    .index('by_user_org', ['userId', 'orgId'])
    .index('by_board', ['boardId'])
    .index('by_user_board', ['userId', 'boardId'])
    .index('by_user_board_org', ['userId', 'boardId', 'orgId']),
});
