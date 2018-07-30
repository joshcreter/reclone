import * as React from 'react';
import './AppHeader.css';
import LoginButton from './LoginWidget';

class AppHeader extends React.Component {
    public render() {
        return (
            <header className="App-header">
                <div className='App-title'>Reclone</div>
                <LoginButton />
            </header>
        );
    }
}

export default AppHeader;