function TotalsPlugin(scrollbarWidth) {
  this._scrollbarWidth = scrollbarWidth;
}

TotalsPlugin.prototype._scrollOffset = 0;

TotalsPlugin.prototype._scrollbarWidth = 16;

TotalsPlugin.prototype._rowHeight = 0;

TotalsPlugin.prototype._$totalsViewport = null;

TotalsPlugin.prototype._$totalsRow = null;

TotalsPlugin.prototype.init = function (grid) {
  this._grid = grid;
  this._rowHeight = grid.getOptions().rowHeight;

  var viewport = grid.getCanvasNode().parentElement;
  var width = viewport.offsetWidth;
  if (viewport.scrollHeight > viewport.offsetHeight) {
    width -= this._scrollbarWidth;
  }

  /*********** SalesPad Edit - top : 0  ***********/
  this._$totalsViewport = $('<div class="slick-viewport totals-viewport">').css({top: 0, width: width});
  this._$totalsViewport.insertAfter(viewport);
  // this._appendTotalsRow(grid);

  var self = this;
  grid.onColumnsResized.subscribe(function() { self._handleColumnsResized.apply(self, arguments) });
  grid.onColumnsReordered.subscribe(function() { self._handleColumnsReordered.apply(self, arguments) });
  grid.onScroll.subscribe(function() { self._handleScroll.apply(self, arguments) });
};

TotalsPlugin.prototype.destroy = function () {
  this._$totalsViewport.remove();
};

/*********** SalesPad Edit - empty cells when columns are updating ***********/
TotalsPlugin.prototype.empty = function () {
  this._$totalsRow && this._$totalsRow.empty()
};

TotalsPlugin.prototype.render = function () {
  var totals = this._grid.getData().getTotals();
  var columns = this._grid.getColumns();
  var cells = this._$totalsRow.children();

  for (var i = 0, l = columns.length; i < l; i++) {
    cells[i].innerText = totals[columns[i].id] || '';
  }
};

TotalsPlugin.prototype._appendTotalsRow = function (grid) {
  var width = grid.getCanvasNode().offsetWidth;
  var $totalsRow = $('<div class="ui-widget-content slick-row totals"></div>').css({position: 'relative', width: width});
  var totals = grid.getData().getTotals();
  var columns = grid.getColumns();
  var $cell;
  var text;

  for (var i = 0, l = columns.length; i < l; i++) {
    $cell = $('<div class="slick-cell"></div>').addClass('l' + i + ' r' + i);
    /*********** SalesPad Edit - Use column formatter to format sum ***********/
    if (_.isFunction(columns[i].formatter)) {
      text = columns[i].formatter(0, i, totals[columns[i].id], columns[i]);
    } else {
      text = totals[columns[i].id];
    }
     /*********** End SalesPad Edit - Use column formatter to format sum ***********/
    $cell.text(text);
    $totalsRow.append($cell);
  }

  this._$totalsViewport.empty().append($totalsRow);
  this._$totalsRow = $totalsRow;
};

TotalsPlugin.prototype._handleColumnsResized = function (event, update) {
  var canvas = update.grid.getCanvasNode();
  var viewport = canvas.parentElement;
  var top = (viewport.scrollWidth > viewport.offsetWidth) ? this._rowHeight + this._scrollbarWidth : this._rowHeight;
  this._$totalsRow.width(canvas.scrollWidth);
  this._$totalsViewport.css('top', 0)
};

TotalsPlugin.prototype._handleColumnsReordered = function(event, update) {
  this._appendTotalsRow(update.grid);
};

TotalsPlugin.prototype._handleScroll = function(event, update) {
  if (this._scrollOffset != update.scrollLeft) {
    this._scrollOffset = update.scrollLeft;
    this._$totalsRow.css('left', this._scrollOffset * -1);
  }
};
