import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import Modal from '@material-ui/core/Modal'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import uri from '../../helper'

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
        display: 'flex',
    },
});

class AudienceForm extends React.Component {

    state = {
        number: this.props.audience ? this.props.audience.number : '',
        floor: this.props.audience ? this.props.audience.floor : '',
        roominess: this.props.audience ? this.props.audience.roominess : '',
        type: this.props.audience ? this.props.audience.type : '',
        housingNumber: this.props.housing || this.props.audience ?
                        this.props.housing.number : '',
        formErrors: {number: '', floor: '', roominess: '', type: '', housingNumber: ''},
        numberValid: false,
        floorValid: false,
        roominessValid: false,
        typeValid: false,
        housingIdValid: !!this.props.housing,
        formValid: false
    };

    handleChange = event => {
        this.checkField(event.target.name, event.target.value);
    };

    isValid = () => {
        const {numberValid, floorValid, roominessValid, typeValid, housingIdValid} = this.state;
        this.setState({
            formValid: numberValid && floorValid && roominessValid && typeValid && housingIdValid
        })
    };

    checkField = (name, value) => {
        let fieldValidationErrors = JSON.parse(JSON.stringify(this.state.formErrors));
        let numberValid = this.state.numberValid;
        let floorValid = this.state.floorValid;
        let roominessValid = this.state.roominessValid;
        let typeValid = this.state.typeValid;
        let housingIdValid = this.state.housingIdValid;

        switch (name) {
            case 'number':
                numberValid = !!value;
                if (!numberValid) {
                    fieldValidationErrors.number = 'Value doesn\'t exist';
                    break;
                }
                if (!this.state.housingNumber) {
                    numberValid = false;
                    break;
                }
                numberValid = this.checkNumberFree(value, this.state.housingNumber);
                if (!numberValid) {
                    fieldValidationErrors.number = 'Audience exist';
                    break;
                }
                break;
            case 'floor':
                floorValid = !!value;
                if (!floorValid) {
                    fieldValidationErrors.floor = 'Value doesn\'t exist';
                    break;
                }
                floorValid = value > 0;
                if (!floorValid) {
                    fieldValidationErrors.floor = 'Value must be greater than zero';
                    break;
                }
                break;
            case 'roominess':
                roominessValid = !!value;
                if (!roominessValid) {
                    fieldValidationErrors.roominess = 'Value doesn\'t exist';
                    break;
                }
                roominessValid = value > 0;
                if (!roominessValid) {
                    fieldValidationErrors.roominess = 'Value must be greater than zero';
                    break;
                }
                break;
            case 'type':
                typeValid = !!value;
                if (!typeValid) {
                    fieldValidationErrors.type = 'Value doesn\'t exist';
                    break;
                }
                break;
            case 'housingNumber':
                housingIdValid = !!value;
                if (!housingIdValid) {
                    fieldValidationErrors.housingId = 'Value doesn\'t exist';
                    break;
                }
                housingIdValid = this.checkHousingIdExist(value);
                if (!housingIdValid) {
                    fieldValidationErrors.housingId = 'Housing doesn\'t exist';
                    break;
                }
                if (!this.state.number) break;
                numberValid = this.checkNumberFree(this.state.number, value);
                if (!numberValid) {
                    fieldValidationErrors.number = 'Audience exist';
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
            floorValid: floorValid,
            roominessValid: roominessValid,
            typeValid: typeValid,
            housingIdValid: housingIdValid
        }, this.isValid);
    };

    submit = () => {
        if (this.isValid) {
            const {number, floor, roominess, type, housingNumber} = this.state;
            const {audience, housing, housings} = this.props;
            const newHousing = housings.find(h => h.number === housingNumber);

            if (audience) {

                let audiencePath = audience._links.self.href;
                let housingAudiencePath = uri(housing._links.audiences.href) + '/' + audience.id;
                let newHousingAudiencesPath = newHousing._links.audiences.href;

                this.props.edit({
                    number: parseInt(number, 10),
                    floor: parseInt(floor, 10),
                    roominess: parseInt(roominess, 10),
                    type: type
                }, audiencePath, housingAudiencePath, newHousingAudiencesPath);
            } else {
                this.props.add({
                    number: parseInt(number, 10),
                    floor: parseInt(floor, 10),
                    roominess: parseInt(roominess, 10),
                    type: type
                }, newHousing._links.audiences.href)
            }
        }

        this.props.closeFormFunc();
    };

    checkNumberFree = (number, hNumber) => {
        if (this.props.audience && this.props.audience.number === number) return true;

        let housing = this.props.housings.find(h => h.number === hNumber);

        return housing && !housing.audiences
            .find(a => a.number === number);
    };

    checkHousingIdExist = hNumber => {
        if (isNaN(hNumber)) return false;

        return this.props.housings.find(h => h.number === hNumber);
    };

    componentWillReceiveProps(nextProps, nextContext) {
        const number = nextProps.audience ? nextProps.audience.number : '';
        const floor = nextProps.audience ? nextProps.audience.floor : '';
        const roominess = nextProps.audience ? nextProps.audience.roominess : '';
        const type = nextProps.audience ? nextProps.audience.type : '';
        const housingNumber = nextProps.housing ? nextProps.housing.number : '';

        const numberValid = !!number;
        const floorValid = !!floor;
        const roominessValid = !!roominess;
        const typeValid = !!type;
        const housingIdValid = !!housingNumber;

        this.setState({
            number: number,
            floor: floor,
            roominess: roominess,
            type: type,
            housingNumber: housingNumber,
            numberValid: numberValid,
            floorValid: floorValid,
            roominessValid: roominessValid,
            typeValid: typeValid,
            housingIdValid: housingIdValid,
        })
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return JSON.stringify(this.state) !== JSON.stringify(nextState)
            || JSON.stringify(this.props) !== JSON.stringify(nextProps);
    }

    render() {
        const {classes, openForm, closeFormFunc, audience, housings} = this.props;
        const {
            number, numberValid,
            floor, floorValid,
            roominess, roominessValid,
            type, typeValid,
            housingNumber, housingIdValid,
            formErrors, formValid
        } = this.state;

        return (
            <Modal
                open={openForm}
                onClose={closeFormFunc}
            >
                <div style={getModalStyle()} className={classes.paper}>
                    <Typography variant="title">
                        Audience {audience ? 'edit' : 'add'} form
                    </Typography>
                    <hr/>
                    <TextField
                        name="number"
                        label="Number"
                        value={number}
                        onChange={this.handleChange}
                        error={!numberValid}
                        helperText={!numberValid && formErrors.number}
                        type="text"
                        className={classes.textField}
                        margin="normal"
                    />
                    <TextField
                        name="floor"
                        label="Floor"
                        value={floor}
                        onChange={this.handleChange}
                        error={!floorValid}
                        helperText={!floorValid && formErrors.floor}
                        type="number"
                        className={classes.textField}
                        margin="normal"
                    />
                    <TextField
                        name="roominess"
                        label="Roominess"
                        value={roominess}
                        onChange={this.handleChange}
                        error={!roominessValid}
                        helperText={!roominessValid && formErrors.roominess}
                        type="number"
                        className={classes.textField}
                        margin="normal"
                    />
                    <TextField
                        name="type"
                        label="Type"
                        value={type}
                        onChange={this.handleChange}
                        error={!typeValid}
                        helperText={!typeValid && formErrors.type}
                        type="text"
                        className={classes.textField}
                        margin="normal"
                    />
                    <FormControl className={classes.textField} error={!housingIdValid}>
                        <InputLabel htmlFor="housingId">Housing №</InputLabel>
                        <Select
                            value={housingNumber ? housingNumber : ''}
                            onChange={this.handleChange}
                            inputProps={{
                                name: 'housingNumber'
                            }}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {housings.map(h =>
                                <MenuItem key={h.id} value={h.number}>{h.number}</MenuItem>
                            )}
                        </Select>
                        {!housingIdValid && <FormHelperText>{formErrors.housingId}</FormHelperText>}
                    </FormControl>
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

//flow / typeScript
AudienceForm.propTypes = {
    classes: PropTypes.object.isRequired,
    openForm: PropTypes.bool.isRequired,
    closeFormFunc: PropTypes.func.isRequired,
    housings: PropTypes.array.isRequired,
    housing: PropTypes.object,
    audience: PropTypes.object,
    add: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
};

export default withStyles(styles)(AudienceForm);
