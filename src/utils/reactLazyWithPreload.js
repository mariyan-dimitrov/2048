import { lazy } from 'react';

const reactLazyWithPreload = importStatement => {
  const Component = lazy(importStatement);

  Component.preload = importStatement;

  return Component;
};

export default reactLazyWithPreload;
