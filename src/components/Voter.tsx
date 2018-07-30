import React, { SFC } from 'react';
import {compose, withHandlers, pure, lifecycle} from 'recompose';
import {withFirestore} from '../utils/utils';
import {connect} from "react-redux";
import {AnchorButton} from "@blueprintjs/core";
import './Voter.css';

interface VoterProps {
    onVoteUpClick: any,
    onVoteDownClick: any,
    onVoteUnsetClick: any,
    voteStatus: number,
    postId: string,
    authenticatedUserId: string
}

const Voter: SFC<VoterProps> = (props) => {
    return <div>
        {(() => {
            switch (props.voteStatus) {
                case 1:
                    return <div className='voterContainer'>
                        <AnchorButton icon="symbol-triangle-up" minimal={true} color="#DB3737" small={true}
                                      className="votedUp"
                                      onClick={props.onVoteUnsetClick}/>
                        <AnchorButton icon="symbol-triangle-down" minimal={true} small={true} className="disabledVote"
                                      onClick={props.onVoteDownClick}/>
                    </div>;
                case -1:
                    return <div className='voterContainer'>
                        <AnchorButton icon="symbol-triangle-up" minimal={true} small={true} className="disabledVote"
                                      onClick={props.onVoteUpClick}/>
                        <AnchorButton icon="symbol-triangle-down" minimal={true} small={true} className="votedDown"
                                      onClick={props.onVoteUnsetClick}/>
                    </div>;
                default:
                    return <div className='voterContainer'>
                        <AnchorButton icon="symbol-triangle-up" minimal={true} small={true} className="unsetVote"
                                      onClick={props.onVoteUpClick}/>
                        <AnchorButton icon="symbol-triangle-down" minimal={true} small={true} className="unsetVote"
                                      onClick={props.onVoteDownClick}/>
                    </div>;
            }
        })()}
    </div>
};

const listenerSettings = {
    collection: 'userVotes',
};

const enhance = compose(
    withFirestore,
    withHandlers({
        onVoteUpClick: props => () => {
            return props['firestore'].set({collection: 'userVotes', doc: props['authenticatedUserId']}, {
                [props['postId']]: 1
            }, { merge: true })
        },
        onVoteDownClick: props => () => {
            return props['firestore'].set({collection: 'userVotes', doc: props['authenticatedUserId']}, {
                [props['postId']]: -1
            },  { merge: true })
        },
        onVoteUnsetClick: props => () => {
            return props['firestore'].set({collection: 'userVotes', doc: props['authenticatedUserId']}, {
                [props['postId']]: 0
            }, { merge: true })
        },
        loadData: props => (error : any) => props['firestore'].setListener(listenerSettings),
    }),
    // Run functionality on component lifecycle
    lifecycle({
        componentWillMount() {
            //@ts-ignore
            this.props.loadData();
        },
        componentWillUnmount() {
            this.props['firestore'].unsetListener(listenerSettings)
        }
    }),
    // Prevent unnecessary re-renders by doing shallow comparison of props
    pure,
    connect(({firestore, firebase: { auth }} : {[key: string]: any }, props) => ({ // state.firestore
        authenticatedUserId: auth.uid,
        votes: firestore.data.userVotes,
        voteStatus: firestore.data.userVotes &&  firestore.data.userVotes[props['authenticatedUserId']] && firestore.data.userVotes[props['authenticatedUserId']][props['postId']]
    }))
);

export default enhance(Voter);