const { JSDOM } = require("jsdom");
const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
global.document = dom.window.document;

// Assuming you have colourKey function defined like this, you may need to adjust according to your actual implementation
function colourKey(key, colour) {
    if (colour === "green") {
      key.classList.add('key-green');
      return;
    }
  
    if (colour === "yellow" && !key.classList.contains('key-green')) {
      key.classList.add('key-yellow');
      return;
    }
  
    if (colour === "grey" && !key.classList.contains('key-green') && !key.classList.contains('key-yellow')) {
      key.classList.add('key-grey');
    }
}

describe('colourKey', () => {

    it('should not change colour if it is already green', () => {
        const key = document.createElement('div');
        key.classList.add('key-green');

        colourKey(key, 'yellow');
        expect(key.classList.contains('key-yellow')).toBe(false);
        expect(key.classList.contains('key-green')).toBe(true);
    });

    it('should not change colour to grey if it is already yellow', () => {
        const key = document.createElement('div');
        key.classList.add('key-yellow');

        colourKey(key, 'grey');
        expect(key.classList.contains('key-grey')).toBe(false);
        expect(key.classList.contains('key-yellow')).toBe(true);
    });

    it('should change colour to yellow if it is grey', () => {
        const key = document.createElement('div');
        key.classList.add('key-grey');

        colourKey(key, 'yellow');
        expect(key.classList.contains('key-yellow')).toBe(true);
    });

    it('should add green class if colour is green', () => {
        const key = document.createElement('div');

        colourKey(key, 'green');
        expect(key.classList.contains('key-green')).toBe(true);
    });

    it('should add yellow class if colour is yellow and no green class present', () => {
        const key = document.createElement('div');

        colourKey(key, 'yellow');
        expect(key.classList.contains('key-yellow')).toBe(true);
    });

    it('should add grey class if colour is grey and no yellow or green class present', () => {
        const key = document.createElement('div');

        colourKey(key, 'grey');
        expect(key.classList.contains('key-grey')).toBe(true);
    });
});
