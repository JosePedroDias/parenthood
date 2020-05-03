# With Graphviz

## using the script to generate graphviz file

The Javascript module converts a ppl file to a graphviz dot compatible file,
able to render in any rendered such as [graphviz](http://graphviz.org/), [viz.js](http://viz-js.com/), etc.

Run it like this:

`ppl2gv parenthood.ppl`

which will output `parenthood.gv`.  
provide the outfile as an additional argument if desired

## generating diagrams

### in the browser

Check the [demo](https://josepedrodias.github.io/parenthood/public/graphviz/demo.html).
You need to focus outside the text area to refresh the diagram.  
Using [viz.js](http://viz-js.com/) here.
Think of this as a hack to allow you to experiment, nothing fancy...

### in the command line

#### setup grapviz

`brew install graphviz` (in mac)  
`apt install graphviz` (in many linuxes)  
`choco install graphviz` (in windows)

#### generate diagram in the format you prefer

`dot parenthood.gv -Tpng -O` (for png)  
`dot parenthood.gv -Tsvg -O` (for svg)  
`dot parenthood.gv -Tpdf -O` (for pdf)

`dot` uses ranks in orthogonal dimensions.  
try `neato` and `twopi` engines as well. the results are less predictable but nodes tend to distribute better.

## reference

- [viz.js](http://viz-js.com/), one of several graphviz implementations for js
- graphviz spec
  - [lang](https://www.graphviz.org/doc/info/lang.html)
  - [attributes](https://www.graphviz.org/doc/info/attrs.html)
  - [shapes](https://www.graphviz.org/doc/info/shapes.html)
  - [command-line usage](https://www.graphviz.org/doc/info/command.html)
  - [neato guide](https://graphviz.gitlab.io/_pages/pdf/neatoguide.pdf)
