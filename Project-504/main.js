function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}class App extends React.Component {
    constructor() {
      super();_defineProperty(this, "calculateOperations",
  
  
  
  
  
      () => {
        let result = [...this.state.displayText];
        result = eval(result.join(""));
        result = result.toString();
        let newArray = [];
        newArray.push(result);
        this.setState({
          displayText: newArray });
  
      });_defineProperty(this, "clickHandler",
      e => {
        let clickedValue = e.target.getAttribute("data-value");
        let newDisplayText = [...this.state.displayText];
        switch (clickedValue) {
          case "equal":
            this.calculateOperations();
            break;
          case "clear":
            this.setState({
              displayText: ["0"] });
  
            break;
          case "-":
            if (newDisplayText[newDisplayText.length - 1] == "+" || newDisplayText[newDisplayText.length - 1] == "*" ||
            newDisplayText[newDisplayText.length - 1] == "-" || newDisplayText[newDisplayText.length - 1] == "/") {
              this.setState({
                op: newDisplayText[newDisplayText.length - 1] });
  
              newDisplayText.pop();
              newDisplayText.push(clickedValue);
  
              this.setState({
                displayText: newDisplayText });
  
            } else {
              newDisplayText.push(clickedValue);
              this.setState({
                displayText: newDisplayText });
  
            }
            break;
  
          case "+":
          case "*":
          case "/":
  
            if (newDisplayText[newDisplayText.length - 1] == "+" || newDisplayText[newDisplayText.length - 1] == "*" ||
            newDisplayText[newDisplayText.length - 1] == "-" || newDisplayText[newDisplayText.length - 1] == "/") {
              newDisplayText.pop();
              newDisplayText.push(clickedValue);
  
              this.setState({
                displayText: newDisplayText });
  
            } else {
              newDisplayText.push(clickedValue);
              this.setState({
                displayText: newDisplayText });
  
            }
            break;
          case ".":
            if (newDisplayText.includes(".")) {
              //split the array at . & check the last section:
              let displayString = newDisplayText.join();
              let cutArray = displayString.split(".");
              let lastOne = cutArray[cutArray.length - 1];
              if (lastOne.includes("+") || lastOne.includes("-") || lastOne.includes("*") || lastOne.includes("/")) {
                newDisplayText.push(clickedValue);
                this.setState({
                  displayText: newDisplayText });
              } else {
                return;
              }
            } else {
              newDisplayText.push(clickedValue);
              this.setState({
                displayText: newDisplayText });
            }
            break;
  
          default:
            if (newDisplayText[0] === "0") {
              newDisplayText.pop();
              if (clickedValue !== "0") {
                newDisplayText.push(clickedValue);
                this.setState({
                  displayText: newDisplayText });
  
              } else {
                return;
              }
  
            } else {
              if (newDisplayText[newDisplayText.length - 1] === "-" &&
              this.state.op !== null) {
                newDisplayText.pop();
                newDisplayText.push(this.state.op);
                newDisplayText.push("-");
                newDisplayText.push(clickedValue);
                this.setState({
                  displayText: newDisplayText,
                  op: "" });
  
              } else {
                newDisplayText.push(clickedValue);
                this.setState({
                  displayText: newDisplayText });
  
              }
              break;
            }}
  
      });this.state = { displayText: ["0"], op: "" };}
    render() {
      return /*#__PURE__*/(
        React.createElement("div", { className: "container" }, /*#__PURE__*/
        React.createElement(Display, { id: "display", displayText: this.state.displayText }), /*#__PURE__*/
        React.createElement(Button, { label: "1", id: "one", value: "1", clicked: this.clickHandler }), /*#__PURE__*/
        React.createElement(Button, { label: "2", id: "two", value: "2", clicked: this.clickHandler }), /*#__PURE__*/
        React.createElement(Button, { label: "3", id: "three", value: "3", clicked: this.clickHandler }), /*#__PURE__*/
        React.createElement(Button, { label: "4", id: "four", value: "4", clicked: this.clickHandler }), /*#__PURE__*/
        React.createElement(Button, { label: "5", id: "five", value: "5", clicked: this.clickHandler }), /*#__PURE__*/
        React.createElement(Button, { label: "6", id: "six", value: "6", clicked: this.clickHandler }), /*#__PURE__*/
        React.createElement(Button, { label: "7", id: "seven", value: "7", clicked: this.clickHandler }), /*#__PURE__*/
        React.createElement(Button, { label: "8", id: "eight", value: "8", clicked: this.clickHandler }), /*#__PURE__*/
        React.createElement(Button, { label: "9", id: "nine", value: "9", clicked: this.clickHandler }), /*#__PURE__*/
        React.createElement(Button, { label: "0", id: "zero", value: "0", clicked: this.clickHandler }), /*#__PURE__*/
        React.createElement(Button, { label: "=", id: "equals", value: "equal", clicked: this.clickHandler }), /*#__PURE__*/
        React.createElement(Button, { label: "+", id: "add", value: "+", clicked: this.clickHandler }), /*#__PURE__*/
        React.createElement(Button, { label: "-", id: "subtract", value: "-", clicked: this.clickHandler }), /*#__PURE__*/
        React.createElement(Button, { label: "X", id: "multiply", value: "*", clicked: this.clickHandler }), /*#__PURE__*/
        React.createElement(Button, { label: "/", id: "divide", value: "/", clicked: this.clickHandler }), /*#__PURE__*/
        React.createElement(Button, { label: ".", id: "decimal", value: ".", clicked: this.clickHandler }), /*#__PURE__*/
        React.createElement(Button, { label: "C", id: "clear", value: "clear", clicked: this.clickHandler })));
  
  
    }}
  
  
  const Display = (props) => /*#__PURE__*/
  React.createElement("div", { id: props.id, className: "display" }, props.displayText);
  
  
  const Button = (props) => /*#__PURE__*/
  React.createElement("button", { id: props.id, className: "button", "data-value": props.value, onClick: props.clicked }, props.label);
  
  
  ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("app"));