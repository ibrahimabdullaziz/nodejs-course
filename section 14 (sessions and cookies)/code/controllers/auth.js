exports.getLogin = (req, res, next) => {
  const cookie = req.get("cookie") || "";
  const isLoggedIn = cookie.split(";")[7]?.split("=")[1];
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: isLoggedIn === "true",
  });
};

exports.postLogin = (req, res, next) => {
  res.setHeader("Set-Cookie", "isLoggedIn=true");
  res.redirect("/");
};
