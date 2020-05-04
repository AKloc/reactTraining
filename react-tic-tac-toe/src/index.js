import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

/*
class Square extends React.Component {
  render() {
    return (
      // COMMON MISTAKE: onClick={alert('click')} wouldn't get assigned
      // properly and would be called on every render. Use the ()s.
      <button className="square" onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}
*/

// Defining the above using a function component instead of classes.
// Don't need to use "this.whatever" here, I guess? Also note that there
// aren't any parens when setting the onClick method on LHS or RHS.
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  // In JavaScript, always have to call "super" when defining the
  // constructor of a subclass (this is a subclass of React.Component).
  // React components with a constuctor should call super(props).
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }

  handleClick(i) {
    // .slice() with no parameters creates a copy of squares instead of
    // modifying the existing array. Why? Immutability.
    // 1: Avoiding direct data mutation lets us record histories
    // 2: Easier to detect changes. Don't have to scan each property
    //   to look for changes.
    // 3: MAIN BENEFIT: Lets you build PURE COMPONENTS in React -> FASTER.
    //   Immutable data is easy to detect changes which makes React
    //   faster.
    const squares = this.state.squares.slice();

    // Did someone already win the game? Is the square already filled?
    // If so, do nothing.
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    // If it's X's turn, show an X, otherwise show an O.
    squares[i] = this.state.xIsNext ? "X" : "O";

    // Why not just save the values directly and skip setstate?
    // Because setState queues changes and tells React to only re-render
    // This component and its children. It's the primary way to update
    // UIs in React.
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      // The below is going to pass TWO values to Square's constructor.
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status; // equivalent to var, but scope blocked. var is always global.
    // null is truthy.
    if (winner) {
      status = "Winner: " + winner;
    } else {
      // Not sure why the parens are needed below, but they are. NBD.
      const status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  // for each winning combination...
  for (let i = 0; i < lines.length; i++) {
    // set a, b, c equal to the three numbers in each winning combination...
    const [a, b, c] = lines[i];
    // this looks weird but it's checking for nulls. null is an object in
    // javascript that is falsy.
    // So - this is saying if A isn't null, and it's the same as b, and
    // it's the same as C, send back the winning O or X.
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  // No winner. Return nothing.
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
