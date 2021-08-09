
import Storage from './storage'

class UserSession {
    static instance = new UserSession();
    //Try to login with django and get the response
    login = async body => {
        try {
            let request = await fetch(`https://django-api-cesar.herokuapp.com/users/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            let response = await request.json();
            try {
                let key = `token-${response.user.username}`;
                await Storage.instance.store(key, response.token);
                key = `id-${response.user.username}`;
                await Storage.instance.store(key, JSON.stringify(response.user));
                return true;
            } catch (err) {
                return response;
            }

        } catch (err) {
            console.log('Login error', err);
            throw Error(err);
        }
    };
    //Try to logout deleting tokens
    logout = async () => {
        try {
            const allkeys = await Storage.instance.getAllKeys();
            const tokens = allkeys.filter(key => key.includes('token-'));
            await Storage.instance.multiRemove(tokens);
            const ids = allkeys.filter(key => key.includes('id-'));
            await Storage.instance.multiRemove(ids);
            return true;
        } catch (err) {
            console.log('Logout err', err);
            return false;
        }
    };
    //Signup to the django API 
    signup = async body => {
        try {
            let request = await fetch(`https://django-api-cesar.herokuapp.com/users/signup/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(body),
            });
            let response = await request.json();
            if (typeof response.username == 'string') {
                return response.username;
            } else {
                return response;
            }
        } catch (err) {
            console.log('Sing up Err', err);
            throw Error(err);
        }
    };
    //To fetch user json
    getUser = async () => {
        try {
            const allKeys = await Storage.instance.getAllKeys();
            const data = allKeys.filter(key => key.includes('id-'));
            const user = await Storage.instance.get(data.toString());
            return JSON.parse(user);
        } catch (err) {
            console.log('Get user err', err);
        }
    };
    //Get the auth token from django 
    getToken = async username => {
        try {
            const key = `token-${username}`;
            return await Storage.instance.get(key);
        } catch (err) {
            console.log('Get token error', err);
        }
    };
    //Try to edit the profile and send the data to django
    editProfile = async (id, token, body) => {
        let uploadData = new FormData();
        uploadData = new FormData;
        uploadData.append('profile.profile_picture', {
            type: 'image/jpeg',
            uri: body,
            name: 'profile.jpg',
        });
        try {
            let request = await fetch(`https://django-api-cesar.herokuapp.com/profile/${id}/`, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Token ${token}`,
                },
                body: uploadData,
            });
            console.log(request);
            let response = await request.json();
            return response;
        } catch (err) {
            console.log('Edit profile error', err);
        }
    }

}

export default UserSession;