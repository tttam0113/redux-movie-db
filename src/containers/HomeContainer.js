import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    fetchPopularMovies,
    searchMovies,
    loadMoreMovies
} from '../redux/actions/movies';

import Home from '../components/Home/Home';

import { getHomeState, getHeroImage } from '../redux/selectors/homeSelectors';
import { getLoading } from '../redux/selectors/uiSelectors';

class HomeContainer extends Component {
    componentDidMount() {
        this.getMovies();
    }

    componentDidUpdate() {
        if (this.props.movies.length > 0) {
            if (!this.props.searchTerm) {
                sessionStorage.setItem('HomeState', JSON.stringify(this.props));
            }
        }
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
    ...getHomeState(state),
    heroImage: getHeroImage(state),
    loading: getLoading(state)
});

const mapDispatchToProps = {
    fetchPopularMovies,
    searchMovies,
    loadMoreMovies
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeContainer);
