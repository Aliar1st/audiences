import React from 'react'
import Button from '@material-ui/core/Button'

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

class Home extends React.Component {

    state = {
        clicks: 0
    };

    getRandomColor = () => {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    handleClick = () => {
        this.setState({clicks: this.state.clicks + 1})
    };

    render() {
        const {clicks} = this.state;

        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Welcome to Home</h1>
                </header>
                <Button size={"large"} variant="contained" color="primary" onClick={this.handleClick}
                        style={{background: this.getRandomColor()}}>Hello</Button>
                <h1 className="App-title">Clicks: {clicks}</h1>
            </div>
        )
    }
}

export default Home