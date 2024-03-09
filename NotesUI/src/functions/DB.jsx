export const BrowserDB = {
    get : (key) => {
        return localStorage.getItem(key);
    },
    set : (key, value) => {
        localStorage.setItem(key, value);
    },
    del : (key) => {
        localStorage.removeItem(key);
    }
}