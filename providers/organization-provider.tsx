'use client';

import { useQuery } from 'convex/react';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
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

interface OrganizationProviderProps {
  children: React.ReactNode;
}

export const OrganizationProvider = ({
  children,
}: OrganizationProviderProps) => {
  const organizations = useQuery(api.organizations.list);
  const [activeOrgId, setActiveOrgIdState] =
    useState<Id<'organizations'> | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setActiveOrgIdState(stored as Id<'organizations'>);
    }
  }, []);

  useEffect(() => {
    if (!organizations) return;

    const exists =
      activeOrgId && organizations.some((org) => org._id === activeOrgId);

    if (!exists) {
      setActiveOrgIdState(organizations[0]?._id ?? null);
    }
  }, [organizations, activeOrgId]);

  const setActiveOrgId = (id: Id<'organizations'>) => {
    setActiveOrgIdState(id);
    window.localStorage.setItem(STORAGE_KEY, id);
  };

  const value = useMemo<OrganizationContextValue>(() => {
    const list = organizations ?? [];

    return {
      organizations: list,
      organization: list.find((org) => org._id === activeOrgId) ?? null,
      activeOrgId,
      setActiveOrgId,
      isLoaded: organizations !== undefined,
    };
  }, [organizations, activeOrgId]);

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
