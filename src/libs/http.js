import BASE_URL from "./url";
//flask API
class Http {
    static instance = new Http();
    //Get all badges from 
    get_all = async () => {
        try {
            let request = await fetch(`${BASE_URL}/all/`);
            let response = await request.json();
            return response;
        } catch (err) {
            console.log('http get error', err);
            throw Error(err);
        }
    };
    //Get a single badge 
    get = async badgeId => { 
        try {
            let request = await fetch(`${BASE_URL}/_id=${badgeId}/`);
            let response = await request.json();
            return response;
        } catch (err) {
            console.log('http get method err', err);
            throw Error(err);
        }
    };
    //Make a new badge
    post = async badge => { 
        try {
            let request = await fetch(`${BASE_URL}/new/`, {
                method: 'POST',
                body: JSON.stringify(badge),
            });
            let response = await request.json();
            return response;
        } catch (err) {
            console.log('http post method err', err);
            throw Error(err);
        }
    };
    //Edit a existing badge
    put = async (badgeId, body) => { 
        try {
            let request = await fetch(`${BASE_URL}/_id=${badgeId}/`, {
                method: 'PUT',
                headers:{
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(body),
            });
            let response = await request.json();
            return response;
        } catch (err) {
            console.log('http put method err', err);
            throw Error(err);
        }
    };

    //delete a badge
    remove = async badgeId => { 
        try {
            let request = await fetch(`${BASE_URL}/_id=${badgeId}/`, {
                method: 'DELETE',
            });
            let response = await request.json();
            return response;
        } catch (err) {
            console.log('http delete method err', err);
            throw Error(err);
        }
    };
}

export default Http;