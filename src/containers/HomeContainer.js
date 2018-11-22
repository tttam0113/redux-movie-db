import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    getPopularMovies,
    showLoadingSpinner,
    searchMovies,
    clearMovies,
    loadMoreMovies,
    setPopularPersistedState
} from '../actions';
import Home from '../components/Home/Home';

class HomeContainer extends Component {
    componentDidMount() {
        if (sessionStorage.getItem('HomeState')) {
            const home = JSON.parse(sessionStorage.getItem('HomeState'));
            this.props.setPopularPersistedState(home);
        } else {
            this.getMovies();
        }
    }

    componentDidUpdate() {
        if (this.props.movies.length > 0) {
            if (this.props.searchTerm === '') {
                sessionStorage.setItem('HomeState', JSON.stringify(this.props));
            }
        }
    }

    getMovies = () => {
        this.props.showLoadingSpinner();
        this.props.getPopularMovies();
    };

    searchMovies = searchTerm => {
        this.props.clearMovies();
        this.props.showLoadingSpinner();
        this.props.searchMovies(searchTerm);
    };

    loadMoreMovies = () => {
        const { searchTerm, currentPage } = this.props;
        this.props.showLoadingSpinner();
        this.props.loadMoreMovies(searchTerm, currentPage);
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

const mapStateToProps = state => state.home;
const mapDispatchToProps = {
    getPopularMovies,
    showLoadingSpinner,
    searchMovies,
    clearMovies,
    loadMoreMovies,
    setPopularPersistedState
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeContainer);
