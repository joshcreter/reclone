import './PostDetail.css';
import React from 'react';
import {compose, withHandlers, pure, lifecycle} from 'recompose'
import {withFirestore} from '../utils/utils';
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import "./PostDetail.css";
import {Button} from "@blueprintjs/core";

const PostDetail = ({match, title, topComment}) => (
    <div className='postDetailContainer'>
        <div className='postDetailTitle'>
            {title}
        </div>
        <div className='postDetailTopComment'>
            {topComment}
        </div>
        <div className='postDetailBackButtonContainer'>
            <Link to={`/`}><Button icon="arrow-left" large={true}>go back</Button></Link>
        </div>
    </div>
);

const listenerSettings = {
    collection: 'webdev',
    limit: 100,
    orderBy: ['created', 'desc'],
};

const enhance = compose(
    withFirestore,
    withHandlers({
        loadData: (props) => err => props.firestore.setListener(listenerSettings),
    }),
    lifecycle({
        componentWillMount() {
            this.props.loadData();
        },
        componentWillUnmount() {
            this.props.firestore.unsetListener(listenerSettings)
        },
    }),
    pure,
    connect(({firestore}, match) => ({ // state.firestore
        title: firestore.data.webdev && firestore.data.webdev[match.match.params.postId]['title'],
        topComment: firestore.data.webdev && firestore.data.webdev[match.match.params.postId]['topComment']
    }))
);

export default enhance(PostDetail);
