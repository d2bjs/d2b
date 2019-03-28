

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

<table><thead><tr><th>Property</th><th>Details</th></tr></thead><tbody><tr class="parent" onclick="toggleNextRow(this)"><td>data.root</td><td>The sunburst root node data.<br><br><strong>Type:</strong> object, object<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr><td>data.root.breadcrumb</td><td>Arc breadcrumb content, if set, this will override the sunburst's breadcrumb accessor. Use null to disable the breadcrumb for this arc.<br><br><strong>Type:</strong> string, null<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.root.children</td><td>Sunburst node children.<br><br><strong>Type:</strong> array<br></td></tr><tr><td>data.root.children[].breadcrumb</td><td>Arc breadcrumb content, if set, this will override the sunburst's breadcrumb accessor. Use null to disable the breadcrumb for this arc.<br><br><strong>Type:</strong> string, null<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.root.children[].color</td><td>Arc color, if set, this will override the sunburst's arc color accessor.<br><br><strong>Type:</strong> string<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.root.children[].label</td><td>Sunburst node label.<br><br><strong>Type:</strong> string<br></td></tr><tr><td>data.root.children[].selected</td><td>Initial arc zoom state, Only one arc may be selected at a time.<br><br><strong>Type:</strong> false, true<br><strong>Default:</strong> `false `<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.root.children[].size</td><td>Sunburst node size.<br><br><strong>Type:</strong> number<br></td></tr><tr><td>data.root.children[].tooltip</td><td>Arc tooltip content, if set, this will override the sunburst's tooltip accessor. Use null to disable the tooltip for this arc.<br><br><strong>Type:</strong> string, null<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.root.color</td><td>Arc color, if set, this will override the sunburst's arc color accessor.<br><br><strong>Type:</strong> string<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.root.label</td><td>Sunburst node label.<br><br><strong>Type:</strong> string<br></td></tr><tr><td>data.root.selected</td><td>Initial arc zoom state, Only one arc may be selected at a time.<br><br><strong>Type:</strong> false, true<br><strong>Default:</strong> `false `<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.root.size</td><td>Sunburst node size. If a parent has a node size, it will override the automatic leaf node size aggrigate function. This is useful to oversize a parent node to indicate it is not completely resolved by it's children.<br><br><strong>Type:</strong> number<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.root.tooltip</td><td>Arc tooltip content, if set, this will override the sunburst's tooltip accessor. Use null to disable the tooltip for this arc.<br><br><strong>Type:</strong> string, null<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.root.breadcrumb</td><td>Arc breadcrumb content, if set, this will override the sunburst's breadcrumb accessor. Use null to disable the breadcrumb for this arc.<br><br><strong>Type:</strong> string, null<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.root.color</td><td>Arc color, if set, this will override the sunburst's arc color accessor.<br><br><strong>Type:</strong> string<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.root.label</td><td>Sunburst node label.<br><br><strong>Type:</strong> string<br></td></tr><tr><td>data.root.selected</td><td>Initial arc zoom state, Only one arc may be selected at a time.<br><br><strong>Type:</strong> false, true<br><strong>Default:</strong> `false `<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.root.size</td><td>Sunburst node size.<br><br><strong>Type:</strong> number<br></td></tr><tr><td>data.root.tooltip</td><td>Arc tooltip content, if set, this will override the sunburst's tooltip accessor. Use null to disable the tooltip for this arc.<br><br><strong>Type:</strong> string, null<br><strong>Optional:</strong> true<br></td></tr></tbody></table></td>
      </tr><tr null><td>data.ancestorBandingExponent</td><td>Ancestor (inner) band sizing exponent. An exponent of 1 will make the bands equal size.<br><br><strong>Type:</strong> number<br><strong>Default:</strong> `1 `<br><strong>Optional:</strong> true<br></td></tr><tr null><td>data.ancestorPadding</td><td>Defines the pixel distance between the ancestor (inner) and descendant (outer) bands.<br><br><strong>Type:</strong> number<br><strong>Default:</strong> `10 `<br><strong>Optional:</strong> true<br></td></tr><tr class="parent" onclick="toggleNextRow(this)"><td>data.breadcrumbs</td><td>Chart breadcrumbs configuration options.<br><br><strong>Type:</strong> object<br><strong>Optional:</strong> true<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr><td>data.breadcrumbs.enabled</td><td>Enable or disable the breadcrumbs.<br><br><strong>Type:</strong> false, true<br><strong>Default:</strong> `true `<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.breadcrumbs.html</td><td>Html content to be displayed in the arc's breadcrumb. A null value will disable the arc's breadcrumb.<br><br><strong>Type:</strong> null, string, (data, value, percent) => string, null<br><strong>Default:</strong> `function (data, value, percent) {   return `     <div class = 'd2b-sunburst-breadcrumb'>       <div class = 'd2b-sunburst-label'>         ${data.label}       </div>       <div class = 'd2b-sunburst-value'>         ${value}         ${percent > 1 ? '' : `<div class = 'd2b-sunburst-percent'> ${d3.format('.0%')(percent)} </div>`}       </div>     </div>   ` } `<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.breadcrumbs.orient</td><td>Breadcrumbs orientation, relative to the chart.<br><br><strong>Type:</strong> "top", "left", "right", "bottom"<br><strong>Default:</strong> `'right' `<br><strong>Optional:</strong> true<br></td></tr></tbody></table></td>
      </tr><tr class="parent" onclick="toggleNextRow(this)"><td>data.chartPadding</td><td>The chart's inner padding (excluding the breadcrumbs) in pixels.<br><br><strong>Type:</strong> number, object<br><strong>Default:</strong> `10 `<br><strong>Optional:</strong> true<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr><td>data.chartPadding.bottom</td><td><strong>Type:</strong> number<br></td></tr><tr><td>data.chartPadding.left</td><td><strong>Type:</strong> number<br></td></tr><tr><td>data.chartPadding.right</td><td><strong>Type:</strong> number<br></td></tr><tr><td>data.chartPadding.top</td><td><strong>Type:</strong> number<br></td></tr></tbody></table></td>
      </tr><tr null><td>data.color</td><td>Sunburst arc color accessor function.<br><br><strong>Type:</strong> string, (data) => string<br><strong>Default:</strong> `d => colorGenerator(d.label) `<br><strong>Optional:</strong> true<br></td></tr><tr null><td>data.cornerRadius</td><td>Corner radius of sunburst arcs in pixels.<br><br><strong>Type:</strong> number<br><strong>Default:</strong> `0 `<br><strong>Optional:</strong> true<br></td></tr><tr null><td>data.descendantBandingExponent</td><td>Descendant (outer) band sizing exponent. An exponent of 1 will make the bands equal size.<br><br><strong>Type:</strong> number<br><strong>Default:</strong> `1 `<br><strong>Optional:</strong> true<br></td></tr><tr null><td>data.descendantLevels</td><td>The maximum number of descendant (outer) bands to show at a time. Deeper bands will be drawn when zooming.<br><br><strong>Type:</strong> number<br><strong>Default:</strong> `Infinity `<br><strong>Optional:</strong> true<br></td></tr><tr null><td>data.duration</td><td>The internal chart duration in miliseconds.<br><br><strong>Type:</strong> number<br><strong>Default:</strong> `250 `<br><strong>Optional:</strong> true<br></td></tr><tr null><td>data.endAngle</td><td>Sunburst chart end angle in radians.<br><br><strong>Type:</strong> number<br><strong>Default:</strong> `2 * Math.PI `<br><strong>Optional:</strong> true<br></td></tr><tr null><td>data.highlight</td><td>Enable or disable the sunburst hover to highlight.<br><br><strong>Type:</strong> false, true<br><strong>Default:</strong> `true `<br><strong>Optional:</strong> true<br></td></tr><tr null><td>data.innerRadius</td><td>The pixel inner radius of the sunburst chart. Usually relative to the width / height of the container.<br><br><strong>Type:</strong> number, (width, height) => number<br><strong>Default:</strong> `(width, height) => Math.min(width, height) / 2 `<br><strong>Optional:</strong> true<br></td></tr><tr null><td>data.outerRadius</td><td>The pixel outer radius of the sunburst chart. Usually relative to the width / height of the container.<br><br><strong>Type:</strong> number, (width, height) => number<br><strong>Default:</strong> `(width, height) => Math.min(50, Math.min(width, height) / 4) `<br><strong>Optional:</strong> true<br></td></tr><tr null><td>data.padAngle</td><td>Sunburst chart angle padding in radians.<br><br><strong>Type:</strong> number<br><strong>Default:</strong> `0 `<br><strong>Optional:</strong> true<br></td></tr><tr class="parent" onclick="toggleNextRow(this)"><td>data.padding</td><td>The chart's outer padding (including the breadcrumbs) in pixels.<br><br><strong>Type:</strong> number, object<br><strong>Default:</strong> `10 `<br><strong>Optional:</strong> true<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr><td>data.padding.bottom</td><td><strong>Type:</strong> number<br></td></tr><tr><td>data.padding.left</td><td><strong>Type:</strong> number<br></td></tr><tr><td>data.padding.right</td><td><strong>Type:</strong> number<br></td></tr><tr><td>data.padding.top</td><td><strong>Type:</strong> number<br></td></tr></tbody></table></td>
      </tr><tr null><td>data.showLabels</td><td>Enable or disable the sunburst labels.<br><br><strong>Type:</strong> false, true<br><strong>Default:</strong> `false `<br><strong>Optional:</strong> true<br></td></tr><tr class="parent" onclick="toggleNextRow(this)"><td>data.size</td><td>The pixel size of the chart.<br><br><strong>Type:</strong> object<br><strong>Optional:</strong> true<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr><td>data.size.height</td><td>The pixel height of the chart. If not given, the container height will be used.<br><br><strong>Type:</strong> number<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.size.width</td><td>The pixel width of the chart. If not given, the container width will be used.<br><br><strong>Type:</strong> number<br><strong>Optional:</strong> true<br></td></tr></tbody></table></td>
      </tr><tr null><td>data.sort</td><td>Sunburst arc sort comparator. Use null to order arcs according to the children array.<br><br><strong>Type:</strong> null, (a, b) => number<br><strong>Default:</strong> `null `<br><strong>Optional:</strong> true<br></td></tr><tr null><td>data.startAngle</td><td>Sunburst chart start angle in radians.<br><br><strong>Type:</strong> number<br><strong>Default:</strong> `0 `<br><strong>Optional:</strong> true<br></td></tr><tr class="parent" onclick="toggleNextRow(this)"><td>data.tooltip</td><td>Chart tooltip configuration options.<br><br><strong>Type:</strong> object<br><strong>Optional:</strong> true<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr><td>data.tooltip.at</td><td>This specifies where the tooltip will be positioned relative to the hovered item. By default, this will alternate between 'center left' and 'center right' depending on the position of the cursor relative to the viewport.<br><br><strong>Type:</strong> "top left", "top center", "top right", "center left", "center center", "center right", "bottom center", "bottom right"<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.tooltip.followMouse</td><td>Tooltip will follow the mouse instead of being placed in a static position relative to the hovered element.<br><br><strong>Type:</strong> false, true<br><strong>Default:</strong> `true `<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.tooltip.html</td><td>Html content to be displayed in the arc's tooltip. A null value will disable the arc's tooltip.<br><br><strong>Type:</strong> null, string, (data, value, percent) => string, null<br><strong>Default:</strong> `function (data, value, percent) {   return `     <div class = 'd2b-sunburst-tooltip'>       <div class = 'd2b-sunburst-label'>         ${data.label}       </div>       <div class = 'd2b-sunburst-value'>         ${value}         ${percent > 1 ? '' : `<div class = 'd2b-sunburst-percent'> ${d3.format('.0%')(percent)} </div>`}       </div>     </div>   ` } `<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.tooltip.my</td><td>Orientation of the tooltip. By default, this will alternate between 'left' and 'right' depending on the position of the cursor relative to the viewport.<br><br><strong>Type:</strong> "top", "left", "right", "bottom"<br><strong>Optional:</strong> true<br></td></tr></tbody></table></td>
      </tr><tr null><td>data.updated</td><td>Event hook for d2b charts. Will be after the chart is rendered. Note: Transitions may still occur after this lifecycle hook fires.<br><br><strong>Type:</strong> (this, data) => void<br><strong>Optional:</strong> true<br></td></tr><tr null><td>data.zoomable</td><td>Enable or disable the sunburst click to zoom.<br><br><strong>Type:</strong> false, true<br><strong>Default:</strong> `true `<br><strong>Optional:</strong> true<br></td></tr></tbody></table>