import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import HomeIcon from '@material-ui/icons/Home'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import GroupIcon from '@material-ui/icons/Group'
import withRouter from 'react-router-dom/withRouter'
import App from '../App'

const styles = {
    root: {
        position: 'fixed',
        width: 'calc(100% - 16px)',
        bottom: 0,
        maxWidth: 1024,
        paddingBottom: 8,
        background: '#f4f5f9',
        zIndex: 100
    },
    action: {
        maxWidth: 'none',
    },
};

class Footer extends React.Component {

    state = {
        value: this.props.value,
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.value !== this.props.value) {
            this.setState({value: nextProps.value});
        }
    }

    onChange = (event, value) => {
        this.props.history.push(App.menu.find(m => m.value === value).path);
    };

    render() {
        const {classes} = this.props;
        const {value} = this.state;

        return (
            <div className={classes.root}>
                <BottomNavigation
                    value={value}
                    onChange={this.onChange}
                    showLabels
                >
                    <BottomNavigationAction //component={Link} to={App.menu[0].path}
                        className={classes.action} label="Home" icon={<HomeIcon/>}/>
                    <BottomNavigationAction //component={Link} to={App.menu[1].path}
                        className={classes.action} label="Housings" icon={<AccountBalanceIcon/>}/>
                    <BottomNavigationAction //component={Link} to={App.menu[2].path}
                        className={classes.action} label="Audiences" icon={<GroupIcon/>}/>
                </BottomNavigation>
            </div>
        )
    }
}

Footer.propTypes = {
    classes: PropTypes.object.isRequired,
    value: PropTypes.number.isRequired,
};

export default withStyles(styles)(withRouter(Footer));