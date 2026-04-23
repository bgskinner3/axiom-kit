const __brand: unique symbol = Symbol('brand');

type TBranded<T, B> = T & { [__brand]: B };
/**
 * Represents a serialized Node.js Buffer-like structure.
 */
type _TBufferLike = {
  readonly type: 'Buffer';
  readonly data: number[];
};
/**
 * Minimal signature for stream-like objects (e.g., Node.js Readable/Writable).
 */
type _TStreamSignature = {
  /* prettier-ignore */ pipe: (dest: _TStreamSignature, options?: Record<string, unknown>) => _TStreamSignature;
  /* prettier-ignore */ on: (event: string, listener: (...args: unknown[]) => void) => _TStreamSignature;
};

/**
 * A branded object representing a Buffer-like data structure.
 */
export type TBufferLikeObject = TBranded<_TBufferLike, 'BufferLikeObject'>;

/**
 * A branded type representing a Stream object.
 */
export type TStream = TBranded<_TStreamSignature, 'Stream'>;

/**
 * A branded URL object verified to be an absolute URL.
 */
export type TAbsoluteURL = TBranded<URL, 'TAbsoluteURL'>;

/**
 * A branded string representing a validated internal application path.
 */
export type TInternalUrl = TBranded<string, 'TInternalUrl'>;

/**
 * A branded string representing a validated Hexadecimal Byte String.
 */
export type THexByteString = TBranded<string, 'THexByteString'>;
