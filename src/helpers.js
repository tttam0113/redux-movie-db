// Convert time to hours and minutes
export const calcTime = time => {
    const hours = Math.floor(time / 60);
    const mins = time % 60;
    return `${hours}h ${mins}m`;
};
// Convert a number to money formatting
export const convertMoney = money => {
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    });
    return formatter.format(money);
};

export const fetchMovies = (endpoint, returnFunc = result => result) => {
    return fetch(endpoint)
        .then(result => result.json())
        .then(result => {
            return returnFunc(result);
        })
        .catch(error => console.error('Error: ', error));
};
