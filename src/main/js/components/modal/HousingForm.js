import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import Modal from '@material-ui/core/Modal'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

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
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
    },
    rightButton: {
        float: 'right',
    },
    textField: {
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '50%',
        display: 'flex'
    },
});

class HousingForm extends React.Component {

    state = {
        number: this.props.housing ? this.props.housing.number : '',
        formErrors: {number: ''},
        numberValid: false,
        formValid: false
    };

    handleChange = event => {
        this.checkField(event.target.name, event.target.value);
    };

    isValid = () => {
        this.setState({formValid: this.state.numberValid});
    };

    checkField = (name, value) => {
        let fieldValidationErrors = JSON.parse(JSON.stringify(this.state.formErrors));
        let numberValid = this.state.numberValid;

        switch (name) {
            case 'number':
                numberValid = !!value;
                if (!numberValid) {
                    fieldValidationErrors.number = 'Value doesn\'t exist';
                    break;
                }
                numberValid = value > 0;
                if (!numberValid) {
                    fieldValidationErrors.number = 'Value must be greater than zero';
                    break;
                }
                numberValid = this.checkNumberFree(value);
                if (!numberValid) {
                    fieldValidationErrors.number = 'Housing exist';
                    break;
                }
                break;
            default:
                break;
        }

        this.setState({
            [name]: value,
            formErrors: fieldValidationErrors,
            numberValid: numberValid,
        }, this.isValid);
    };

    submit = () => {
        if (this.isValid)
            if (this.props.housing) {
                this.props.edit({
                    number:  parseInt(this.state.number, 10)
                }, this.props.housing._links.self.href)
            } else {
                this.props.add({
                    number: parseInt(this.state.number, 10),
                    audiences: []
                })
            }
        this.props.closeFormFunc();
    };

    checkNumberFree = number => {
        const val = parseInt(number, 10);

        if (isNaN(val)) return false;
        if (this.props.housing && this.props.housing.number === val) return true;

        return !this.props.housings
            .find(h => h.number === val);
    };

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            number: nextProps.housing ? nextProps.housing.number : '',
        })
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return JSON.stringify(this.state) !== JSON.stringify(nextState)
            || JSON.stringify(this.props) !== JSON.stringify(nextProps);
    }

    render() {
        const {classes, openForm, closeFormFunc, housing} = this.props;
        const {number, numberValid, formErrors, formValid} = this.state;

        return (
            <Modal
                open={openForm}
                onClose={closeFormFunc}
            >
                <div style={getModalStyle()} className={classes.paper}>
                    <Typography variant="title">
                        Housing {housing ? 'edit' : 'add'} form
                    </Typography>
                    <hr/>
                    <TextField
                        name="number"
                        label="Number"
                        value={number}
                        onChange={this.handleChange}
                        error={!numberValid}
                        helperText={!numberValid && formErrors.number}
                        type="number"
                        className={classes.textField}
                        margin="normal"
                    />
                    <hr/>
                    <Button
                        onClick={closeFormFunc}
                        variant="outlined">
                        Close
                    </Button>
                    <Button
                        onClick={this.submit}
                        disabled={!formValid}
                        variant="contained"
                        color="primary"
                        className={classes.rightButton}>
                        Save
                    </Button>
                </div>
            </Modal>
        )
    }
}

HousingForm.propTypes = {
    classes: PropTypes.object.isRequired,
    openForm: PropTypes.bool.isRequired,
    closeFormFunc: PropTypes.func.isRequired,
    housing: PropTypes.object,
    housings: PropTypes.array.isRequired,
    add: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
};

export default withStyles(styles)(HousingForm);
