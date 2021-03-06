module.exports = {
    isAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            next()
        } else {
            // If not authenticated - login.
            res.redirect('/users/login')
        }
    },
    isInRole: (role) => {
        return (req, res, next) => {
            if (req.user && req.user.roles.indexOf(role) > -1) {
                next()
            }else if(req.user){
                res.redirect('/')
            }else {
                // If not authorized - login with proper account.
                res.redirect('/users/login')
            }
        }
    }
}