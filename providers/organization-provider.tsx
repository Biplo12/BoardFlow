'use client';

import { useQuery } from 'convex/react';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from 'react';

import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';

type OrganizationDoc = Doc<'organizations'>;

interface OrganizationContextValue {
  organizations: OrganizationDoc[];
  organization: OrganizationDoc | null;
  activeOrgId: Id<'organizations'> | null;
  setActiveOrgId: (id: Id<'organizations'>) => void;
  isLoaded: boolean;
}

const OrganizationContext = createContext<OrganizationContextValue | null>(null);

const STORAGE_KEY = 'boardflow:active-org';

/* The choice lives in localStorage, which React cannot see, so it is read as
   an external store instead of being copied into state by an effect. The
   `storage` event only fires in other tabs, so writes notify this one. */
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  window.addEventListener('storage', listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
};

const getStored = () => window.localStorage.getItem(STORAGE_KEY);

const getStoredOnServer = () => null;

const store = (id: string) => {
  window.localStorage.setItem(STORAGE_KEY, id);
  listeners.forEach((listener) => listener());
};

interface OrganizationProviderProps {
  children: React.ReactNode;
}

export const OrganizationProvider = ({
  children,
}: OrganizationProviderProps) => {
  const organizations = useQuery(api.organizations.list);

  const storedOrgId = useSyncExternalStore(
    subscribe,
    getStored,
    getStoredOnServer
  );

  const setActiveOrgId = useCallback((id: Id<'organizations'>) => store(id), []);

  const value = useMemo<OrganizationContextValue>(() => {
    const list = organizations ?? [];

    /* Derived rather than stored: an organization that was deleted, or that
       this account was removed from, falls back to the first one on its own. */
    const organization =
      list.find((org) => org._id === storedOrgId) ?? list[0] ?? null;

    return {
      organizations: list,
      organization,
      activeOrgId: organization?._id ?? null,
      setActiveOrgId,
      isLoaded: organizations !== undefined,
    };
  }, [organizations, storedOrgId, setActiveOrgId]);

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganizationContext = () => {
  const context = useContext(OrganizationContext);

  if (!context) {
    throw new Error(
      'useOrganizationContext must be used within an OrganizationProvider'
    );
  }

  return context;
};
