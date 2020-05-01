# parenthood

The idea behind this is to find a convenient way to represent relationships,
both simple to textually represent and possible to graph as well.

This can be useful during a complex book or a long tv series.

One could even have different versions of the hierarchy evolve over time,
to represent bonds that were lost, evolution and avoid spoiling.

## the PPL format

The ppl format is a text file with a set of relationship.

A relationship can be described by 2 people and an optional set of siblings

```
<person1> <relationship_kind> <person2>
    <sibling1>
    ...
    <siblingn>
```

relationship kinds can be:

- `..` seem to be getting along (rose)
- `+` together
- `+/` used to be together (red)

The simple parser ignores lines starting with `#`

### limitations

People names must be not have spaces as they aren't escaped in dot.  
The layout may get cluttered with too many people or people with many relationships.

## the script

The Javascript module converts a ppl file to a graphviz dot compatible file,
able to render in any rendered such as [graphviz](http://graphviz.org/), [viz.js](http://viz-js.com/), etc.

## in node

Run it like this:

    node --experimental-modules ppl2dot.mjs parenthood.ppl # will output to parenthood.gv. provide the outfile if desired.

## in the browser

Check the [demo](https://josepedrodias.github.io/parenthood/demo.html).

# reference

- http://viz-js.com/
- https://graphviz.gitlab.io/_pages/doc/info/lang.html
- https://graphviz.gitlab.io/_pages/doc/info/attrs.html
- https://www.graphviz.org/doc/info/shapes.html
