import * as React from 'react';
import {Provider} from 'react-redux';
import configureStore from '../store/store';
import './App.css';
import Posts from '../components/PostListing';
import Header from '../components/AppHeader';
import PostDetail from "./PostDetail";
import {HashRouter, Route, Switch} from "react-router-dom";
//@ts-ignore
const initialState = window.__INITIAL_STATE__ || {firebase: {authError: null}};
const store = configureStore(initialState);

class App extends React.Component {
    public render() {
        return (
                <Provider store={store}>
            <div className="app">
                        <Header/>
                        <div className='appContainer'>
                        <HashRouter>
                          <Switch>
                            <Route exact path="/" component={ Posts }/>
                            <Route path="/post/:postId" component={ PostDetail} />
                          </Switch>
                          </HashRouter>
                        </div>
                    </div>
                </Provider>
        );
    }
}

export default App;