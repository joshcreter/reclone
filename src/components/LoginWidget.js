import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {firebaseConnect, isLoaded, isEmpty} from 'react-redux-firebase'
import {AnchorButton} from "@blueprintjs/core";
import {handleLogin, handleLogout} from "../utils/authentication";
import {withHandlers} from "recompose";
import {withFirestore} from "../utils/utils";
import './LoginWidget.css';

export const LoginWidget = ({firestore, firebase, auth, onLoginClick, onLogoutClick}) => (
    <div className='LoginWidgetContainer'>
        {(() => {
            if (isLoaded(auth)) {
                if(isEmpty(auth)){
                    handleLogin(firestore, firebase);
                    return <div>Setting things up...</div>
                }
                else {
                    if (auth.isAnonymous) {
                        return <div><AnchorButton onClick={onLoginClick} rightIcon='log-in'>Login</AnchorButton></div>
                    }
                    else {
                        return <div className='LoginWidgetSubContainer'>
                            <div className='LoginWidgetDisplayName'>
                            {auth['displayName']}
                            </div>
                            <div>
                            <AnchorButton onClick={onLogoutClick} rightIcon='log-out'>Log out</AnchorButton>
                            </div>
                        </div>
                    }
                }
            }
            else {
                return <div>Authenticating...</div>
            }
        })()}
    </div>
);

LoginWidget.propTypes = {
    firebase: PropTypes.shape({
        login: PropTypes.func.isRequired,
                logout: PropTypes.func.isRequired

    }),
    auth: PropTypes.object
};

export default compose(
    withFirestore,
    firebaseConnect(),
     withHandlers({
         onLoginClick: props => () => {
             handleLogin(props.firestore, props.firebase);
         },
        onLogoutClick: props => () => {
            handleLogout(props.firebase);
        },
    }),
    connect(({firestore, firebase: {auth}}) => ({auth}))
)(LoginWidget);