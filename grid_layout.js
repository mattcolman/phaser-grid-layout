import _ from 'lodash';

class GridLayout {

  /**
   * [constructor]
   * @param  {Phaser.Game}      game    [Phaser Game instance]
   * @param  {Phaser.Rectangle} bounds  [The bounds in which the grid layout will render]
   * @param  {Object}           options
   * * @property { Int }      [numColumns]
   * * @property { Int }      [numRows]
   * * @property { Number }   [xPadding]
   * * @property { Number }   [yPadding]
   * * @property { Function } [layout]
   *
   * @example
   * const gl = new GridLayout(this.game, bounds, {
      numColumns: 3,
      numRows: 4,
      xPadding: 3,
      yPadding: 4,
      layout: GridLayout.center // there are different layout functions to choose from, or create your own custom one!
    })

    for (var i = 0; i < 10; i++) {
      gl.add( this.addSquare() ) // addSquare returns a Phaser.Sprite that has already been added to the stage!
    }

    // updates the grid layout, sorting by either 'x' or 'y'.
    // as in, if you have 3 columns and 3 rows and add 4 objects, if you sort by 'x' your will get 3 objects
    // in the first row and 1 in the second. But sorting by 'y' will get you 3 objects in the first column and
    // 1 in the second.
    // Nothing visually will happen until you call update.
    gl.update('x')
   *
   */
  constructor(game, bounds, options = {}) {
    this.game = game
    this.parent = parent
    this.bounds = bounds

    let defaultOptions = {
      numColumns: 1,
      numRows: 1,
      xPadding: 1,
      yPadding: 1,
      layout: GridLayout.xy
    }

    _.extend(this, defaultOptions, options)

    this.items = []
  }

  /**
   * [add - add items to the GridLayout]
   * @param {...[DisplayObject]} items
   * @note THIS DOES NOT ADD THE CHILD TO THE STAGE
   */
  add(...items) {
    items.forEach( function(item) {
      this.items.push(item)
    }, this)
  }

  /**
   * [remove - remove items from the GridLayout]
   * @param {...[DisplayObject]} items
   * @note THIS DOES NOT REMOVE THE CHILD FROM THE STAGE
   */
  remove(...items) {
    this.items = _.without(this.items, ...items)
  }

  setBounds(x, y, width, height) {
    this.bounds.x = x
    this.bounds.y = y
    this.bounds.width = width
    this.bounds.height = height
  }

  drawBounds( parent ) {
    if (!this.debugRect) {
      this.debugRect = this.addDebugRect(parent)
    }
    this.debugRect.clear()
                  .beginFill(0xff0000, .5)
                  .drawRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height)
  }

  /**
   * [update updates the grid layout]
   * @param  {String} layout ['x' or 'y']
   */
  update( layout = 'x' ) {
    switch(layout) {
      case 'x':
        return this._layoutX()
      case 'y':
        return this._layoutY()
      default:
        return this._layoutX()
    }
  }

  _addDebugRect( parent ) {
    return this.game.add.graphics(0, 0, parent)
  }

  _layoutX() {
    var column = 0
    var row = 0
    for (var i = 0; i < this.items.length; i++) {

      this._layout(this.items[i], column, row)

      if (++column >= this.numColumns) {
        column = 0
        if (++row >= this.numRows) {
          row = 0
          console.warn('items have wrapped around')
        }
      }
    }
  }

  _layoutY() {
    var column = 0
    var row = 0
    for (var i = 0; i < this.items.length; i++) {

      this._layout(this.items[i], column, row)

      if (++row >= this.numRows) {
        row = 0
        if (++column >= this.numColumns) {
          column = 0
          console.warn('items have wrapped around')
        }
      }
    }
  }

  _layout(item, column, row) {
    const width = (this.bounds.width - (this.numColumns-1)*this.xPadding) / this.numColumns
    const height = (this.bounds.height - (this.numRows-1)*this.yPadding) / this.numRows
    const x = this.bounds.x + column * width + this.xPadding * column
    const y = this.bounds.y + row * height + this.yPadding * row
    if (item.layout) item.layout(x, y, width, height) // custom item layout function
    else if (this.layout) this.layout.call(item, x, y, width, height)
  }
}

// center and proportional scale to fit
GridLayout.centerAndScaleToFit = function(x, y, w, h) {
  this.width = w
  this.scale.y = this.scale.x
  if (this.height > h) {
    this.height = h
    this.scale.x = this.scale.y
  }
  this.x = x + ((this.anchor) ? this.anchor.x * this.width : 0) + this.pivot.x * this.scale.x + (w - this.width) / 2
  this.y = y + ((this.anchor) ? this.anchor.y * this.height : 0) + this.pivot.y * this.scale.y + (h - this.height) / 2
}

GridLayout.center = function(x, y, w, h) {
  GridLayout.centerX.call(this, x, y, w, h)
  GridLayout.centerY.call(this, x, y, w, h)
}

GridLayout.centerX = function(x, y, w, h) {
  this.x = x + ((this.anchor) ? this.anchor.x * this.width : 0) + this.pivot.x * this.scale.x + w / 2 - this.width / 2
}

GridLayout.centerY = function(x, y, w, h) {
  this.y = y + ((this.anchor) ? this.anchor.y * this.height : 0) + this.pivot.y * this.scale.y + h / 2 - this.height / 2
}

GridLayout.xy = function(x, y) {
  this.x = x
  this.y = y
}

export default GridLayout;
