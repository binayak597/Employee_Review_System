export const authAdmin = (req, res, next) => {

    if(req.session.userEmail && req.session.typeOfUser === "admin"){
        next();
    }else{
        res.redirect("/auth/login");
    }
}