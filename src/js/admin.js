var admin = (admin => {
    /**
     * Configuration attributes, these cannot change
     */
    const config = {};

    /**
     * Cached attributes, these can change
     */
    admin.cache = {};

    return admin;
})(admin || {});

admin.init();
