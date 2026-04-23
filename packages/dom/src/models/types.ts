const __brand: unique symbol = Symbol('brand');

type TBranded<T, B> = T & { [__brand]: B };


export type TAbsoluteURL = TBranded<URL, 'TAbsoluteURL'>;
export type TInternalUrl = TBranded<string, 'TInternalUrl'>;

export type TTypeGuard<T> = (value: unknown) => value is T;