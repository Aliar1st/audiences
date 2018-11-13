import React from 'react'
import Route from 'react-router-dom/Route'
import Switch from 'react-router-dom/Switch'
import withRouter from 'react-router-dom/withRouter'
import withStyles from '@material-ui/core/styles/withStyles'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './components/pages/Home'
import AudienceList from './components/pages/audience/AudienceList'
import HousingList from './components/pages/housing/HousingList'
import NotFound from './components/pages/NotFound'
import HousingSingle from "./components/pages/housing/HousingSingle"
import axios from 'axios'

const styles = {
    root: {
        flexGrow: 1,
        maxWidth: 1024,
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingTop: 56,
        paddingBottom: 64,
    }
};

class App extends React.Component {

    static menu = [
        {
            title: "Housings",
            value: 1,
            path: "/housings"
        }, {
            title: "Audiences",
            value: 2,
            path: "/audiences"
        }, {
            title: "Home",
            value: 0,
            path: "/"
        }
    ];

    getLink = () => {
        const s = this.props.history.location.pathname;
        const res = App.menu.find(m => s.match(m.path));
        return res ? res : {
            title: "Not Found",
            value: -1,
            path: ""
        };
    };

    state = {
        link: this.getLink(),
        housings: []
    };

    componentDidMount() {
        this.loadFromServer();
    }

    loadFromServer = () => {
        axios.get('/api/housings')
            .then(response => {
                this.setState({housings: response.data._embedded.housings})
            })
    };

    render() {
        const {classes} = this.props;
        const {housings} = this.state;
        const link = this.getLink();

        return (
            <div className={classes.root}>
                <Header title={link.title}/>

                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/audiences"
                           render={() => <AudienceList refresh={this.loadFromServer}
                                                       housings={JSON.parse(JSON.stringify(housings))}/>}/>
                    <Route exact path="/housings"
                           render={() => <HousingList refresh={this.loadFromServer}
                                                      housings={JSON.parse(JSON.stringify(housings))}/>}/>
                    <Route exact path="/housings/:id"
                           render={() => <HousingSingle refresh={this.loadFromServer}
                                                        housings={JSON.parse(JSON.stringify(housings))}/>}/>}/>
                    <Route component={NotFound}/>
                </Switch>

                <Footer value={link.value}/>
            </div>
        )
    }
}


export default withStyles(styles)(withRouter(App))
