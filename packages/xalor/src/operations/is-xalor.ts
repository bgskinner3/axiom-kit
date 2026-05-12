import { XalethorService } from '../xalor-service';
import type {
  ISolidRegistry,
  TStrictSolidMetaData,
  TSolidBranded,
  TReturnTypeIsXalor,
  TIsXalorArgs,
} from '../models/types';
import { isMetaData, markAsSolid } from '../utils';

/** I. REGISTRATION (Generic call for the Miner) */
export function isXalor<
  _K extends keyof ISolidRegistry | (string & {}),
  _T,
>(): void;
/** II. RESOLUTION (Metadata lookup) */
export function isXalor<K extends keyof ISolidRegistry>(params: {
  mode: 'meta';
  injectedKey: K;
}): TStrictSolidMetaData;
/** III. VALIDATION (The Boolean Guard) */
export function isXalor<K extends keyof ISolidRegistry>(params: {
  mode: 'guard';
  injectedKey: K;
  data: unknown;
}): params is { mode: 'guard'; injectedKey: K; data: ISolidRegistry[K] };
/** IV. ASSERTION (The Auditor Enforcer) */
export function isXalor<K extends keyof ISolidRegistry>(params: {
  mode: 'assert';
  injectedKey: K;
  data: unknown;
}): asserts params is {
  mode: 'assert';
  injectedKey: K;
  data: ISolidRegistry[K];
};
/** V. PARSE (The Boolean Guard) */
export function isXalor<K extends keyof ISolidRegistry>(params: {
  mode: 'parse';
  injectedKey: K;
  data: unknown;
}): TSolidBranded<K, ISolidRegistry[K]>;
export function isXalor<K extends keyof ISolidRegistry>(params: {
  mode: 'parseAsync';
  injectedKey: K;
  data: unknown;
}): Promise<TSolidBranded<K, ISolidRegistry[K]>>;
export function isXalor<K extends keyof ISolidRegistry>(
  params: TIsXalorArgs<K> = {},
): TReturnTypeIsXalor<K> {
  const { mode, injectedKey, data } = params;

  if (!mode && isMetaData(params)) return XalethorService.solidify(params);

  if (mode === 'meta') return XalethorService.inspectMetaData(injectedKey);
  if (mode === 'guard') return XalethorService.validateShape(data, injectedKey);
  if (mode === 'assert') {
    if (!XalethorService.validateShape(data, injectedKey)) {
      XalethorService.panic(injectedKey);
    }
    return;
  }
  if (mode === 'parse') {
    if (XalethorService.validateShape(data, injectedKey)) {
      if (markAsSolid<K, ISolidRegistry[K]>(data)) return data;
    }
    XalethorService.panic(injectedKey);
  }
  if (mode === 'parseAsync') {
    return Promise.resolve(data).then((val) => {
      if (XalethorService.validateShape(val, injectedKey)) {
        if (markAsSolid<K, ISolidRegistry[K]>(val)) return val;
      }
      return XalethorService.panic(injectedKey);
    });
  }
}
// /* prettier-ignore */
