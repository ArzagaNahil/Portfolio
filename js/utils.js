export const preloadFonts = id => {
    return new Promise(resolve => {
        WebFont.load({
            google: { families: [id] },
            active: resolve
        });
    });
};
