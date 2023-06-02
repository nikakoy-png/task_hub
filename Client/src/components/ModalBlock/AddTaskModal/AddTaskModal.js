import ReactModal from 'react-modal';
import React, {useState} from 'react';
import '../Modal.css';
import Cookies from 'js-cookie';
import PrioritySelect from "./PrioritySelect";
import UserSelect from "./UserSelect";

function AddTaskModal(props) {
    const {isOpen, onClose, onUpdateTasks} = props;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('');
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [date, setDate] = useState("");

    const handleSubmit = async (event) => {
        console.log(props.team)
        event.preventDefault();
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}projects/${props.id}/tasks/`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('token')}`,
                    },
                    body: JSON.stringify({
                        title,
                        description,
                        priority,
                        accountable: assignedUsers,
                        project: props.id,
                        due_date: date,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            onUpdateTasks();
            onClose();
        } catch (error) {
            console.error(error);
        }
    };


    const handleChange = (event) => {
        setDate(event.target.value);
    };


    const handleAssignedUsersChange = (event) => {
        const users = event.target.value.split(',').map((name) => name.trim());
        setAssignedUsers(Array.isArray(users) ? users : []);
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Модальное окно добавления нового проекта"
            style={{
                content: {
                    border: 'none',
                    margin: 'auto',
                    maxWidth: '500px',
                    background: 'rgba(0,0,0,0)',
                },
                overlay: {
                    background: 'rgba(0, 0, 0, 0.5)',
                },
            }}
        >
            <div className="form-box">
                <h2>Create Task</h2>
                <form onSubmit={handleSubmit}>
                    <div className="data-box">
                        <input
                            type="text"
                            name="name"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            required
                        />
                        <label>Title Task</label>
                    </div>
                    <div className="data-box">
                        <input
                            type="text"
                            name="description"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                        />
                        <label>Description</label>
                    </div>
                    <div className="data-box">
                        <input
                            type="date"
                            name="due date"
                            value={date}
                            onChange={handleChange}
                            required
                        />
                        <label>Due date</label>
                    </div>
                    <div className="data-box">
                        <h6 style={{color: '#9e32b9'}}>Priority</h6>
                        <PrioritySelect value={priority} onChange={setPriority}/>
                    </div>
                    <div className="data-box">
                        <h6 style={{color: '#9e32b9'}}>Assigned Users</h6>
                        <UserSelect value={assignedUsers} onChange={setAssignedUsers} team_id={props.team}/>
                    </div>
                    <button type="submit" className="d-flex justify-content-center">
                        Submit
                    </button>
                </form>
            </div>
        </ReactModal>
    );
}

export default AddTaskModal;
