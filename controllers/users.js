module.exports = {
    index,
};

function index(req, res, next) {
    res.render('index', { user: req.user });
}
