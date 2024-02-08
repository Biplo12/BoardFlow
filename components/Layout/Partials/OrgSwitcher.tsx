import { OrganizationSwitcher } from '@clerk/nextjs';
import React from 'react';

const OrgSwitcher: React.FC = (): JSX.Element => {
  return (
    <OrganizationSwitcher
      hidePersonal
      appearance={{
        elements: {
          rootBox: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          },
          organizationSwitcherTrigger: {
            padding: '6px',
            width: '100%',
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            justifyContent: 'space-between',
            backgroundColor: 'white',
          },
        },
      }}
    />
  );
};
export default OrgSwitcher;
