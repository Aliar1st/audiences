import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/ArrowBack'
import withRouter from 'react-router-dom/withRouter'

const styles = {
    root: {
        position: 'fixed',
        top: 0,
        width: 'calc(100% - 16px)',
        paddingTop: 9,
        maxWidth: 1024,
        background: '#f4f5f9',
        zIndex: 100
    },
    menuButton: {
        marginLeft: -18,
        marginRight: 10,
    },
};

class Header extends React.Component {

    state = {
        title: this.props.title
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.title !== this.props.title) {
            this.setState({title: nextProps.title});
        }
    }

    handleBack = () => {
        this.props.history.goBack();
    };

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <IconButton onClick={this.handleBack} className={classes.menuButton} color="inherit">
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="title" color="inherit">
                            {this.state.title}
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default withStyles(styles)(withRouter(Header));