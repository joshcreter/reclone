import React, { SFC } from 'react';
import {compose, flattenProp, pure} from 'recompose'
import Voter from './Voter';
import './Post.css';
import { Link } from 'react-router-dom';

const Post = (props) => {
    return <div className='postContainer'>
        <Voter postId={props.id} authenticatedUserId={props.authenticatedUserId}/>
        <Link className='postBody' to={`/post/${props.id}`}>{props.title}</Link>
    </div>
};

const enhance = compose(
    flattenProp('post'),
    pure
);

export default enhance(Post);


// import React, { SFC } from 'react';
// import {compose, flattenProp, withHandlers, pure} from 'recompose'
// import {withFirestore} from '../utils/utils';
// import Voter from './Voter';
// import './Post.css';
//
// interface PostProps {
//     title: string,
//     id: string,
//     authenticatedUserId: string
// }
//
// const Post: SFC<PostProps> = (props) => {
//     return <div className='postContainer'>
//         <Voter PostId={props.id} authenticatedUserId={props.authenticatedUserId}/>
//         <div className='postBody'>{props.title}</div>
//     </div>
// };
//
// const enhance = compose(
//     // Add props.firestore
//     withFirestore,
//     flattenProp('post'),
//     // Handlers as props
//     withHandlers({}),
//     // Prevent unnessesary re-renders by doing shallow comparison of props
//     pure
// );
//
// export default enhance(Post);
