import type {
  TXalorMinerRouterMap,
  TRegisterRawPayload,
  TGenerateRawPayload,
} from '../../types';
import { isKeyOfArray, GENERATOR_MODE_TRIGGERS } from '../../../shared';
// import type { TGenerateXalorModes, TValidateXalorModes } from '../../../shared';
import type { TGenerateXalorModes } from '../../../shared';

export const XALOR_MINING_ROUTER_MAPPER: TXalorMinerRouterMap = {
  registerXalor: (node, checker): TRegisterRawPayload => {
    const typeArgs = node.typeArguments;
    const args = node.arguments;

    // --- PATH A: Declarative Interface Registration -> <'KEY', Type>() ---
    if (typeArgs && typeArgs.length >= 2) {
      const keyType = checker.getTypeFromTypeNode(typeArgs[0]);
      const shapeType = checker.getTypeFromTypeNode(typeArgs[1]);

      if (!keyType.isStringLiteral()) return null;
      return {
        keyName: keyType.value,
        keyType,
        shapeType,
        apiName: 'registerXalor',
      };
    }

    // --- PATH B: Live Variable Inference -> <'KEY'>(runtimeDataObject) ---
    if (typeArgs && typeArgs.length === 1 && args.length >= 1) {
      const keyType = checker.getTypeFromTypeNode(typeArgs[0]);
      const shapeType = checker.getTypeAtLocation(args[0]);

      if (!keyType.isStringLiteral()) return null;
      return {
        keyName: keyType.value,
        keyType,
        shapeType,
        apiName: 'registerXalor',
      };
    }

    return null;
  },
  generateXalor: (node, checker): TGenerateRawPayload => {
    const typeArgs = node.typeArguments ?? [];

    let keyName: string | undefined;
    let mode: TGenerateXalorModes | undefined; // 🛡️ Zero any-cast! Enforce your exact literal type union contract

    if (typeArgs.length >= 2) {
      const keyType = checker.getTypeFromTypeNode(typeArgs[0]);
      const modeType = checker.getTypeFromTypeNode(typeArgs[1]);

      if (keyType.isStringLiteral()) {
        keyName = keyType.value;
      }

      if (
        modeType.isStringLiteral() &&
        isKeyOfArray(GENERATOR_MODE_TRIGGERS)(modeType.value)
      ) {
        mode = modeType.value;
      }
    }

    return { keyName, mode, apiName: 'generateXalor' };
  },
} satisfies TXalorMinerRouterMap;
