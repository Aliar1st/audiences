import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Tooltip from '@material-ui/core/Tooltip'
import EnhancedTableHead from './EnhancedTableHead'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import ConfirmationForm from "../modal/ConfirmationForm";

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflow: 'auto'
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    td: {
        padding: '4px 24px 4px 24px'
    },
    tdIcon: {
        textAlign: 'center',
        paddingRight: 24
    },
    tablePaginationRoot: {
        fontSize: '0.75em',
        float: 'right'
    },
    button: {
        margin: theme.spacing.unit,
    },
});

class EnhancedTable extends React.Component {
    state = {
        order: 'asc',
        orderBy: this.props.rows[0].id,
        page: 0,
        rowsPerPage: 5,
        del: undefined,
        openForm: false
    };

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({order, orderBy});
    };

    handleChangePage = (event, page) => {
        this.setState({page});
    };

    handleChangeRowsPerPage = event => {
        this.setState({rowsPerPage: event.target.value});
    };

    handleCloseForm = () => {
        this.setState({openForm: false})
    };

    setDel = n => {
        this.setState({del: n, openForm: true});
    };

    del = () => {
        this.setState({openForm: false});
        this.props.del(this.state.del);
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return JSON.stringify(this.state) !== JSON.stringify(nextState)
            || JSON.stringify(this.props) !== JSON.stringify(nextProps);
    }

    render() {
        const {classes, title, rows, add, show, edit, del, data} = this.props;
        const {order, orderBy, rowsPerPage, page, openForm, delN} = this.state;

        return (
            <div>
                <Paper className={classes.root}>
                    {title && <EnhancedTableToolbar title={title}/>}
                    <div className={classes.tableWrapper}>
                        <Table className={classes.table} aria-labelledby="tableTitle">
                            <EnhancedTableHead
                                show={show}
                                edit={edit}
                                del={del}
                                rows={rows}
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={this.handleRequestSort}
                            />
                            <TableBody>
                                {stableSort(this.props.data, getSorting(order, orderBy))
                                    .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                                    .map(n =>
                                        <TableRow
                                            hover
                                            tabIndex={-1}
                                            key={n.id}>
                                            {rows.map(r => {
                                                return <TableCell className={classes.td} key={'' + n.id + r.id}
                                                                  numeric={r.numeric}>{n[r.id]}</TableCell>
                                            })}
                                            {show &&
                                            <TableCell className={classes.tdIcon}>
                                                <Tooltip title='Show'>
                                                    <IconButton onClick={() => show(n.id)} className={classes.button}>
                                                        <SearchIcon/>
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>}
                                            {edit &&
                                            <TableCell className={classes.tdIcon}>
                                                <Tooltip title='Edit'>
                                                    <IconButton onClick={() => edit(n.id)} className={classes.button}>
                                                        <EditIcon/>
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>}
                                            {del &&
                                            <TableCell className={classes.tdIcon}>
                                                <Tooltip title='Delete'>
                                                    <IconButton onClick={() => this.setDel(n)}
                                                                className={classes.button}>
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>}
                                        </TableRow>
                                    )}
                            </TableBody>
                        </Table>
                    </div>
                    <TablePagination
                        className={classes.tablePaginationRoot}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}/>

                    {add &&
                    <Tooltip title="Add">
                        <Button
                            onClick={() => add()}
                            className={classes.button}
                            variant="fab"
                            mini
                            color="primary">
                            <AddIcon/>
                        </Button>
                    </Tooltip>}
                </Paper>
                <ConfirmationForm
                    openForm={openForm}
                    closeFormFunc={this.handleCloseForm}
                    handleYes={() => this.del(delN)}
                    message="Audiences will be cascaded!"
                />
            </div>
        )
    }
}

EnhancedTable.propTypes = {
    classes: PropTypes.object.isRequired,
    add: PropTypes.func,
    show: PropTypes.func,
    edit: PropTypes.func,
    delete: PropTypes.func,
};

export default withStyles(styles)(EnhancedTable);
