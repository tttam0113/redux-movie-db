import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    fetchPopularMovies,
    searchMovies,
    loadMoreMovies
    // setPopularPersistedState
} from '../redux/actions/movies';

import Home from '../components/Home/Home';

import * as homeSelectors from '../redux/selectors/homeSelectors';

class HomeContainer extends Component {
    componentDidMount() {
        // if (sessionStorage.getItem('HomeState')) {
        // const home = JSON.parse(sessionStorage.getItem('HomeState'));
        // this.props.setPopularPersistedState(home);
        // } else {
        this.getMovies();
        // }
    }

    componentDidUpdate() {
        // if (this.props.movies.length > 0) {
        //     if (this.props.searchTerm === '') {
        //         sessionStorage.setItem('HomeState', JSON.stringify(this.props));
        //     }
        // }
    }

    getMovies = () => {
        this.props.fetchPopularMovies({});
    };

    searchMovies = searchTerm => {
        this.props.searchMovies({ searchTerm });
    };

    loadMoreMovies = () => {
        const { searchTerm, currentPage } = this.props;
        this.props.loadMoreMovies({ searchTerm, currentPage });
    };

    render() {
        return (
            <Home
                {...this.props}
                searchMovies={this.searchMovies}
                loadMoreMovies={this.loadMoreMovies}
            />
        );
    }
}

const mapStateToProps = state => ({
    ...homeSelectors.getHomeState(state),
    heroImage: homeSelectors.getHeroImage(state),
    loading: homeSelectors.getLoading(state)
});

const mapDispatchToProps = {
    fetchPopularMovies,
    searchMovies,
    loadMoreMovies
    // setPopularPersistedState
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeContainer);
