import { mergeCssVars } from '../../src/utils';

describe('React Style Utils', () => {
  describe('mergeCssVars', () => {
    it('merges variables and strings into a style object', () => {
      const vars = { '--color': 'red', '--size': 10, '--empty': undefined };
      const style = { marginTop: '10px' };
      const merged = mergeCssVars(vars, style);

      expect(merged).toEqual({
        '--color': 'red',
        '--size': '10',
        marginTop: '10px',
      });
      expect(merged).not.toHaveProperty('--empty');
    });
    it('merges standard variables and maintains numeric strings', () => {
      const vars = { '--color': 'blue', '--opacity': 0.5 };
      const style = { display: 'block' };
      expect(mergeCssVars(vars, style)).toEqual({
        '--color': 'blue',
        '--opacity': '0.5',
        display: 'block',
      });
    });

    it('filters out undefined, null, and empty strings', () => {
      const vars = {
        '--valid': 'yes',
        '--undef': undefined,
        '--empty': '',
        '--null': null as any,
      };
      const result = mergeCssVars(vars);
      expect(result).toHaveProperty('--valid');
      expect(Object.keys(result)).toHaveLength(1);
    });

    it('preserves 0 as a valid CSS value', () => {
      const vars = { '--gap': 0, '--top': '0' };
      const result = mergeCssVars(vars);
      expect(result).toEqual({ '--gap': '0', '--top': '0' });
    });

    it('allows standard styles to overwrite CSS variables if keys collide', () => {
      // This tests the spread order in the implementation
      const vars = { color: 'red' } as any;
      const style = { color: 'blue' };
      const result = mergeCssVars(vars, style);
      expect(result.color).toBe('blue');
    });

    it('handles empty inputs gracefully', () => {
      expect(mergeCssVars({})).toEqual({});
      expect(mergeCssVars({}, { margin: 0 })).toEqual({ margin: 0 });
    });

    it('handles purely numeric keys or values', () => {
      const vars = { '--scale': 1.5 };
      const result = mergeCssVars(vars);

      // 🚀 THE FIX: Cast to Record to access custom CSS variables
      const styledResult = result as Record<string, unknown>;

      expect(typeof styledResult['--scale']).toBe('string');
      expect(styledResult['--scale']).toBe('1.5');
    });
  });
});
