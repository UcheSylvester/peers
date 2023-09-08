import { ReactNode } from 'react';

export interface ConditionWrapperProps {
  condition: boolean;
  wrapper: (children: ReactNode) => JSX.Element;
  children: JSX.Element;
}

export const ConditionWrapper = ({
  condition,
  wrapper,
  children,
}: ConditionWrapperProps) => (condition ? wrapper(children) : children);
