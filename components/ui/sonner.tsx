'use client';

import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

/* The app is light only, so the toaster is pinned rather than following the
   operating system, which used to render every toast in the dark palette. */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme='light'
      position='bottom-center'
      className='toaster group'
      toastOptions={{
        unstyled: false,
        classNames: {
          toast: 'candy-toast',
          title: 'candy-toast-title',
          description: 'candy-toast-description',
          actionButton: 'candy-toast-action',
          cancelButton: 'candy-toast-cancel',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
