class QuoteGenerator extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      quote: '',
      author: ''
    }
    
    this.tweetIt = this.tweetIt.bind(this);
    
    this.generateQuote();
  }
  
  generateQuote = async () => {
    const url = 'https://api.api-ninjas.com/v1/quotes';
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('X-Api-Key', 'OoII3HXN/vlvuawVTmA3Pg==ci81hDMAoU7zqAWO');
    const fetchQuote = fetch(url, {
      method: 'GET',
      headers: headers
    });
    
    try {
      const response = await fetchQuote;
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      
      const data = (await response.json())[0];
      
      this.setState({
        quote: data.quote,
        author: '- ' + data.author
      });
    } catch (e) {
      console.log(e);
    }
  }
  
  tweetIt = (e) => {
    e.preventDefault();
    
    const text = `"${this.state.quote}" ${this.state.author}`;
    const url = 'https://codepen.io/3Kayo/pen/ZEMZrmm';
    const hashtags = 'quotes';
    const related = 'freecodecamp';
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent(hashtags)}&related=${encodeURIComponent(related)}`;

    window.open(twitterUrl, '_top');
  }
  
  render() {
    const text = `"${this.state.quote}" ${this.state.author}`;
    const url = 'https://codepen.io/3Kayo/pen/ZEMZrmm';
    const hashtags = 'quotes';
    const related = 'freecodecamp';
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent(hashtags)}&related=${encodeURIComponent(related)}`;
    
    return(
      <div id="quote-box"
       className="flex flex-col items-center flex-wrap
              bg-white
              p-6
              rounded">
        <div id="text"
          className="w-full h-1/2
                 font-serif">
            <i className="fas fa-angle-double-left"></i> {this.state.quote} <i className="fas fa-angle-double-right"></i>
          </div>
        <div id="author"
          className="flex justify-end
                 w-full
                 mt-auto
                 font-mono">
          {this.state.author}
        </div>
        <div id="buttons"
          className="flex justify-between
                 w-full
                   mt-3">
          <a id="tweet-quote"
            className="bg-blue-900 text-white
                   rounded"
            href={twitterUrl}
            title="Tweet this quote!" target="_top">
            <i className="fab fa-twitter mx-1" aria-hidden="true"></i>
          </a>
          <button id="new-quote"
            className="bg-blue-900 text-white
                   rounded"
            onClick={this.generateQuote}
            title="Get new quote!">
            <i className="fas fa-redo-alt mx-1"></i>
          </button>
        </div>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<QuoteGenerator />);