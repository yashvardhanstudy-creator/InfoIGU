var UserProfile = (function () {
    var full_name = "";
    var admin = false;

    var getName = function () {
        return full_name;    // Or pull this from cookie/localStorage
    };

    var getRole = function () {
        return admin;    // Or pull this from cookie/localStorage
    };

    var setRole = function (role: boolean) {
        admin = role;
        // Also set this in cookie/localStorage
    };

    var setName = function (name: string) {
        full_name = name;
        // Also set this in cookie/localStorage
    };

    return {
        getName: getName,
        setName: setName,
        getRole: getRole,
        setRole: setRole
    }

})();

export default UserProfile;