const __brand: unique symbol = Symbol('brand');

type TBranded<T, B> = T & { [__brand]: B };

type _TBufferLike = {
  readonly type: 'Buffer';
  readonly data: number[];
};
type _TStreamSignature = {
  /* prettier-ignore */ pipe: (dest: _TStreamSignature, options?: Record<string, unknown>) => _TStreamSignature;
  /* prettier-ignore */ on: (event: string, listener: (...args: unknown[]) => void) => _TStreamSignature;
};

export type TBufferLikeObject = TBranded<_TBufferLike, 'BufferLikeObject'>;

export type TStream = TBranded<_TStreamSignature, 'Stream'>;

export type TTypeGuard<T> = (value: unknown) => value is T;

export type TAssert<T> = (value: unknown) => asserts value is T;

export type TAnyFunction = (...args: unknown[]) => unknown;

export type TAnyObject = Record<PropertyKey, unknown>;