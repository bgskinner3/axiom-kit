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

export type TAbsoluteURL = TBranded<URL, 'TAbsoluteURL'>;

export type TInternalUrl = TBranded<string, 'TInternalUrl'>;
