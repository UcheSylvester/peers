import { forwardRef } from 'react';
import * as React from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { Anchor, AnchorProps } from '@mantine/core';
import { isExternalLink } from '@/helpers/is-external-link';
import { ConditionWrapper } from '../misc';

export interface LinkProps
  extends AnchorProps,
    Partial<NextLinkProps> {}

export const Link = forwardRef<
  HTMLAnchorElement,
  LinkProps & { component?: unknown }
>(({ children, href = '', ...otherProps }: LinkProps) => {
  const isExternal = isExternalLink(href as string);

  if (isExternal) {
    return (
      <Anchor target="_blank" href={href as string} {...otherProps}>
        {children}
      </Anchor>
    );
  }

  return (
    <ConditionWrapper
      condition={!!href}
      wrapper={(children) => (
        <NextLink href={href} passHref={true} legacyBehavior={true}>
          {children}
        </NextLink>
      )}
    >
      <Anchor href={href as string} {...otherProps}>
        {children}
      </Anchor>
    </ConditionWrapper>
  );
});

Link.displayName = 'Link';
