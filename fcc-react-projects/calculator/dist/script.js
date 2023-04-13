import React from 'https://esm.sh/react@18.2.0';
import ReactDOM from 'https://esm.sh/react-dom@18.2.0';

const initState = {
  input: '',
  result: '0' };


const Display = props => {
  return /*#__PURE__*/(
    React.createElement("div", { id: "display-container" }, /*#__PURE__*/
    React.createElement("div", { id: "display-input" },
    props.data.input), /*#__PURE__*/

    React.createElement("div", { id: "display" },
    props.data.result)));



};

const Button = props => {
  return /*#__PURE__*/(
    React.createElement("div", { onClick: props.onClick,
      id: props.data.id,
      class: ["button", props.data.class].join(" ") },
    props.data.inner));


};

const Calculator = () => {
  const [data, setData] = React.useState(initState);

  const buttonsProps = [
  { id: 'clear', class: 'button-op', inner: 'AC' },
  { id: 'modulo', class: 'button-op', inner: '%' },
  { id: 'divide', class: 'button-op', inner: '/' },
  { id: 'seven', class: 'button-num', inner: '7' },
  { id: 'eight', class: 'button-num', inner: '8' },
  { id: 'nine', class: 'button-num', inner: '9' },
  { id: 'multiply', class: 'button-op', inner: 'X' },
  { id: 'four', class: 'button-num', inner: '4' },
  { id: 'five', class: 'button-num', inner: '5' },
  { id: 'six', class: 'button-num', inner: '6' },
  { id: 'subtract', class: 'button-op', inner: '-' },
  { id: 'one', class: 'button-num', inner: '1' },
  { id: 'two', class: 'button-num', inner: '2' },
  { id: 'three', class: 'button-num', inner: '3' },
  { id: 'add', class: 'button-op', inner: '+' },
  { id: 'zero', class: 'button-num', inner: '0' },
  { id: 'decimal', class: 'button-num', inner: '.' },
  { id: 'equals', class: 'button-equals', inner: '=' }];


  const handleClick = e => {
    let newInput = '';
    let newResult = '';
    if (e.target.id === 'clear') {
      setData(initState);
      return;
    }
    let dots = data.input.match(/[\d\.]+?$/);
    if (dots !== null && dots[0].includes('.') && e.target.innerText === '.')
    return;
    if (data.input === '' && e.target.innerText.match(/[-+X/%]/) !== null)
    newInput = '0';
    if (data.input.includes('=')) {
      if (e.target.id === 'equals')
      return;
      newInput = (e.target.className.includes('num') ? newInput : data.result) + e.target.innerText;
    } else
    {
      newInput += data.input === '0' && e.target.className.includes('num') ? '' : data.input;
      if (e.target.className.includes('op') && newInput.slice(-1).match(/[-+X/%]/) !== null) {
        if (e.target.innerText === '-' && newInput.slice(-1) !== '-')
        newInput += e.target.innerText;else

        newInput = newInput.replace(/\D{1,2}$/, e.target.innerText);
      } else
      newInput += e.target.innerText;
    }
    const elemArray = newInput.split(/([-+=X/%])/).filter(el => el !== '');
    newResult = [];
    for (let i = 0; i < elemArray.length; i++) {
      if (elemArray[i] === '-' && i > 0 && i !== elemArray.length - 1 &&
      ['+', 'X', '/', '%'].includes(elemArray[i - 1])) {
        newResult.push(elemArray[i] + elemArray[i + 1]);
        i++;
      } else {
        newResult.push(elemArray[i]);
      }
    }
    if (e.target.id === 'equals') {
      newResult = calculateResult(newResult);
      newInput += newResult;
    } else
    newResult = newResult[newResult.length - 1];

    setData({ input: newInput, result: newResult });
  };

  const calculateResult = elemArray => {
    elemArray = elemArray.slice(0, -1).map(el => isNaN(Number(el)) ? el : Number(el));
    let i = 0;
    while (i < elemArray.length) {
      switch (elemArray[i]) {
        case 'X':
          elemArray[i + 1] = elemArray[i - 1] * elemArray[i + 1];
          elemArray[i - 1] = null;
          elemArray[i] = null;
          break;
        case '/':
          elemArray[i + 1] = elemArray[i - 1] / elemArray[i + 1];
          elemArray[i - 1] = null;
          elemArray[i] = null;
          break;
        case '%':
          elemArray[i + 1] = elemArray[i - 1] % elemArray[i + 1];
          elemArray[i - 1] = null;
          elemArray[i] = null;
          break;}

      i++;
    }
    elemArray = elemArray.filter(el => el !== null);
    i = 0;
    while (i < elemArray.length) {
      switch (elemArray[i]) {
        case '-':
          elemArray[i + 1] = elemArray[i - 1] - elemArray[i + 1];
          elemArray[i - 1] = null;
          elemArray[i] = null;
          break;
        case '+':
          elemArray[i + 1] = elemArray[i - 1] + elemArray[i + 1];
          elemArray[i - 1] = null;
          elemArray[i] = null;
          break;}

      i++;
    }
    return elemArray[elemArray.length - 1];
  };

  const Buttons = buttonsProps.map(props => /*#__PURE__*/React.createElement(Button, { data: props, onClick: handleClick }));

  return /*#__PURE__*/(
    React.createElement("div", { id: "calculator" }, /*#__PURE__*/
    React.createElement(Display, { data: data }), /*#__PURE__*/
    React.createElement("div", { id: "buttons-container" },
    Buttons)));



};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( /*#__PURE__*/
React.createElement(React.StrictMode, null, /*#__PURE__*/
React.createElement(Calculator, null)));