

<script>
  function toggleNextRow(el) {
    const nextRow = el.nextElementSibling;
    nextRow.classList.toggle('hidden');
    el.classList.toggle('expanded');
  } 
</script>

<style>
  .optional {
    opacity: 0.8;
  }

  .required {
    font-weight: bold;
  }

  .parent td:first-child > div::before {
    position: absolute;
    left: -12px;
    content: '\f0da';
    font-family: FontAwesome;
  }

  .expanded td:first-child > div::before {
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

  tr td:first-child > div {
    position: relative;
  }

  tr {
    background-color: white !important;
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

<table><thead><tr><th>Property</th><th>Details</th></tr></thead><tbody><tr class="parent" onclick="toggleNextRow(this)"><td><div style="margin-left:15px;" class="required">data.links</div></td><td>Array of sankey links.<br><br><strong>Type:</strong> <code>array</code><br><strong>Required:</strong> true<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr null><td><div style="margin-left:30px;" class="required">link.source</div></td><td>Link source name. Should refer to the source node's name.<br><br><strong>Type:</strong> <code>string</code><br><strong>Required:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="required">link.target</div></td><td>Link target name. Should refer to the target node's name.<br><br><strong>Type:</strong> <code>string</code><br><strong>Required:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="required">link.value</div></td><td>Link value.<br><br><strong>Type:</strong> <code>number</code><br><strong>Required:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="optional">link.sourceColor</div></td><td>Link source color, if set, this will override the sankey's link.sourceColor accessor.<br><br><strong>Type:</strong> <code>string</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="optional">link.targetColor</div></td><td>Link target color, if set, this will override the sankey's link.targetColor accessor.<br><br><strong>Type:</strong> <code>string</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="optional">link.tooltip</div></td><td>Link tooltip content, if set, this will override the sankey's link.tooltip accessor. Use null to disable the tooltip for this link.<br><br><strong>Type:</strong> <code>string, null</code><br><strong>Optional:</strong> true<br></td></tr></tbody></table></td>
      </tr><tr class="parent" onclick="toggleNextRow(this)"><td><div style="margin-left:15px;" class="required">data.nodes</div></td><td>Array of sankey nodes.<br><br><strong>Type:</strong> <code>array</code><br><strong>Required:</strong> true<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr null><td><div style="margin-left:30px;" class="required">node.name</div></td><td>Node name.<br><br><strong>Type:</strong> <code>string</code><br><strong>Required:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="optional">node.color</div></td><td>Node color, if set, this will override the sankey's node.color accessor.<br><br><strong>Type:</strong> <code>string</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="optional">node.tooltip</div></td><td>Node tooltip content, if set, this will override the sankey's node.tooltip accessor. Use null to disable the tooltip for this node.<br><br><strong>Type:</strong> <code>string, null</code><br><strong>Optional:</strong> true<br></td></tr></tbody></table></td>
      </tr><tr null><td><div style="margin-left:15px;" class="optional">data.iterations</div></td><td>Number of relaxation iterations used while generating the sankey layout.<br><br><strong>Type:</strong> <code>number</code><br><strong>Default:</strong> <code>6</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:15px;" class="optional">data.updated</div></td><td>Event hook for d2b charts. Will be after the chart is rendered. Note: Transitions may still occur after this lifecycle hook fires.<br><br><strong>Type:</strong> <code>(this, data) => void</code><br><strong>Optional:</strong> true<br></td></tr><tr class="parent" onclick="toggleNextRow(this)"><td><div style="margin-left:15px;" class="optional">data.link</div></td><td>Sankey link configuration options.<br><br><strong>Type:</strong> <code>object</code><br><strong>Optional:</strong> true<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr null><td><div style="margin-left:30px;" class="optional">link.sourceColor</div></td><td>Sankey link source color accessor function.<br><br><strong>Type:</strong> <code>string, (data, sourceColor) => string</code><br><strong>Default:</strong> <code>(data, sourceColor) => sourceColor</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="optional">link.targetColor</div></td><td>Sankey link target color accessor function.<br><br><strong>Type:</strong> <code>string, (data, targetColor) => string</code><br><strong>Default:</strong> <code>(data, targetColor) => targetColor</code><br><strong>Optional:</strong> true<br></td></tr><tr class="parent" onclick="toggleNextRow(this)"><td><div style="margin-left:30px;" class="optional">link.tooltip</div></td><td>Link tooltip configuration options.<br><br><strong>Type:</strong> <code>object</code><br><strong>Optional:</strong> true<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr null><td><div style="margin-left:45px;" class="optional">tooltip.at</div></td><td>This specifies where the tooltip will be positioned relative to the hovered item. By default, this will alternate between 'center left' and 'center right' depending on the position of the cursor relative to the viewport.<br><br><strong>Type:</strong> <code>"top left", "top center", "top right", "center left", "center center", "center right", "bottom center", "bottom right"</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:45px;" class="optional">tooltip.followMouse</div></td><td>Tooltip will follow the mouse instead of being placed in a static position relative to the hovered element.<br><br><strong>Type:</strong> <code>boolean</code><br><strong>Default:</strong> <code>true</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:45px;" class="optional">tooltip.html</div></td><td>Html content to be displayed in the link's tooltip.<br><br><strong>Type:</strong> <code>string, (data, source, target) => string</code><br><strong>Default:</strong> <code>function (data, source, target) {   return `     <b>${source.name}</b>     <i class='fa fa-arrow-right d2b-sankey-link-arrow' aria-hidden='true'></i>     <b>${target.name}</b>:     ${data.value}   ` }</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:45px;" class="optional">tooltip.my</div></td><td>Orientation of the tooltip. By default, this will alternate between 'left' and 'right' depending on the position of the cursor relative to the viewport.<br><br><strong>Type:</strong> <code>"top", "left", "right", "bottom"</code><br><strong>Optional:</strong> true<br></td></tr></tbody></table></td>
      </tr></tbody></table></td>
      </tr><tr class="parent" onclick="toggleNextRow(this)"><td><div style="margin-left:15px;" class="optional">data.node</div></td><td>Sankey node configuration options.<br><br><strong>Type:</strong> <code>object</code><br><strong>Optional:</strong> true<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr null><td><div style="margin-left:30px;" class="optional">node.align</div></td><td>How to align sankey nodes.<br><br><strong>Type:</strong> <code>"left", "right", "center", "justify"</code><br><strong>Default:</strong> <code>'justify'</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="optional">node.color</div></td><td>Sankey node color accessor function.<br><br><strong>Type:</strong> <code>string, (data, key) => string</code><br><strong>Default:</strong> <code>data => colorGenerator(data.name)</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="optional">node.draggableX</div></td><td>Enable / disable node dragging in the horizontal direction.<br><br><strong>Type:</strong> <code>boolean</code><br><strong>Default:</strong> <code>false</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="optional">node.draggableY</div></td><td>Enable / disable node dragging in the vertical direction.<br><br><strong>Type:</strong> <code>boolean</code><br><strong>Default:</strong> <code>false</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="optional">node.labelWrapLength</div></td><td>The number of characters to start wrapping the node label.<br><br><strong>Type:</strong> <code>number</code><br><strong>Default:</strong> <code>Infinity</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="optional">node.padding</div></td><td>Vertical separation between nodes.<br><br><strong>Type:</strong> <code>number</code><br><strong>Default:</strong> <code>8</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="optional">node.sort</div></td><td>Sort comparator for sankey node columns. Use null to order nodes according to the nodes array. If undefined, the nodes will be sorted according to the layout.<br><br><strong>Type:</strong> <code>null, (a, b) => number</code><br><strong>Default:</strong> <code>undefined</code><br><strong>Optional:</strong> true<br></td></tr><tr class="parent" onclick="toggleNextRow(this)"><td><div style="margin-left:30px;" class="optional">node.tooltip</div></td><td>Node tooltip configuration options.<br><br><strong>Type:</strong> <code>object</code><br><strong>Optional:</strong> true<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr null><td><div style="margin-left:45px;" class="optional">tooltip.at</div></td><td>This specifies where the tooltip will be positioned relative to the hovered item. By default, this will alternate between 'center left' and 'center right' depending on the position of the cursor relative to the viewport.<br><br><strong>Type:</strong> <code>"top left", "top center", "top right", "center left", "center center", "center right", "bottom center", "bottom right"</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:45px;" class="optional">tooltip.followMouse</div></td><td>Tooltip will follow the mouse instead of being placed in a static position relative to the hovered element.<br><br><strong>Type:</strong> <code>boolean</code><br><strong>Default:</strong> <code>true</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:45px;" class="optional">tooltip.html</div></td><td>Html content to be displayed in the node's tooltip.<br><br><strong>Type:</strong> <code>string, (data, value) => string</code><br><strong>Default:</strong> <code>(data, value) => `<b>${data.name}</b>: ${value}`</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:45px;" class="optional">tooltip.my</div></td><td>Orientation of the tooltip. By default, this will alternate between 'left' and 'right' depending on the position of the cursor relative to the viewport.<br><br><strong>Type:</strong> <code>"top", "left", "right", "bottom"</code><br><strong>Optional:</strong> true<br></td></tr></tbody></table></td>
      </tr></tbody></table></td>
      </tr><tr class="parent" onclick="toggleNextRow(this)"><td><div style="margin-left:15px;" class="optional">data.padding</div></td><td>The chart's outer padding in pixels.<br><br><strong>Type:</strong> <code>number, object</code><br><strong>Default:</strong> <code>10</code><br><strong>Optional:</strong> true<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr null><td><div style="margin-left:30px;" class="required">padding.bottom</div></td><td><strong>Type:</strong> <code>number</code><br><strong>Required:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="required">padding.left</div></td><td><strong>Type:</strong> <code>number</code><br><strong>Required:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="required">padding.right</div></td><td><strong>Type:</strong> <code>number</code><br><strong>Required:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="required">padding.top</div></td><td><strong>Type:</strong> <code>number</code><br><strong>Required:</strong> true<br></td></tr></tbody></table></td>
      </tr><tr class="parent" onclick="toggleNextRow(this)"><td><div style="margin-left:15px;" class="optional">data.size</div></td><td>The pixel size of the chart.<br><br><strong>Type:</strong> <code>object</code><br><strong>Optional:</strong> true<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr null><td><div style="margin-left:30px;" class="optional">size.height</div></td><td>The pixel height of the chart. If not given, the container height will be used.<br><br><strong>Type:</strong> <code>number</code><br><strong>Optional:</strong> true<br></td></tr><tr null><td><div style="margin-left:30px;" class="optional">size.width</div></td><td>The pixel width of the chart. If not given, the container width will be used.<br><br><strong>Type:</strong> <code>number</code><br><strong>Optional:</strong> true<br></td></tr></tbody></table></td>
      </tr></tbody></table>