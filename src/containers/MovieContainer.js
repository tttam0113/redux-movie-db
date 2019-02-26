import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchMovie } from '../redux/actions/movie';

import Movie from '../components/Movie/Movie';

import { getMovieState } from '../redux/selectors/movieSelectors';
import { getLoading } from '../redux/selectors/uiSelectors';

class MovieContainer extends Component {
  componentDidMount() {
    const { movieId } = this.props.match.params;
    this.getMovie(movieId);
  }

  componentDidUpdate() {
    const { movieId } = this.props.match.params;
    const { movie, actors, directors } = this.props;
    if (this.props.movie) {
      const persistedMovieState = { movie, actors, directors };
      sessionStorage.setItem(`${movieId}`, JSON.stringify(persistedMovieState));
    }
  }

  getMovie = movieId => {
    this.props.fetchMovie({ movieId });
  };

  render() {
    return (
      <Movie
        movie={this.props.movie}
        directors={this.props.directors}
        actors={this.props.actors}
        loading={this.props.loading}
      />
    );
  }
}

const mapStateToProps = state => ({
  ...getMovieState(state),
  loading: getLoading(state),
});

export default connect(
  mapStateToProps,
  { fetchMovie },
)(MovieContainer);
