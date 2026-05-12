import type { TSolidMetadata, TStrictSolidMetaData } from '../../models/types';

interface IAdditionalFields {
  filePath: string;
  typeName: string;
  symbolName: string;
}

const rectifierRegistry: {
  [K in keyof IAdditionalFields]: (
    input: TSolidMetadata,
  ) => IAdditionalFields[K];
} = {
  filePath: (input) => {
    if (input.filePath) return input.filePath;
    // Extract path from the GPS 'area' string
    return input.area.split(':')[0] ?? 'unknown_path';
  },

  typeName: (input) => {
    if (input.typeName) return input.typeName;
    // Fallback to symbol or a generic placeholder
    return input.symbolName || `T${input.key}`;
  },

  symbolName: (input) => {
    return input.symbolName ?? 'unknown';
  },
};

export const preRegisterMetadata = (
  input: TSolidMetadata,
): TStrictSolidMetaData => {
  return {
    // Standard Metadata
    key: input.key,
    area: input.area,
    version: input.version,
    shape: input.shape,

    // Rectified Metadata
    filePath: rectifierRegistry.filePath(input),
    typeName: rectifierRegistry.typeName(input),
    symbolName: rectifierRegistry.symbolName(input),
  };
};
