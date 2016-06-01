# Phaser Grid Layout

```
@example
    const gl = new GridLayout(this.game, bounds, {
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
```
   
