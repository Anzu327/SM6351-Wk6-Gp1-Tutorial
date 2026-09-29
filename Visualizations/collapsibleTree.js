/*
 * SM6351 Wk6 Gp1 Tutorial · Collapsible Node-Link Tree
 * Run with the D3 v7 object, the supplied GDP data, and a DOM container.
 * In the teaching page these are passed by the isolated preview runner.
 * GDP shares come from the source visualization's January 2017 dataset.
 */
function renderTree({ d3, data, container }) {
  const width = 1020;
  const rowGap = 44;
  const columnGap = 245;

  d3.select(container).selectAll("*").remove();
  const svg = d3.select(container)
    .append("svg")
    .attr("role", "img")
    .attr("aria-label", "Collapsible world, group, and country or region tree")
    .attr("width", width);
  const stage = svg.append("g");
  const linkLayer = stage.append("g").attr("class", "links");
  const nodeLayer = stage.append("g").attr("class", "nodes");

  // KEY 1: D3 wraps nested JSON in nodes with parent, depth, and children.
  const root = d3.hierarchy(data).sum((d) => d.weight || 0);

  // Begin with regional groups folded; click a circle to reveal countries and regions.
  root.children.forEach((group) => {
    group._children = group.children;
    group.children = null;
  });

  // KEY 2: The tree layout computes x/y coordinates for visible nodes.
  const layout = d3.tree().nodeSize([rowGap, columnGap]);
  // TASK 2 START: increase the up-and-down gap between nodes.
  // Type one line here, using the layout above as a guide.
  // TASK 2 END
  const drawLink = d3.linkHorizontal()
    .x((d) => d.y)
    .y((d) => d.x);

  function update() {
    layout(root);

    // KEY 3: descendants() and links() feed D3's SVG data joins.
    const visibleNodes = root.descendants();
    const visibleLinks = root.links();
    const top = d3.min(visibleNodes, (d) => d.x);
    const bottom = d3.max(visibleNodes, (d) => d.x);
    const height = Math.max(420, bottom - top + 100);
    svg.attr("height", height).attr("viewBox", `0 0 ${width} ${height}`);
    stage.attr("transform", `translate(74,${50 - top})`);

    linkLayer.selectAll("path.link")
      .data(visibleLinks, (d) => d.target.ancestors().map((a) => a.data.name).reverse().join("/"))
      .join("path")
      .attr("class", "link")
      .attr("d", drawLink);

    const nodes = nodeLayer.selectAll("g.node")
      .data(visibleNodes, (d) => d.ancestors().map((a) => a.data.name).reverse().join("/"))
      .join((enter) => {
        const node = enter.append("g").attr("class", "node");
        node.append("circle").attr("r", 8);
        node.append("text").attr("x", 16).attr("dy", "0.32em");
        return node;
      })
      .attr("transform", (d) => `translate(${d.y},${d.x})`)
      .classed("expandable", (d) => Boolean(d.children || d._children))
      .on("click", (event, d) => {
        if (!d.children && !d._children) return;
        // KEY 4: swap visible children and stored children, then redraw.
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        update();
      });

    // TASK 1 START: give all regional groups one shared color.
    const nodeFill = (d) => {
      if (d.depth === 0) return "#18345b";
      if (d.depth === 1) return d.data.color;
      return "#ffffff";
    };
    // TASK 1 END
    nodes.select("circle").attr("fill", nodeFill);
    nodes.select("text")
      .text((d) => {
        const name = d.depth === 0 ? "World" : d.data.code === "HK" ? "Hong Kong SAR, China" : d.data.name;
        const count = d.depth < 2 ? ` (${(d.children || d._children).length})` : "";
        return `${name} ${d.value.toFixed(2)}%${count}`;
      })
      .attr("font-weight", (d) => d.depth < 2 ? 650 : 400);

  }

  update();
}

renderTree({ d3, data, container });
