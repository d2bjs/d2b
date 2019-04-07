

<script>
  function toggleNextRow(el) {
    const nextRow = el.nextElementSibling;
    nextRow.classList.toggle('hidden');
    el.classList.toggle('expanded');
  } 
</script>

<style>
  .parent td:first-child::before {
    position: absolute;
    left: 8px;
    content: '\f0da';
    font-family: FontAwesome;
  }

  .expanded td:first-child::before {
    content: '\f0d7';
    font-family: FontAwesome;
  }

  .child > td {
    padding: 0 !important;
    border: none !important;
  }

  .child table {
    margin: 0 !important;
    border: 0 !important;
  }

  tr td:first-child {
    min-width: 250px;
    max-width: 250px;
    width: 250px;
  }

  tr.hidden {
    display: none;
  }

  td {
    position: relative;
  }

  tbody tr td:first-child {
    padding-left: 20px;
  }
</style>

<table><thead><tr><th>Property</th><th>Details</th></tr></thead><tbody><tr class="parent" onclick="toggleNextRow(this)"><td>data.links</td><td>Array of sankey links.<br><br><strong>Type:</strong> array<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr><td>data.links[].source</td><td>Link source name. Should refer to the source node's name.<br><br><strong>Type:</strong> string<br></td></tr><tr><td>data.links[].sourceColor</td><td>Link source color, if set, this will override the sankey's link.sourceColor accessor.<br><br><strong>Type:</strong> string<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.links[].target</td><td>Link target name. Should refer to the target node's name.<br><br><strong>Type:</strong> string<br></td></tr><tr><td>data.links[].targetColor</td><td>Link target color, if set, this will override the sankey's link.targetColor accessor.<br><br><strong>Type:</strong> string<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.links[].tooltip</td><td>Link tooltip content, if set, this will override the sankey's link.tooltip accessor. Use null to disable the tooltip for this link.<br><br><strong>Type:</strong> string, null<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.links[].value</td><td>Link value.<br><br><strong>Type:</strong> number<br></td></tr></tbody></table></td>
      </tr><tr class="parent" onclick="toggleNextRow(this)"><td>data.nodes</td><td>Array of sankey nodes.<br><br><strong>Type:</strong> array<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr><td>data.nodes[].color</td><td>Node color, if set, this will override the sankey's node.color accessor.<br><br><strong>Type:</strong> string<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.nodes[].name</td><td>Node name.<br><br><strong>Type:</strong> string<br></td></tr><tr><td>data.nodes[].tooltip</td><td>Node tooltip content, if set, this will override the sankey's node.tooltip accessor. Use null to disable the tooltip for this node.<br><br><strong>Type:</strong> string, null<br><strong>Optional:</strong> true<br></td></tr></tbody></table></td>
      </tr><tr null><td>data.iterations</td><td>Number of relaxation iterations used while generating the sankey layout.<br><br><strong>Type:</strong> number<br><strong>Default:</strong> `6 `<br><strong>Optional:</strong> true<br></td></tr><tr class="parent" onclick="toggleNextRow(this)"><td>data.link</td><td>Sankey link configuration options.<br><br><strong>Type:</strong> object<br><strong>Optional:</strong> true<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr><td>data.link.sourceColor</td><td>Sankey link source color accessor function.<br><br><strong>Type:</strong> string, (data, sourceColor) => string<br><strong>Default:</strong> `(data, sourceColor) => sourceColor `<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.link.targetColor</td><td>Sankey link target color accessor function.<br><br><strong>Type:</strong> string, (data, targetColor) => string<br><strong>Default:</strong> `(data, targetColor) => targetColor `<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.link.tooltip</td><td>Link tooltip configuration options.<br><br><strong>Type:</strong> object<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.link.tooltip.at</td><td>This specifies where the tooltip will be positioned relative to the hovered item. By default, this will alternate between 'center left' and 'center right' depending on the position of the cursor relative to the viewport.<br><br><strong>Type:</strong> "top left", "top center", "top right", "center left", "center center", "center right", "bottom center", "bottom right"<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.link.tooltip.followMouse</td><td>Tooltip will follow the mouse instead of being placed in a static position relative to the hovered element.<br><br><strong>Type:</strong> boolean<br><strong>Default:</strong> `true `<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.link.tooltip.html</td><td>Html content to be displayed in the link's tooltip.<br><br><strong>Type:</strong> string, (data, source, target) => string<br><strong>Default:</strong> `function (data, source, target) {   return `     <b>${source.name}</b>     <i class='fa fa-arrow-right d2b-sankey-link-arrow' aria-hidden='true'></i>     <b>${target.name}</b>:     ${data.value}   ` } `<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.link.tooltip.my</td><td>Orientation of the tooltip. By default, this will alternate between 'left' and 'right' depending on the position of the cursor relative to the viewport.<br><br><strong>Type:</strong> "top", "left", "right", "bottom"<br><strong>Optional:</strong> true<br></td></tr></tbody></table></td>
      </tr><tr class="parent" onclick="toggleNextRow(this)"><td>data.node</td><td>Sankey node configuration options.<br><br><strong>Type:</strong> object<br><strong>Optional:</strong> true<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr><td>data.node.align</td><td>How to align sankey nodes.<br><br><strong>Type:</strong> "left", "right", "center", "justify"<br><strong>Default:</strong> `'justify' `<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.node.color</td><td>Sankey node color accessor function.<br><br><strong>Type:</strong> string, (data, key) => string<br><strong>Default:</strong> `data => colorGenerator(data.name) `<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.node.draggableX</td><td>Enable / disable node dragging in the horizontal direction.<br><br><strong>Type:</strong> boolean<br><strong>Default:</strong> `false `<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.node.draggableY</td><td>Enable / disable node dragging in the vertical direction.<br><br><strong>Type:</strong> boolean<br><strong>Default:</strong> `false `<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.node.labelWrapLength</td><td>The number of characters to start wrapping the node label.<br><br><strong>Type:</strong> number<br><strong>Default:</strong> `Infinity `<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.node.padding</td><td>Vertical separation between nodes.<br><br><strong>Type:</strong> number<br><strong>Default:</strong> `8 `<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.node.sort</td><td>Sort comparator for sankey node columns. Use null to order nodes according to the nodes array. If undefined, the nodes will be sorted according to the layout.<br><br><strong>Type:</strong> null, (a, b) => number<br><strong>Default:</strong> `undefined `<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.node.tooltip</td><td>Node tooltip configuration options.<br><br><strong>Type:</strong> object<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.node.tooltip.at</td><td>This specifies where the tooltip will be positioned relative to the hovered item. By default, this will alternate between 'center left' and 'center right' depending on the position of the cursor relative to the viewport.<br><br><strong>Type:</strong> "top left", "top center", "top right", "center left", "center center", "center right", "bottom center", "bottom right"<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.node.tooltip.followMouse</td><td>Tooltip will follow the mouse instead of being placed in a static position relative to the hovered element.<br><br><strong>Type:</strong> boolean<br><strong>Default:</strong> `true `<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.node.tooltip.html</td><td>Html content to be displayed in the node's tooltip.<br><br><strong>Type:</strong> string, (data, value) => string<br><strong>Default:</strong> `(data, value) => `<b>${data.name}</b>: ${value}` `<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.node.tooltip.my</td><td>Orientation of the tooltip. By default, this will alternate between 'left' and 'right' depending on the position of the cursor relative to the viewport.<br><br><strong>Type:</strong> "top", "left", "right", "bottom"<br><strong>Optional:</strong> true<br></td></tr></tbody></table></td>
      </tr><tr class="parent" onclick="toggleNextRow(this)"><td>data.padding</td><td>The chart's outer padding in pixels.<br><br><strong>Type:</strong> number, object<br><strong>Default:</strong> `10 `<br><strong>Optional:</strong> true<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr><td>data.padding.bottom</td><td><strong>Type:</strong> number<br></td></tr><tr><td>data.padding.left</td><td><strong>Type:</strong> number<br></td></tr><tr><td>data.padding.right</td><td><strong>Type:</strong> number<br></td></tr><tr><td>data.padding.top</td><td><strong>Type:</strong> number<br></td></tr></tbody></table></td>
      </tr><tr class="parent" onclick="toggleNextRow(this)"><td>data.size</td><td>The pixel size of the chart.<br><br><strong>Type:</strong> object<br><strong>Optional:</strong> true<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr><td>data.size.height</td><td>The pixel height of the chart. If not given, the container height will be used.<br><br><strong>Type:</strong> number<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.size.width</td><td>The pixel width of the chart. If not given, the container width will be used.<br><br><strong>Type:</strong> number<br><strong>Optional:</strong> true<br></td></tr></tbody></table></td>
      </tr><tr null><td>data.updated</td><td>Event hook for d2b charts. Will be after the chart is rendered. Note: Transitions may still occur after this lifecycle hook fires.<br><br><strong>Type:</strong> (this, data) => void<br><strong>Optional:</strong> true<br></td></tr></tbody></table>