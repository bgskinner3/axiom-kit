// transformer/reifiers/registry/intersections.ts
import { registerReifier } from './core';
import { isIntersectionType } from '../../../models/guards/transformer';

registerReifier((type, _checker, next) => {
  if (!isIntersectionType(type)) return undefined;

  return {
    kind: 'intersection',
    parts: type.types.map((t) => next(t)),
  };
});
