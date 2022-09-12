import { render, screen } from '@testing-library/react';
import App from './App';
import data from "./data.json"


/* We use render and screen functions from testing-library/react to start introducing myself to TDD aproach. Typing npm t in the terminal will open the test mode.  */
describe("Star Wars APP", () => { 
/*
  it("Should show a list of characters including Luke Skywalker", () => {
    render(<App />);
    expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
  });

  it("should show a list of characters from a JSON file", () => {
    render (<App />);
    for (let character of data.results) {
      expect(screen.getByText(character.name)).toBeInTheDocument();
    }
  });
*/


  /* It's used the beforeAll function as part of thes tests made on the API request */
  /* We do this becuase we want to note when the code is making a fetch, to make it use the fetch method we create inside the people.js file, and not the native fetch methode */
  beforeAll(() => jest.spyOn(window, 'fetch'));

  it("should show a list of characters from the API", async () => {
    /* We make a mock to know when the code is making a fetch */
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => data,
    });
    render(<App />);
    /* We ask if it has been called 1 time */
    expect(window.fetch).toHaveBeenCalledTimes(2);
    /* We ask if it hass been called with this path */
    expect(window.fetch).toHaveBeenCalledWith('http://swapi.dev/api/people/');

    /* We ask if each one of the names requested is in this list shown in the screen. It's kinda stupid but this can improve our knowledge about testing */
    for (let character of data.results) {
      expect(await screen.findByText(character.name)).toBeInTheDocument();
    }
  });

  it("should show an error message when has a network error", async () => {
    /* We simulate to make a fetch and getting an error, to verify the test*/
    window.fetch.mockResolvedValueOnce(new Error("Network error"));

    render(<App />);
    /* this "it" is implemented to verify is there is an error charging the site */
    expect(await screen.findByText("Network error")).toBeInTheDocument();
  });
});
