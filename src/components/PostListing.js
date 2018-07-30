import {withFirestore} from '../utils/utils';
import Post from '../components/Post';
import PropTypes from 'prop-types';
import * as React from 'react';
import {connect} from 'react-redux';
import {lifecycle, withHandlers} from 'recompose';
import {compose} from 'redux';
import './PostListing.css';

const PostListing = ({posts, authenticatedUserId}) => (
    <div className='postListingContainer'>
        {
            posts === undefined
                ? <span>Loading</span>
                : !posts.length
                ? <span>No posts found</span>
                :
                posts.map((post, i) => (
                    <Post
                        key={`${posts.id}-${i}`}
                        post={post}
                        postId={`${posts.id}`}
                        authenticatedUserId={authenticatedUserId}
                    />
                ))
        }
    </div>
)

PostListing.propTypes = {
    posts: PropTypes.array,
    store: PropTypes.shape({
        firestore: PropTypes.object
    }),
}

const listenerSettings = {
    collection: 'webdev',
    limit: 100,
    orderBy: ['created', 'desc'],
}

const enhance = compose(
    withFirestore,
    withHandlers({
        loadData: props => err => props.firestore.setListener(listenerSettings),
    }),
    lifecycle({
        componentWillMount() {
            this.props.loadData();

        },
        componentWillUnmount() {
            this.props.firestore.unsetListener(listenerSettings)
        }
    }),
    connect(({firestore, firebase: {auth}}) => ({ // state.firestore
        posts: firestore.ordered.webdev, // document data in array
        authenticatedUserId: auth.uid,
    }))
);

export default enhance(PostListing)