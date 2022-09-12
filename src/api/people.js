
/* This one is the function that request data from the API.  */

export async function getPeople() {
    try {
        /* We make the call and save the data in response */
        const response = await fetch('http://swapi.dev/api/people/');

        /* In the App.test.js file we set the ok variable in true. ok is a key inside the response array, so we ask if ok is not true, we throw an error that we declare above as a class */
        if (!response.ok){
            throw new NetworkError();
        }

        /* response is converted into a json file and saved in data */
        const data = await response.json();
        return data;
    } catch (err) {
        /* If there is another error message we catch it here */
        throw err;
    }
    
}

/* This function asks for the info about one specific character */
export async function getCharacter(id=1) {
    const response = await fetch(`http://swapi.dev/api/people/${id}`);  
    const data = await response.json();
    return data;
}

/* This functions asks for a list of all the characters that has certain keyword in its name */
export async function searchCharacter(name){
    const response = await fetch(`http://swapi.dev/api/people/?search=${name}`);  
    const data = await response.json();
    return data;
}

class NetworkError extends Error {
    constructor() {
        super("Network error");
    }
}