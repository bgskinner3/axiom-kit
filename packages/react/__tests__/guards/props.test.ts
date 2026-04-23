/**
 * @jest-environment jsdom
 */
import React from 'react';
import { hasOnClick, createPropGuard, hasChildren } from '../../src/guards';

describe('React Prop Guards', () => {
  describe('hasChildren', () => {
    it('returns true if object has a defined children prop', () => {
      expect(hasChildren({ children: 'hello' })).toBe(true);
      expect(hasChildren({ children: null })).toBe(false); // isDefined(null) is false
      expect(hasChildren({})).toBe(false);
    });
  });
  describe('hasOnClick', () => {
    it('returns true if element has an onClick function prop', () => {
      const element = React.createElement('button', { onClick: () => {} });
      expect(hasOnClick(element)).toBe(true);
    });

    it('returns false if onClick is missing or not a function', () => {
      expect(hasOnClick(React.createElement('button'))).toBe(false);
      expect(
        hasOnClick(React.createElement('button', { onClick: 'not-a-fn' })),
      ).toBe(false);
    });
  });
  describe('createPropGuard', () => {
    it('correctly validates primitives vs objects', () => {
      const isStatus = createPropGuard<any, any>();
      expect(isStatus('active')).toBe(true);
      expect(isStatus({ color: 'red' })).toBe(false); // Now returns false
    });
  });
});
