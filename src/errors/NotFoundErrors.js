import React, { Component } from 'react';
import './NotFoundErrors.scss'
class NotFoundErrors extends Component {
    render() {
        return (
            <div className="NotFoundErrors">
                <div id="background"></div>
                <div className="top">
                    <h1>404</h1>
                    <h3>page not found</h3>
                </div>
                <div className="container">
                    <div className="ghost-copy">
                        <div className="one"></div>
                        <div className="two"></div>
                        <div className="three"></div>
                        <div className="four"></div>
                    </div>
                    <div className="ghost">
                        <div className="face">
                            <div className="eye"></div>
                            <div className="eye-right"></div>
                            <div className="mouth"></div>
                        </div>
                    </div>
                    <div className="shadow"></div>
                </div>
                <div className="bottom">
                    <p>Boo, looks like a ghost stole this page!</p>
                </div>

                <footer>
                    <p>made by <a href="https://codepen.io/juliepark"> julie</a> ♡</p>
            </footer>
        </div>
        )
    }
}

export default NotFoundErrors;