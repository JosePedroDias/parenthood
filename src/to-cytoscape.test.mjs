import { processPplString } from './to-cytoscape.mjs';

describe('processPplString', () => {
  it('processes 1 has_been_with relationship w/ 2 siblings', () => {
    expect(
      processPplString(`p1 +/ p2
      s1
      s2`)
    ).toMatchSnapshot();
  });
});
