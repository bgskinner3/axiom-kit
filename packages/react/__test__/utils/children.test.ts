/**
 * @jest-environment jsdom
 */
import React from 'react';
import { filterChildrenByDisplayName } from '../../src/utils';

describe('React Children Utils', () => {
  describe('filterChildrenByDisplayName', () => {
    it('filters children based on their component displayName', () => {
      // 1. Define standard functional components
      const MyComp = () => null;
      MyComp.displayName = 'Target';

      const OtherComp = () => null;
      OtherComp.displayName = 'Ignore';

      // 2. Wrap one in Memo to test the nested logic
      const MemoComp = React.memo(() => null);
      MemoComp.displayName = 'TargetMemo';

      const children = [
        React.createElement(MyComp, { key: '1' }),
        React.createElement(OtherComp, { key: '2' }),
        React.createElement(MemoComp, { key: '3' }),
        'some text',
      ];

      // Test standard
      const filtered = filterChildrenByDisplayName(children, 'Target');
      expect(filtered).toHaveLength(1);

      // Test memoized (if your logic supports TargetMemo)
      const filteredMemo = filterChildrenByDisplayName(children, 'TargetMemo');
      expect(filteredMemo).toHaveLength(1);
    });
  });
});
