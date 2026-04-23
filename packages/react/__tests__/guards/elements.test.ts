/**
 * @jest-environment jsdom
 */
import React from 'react';
import { createPortal } from 'react-dom';
import {
  isReactPortal,
  isFragment,
  isReactElement,
  isValidReactNode,
} from '../../src/guards';

describe('React Element Guards', () => {
  describe('isReactPortal', () => {
    it('identifies portals created via react-dom', () => {
      const div = document.createElement('div');
      const portal = createPortal(React.createElement('span'), div);
      expect(isReactPortal(portal)).toBe(true);
    });
  });
  describe('isFragment', () => {
    it('returns true only for React.Fragment', () => {
      expect(isFragment(React.createElement(React.Fragment))).toBe(true);
      expect(isFragment(React.createElement('div'))).toBe(false);
    });
  });
  describe('isReactElement', () => {
    it('isReactElement identifies JSX correctly', () => {
      const element = React.createElement('div');
      const plainObject = { type: 'div', props: {} };

      expect(isReactElement(element)).toBe(true);
      expect(isReactElement(plainObject)).toBe(false); // Fails because it lacks the Symbol
    });
  });
  describe('isValidReactNode', () => {
    it('returns true for primitives (strings, numbers, null)', () => {
      expect(isValidReactNode('hello')).toBe(true);
      expect(isValidReactNode(42)).toBe(true);
      expect(isValidReactNode(null)).toBe(true);
      expect(isValidReactNode(undefined)).toBe(true);
    });

    it('returns true for JSX elements', () => {
      expect(isValidReactNode(React.createElement('div'))).toBe(true);
    });

    it('returns true for arrays of valid nodes', () => {
      expect(isValidReactNode(['a', 1, React.createElement('span')])).toBe(
        true,
      );
    });

    it('returns true for Portals', () => {
      const container = document.createElement('div');
      const portal = createPortal(
        React.createElement('div'),
        container,
      );
      expect(isValidReactNode(portal)).toBe(true);
    });
  });
});
