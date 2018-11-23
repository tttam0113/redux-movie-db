export default fn => {
    window.fetch = jest.fn().mockImplementation(fn);
};
