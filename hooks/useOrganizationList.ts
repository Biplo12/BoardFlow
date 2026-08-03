import { Id } from '@/convex/_generated/dataModel';
import { useOrganizationContext } from '@/providers/organization-provider';

export const useOrganizationList = () => {
  const { organizations, setActiveOrgId, isLoaded } = useOrganizationContext();

  return {
    organizations,
    isLoaded,
    setActive: (id: Id<'organizations'>) => setActiveOrgId(id),
  };
};
