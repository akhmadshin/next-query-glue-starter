import React, { PropsWithChildren } from 'react';

export type ParentComponent<T = unknown> = React.FC<PropsWithChildren<T>>
export type Component<T = unknown> = React.FC<T>