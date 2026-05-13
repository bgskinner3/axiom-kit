import { XalethorService } from '../../xalor-service';
import type {
  ISolidRegistry,
  TTypeGuard,
  TAssert,
  TReturnValidationTools,
} from '../../models/types';
import { makeAssert } from '../common';

export function buildValidationTools<
  K extends Extract<keyof ISolidRegistry, string>,
>(key: K): TReturnValidationTools<K> {
  const guard: TTypeGuard<ISolidRegistry[K]> = (
    val: unknown,
  ): val is ISolidRegistry[K] => XalethorService.validateShape(val, key);

  const assert: TAssert<ISolidRegistry[K]> = makeAssert(guard, key);

  return { guard, assert };
}
