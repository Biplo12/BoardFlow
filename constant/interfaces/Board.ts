import { Id } from '@/convex/_generated/dataModel';

export default interface Board {
  _id: Id<'boards'>;
  _creationTime: number;
  orgId: Id<'organizations'>;
  title: string;
  authorId: Id<'users'>;
  authorName: string;
  imageUrl: string;
  isFavorite: boolean;
}
