import { processPplString, pplStringToRelationships } from './core.mjs';

describe('pplStringToRelationships', () => {
  it('parses with relationship wo /siblings', () => {
    expect(pplStringToRelationships(`p1 + p2`)).toEqual([
      {
        a: 'p1',
        b: 'p2',
        kind: 'with',
      },
    ]);
  });

  it('parses almost_with relationship w/ 1 sibling', () => {
    expect(
      pplStringToRelationships(`p1 .. p2
  s1`)
    ).toEqual([
      {
        a: 'p1',
        b: 'p2',
        kind: 'almost_with',
        siblings: ['s1'],
      },
    ]);
  });

  it('parses has_been_with relationship w/ 2 siblings', () => {
    expect(
      pplStringToRelationships(`p1 +/ p2
  s1
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
