
import React from 'https://esm.sh/react@18.2.0';
import ReactDOM from 'https://esm.sh/react-dom@18.2.0';
import { Provider, connect } from 'https://esm.sh/react-redux@8.0.5';

//

marked.setOptions({
  breaks: true
});

//Redux Part

const initText = `# Welcome!
## This is my markdown previewer!

Feel free to visit my **[Codepen profile!](https://codepen.io/3Kayo)**

I'm quite enjoying coding with \`React + Redux\` in this project :)

\`\`\`
// Wonder what this is?

for (let i = 1; i <= 100; i++) {
  if (i % 3 === 0 && i % 5 === 0) {
    console.log("FizzBuzz");
  } else if (i % 3 === 0) {
    console.log("Fizz");
  } else if (i % 5 === 0) {
    console.log("Buzz");
  } else {
    console.log(i);
  }
}
\`\`\`

Reasons to write this:
1. It's cool practice.
1. It's fun!
1. Why not?

>Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.

**- Richard Feynmann**

![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)`;

const initState = {text: initText};
const CHANGE = 'CHANGE';
const actionChange = (text) => ({type: CHANGE, text});

const mapStateToProps = (state) => {
  return {
    text: state.text,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    actionChange: (text) => dispatch(actionChange(text)),
  };
};

const actionReducer = (state = initState, action) => {
  switch(action.type) {
    case CHANGE:
      return {text: action.text};
    default:
      return state;
  }
}

const store = Redux.createStore(actionReducer);

// React Part

class EditorComponent extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      containerId: 'editorContainer',
      toolbar: {
        text: 'Editor'
      }
    }
    
    this.props.customizeContainer(this.state);
    
    this.handleTextChange = this.handleTextChange.bind(this);
  }
  
  handleTextChange(event) {
    this.props.actionChange(event.target.value);
    this.setState({});
  }
  
  render() {
    return (
    <textarea id="editor" value={this.props.text} onChange={this.handleTextChange}>
    </textarea>
    );
  }
}

const ConnectedEditorComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorComponent);

/*
*/

class PreviewComponent extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      containerId: 'previewContainer',
      toolbar: {
        text: 'Previewer'
      }
    }
    
    this.props.customizeContainer(this.state);
  }
  
  render() {
    let innerHTML = marked.parse(this.props.text.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,""));
    
    return (
    <div id="preview" dangerouslySetInnerHTML={{ __html: innerHTML }}>
    </div>
    );
  }
}

const ConnectedPreviewComponent = connect(
  mapStateToProps
)(PreviewComponent);

/*
*/

class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      containerClass: '',
      toolbar: {
        text: ''
      }
    };
  }
  
  render() {
    let Content = this.props.data;
    let customizeContainer = (props) => {
      this.setState({
      containerId: props.containerId,
      toolbar: {
        text: props.toolbar.text
      }
    })
    };
    
    return (
      <div id={this.state.containerId}>
        <div className="toolbar">
          {this.state.toolbar.text}
        </div>
        <Content customizeContainer={customizeContainer} />
      </div>
    );
  }
}

const App = () => {
  return(
    <React.Fragment>
      <AppContainer data={ConnectedEditorComponent} />
      <AppContainer data={ConnectedPreviewComponent} />
    </React.Fragment>
  );
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);