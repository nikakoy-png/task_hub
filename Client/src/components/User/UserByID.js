import React, {useEffect, useState} from 'react';
import Cookies from 'js-cookie';

function UserByID(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [user, setUser] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}getUser/${props.ID}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${Cookies.get('token')}`,
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setUser(result)
                    console.log(result)
                    if (result.username === undefined) {
                        Cookies.remove('token');
                    }
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                    <img
                        src={`http://localhost:8000${user.img}`}
                        alt="avatar"
                        className="img-thumbnail rounded-circle d-inline-block me-3"
                        style={{width: '30px', height: '30px'}}
                    />
                    <h2 className="text-white mb-0 fw-bold" style={{fontSize: '3vh'}}>{user.username}</h2>
                </div>
            </div>

        )
    }
}

export default UserByID;