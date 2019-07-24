import { h, app } from 'hyperapp';
import { Http } from 'hyperapp-fx';
import hyperappLogo from '../public/hyperapp-2-logo-sign.svg';

// NOTE: Once the package is published, it would be imported with
// import { preventDefault } from '@hyperapp/events';
const preventDefault = [
  function(_, props, event) {
    if (props == null || props === true) event.preventDefault();
  }
];

function fetchPostList(search) {
  return Http({
    url: `https://codingthat-quick-json-back-end-2.glitch.me/posts?q=${search}`,
    action: (state, responseData) => ({
      ...state,
      posts: responseData,
      isLoading: false
    })
  });
}

function getTargetValue(event) {
  return event.target.value;
}

function inputChange(state, search) {
  return { ...state, search };
}

function formSubmit(state) {
  return [
    { ...state, isLoading: true },
    preventDefault,
    fetchPostList(state.search)
  ];
}

function init() {
  return [
    {
      isLoading: true,
      search: 'engineering',
      posts: []
    },
    fetchPostList('engineering')
  ];
}

const PostList = props => (
  <div className="post-list">
    {props.posts.map(post => (
      <a className="post-list-item" href={post.url}>
        {post.title}
      </a>
    ))}
  </div>
);

app({
  init,
  view: state => (
    <div className="layout">
      <header className="app-header">
        <div className="layout-container">
          <div className="app-header-content">
            <div className="header-image">
              <img src={hyperappLogo} />
            </div>

            <form
              className="search-form"
              noValidate={true}
              onSubmit={formSubmit}
            >
              <input
                type="text"
                className="search-input"
                value={state.search}
                oninput={[inputChange, getTargetValue]}
              />

              <button type="submit" className="search-btn">
                Search
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="layout-container">
        <article className="app-main">
          {state.isLoading ? (
            <div className="list-loader">
              <div className="spinner" />
            </div>
          ) : (
            <PostList posts={state.posts} />
          )}
        </article>

        <footer className="app-footer">
          Made with ❤️and{' '}
          <a href="https://github.com/jorgebucaran/hyperapp">hyperapp</a>
        </footer>
      </div>
    </div>
  ),
  node: document.getElementById('app')
});
