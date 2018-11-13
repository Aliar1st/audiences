import React from 'react'
import PropTypes from 'prop-types'
import withRouter from 'react-router-dom/withRouter'
import EnhancedTable from '../../table/EnhancedTable'
import HousingFrom from '../../modal/HousingForm'
import axios from 'axios';
import uri from '../../../helper'

const rows = [
    {id: 'id', label: 'Id', numeric: true},
    {id: 'number', label: 'Number', numeric: true},
    {id: 'roominess', label: 'Roominess', numeric: true},
    {id: 'audiences', label: 'Audiences', numeric: false}
];

class HousingList extends React.Component {

    convertHousings = housings => {
        return housings.map(h => {
            const audiences = h.audiences;

            h['roominess'] = audiences.reduce((a, c) => a + c.roominess, 0);

            const types = audiences.reduce((a, c) => {
                const type = c.type;
                a.hasOwnProperty(type)
                    ?
                    a[type] = a[type] + 1
                    :
                    a[type] = 1;
                return a;
            }, {});

            let s = JSON.stringify(types);
            h['audiences'] = s
                .substring(1, s.length - 1)
                .split(',')
                .sort()
                .join(', ')
                .split('"')
                .join('')
                .replace(':', ': ');

            return h
        });
    };

    state = {
        openForm: false,
        housing: undefined,
        housings: this.convertHousings(this.props.housings)
    };

    add = newHousing => {
        axios.get('/api/housings')
            .then(response => {
                return axios.post(uri(response.data._links.self.href), newHousing, {headers: {'Content-Type': 'application/json'}})
            }).then(response => {
                this.props.refresh()
            }).catch(error => {
                console.log(error)
            });
    };

    edit = (housing, path) => {
        axios.patch(uri(path), housing, {headers: {'Content-Type': 'application/json'}})
            .then(response => {
                this.props.refresh()
            }).catch(error => {
            console.log(error)
            })
    };

    handleDeleteHousing = (h) => {
        axios.delete(uri(h._links.self.href))
            .then(response => {
                this.props.refresh()
            }).catch(error => {
                console.log(error)
            })
    };

    handleOpenForm = (hId) => {
        if (hId) {
            this.setState({
                openForm: true,
                housing: this.props.housings.find(h => h.id === hId)
            })
        } else {
            this.setState({
                openForm: true,
                housing: undefined
            })
        }
    };

    handleCloseForm = () => {
        this.setState({openForm: false})

    };

    handleShowHousing = (hId) => {
        this.props.history.push('/housings/' + hId);
    };

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            housings: this.convertHousings(nextProps.housings)
        })
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return JSON.stringify(this.state) !== JSON.stringify(nextState)
            || JSON.stringify(this.props) !== JSON.stringify(nextProps);
    }

    render() {
        const {housings, housing, openForm} = this.state;

        return (
            <div>
                <EnhancedTable
                    add={this.handleOpenForm}
                    show={this.handleShowHousing}
                    edit={this.handleOpenForm}
                    del={this.handleDeleteHousing}
                    rows={rows}
                    data={housings}/>
                <HousingFrom
                    openForm={openForm}
                    housing={housing}
                    housings={housings}
                    add={this.add}
                    edit={this.edit}
                    closeFormFunc={this.handleCloseForm}
                />
            </div>
        )
    }
}

HousingList.propTypes = {
    housings: PropTypes.array.isRequired,
    refresh: PropTypes.func.isRequired
};

export default withRouter(HousingList)
