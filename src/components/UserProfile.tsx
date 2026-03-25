var UserProfile = (function () {
    var full_name = localStorage.getItem("user_name") || "";
    var admin = localStorage.getItem("user_admin") === "true";

    var getName = function () {
        return full_name;
    };

    var getRole = function () {
        return admin;
    };

    var setRole = function (role: boolean) {
        admin = role;
        localStorage.setItem("user_admin", String(role));
    };

    var setName = function (name: string) {
        full_name = name;
        if (name) {
            localStorage.setItem("user_name", name);
        } else {
            localStorage.removeItem("user_name");
        }
    };

    return {
        getName: getName,
        setName: setName,
        getRole: getRole,
        setRole: setRole
    }

})();

export default UserProfile;