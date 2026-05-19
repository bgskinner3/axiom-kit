import type { TShapeTransformMapperMapper } from '../models/types';
import { isObject, isNull, isArray } from '../../shared';
import { XalethorVaultKeeper } from '../xalor-service/vault-keeper';
import { validateShape, createInitialContext } from '../validation';

/**
 * TRANSFORMER_OMIT_PICK_MAPPER
 *
 * ROLE:
 * A specialized polymorphic lookup matrix tied explicitly to the 'pick' and 'omit'
 * data evaluation strategies. It traverses complex type graphs step-by-step to selectively
 * extract or prune property layers based on structural contract boundaries.
 *
 *
 * @see transformXalor
 */
export const TRANSFORMER_OMIT_PICK_MAPPER: TShapeTransformMapperMapper = {
  primitive: (_shape, data) => data,

  // Literals only pass through if they align exactly with the schema's required value
  literal: (shape, data) => (data === shape.value ? data : null),

  // Objects iterate authoritatively over blueprint fields, running key validation checks on the fly
  object: (shape, data, filterSet, depth, recurse) => {
    if (!isObject(data) || isNull(data) || isArray(data)) return null;

    // Safely preserve class prototypes if cloning class model instances
    const proto = Object.getPrototypeOf(data);
    const cleanObj = Object.create(proto);

    const blueprintProps = shape.properties;

    // Walk through your authoritative master blueprint properties fields
    for (const key of Object.keys(blueprintProps)) {
      const propertyContainer = blueprintProps[key];

      if (
        propertyContainer &&
        propertyContainer.shape &&
        Object.prototype.hasOwnProperty.call(data, key)
      ) {
        const sourceValue = (data as Record<string, unknown>)[key];

        // Recurse down into the child shape parameters slot cleanly
        cleanObj[key] = recurse(
          sourceValue,
          propertyContainer.shape,
          filterSet,
          depth + 1,
        );
      }
    }
    return cleanObj;
  },

  // Arrays step through collection elements recursively to clean sub-object indices
  array: (shape, data, filterSet, depth, recurse) => {
    if (!isArray(data)) return [];

    const copy: unknown[] = [];
    for (let i = 0; i < data.length; i++) {
      copy[i] = recurse(data[i], shape.items, filterSet, depth + 1);
    }
    return copy;
  },

  // Unions look up which sub-branch variant validly satisfies the runtime data layout structure
  union: (shape, data, filterSet, depth, recurse) => {
    const matchingBranch = shape.values.find((branch) =>
      validateShape(data, branch, createInitialContext()),
    );
    return matchingBranch
      ? recurse(data, matchingBranch, filterSet, depth)
      : null;
  },

  // Intersections aggregate and merge part properties recursively
  intersection: (shape, data, filterSet, depth, recurse) => {
    let merged = {};
    for (const part of shape.parts) {
      const transformedPart = recurse(data, part, filterSet, depth);
      if (
        transformedPart &&
        isObject(transformedPart) &&
        !isArray(transformedPart)
      ) {
        merged = { ...merged, ...transformedPart };
      }
    }
    return merged;
  },

  // Ambient Database Bridge: Pull the blueprint by its lookup key and jump inside it
  reference: (shape, data, filterSet, depth, recurse) => {
    const subShape = XalethorVaultKeeper.peek('blueprint', shape.name);
    return subShape ? recurse(data, subShape, filterSet, depth + 1) : data;
  },

  // Brand wrappers pass execution straight through to their internal underlying base schemas
  branded: (shape, data, filterSet, depth, recurse) => {
    return recurse(data, shape.base, filterSet, depth);
  },
} satisfies TShapeTransformMapperMapper;

// // src/registry/transform-workers.ts

// import type { TSolidShape } from '../../shared';
// import { isObject, isNull, isArray } from '../../shared';
// import { XalethorVaultKeeper } from './vault-keeper'; // Assuming this peeks references

// type TFilterPredicate = (key: string, set: Set<string>) => boolean;

// /**
//  * 🌀 COMPREHENSIVE STRUCTURAL TRANSFORM WORKER FACTORY
//  *
//  * ROLE:
//  * Generates an engine capable of deep-cloning data structures while running
//  * transformation filters against every possible polymorphic shape node.
//  */
// function createTransformSanitizer(predicate: TFilterPredicate) {
//   return function sanitize(
//     data: unknown,
//     shape: TSolidShape,
//     filterSet: Set<string>,
//     seen = new Map<unknown, unknown>(),
//     depth = 0
//   ): unknown {
//     // ⚖️ THE DEPTH LAW (Security boundary checkpoint)
//     if (depth > 25) return null;

//     // Fast primitive pass-through gate
//     if (data === null || typeof data !== 'object') {
//       return data;
//     }

//     // 🔄 RECURSION PROTECTION: Intercept circular links instantly
//     const cached = seen.get(data);
//     if (cached !== undefined) {
//       return cached;
//     }

//     if (!shape) return data;

//     // Type signature for our recursive execution handlers mapping list
//     type TSanitizeRunner = (targetShape: any) => unknown;

//     // ========================================================================
//     // 🗺️ POLYMORPHIC SHAPE VALIDATOR SWITCHBOARD (NO switch statements)
//     // ========================================================================
//     const TRANSFORM_MAPPER: Record<TSolidShape['kind'], TSanitizeRunner> = {
//       // Primitives are immutable terminal leaves
//       primitive: () => data,

//       // Literals only pass through if they exactly align with constraints
//       literal: (s) => (data === s.value ? data : null),

//       // Objects walk through fields selectively via the curried predicate strategy!
//       object: (s) => {
//         const proto = Object.getPrototypeOf(data);
//         const cleanObj = Object.create(proto);
//         seen.set(data, cleanObj);

//         const blueprintProps = s.properties;

//         for (const key of Object.keys(blueprintProps)) {
//           const propertyContainer = blueprintProps[key];

//           if (propertyContainer && propertyContainer.shape && Object.prototype.hasOwnProperty.call(data, key)) {
//             // 🚀 THE STRATEGY GATE: Run the filter predicate (pick vs omit) on the key
//             if (predicate(key, filterSet)) {
//               const sourceValue = (data as Record<string, unknown>)[key];

//               // Recurse into the nested child shape contract slot safely
//               cleanObj[key] = sanitize(sourceValue, propertyContainer.shape, filterSet, seen, depth + 1);
//             }
//           }
//         }
//         return cleanObj;
//       },

//       // Arrays loop and transform collection elements recursively
//       array: (s) => {
//         if (!isArray(data)) return [];
//         const copy: unknown[] = [];
//         seen.set(data, copy);

//         for (let i = 0; i < data.length; i++) {
//           copy[i] = sanitize(data[i], s.items, filterSet, seen, depth + 1);
//         }
//         return copy;
//       },

//       // Unions hunt case-insensitively for the matching structural branch payload
//       union: (s) => {
//         // Find the first variant branch that successfully matches the runtime data data layout
//         // to determine which path rules apply to this transformation pass
//         const matchingBranch = s.values.find((branch: TSolidShape) =>
//           XalethorService.validateShapeDirect(data, branch)
//         );
//         return matchingBranch ? sanitize(data, matchingBranch, filterSet, seen, depth) : null;
//       },

//       // Intersections aggregate and merge part transformations cleanly
//       intersection: (s) => {
//         let merged = {};
//         for (const part of s.parts) {
//           const transformedPart = sanitize(data, part, filterSet, seen, depth);
//           if (transformedPart && typeof transformedPart === 'object') {
//             merged = { ...merged, ...transformedPart };
//           }
//         }
//         return merged;
//       },

//       // Ambient Database Jumps: Resolve the ghost blueprint and jump inside it
//       reference: (s) => {
//         const subShape = XalethorVaultKeeper.peek('blueprint', s.name);
//         return subShape ? sanitize(data, subShape, filterSet, seen, depth + 1) : data;
//       },

//       // Branded Type nominal boundaries pass straight through to their base definitions
//       branded: (s) => sanitize(data, s.base, filterSet, seen, depth),
//     };

//     // 🎯 GENERIC METHOD DISPATCHER
//     const executeMapper = <K extends TSolidShape['kind']>(
//       kind: K,
//       targetShape: Extract<TSolidShape, { kind: K }>
//     ): unknown => {
//       const runner = TRANSFORM_MAPPER[kind];
//       return runner(targetShape);
//     };

//     return executeMapper(shape.kind, shape);
//   };
// }

// /** 📥 EXPORT THE STRATEGY WRAPPERS */
// export const executePickSanitizer = createTransformSanitizer((key, set) => set.has(key));
// export const executeOmitSanitizer = createTransformSanitizer((key, set) => !set.has(key));
