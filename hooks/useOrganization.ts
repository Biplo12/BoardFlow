import { useOrganizationContext } from '@/providers/organization-provider';

export const useOrganization = () => {
  const { organization, isLoaded } = useOrganizationContext();

  return { organization, isLoaded };
};
