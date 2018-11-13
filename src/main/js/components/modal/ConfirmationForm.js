import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import Modal from '@material-ui/core/Modal'
import Button from '@material-ui/core/Button'

function rand() {
    return Math.round(Math.random() * 2) - 1;
}

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const styles = theme => ({
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 30,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
    },
    rightButton: {
        float: 'right',
    }
});

class ConfirmationForm extends React.Component {

    state = {openForm: this.props.openForm};

    handleYes = () => {
        this.props.handleYes();
    };

    handleNo = () => {
        this.props.closeFormFunc();
    };

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({openForm: nextProps.openForm})
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return JSON.stringify(this.state) !== JSON.stringify(nextState)
            || JSON.stringify(this.props) !== JSON.stringify(nextProps);
    }

    render() {
        const {classes, message, closeFormFunc} = this.props;
        const {openForm} = this.state;

        return (
            <Modal
                open={openForm}
                onClose={closeFormFunc}
            >
                <div style={getModalStyle()} className={classes.paper}>
                    <Typography variant="title">
                        Are you sure?
                    </Typography>
                    <hr/>
                    <Typography variant="subheading">
                        {message}
                    </Typography>
                    <hr/>
                    <Button
                        onClick={this.handleNo}
                        variant="outlined">
                        No
                    </Button>
                    <Button
                        onClick={this.handleYes}
                        variant="contained"
                        color="primary"
                        className={classes.rightButton}>
                        Yes
                    </Button>
                </div>
            </Modal>
        )
    }
}

ConfirmationForm.propTypes = {
    classes: PropTypes.object.isRequired,
    openForm: PropTypes.bool.isRequired,
    closeFormFunc: PropTypes.func.isRequired,
    handleYes: PropTypes.func
};

export default withStyles(styles)(ConfirmationForm);
