import {
  handleWhitespaceAndComment,
  tokenizeByOperand,
  processPplString,
  pplStringToRelationships,
} from './core.mjs';

describe('handleWhitespaceAndComment', () => {
  it('basics', () => {
    expect(handleWhitespaceAndComment('')).toBe('');
    expect(handleWhitespaceAndComment('  ')).toBe('');
    expect(handleWhitespaceAndComment('\t\t')).toBe('');
    expect(handleWhitespaceAndComment('  a thing')).toBe('a thing');
    expect(handleWhitespaceAndComment('\t\tAnother one')).toBe('Another one');
    expect(handleWhitespaceAndComment('# just a comment')).toBe('');
    expect(handleWhitespaceAndComment('  a thing#stuffs')).toBe('a thing');
    expect(handleWhitespaceAndComment('\t\tAnother one# more stuffs')).toBe(
      'Another one'
    );
  });
});

describe('tokenizeByOperand', () => {
  it('basics', () => {
    expect(tokenizeByOperand('Adam+/Eve')).toEqual(['Adam', '+/', 'Eve']);
    expect(tokenizeByOperand('Ad am +/\tE ve')).toEqual([
      'Ad am',
      '+/',
      'E ve',
    ]);
    expect(tokenizeByOperand('Ad am +\tE ve')).toEqual(['Ad am', '+', 'E ve']);
    expect(tokenizeByOperand('Ad am ..\tE ve')).toEqual([
      'Ad am',
      '..',
      'E ve',
    ]);
    expect(tokenizeByOperand('Ad am @\tE ve')).toEqual(undefined);
  });
});

describe('pplStringToRelationships', () => {
  it('fails if no known operand is found', () => {
    expect(() => pplStringToRelationships(`p 1 @ p 2`)).toThrow(Error);
  });

  it('parses with relationship wo /siblings', () => {
    expect(pplStringToRelationships(`p 1 + p 2`)).toEqual([
      {
        a: 'p 1',
        b: 'p 2',
        kind: 'with',
      },
    ]);
  });

  it('parses almost_with relationship w/ 1 sibling', () => {
    expect(
      pplStringToRelationships(`p 1 .. p 2
  s 1`)
    ).toEqual([
      {
        a: 'p 1',
        b: 'p 2',
        kind: 'almost_with',
        siblings: ['s 1'],
      },
    ]);
  });

  it('parses has_been_with relationship w/ 2 siblings', () => {
    expect(
      pplStringToRelationships(`p1 +/ p2
\ts1
  s2`)
    ).toEqual([
      {
        a: 'p1',
        b: 'p2',
        kind: 'has_been_with',
        siblings: ['s1', 's2'],
      },
    ]);
  });

  it('parses almost_with relationship w/ 1 sibling and comments', () => {
    expect(
      pplStringToRelationships(`
#something
p1 .. p2
  # something else
  s1
# and even more`)
    ).toEqual([
      {
        a: 'p1',
        b: 'p2',
        kind: 'almost_with',
        siblings: ['s1'],
      },
    ]);
  });
});

describe('processPplString', () => {
  it('processes 1 has_been_with relationship w/ 2 siblings', () => {
    expect(
      processPplString(`p1 +/ p2
    s1
    s2`)
    ).toMatchSnapshot();
  });
});
