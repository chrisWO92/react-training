import styles from "./App.module.css";
import { useEffect, useState, useRef } from "react";
import { getCharacter, getPeople, searchCharacter } from "./api/people.js"

export function App() {

  const inputSearch = useRef(null); /* This is used to set a ref to an element to call it in an element */
  const [people, setPeople] = useState([]); /* state to update the array of characters we're showing */
  const [textSearch, setTextSearch] = useState(""); /* state to manage the input we have in the input text */
  const [currentCharacter, setCurrentCharacter] = useState(1);
  const [details, setDetails] = useState({});
  const [errorState, setErrorState] = useState({ hasError: false});

  /* When the page is loaded we ask for the first 10 default characters that the API shows, and save it inside people variable */
  useEffect(() => {
    getPeople()
      .then((data) => setPeople(data.results))
      .catch(handleError)
  }, []);

  /* When we click in the names of the characters shown on the screen, we can get the id of the character we're clicking. We
     ask for the info of the character and set it in the details variable */
  useEffect(() => {
    getCharacter(currentCharacter).then(setDetails).catch(handleError);
  }, [currentCharacter]);

  
  const handleError = (err) => {
    setErrorState({ hasError: true, message: err.message });
  };

  /* This function is activated when we click in a character. We just get the id of the selected character and then set it in the currentCharacter variable */
  const showDetails = (character) => {
    const id = Number(character.url.split('/').slice(-2)[0]);
    setCurrentCharacter(id);
  };

  /* Function activated when the text inside the input changes. The text written is passed to textSearch variable. Here we use useRef hook to set an identifier in an element, this time called inputSearch */
  const onChangeTextSearch = (e) => {
    e.preventDefault();
    const text = inputSearch.current.value;
    setTextSearch(text);
  };

  /* This function identifies when user press Enter to ask for a keyword. We set people variable through setPeople, with the informatin about the characters related to the keyword entered */
  const onSearchSubmit = (e) => {
    if (e.key !== "Enter") return;
    inputSearch.current.value = "";
    setDetails({});
    searchCharacter(textSearch).then((data) => setPeople(data.results)).catch(handleError);
  };

  return (
    <div>
      <input 
        ref={inputSearch} 
        onChange={onChangeTextSearch}
        onKeyDown={onSearchSubmit}
        type="text" placeholder="Busca un personaje"/>
      <ul className={styles.App}>
        {/* Tthis is to verify if we're having an error, so we show it in the screen */}
        {errorState.hasError && <div>{errorState.message}</div>}
        {people.map((character) => (
          <li key={character.name} onClick={() => showDetails(character)}>{character.name}</li>
        ))}
      </ul>
      {details && (
        <aside>
        <h1>{details.name}</h1>
        <ul>
          <li>Height: {details.height}</li>
          <li>Mass: {details.mass}</li>
          <li>Birthyear: {details.birth_year}</li>
        </ul>
      </aside>
      )}
    </div>
  );
}

export default App;
