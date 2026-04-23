/**
 * @jest-environment jsdom
 */
import React from 'react';
import {
  isForwardRef,
  hasNameMetadata,
  isComponentType,
  hasReactSymbol,
} from '../../src/guards';

describe('React Component Guards', () => {
  describe('isForwardRef', () => {
    it('identifies components wrapped in React.forwardRef', () => {
      const Forwarded = React.forwardRef((_props, _ref) => null);
      expect(isForwardRef(Forwarded)).toBe(true);
      expect(isForwardRef(() => null)).toBe(false);
    });
  });
  describe('hasNameMetadata', () => {
    it('identifies components via various keys', () => {
      const CompA = () => null;
      CompA.displayName = 'A';

      function CompB() {
        return null;
      }

      expect(hasNameMetadata(CompA)).toBe(true);
      expect(hasNameMetadata(CompB)).toBe(true);
      expect(hasNameMetadata(() => null)).toBe(true); // Functions have 'name' by default
    });
  });
  describe('isComponentType', () => {
    it('identifies functional components (hits isFunction branch)', () => {
      const FnComp = () => null;
      // This returns true at the very first check
      expect(isComponentType(FnComp)).toBe(true);
    });

    it('returns false for non-component objects (hits the false branches)', () => {
      // Hits: isFunction(false) -> has 'prototype'(true) -> isObject(prototype)(true)
      // -> has 'render'(false) 🛑
      const plainObj = { prototype: {} };
      expect(isComponentType(plainObj)).toBe(false);

      // Hits: isFunction(false) -> has 'prototype'(false) 🛑
      expect(isComponentType({ arbitrary: 'data' })).toBe(false);
    });

    it('returns false for null or primitives', () => {
      expect(isComponentType(null)).toBe(false);
      expect(isComponentType(123)).toBe(false);
    });
    it('hits the final isFunction check for class-like objects', () => {
      // 1. isFunction(fakeClass) is FALSE (it's a plain object)
      // 2. has prototype is TRUE
      // 3. isObject(prototype) is TRUE
      // 4. has render is TRUE
      // 5. isFunction(render) is TRUE ✅ <--- This is the one you are missing
      const fakeClass = {
        prototype: {
          render: () => null,
        },
      };

      expect(isComponentType(fakeClass)).toBe(true);
    });

    it('hits the false branch of the final isFunction check', () => {
      // Hits everything up to the end, but render is NOT a function
      const brokenClass = {
        prototype: {
          render: 'not-a-function',
        },
      };

      expect(isComponentType(brokenClass)).toBe(false);
    });
  });
  describe('hasReactSymbol', () => {
    it('detects specific react symbols', () => {
      const memoComp = React.memo(() => null);
      const MEMO_TYPE = Symbol.for('react.memo');
      expect(hasReactSymbol(memoComp, MEMO_TYPE)).toBe(true);
    });
  });
});
