import { Id } from '@/convex/_generated/dataModel';

export default interface Board {
  _id: Id<'boards'>;
  _creationTime: number;
  orgId: string;
  title: string;
  authorId: string;
  authorName: string;
  imageUrl: string;
  isFavorite: boolean;
}
