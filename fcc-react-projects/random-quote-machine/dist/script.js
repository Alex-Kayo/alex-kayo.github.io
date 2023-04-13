function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}class QuoteGenerator extends React.Component {
  constructor(props) {
    super(props);_defineProperty(this, "generateQuote",











    async () => {
      const url = 'https://api.api-ninjas.com/v1/quotes';
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('X-Api-Key', 'OoII3HXN/vlvuawVTmA3Pg==ci81hDMAoU7zqAWO');
      const fetchQuote = fetch(url, {
        method: 'GET',
        headers: headers });


      try {
        const response = await fetchQuote;
        if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);

        const data = (await response.json())[0];

        this.setState({
          quote: data.quote,
          author: '- ' + data.author });

      } catch (e) {
        console.log(e);
      }
    });_defineProperty(this, "tweetIt",

    e => {
      e.preventDefault();

      const text = `"${this.state.quote}" ${this.state.author}`;
      const hashtags = 'quotes';
      const related = 'freecodecamp';
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent(hashtags)}&related=${encodeURIComponent(related)}`;

      window.open(twitterUrl, '_top');
    });this.state = { quote: '', author: '' };this.tweetIt = this.tweetIt.bind(this);this.generateQuote();}

  render() {
    const text = `"${this.state.quote}" ${this.state.author}`;
    const hashtags = 'quotes';
    const related = 'freecodecamp';
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent(hashtags)}&related=${encodeURIComponent(related)}`;

    return /*#__PURE__*/(
      React.createElement("div", { id: "quote-box",
        class: "flex flex-col items-center flex-wrap bg-white p-6 rounded" }, /*#__PURE__*/



      React.createElement("div", { id: "text",
        class: "w-full h-1/2 font-serif" }, /*#__PURE__*/

      React.createElement("i", { class: "fas fa-angle-double-left" }), " ", this.state.quote, " ", /*#__PURE__*/React.createElement("i", { class: "fas fa-angle-double-right" })), /*#__PURE__*/

      React.createElement("div", { id: "author",
        class: "flex justify-end w-full mt-auto font-mono" },



      this.state.author), /*#__PURE__*/

      React.createElement("div", { id: "buttons",
        class: "flex justify-between w-full mt-3" }, /*#__PURE__*/


      React.createElement("a", { id: "tweet-quote",
        class: "bg-blue-900 text-white rounded",

        href: twitterUrl,
        title: "Tweet this quote!", target: "_top" }, /*#__PURE__*/
      React.createElement("i", { class: "fab fa-twitter mx-1", "aria-hidden": "true" })), /*#__PURE__*/

      React.createElement("button", { id: "new-quote",
        class: "bg-blue-900 text-white rounded",

        onClick: this.generateQuote,
        title: "Get new quote!" }, /*#__PURE__*/
      React.createElement("i", { class: "fas fa-redo-alt mx-1" })))));




  }}


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render( /*#__PURE__*/React.createElement(QuoteGenerator, null));