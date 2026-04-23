import { mergeEventHandlerClicks } from '../../src/utils';

describe('React Event Utils', () => {
  describe('mergeEventHandlerClicks', () => {
    it('runs internal handler if user does not prevent default', () => {
      const user = jest.fn();
      const internal = jest.fn();
      const event = { defaultPrevented: false } as any;

      const handler = mergeEventHandlerClicks(user, internal);
      handler(event);

      expect(user).toHaveBeenCalled();
      expect(internal).toHaveBeenCalled();
    });

    it('skips internal handler if user calls preventDefault', () => {
      const user = jest.fn((e) => {
        e.defaultPrevented = true;
      });
      const internal = jest.fn();
      const event = { defaultPrevented: false } as any;

      const handler = mergeEventHandlerClicks(user, internal);
      handler(event);

      expect(internal).not.toHaveBeenCalled();
    });
  });
});
