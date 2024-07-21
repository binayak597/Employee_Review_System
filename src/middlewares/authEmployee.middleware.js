export const authEmployee = (req, res, next) => {

    if(req.session.userEmail && req.session.typeOfUser === "employee"){
        next();
    }else{
        res.redirect("/auth/login");
    }
}