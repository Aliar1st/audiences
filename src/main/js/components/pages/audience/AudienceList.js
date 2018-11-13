import React from 'react';
import EnhancedTable from '../../table/EnhancedTable'
import AudienceForm from "../../modal/AudienceForm";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import axios from "axios";
import uri from "../../../helper";

const styles = theme => ({});

const rows = [
    {id: 'id', label: 'Id', numeric: true},
    {id: 'number', label: 'Number', numeric: true},
    {id: 'roominess', label: 'Roominess', numeric: true},
    {id: 'type', label: 'Type', numeric: false},
    {id: 'floor', label: 'Floor', numeric: true},
    {id: 'housing', label: 'Housing №', numeric: true}
];

class AudienceList extends React.Component {

    convertAudiences = housings => {
        const audiences = [];
        housings.forEach(h =>
            h.audiences.forEach(a => {
                a['housing'] = h.number;
                a['housingId'] = h.id;
                audiences.push(a);
            }));
        return audiences;
    };

    state = {
        openForm: false,
        audience: undefined,
        audiences: this.convertAudiences(this.props.housings),
        housings: this.props.housings,
        housing: undefined
    };

    add = (newAudience, housingAudiencesPath) => {

        axios.get('/api/audiences')
            .then(response => {
                return axios.post(uri(response.data._links.self.href), newAudience, {headers: {'Content-Type': 'application/json'}})
            }).then(response => {
            return axios.post(uri(housingAudiencesPath), uri(response.data._links.self.href), {headers: {'Content-Type': 'text/uri-list'}})
        }).then(response => {
            this.props.refresh()
        }).catch(error => {
            console.log(error)
        });
    };

    edit = (audience, audiencePath, housingAudiencePath, newHousingAudiencesPath) => {

        axios.patch(uri(audiencePath), audience, {headers: {'Content-Type': 'application/json'}})
            .then(response => {
                return axios.delete(uri(housingAudiencePath), {headers: {'Content-Type': 'text/uri-list'}})
            }).then(response => {
            return axios.post(uri(newHousingAudiencesPath), uri(audiencePath), {headers: {'Content-Type': 'text/uri-list'}})
        }).then(response => {
            this.props.refresh()
        }).catch(error => {
            console.log(error)
        });
    };

    handleDeleteAudience = a => {
        axios.delete(uri(a._links.self.href))
            .then(response => {
                this.props.refresh()
            }).catch(error => {
            console.log(error)
        });
    };

    handleOpenForm = (aId) => {
        const {audiences, audience, housings} = this.state;
        const audienceTmp = audiences.find(a => a.id === aId);

        this.setState({
            openForm: true,
            audience: audienceTmp,
            housing: audienceTmp ? housings.find(h => h.id === audienceTmp.housingId) : {}
        })
    };

    handleCloseForm = () => {
        this.setState({openForm: false})
    };

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            housings: nextProps.housings,
            audiences: this.convertAudiences(nextProps.housings)
        })
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return JSON.stringify(this.state) !== JSON.stringify(nextState)
            || JSON.stringify(this.props) !== JSON.stringify(nextProps);
    }

    render() {
        const {audiences, openForm, audience, housings, housing} = this.state;

        return (
            <div>
                <EnhancedTable
                    add={this.handleOpenForm}
                    edit={this.handleOpenForm}
                    del={this.handleDeleteAudience}
                    rows={rows}
                    data={audiences}/>
                <AudienceForm
                    openForm={openForm}
                    audience={audience}
                    housings={housings}
                    housing={housing}
                    add={this.add}
                    edit={this.edit}
                    closeFormFunc={this.handleCloseForm}/>
            </div>
        );
    }
}

AudienceList.propTypes = {
    housings: PropTypes.array.isRequired,
    refresh: PropTypes.func.isRequired
};

export default withStyles(styles)(AudienceList);