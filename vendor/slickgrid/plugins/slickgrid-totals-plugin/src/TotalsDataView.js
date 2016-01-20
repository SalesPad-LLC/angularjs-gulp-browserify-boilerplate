'use strict';
/**
 * A data provider that caclulates a total of all values for any column that has a hasTotal flag set to true.
 * @param {Slick.Data.DataView || []} data A slick grid data view or an array of data
 * @param {Object} columns The column definitions
 * @constructor
 */
function TotalsDataView(data, columns) {
  var totals = {};
  var totalsMetadata = {
    cssClasses: 'total-spacer-row',
    columns: {}
  };

  // Make the totals not editable.
  for (var i = 0; i < columns.length; i++) {
    totalsMetadata.columns[i] = {
      editor: null
    };
  }

  var self = this;

  _.extend(this, data);/** Sales Pad Edit - extend dataview with these fns***/
  if (data.onRowCountChanged) {
    data.onRowCountChanged.subscribe(function (e, args) {
      self.updateTotals();
    });
  }

  if (data.onRowsChanged) {
    data.onRowsChanged.subscribe(function (e, args) {
      self.updateTotals();
    });
  }

  /*********** Sales Pad Edit - update columns ***********/
  this.setTotalsColumns = function(newColumns) {
    columns = newColumns;
    totalsMetadata.columns = {};
    for (var i = 0; i < newColumns.length; i++) {
      totalsMetadata.columns[i] = {
        editor: null
      };
    }
  };

  this.getLength = function () {
    var length = data.getLength ? data.getLength() : data.length;
    /*********** Sales Pad Edit - if we have no data, do not add an extra row ***********/
    return length ? length + 1 : length;
  };

  this.getItem = function (index) {
    return data.getItem ? data.getItem(index) : data[index];
  };

  this.getItemMetadata = function (index) {
    if (index == (this.getLength() - 1)) {
      return totalsMetadata;
    } else {
      return data.getItemMetadata ? data.getItemMetadata(index) : null;
    }
  };

  this.getTotals = function () {
    return totals;
  };

  this.updateTotals = function () {
    console.log("updating totals", columns);
    var columnIdx = columns.length;
    while (columnIdx--) {
      var column = columns[columnIdx];
      if (!column.hasTotal) {
        continue;
      }

      var total = 0;
      var dataItems = data.getItems ? data.getItems() : data;
      var i = dataItems.length;
      if (_.isFunction(column.aggregator)) {
        total = column.aggregator(dataItems);
      } else {
        while (i > -1) {
          i--;
          if (dataItems[i]) {
            total += (parseFloat(dataItems[i][column.field], 10) || 0);
          }
        }
      }
      totals[column.id] = +total.toFixed(2);
    }
  };

  this.updateTotals();
}
