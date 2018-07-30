// ------------------------------------
// Constants
// ------------------------------------
export const AUTH_CHANGE = 'AUTH_CHANGE';
export const AUTH_ERROR = 'AUTH_ERROR';

// ------------------------------------
// Actions
// ------------------------------------
// export function authChange(auth = '') {
export function authChange(auth) {
    return {
        type: AUTH_CHANGE,
        payload: auth
    }
}

// ------------------------------------
// Specialized Action Creator
// ------------------------------------
export const updateAuth = ({dispatch}) => {
    return nextAuth => dispatch(authChange(nextAuth))
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = null;
export default function authReducer(state = initialState, action) {
    return action.type === AUTH_CHANGE ? action.payload : state
};

