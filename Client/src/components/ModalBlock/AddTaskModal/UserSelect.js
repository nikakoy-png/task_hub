import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import Cookies from "js-cookie";
import UserByID from "../../User/UserByID";

const customStyles = {
  control: (provided) => ({
    ...provided,
    borderRadius: '4px',
    borderColor: '#252323',
    backgroundColor: '#1c1b1b',
    minHeight: '50px',
    height: '50px',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#9928d2'
    },
    marginBottom: '20px'
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#5e1caf' : 'transparent',
    color: state.isSelected ? '#ffffff' : '#ffffff',
    '&:hover': {
      backgroundColor: '#5e1caf',
      color: '#ffffff'
    }
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#ffffff'
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#ffffff'
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#424242',
    color: '#ffffff',
    textColor: '#ffffff'
  })
};

function UserSelect({onChange, team_id}) {
    const [users, setUsers] = useState([]);
    const [value, setValue] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch(`${process.env.REACT_APP_API_URL}getUsers/${team_id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${Cookies.get('token')}`,
                    },
                }
            );
            const data = await response.json();
            const options = data.map(user => ({
                value: user.id,
                 label: <UserByID ID={user.id} />,
            }));
            setUsers(options);
        };
        fetchUsers();
    }, [team_id]);

    return (
        <Select
            options={users}
            styles={customStyles}
            value={{value: value, label: value}}
            onChange={(option) => {
                onChange(option.value);
                setValue(option.label);
            }}
            menuPortalTarget={document.body}
            menuPlacement="auto"
        />
    );
}

export default UserSelect;
