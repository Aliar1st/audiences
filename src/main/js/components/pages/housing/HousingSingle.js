import React from 'react';
import PropTypes from 'prop-types'
import withRouter from 'react-router-dom/withRouter'
import EnhancedTable from '../../table/EnhancedTable'
import AudienceForm from "../../modal/AudienceForm"
import axios from 'axios';
import uri from '../../../helper'

const rows = [
    {id: 'id', label: 'Id', numeric: true},
    {id: 'number', label: 'Number', numeric: true},
    {id: 'roominess', label: 'Roominess', numeric: true},
    {id: 'type', label: 'Type', numeric: false},
    {id: 'floor', label: 'Floor', numeric: true},
    {id: 'housing', label: 'Housing №', numeric: true}
];

class HousingSingle extends React.Component {

    convertAudiences = housing => {
        const audiences = [];
        housing.audiences.forEach(a => {
            a['housing'] = housing.number;
            audiences.push(a);
        });
        return audiences;
    };

    state = {
        openForm: false,
        audience: undefined,
        audiences: this.convertAudiences(this.props.housings.find(h => h.id === this.props.match.params.id)),
        housing: this.props.housings.find(h => h.id === this.props.match.params.id)
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

    handleOpenForm = aId => {
        this.setState({
            openForm: true,
            audience: this.state.audiences.find(a => a.id === aId)
        })
    };

    handleCloseForm = () => {
        this.setState({openForm: false})

    };

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            audiences: this.convertAudiences(nextProps.housings.find(h => h.id === this.props.match.params.id))
        })
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return JSON.stringify(this.state) !== JSON.stringify(nextState)
            || JSON.stringify(this.props) !== JSON.stringify(nextProps);
    }

    render() {
        const {audiences, openForm, audience, housing} = this.state;
        const {housings} = this.props;
        const title = 'Housing ' + housing.number + ' audiences';

        return (
            <div>
                <EnhancedTable
                    add={this.handleOpenForm}
                    edit={this.handleOpenForm}
                    del={this.handleDeleteAudience}
                    title={title}
                    rows={rows}
                    data={audiences}/>
                <AudienceForm
                    openForm={openForm}
                    audience={audience}
                    housing={housing}
                    housings={housings}
                    add={this.add}
                    edit={this.edit}
                    closeFormFunc={this.handleCloseForm}/>
            </div>
        );
    }
}

HousingSingle.propTypes = {
    housings: PropTypes.array.isRequired,
    refresh: PropTypes.func.isRequired
};

export default withRouter(HousingSingle)