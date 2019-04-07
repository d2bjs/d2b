

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

<table><thead><tr><th>Property</th><th>Details</th></tr></thead><tbody><tr class="parent" onclick="toggleNextRow(this)"><td>data.values</td><td>Array of pie values.<br><br><strong>Type:</strong> array<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr><td>data.values[].color</td><td>Arc color, if set, this will override the pie's arc color accessor.<br><br><strong>Type:</strong> string<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.values[].empty</td><td>Initial arc visibility state, this will be modified internally by the pie chart.<br><br><strong>Type:</strong> boolean<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.values[].label</td><td>Pie arc label.<br><br><strong>Type:</strong> string<br></td></tr><tr><td>data.values[].legendIcon</td><td>Legend icon symbol type. This can either be a font awesome character code (e.g. '\uf111' for a circle), [d3 symbol](https://github.com/d3/d3-shape#symbols) or [d2b symbol](https://docs.d2bjs.org/shape/symbols.html). If set, this will override the legend's icon property.<br><br><strong>Type:</strong> string, SymbolType<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.values[].tooltip</td><td>Arc tooltip content, if set, this will override the pie's arc tooltip accessor. Use null to disable the tooltip for this arc.<br><br><strong>Type:</strong> string, null<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.values[].value</td><td>Pie arc value.<br><br><strong>Type:</strong> number<br></td></tr></tbody></table></td>
      </tr><tr null><td>data.at</td><td>This specifies where the pie chart will reside within the chart frame. It can either be specified as a location descriptor or a center position computator.<br><br><strong>Type:</strong> "top left", "top center", "top right", "center left", "center center", "center right", "bottom center", "bottom right", (width, height, radius) => number<br><strong>Default:</strong> `(width, height, radius) => { return { x: width / 2, y: height / 2 } } `<br><strong>Optional:</strong> true<br></td></tr><tr class="parent" onclick="toggleNextRow(this)"><td>data.chartPadding</td><td>The chart's inner padding (excluding the legend) in pixels.<br><br><strong>Type:</strong> number, object<br><strong>Default:</strong> `10 `<br><strong>Optional:</strong> true<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr><td>data.chartPadding.bottom</td><td><strong>Type:</strong> number<br></td></tr><tr><td>data.chartPadding.left</td><td><strong>Type:</strong> number<br></td></tr><tr><td>data.chartPadding.right</td><td><strong>Type:</strong> number<br></td></tr><tr><td>data.chartPadding.top</td><td><strong>Type:</strong> number<br></td></tr></tbody></table></td>
      </tr><tr null><td>data.color</td><td>Pie arc color accessor function.<br><br><strong>Type:</strong> string, (data) => string<br><strong>Default:</strong> `d => colorGenerator(d.label) `<br><strong>Optional:</strong> true<br></td></tr><tr null><td>data.cornerRadius</td><td>Corner radius of pie arcs in pixels.<br><br><strong>Type:</strong> number<br><strong>Default:</strong> `0 `<br><strong>Optional:</strong> true<br></td></tr><tr null><td>data.donutRatio</td><td>Ratio of the pie's inner radius to outer radius. Given as a decimal between 0 and 1.<br><br><strong>Type:</strong> number<br><strong>Default:</strong> `0 `<br><strong>Optional:</strong> true<br></td></tr><tr null><td>data.duration</td><td>The internal chart duration in miliseconds.<br><br><strong>Type:</strong> number<br><strong>Default:</strong> `250 `<br><strong>Optional:</strong> true<br></td></tr><tr null><td>data.endAngle</td><td>Pie chart end angle in radians.<br><br><strong>Type:</strong> number<br><strong>Default:</strong> `2 * Math.PI `<br><strong>Optional:</strong> true<br></td></tr><tr class="parent" onclick="toggleNextRow(this)"><td>data.legend</td><td>Chart legend configuration options.<br><br><strong>Type:</strong> object<br><strong>Optional:</strong> true<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr><td>data.legend.clickable</td><td>Whether the legend will hide / show arcs on click.<br><br><strong>Type:</strong> boolean<br><strong>Default:</strong> `true `<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.legend.dblclickable</td><td>Whether the legend will hide / show arcs on dblclick.<br><br><strong>Type:</strong> boolean<br><strong>Default:</strong> `true `<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.legend.enabled</td><td>Enable or disable the legend.<br><br><strong>Type:</strong> boolean<br><strong>Default:</strong> `true `<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.legend.icon</td><td>Legend icon symbol type. This can either be a font awesome character code (e.g. '\uf111' for a circle), [d3 symbol](https://github.com/d3/d3-shape#symbols) or [d2b symbol](https://docs.d2bjs.org/shape/symbols.html). This can also be provided as an accessor to the pie value.<br><br><strong>Type:</strong> string, SymbolType, (data) => string, SymbolType<br><strong>Default:</strong> `d3.symbolCircle `<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.legend.orient</td><td>Legend orientation, relative to the chart.<br><br><strong>Type:</strong> "top", "left", "right", "bottom"<br><strong>Default:</strong> `'bottom' `<br><strong>Optional:</strong> true<br></td></tr></tbody></table></td>
      </tr><tr null><td>data.padAngle</td><td>Pie chart angle padding in radians.<br><br><strong>Type:</strong> number<br><strong>Default:</strong> `0 `<br><strong>Optional:</strong> true<br></td></tr><tr class="parent" onclick="toggleNextRow(this)"><td>data.padding</td><td>The chart's outer padding (including the legend) in pixels.<br><br><strong>Type:</strong> number, object<br><strong>Default:</strong> `10 `<br><strong>Optional:</strong> true<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr><td>data.padding.bottom</td><td><strong>Type:</strong> number<br></td></tr><tr><td>data.padding.left</td><td><strong>Type:</strong> number<br></td></tr><tr><td>data.padding.right</td><td><strong>Type:</strong> number<br></td></tr><tr><td>data.padding.top</td><td><strong>Type:</strong> number<br></td></tr></tbody></table></td>
      </tr><tr null><td>data.radius</td><td>Pie chart outer radius computator. Usually relative to the container height and width.<br><br><strong>Type:</strong> (width, height) => number<br><strong>Default:</strong> `(width, height) => Math.min(width, height) / 2 `<br><strong>Optional:</strong> true<br></td></tr><tr class="parent" onclick="toggleNextRow(this)"><td>data.size</td><td>The pixel size of the chart.<br><br><strong>Type:</strong> object<br><strong>Optional:</strong> true<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr><td>data.size.height</td><td>The pixel height of the chart. If not given, the container height will be used.<br><br><strong>Type:</strong> number<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.size.width</td><td>The pixel width of the chart. If not given, the container width will be used.<br><br><strong>Type:</strong> number<br><strong>Optional:</strong> true<br></td></tr></tbody></table></td>
      </tr><tr null><td>data.sort</td><td>Pie arc sort comparator. Use null to order arcs according to the values array.<br><br><strong>Type:</strong> null, (a, b) => number<br><strong>Default:</strong> `null `<br><strong>Optional:</strong> true<br></td></tr><tr null><td>data.startAngle</td><td>Pie chart start angle in radians.<br><br><strong>Type:</strong> number<br><strong>Default:</strong> `0 `<br><strong>Optional:</strong> true<br></td></tr><tr class="parent" onclick="toggleNextRow(this)"><td>data.tooltip</td><td>Chart tooltip configuration options.<br><br><strong>Type:</strong> object<br><strong>Optional:</strong> true<br></td></tr><tr class="child hidden">
        <td colspan="2"><table><tbody><tr><td>data.tooltip.at</td><td>This specifies where the tooltip will be positioned relative to the hovered item. By default, this will alternate between 'center left' and 'center right' depending on the position of the cursor relative to the viewport.<br><br><strong>Type:</strong> "top left", "top center", "top right", "center left", "center center", "center right", "bottom center", "bottom right"<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.tooltip.followMouse</td><td>Tooltip will follow the mouse instead of being placed in a static position relative to the hovered element.<br><br><strong>Type:</strong> boolean<br><strong>Default:</strong> `true `<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.tooltip.html</td><td>Html content to be displayed in the arc's tooltip. A null value will disable the arc's tooltip.<br><br><strong>Type:</strong> null, string, (data, value, percent) => string, null<br><strong>Default:</strong> `(d, percent) => `<b>${d.label}</b>: ${d.value} (${d3.format('.0%')(percent)})` `<br><strong>Optional:</strong> true<br></td></tr><tr><td>data.tooltip.my</td><td>Orientation of the tooltip. By default, this will alternate between 'left' and 'right' depending on the position of the cursor relative to the viewport.<br><br><strong>Type:</strong> "top", "left", "right", "bottom"<br><strong>Optional:</strong> true<br></td></tr></tbody></table></td>
      </tr><tr null><td>data.updated</td><td>Event hook for d2b charts. Will be after the chart is rendered. Note: Transitions may still occur after this lifecycle hook fires.<br><br><strong>Type:</strong> (this, data) => void<br><strong>Optional:</strong> true<br></td></tr></tbody></table>