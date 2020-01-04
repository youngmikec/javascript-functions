const esprima = require("esprima");
const gameoflife = require("../js/gameoflife.js");

describe("Conway's Game of Life", () => {
  describe("Seed function", () => {
    it("Should add a `seed` function. @seed-function", () => {
      assert(
        gameoflife.seed,
        "Have you created and exported a `seed` function?"
      );

      assert(gameoflife.seed &&
        Array.isArray(gameoflife.seed([1, 2], [5, 6])) &&
          gameoflife.seed([1, 2], [5, 6]).length === 2,
        "Have you converted `arguments` to a real array?"
      );

    });
  });

  describe("Same function", () => {
    it("Should have a `same` function. @same-function", () => {
      assert(
        gameoflife.same,
        "Have you created and exported a `same` function?"
      );

      var sameNode;
      esprima.parseModule(source, {}, function(node) {
        if (node.id && node.id.name === "same") {
          sameNode = node;
        }
      });
      assert(sameNode.params.length === 2, "Have you created a `same` function with two arguments?");

      assert(gameoflife.same && 
        gameoflife.same([1, 2], [1, 2]),
        "Have you created a `same` function that returns true if the two point parameters are the same?"
      );
      assert(gameoflife.same &&
        !gameoflife.same([1, 2], [5, 2]),
        "Have you created a `same` function that returns false if the two point parameters are not the same?"
      );

    });
  });

  describe("Contains function", () => {
    it("Should have a `contains` function. @contains-function", () => {
      assert(
        gameoflife.contains,
        "Have you created and exported a `contains` function?"
      );

      const boundContains = (gameoflife.contains || (() =>{})).bind([
        [1, 2],
        [3, 4],
        [4, 4]
      ]);
      assert(gameoflife.contains && 
        boundContains([1, 2]) && boundContains([3, 4]) && boundContains([4, 4]),
        "Have you implemented a check that the passed cell is in the passed game state?"
      );
      assert(gameoflife.contains &&
        !(
          boundContains([5, 6]) ||
          boundContains([2, 1]) ||
          boundContains([3, 3])
        ),
        "Have you implemented a check that the passed cell is in the passed game state?"
      );
    });

  });

  describe("Sum function", () => {
    it("Should have a `sum` function. @sum-function", () => {
      assert(gameoflife.sum, "Have you created and exported a `sum` function?");

      assert(gameoflife.sum && gameoflife.same &&
        gameoflife.same(gameoflife.sum([1, 2], [5, 7]), [6, 9]),
        "Have you implemented a sum function that adds two cells?"
      );
      assert(gameoflife.sum && gameoflife.same &&
        gameoflife.same(gameoflife.sum([-1, 2], [5, -7]), [4, -5]),
        "Have you implemented a sum function that handles negative coordinates?"
      );

      var sumNode;
      esprima.parseModule(source, {}, function(node) {
        if (node.type === "VariableDeclarator" && node.id.name === "sum") {
          sumNode = node;
        }
      });
      assert(sumNode, "Have you implemented an arrow function named `sum`?");
      assert(sumNode &&
        sumNode.init.type === "ArrowFunctionExpression",
        "Have you implemented an arrow function named `sum`?"
      );
      assert(sumNode &&
        sumNode.init.body.type === "ArrayExpression",
        "Have you implemented an arrow function named `sum`?"
      );

    });
  });

  describe("Printing a cell", () => {
    it("Should have a printCell function. @printCell-function", () => {
      assert(
        gameoflife.printCell,
        "Have you created and exported a `printCell` function?");

      assert(gameoflife.printCell && gameoflife.printCell([1,1], [[1,1], [2,2]]) == "\u25A3", "Have you returned '\u25A3' for living cells?");
      assert(gameoflife.printCell && gameoflife.printCell([1,2], [[1,1], [2,2]]) == "\u25A2", "Have you returned '\u25A2' for non-living cells?");

    });
  });

  describe("Finding the corners", () => {
    var corners;
    before(()=>{
      corners = gameoflife.corners([
        [2, 3],
        [2, 1],
        [4, 3],
        [1, 1],
        [2, 1],
        [3, 1]
      ]);
    });

    it("Should have a corners function. @corners-function", () => {
      assert(
        gameoflife.corners,
        "Have you created and exported a `printCell` function?");
        
      const zeroCorners = (gameoflife.corners || (() => {}))();
      assert(gameoflife.same && gameoflife.corners && gameoflife.same(zeroCorners.topRight, [0,0]), "Have you ensured that topRight is [0,0] if there are no living cells?");
      assert(gameoflife.same && gameoflife.corners && gameoflife.same(zeroCorners.bottomLeft, [0,0]), "Have you ensured that botomLeft is [0,0] if there are no living cells?");

      assert(gameoflife.corners && corners.topRight, "");
      assert(gameoflife.corners && Array.isArray(corners.topRight), "");
      assert(gameoflife.corners && corners.topRight.length === 2, "");

      assert(gameoflife.same && gameoflife.corners &&
        gameoflife.same(corners.topRight, [4, 3]),
        "Have you implemented a corners function that returns the correct top right coordinate?"
      );

      assert(gameoflife.corners && corners.bottomLeft, "");
      assert(gameoflife.corners && Array.isArray(corners.bottomLeft), "");
      assert(gameoflife.corners && corners.bottomLeft.length === 2, "");
      
      assert(gameoflife.same && gameoflife.corners &&
        gameoflife.same(corners.bottomLeft, [1, 1]),
        "Have you implemented a corners function that returns the correct bottom left coordinate?"
      );

      var cornersNode;
      esprima.parseModule(source, {}, function(node) {
        if ((node.type === "VariableDeclarator" || node.type === "FunctionDeclaration") && node.id && node.id.name === "corners") {
          cornersNode = node;
        }
      });
      assert((typeof cornersNode != "undefined") && (cornersNode.params || cornersNode.init.params)[0].type == 'AssignmentPattern', "Have you provided a default value for the 'corners' function parameter?");
    });

  });
  
  describe("Printing the game state", () => {
    it("Should have a printCells function. @printCells-function", () => {
      assert(
        gameoflife.printCells,
        "Have you created and exported a `printCells` function?");
      
      assert(typeof gameoflife.printCells([[3,2]]) == "string", "Have you created a 'printCells' function that returns a string representation of the game state?");
      assert(gameoflife.printCells([[3,2]]) == '▣\n', "Have you created a 'printCells' function that prints '▣' for each living cell, '▢' for each non-living cell and a newline character at the end of each row?");
      assert(gameoflife.printCells([[3,2], [5,2]]) == '▣ ▢ ▣\n', "Have you created a 'printCells' function that prints '▣' for each living cell, '▢' for each non-living cell, a space in between each cell and a newline character at the end of each row?");
      assert(gameoflife.printCells([[3,2],[2,3],[3,3],[3,4],[4,4]]) == '▢ ▣ ▣\n▣ ▣ ▢\n▢ ▣ ▢\n');
    });
    
  });


  // describe('Calculating the next state', ()=>{
  //   var start, next;
  //   before(()=>{
  //     start = gameoflife.seed([3,2], [2,3],[3,3],[3,4],[4,4]);
  //     next = gameoflife.calculateNext(start);
  //   });

  //   it('should calculate the correct next state. @calculateNext-correct-next-state', ()=>{
  //     // todo
  //   });
  // });
});
