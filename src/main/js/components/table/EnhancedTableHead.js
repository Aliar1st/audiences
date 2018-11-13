import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Tooltip from '@material-ui/core/Tooltip'

const styles = theme => ({
    td: {
        padding: '4px 24px 4px 24px'
    }
});

class EnhancedTableHead extends React.Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return JSON.stringify(this.state) !== JSON.stringify(nextState)
            || JSON.stringify(this.props) !== JSON.stringify(nextProps);
    }

    render() {
        const {classes, order, orderBy, rows, show, edit, del} = this.props;

        return (
            <TableHead>
                <TableRow>
                    {rows.map(row => {
                        return (
                            <TableCell
                                className={classes.td}
                                key={row.id}
                                numeric={row.numeric}
                                sortDirection={orderBy === row.id ? order : false}>
                                <Tooltip
                                    title="Sort"
                                    placement={row.numeric ? 'bottom-end' : 'bottom-start'}>
                                    <TableSortLabel
                                        active={orderBy === row.id}
                                        direction={order}
                                        onClick={this.createSortHandler(row.id)}>
                                        {row.label}
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                        )
                    })}
                    {show && <TableCell className={classes.td}/>}
                    {edit && <TableCell className={classes.td}/>}
                    {del && <TableCell className={classes.td}/>}
                </TableRow>
            </TableHead>
        );
    }
}

EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    show: PropTypes.func,
    edit: PropTypes.func,
    delete: PropTypes.func,
    title: PropTypes.string
};

export default withStyles(styles)(EnhancedTableHead)