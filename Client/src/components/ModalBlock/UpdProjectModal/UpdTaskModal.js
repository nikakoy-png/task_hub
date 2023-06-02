import ReactModal from 'react-modal';
import React, {useState} from "react";
import '../Modal.css'
import Cookies from "js-cookie";
import PrioritySelect from "../AddTaskModal/PrioritySelect";
import UserSelect from "../AddTaskModal/UserSelect";

function UpdTaskModal(props) {
    const {isOpen, onClose} = props
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('');
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [date, setDate] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}projects/${props.project_id}/tasks/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`,
                },
                body: JSON.stringify({
                    'title': title,
                    'description': description,
                    'project': props.project_id,
                    'due_date': date,
                    'accountable': assignedUsers,
                    'priority': priority,
                    'task': props.id
                })
            });
            console.log(
                    JSON.stringify({
                    'title': title,
                    'description': description,
                    'project': props.project_id,
                    'due_date': date,
                    'accountable': assignedUsers,
                    'priority': priority,
                    'task': props.id
                }
                ))
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            window.location.href = '/';

        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (event) => {
        setDate(event.target.value);
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
                <h2>Update Project</h2>
                <form onSubmit={handleSubmit}>
                    <div className="data-box">
                        <input
                            type="text"
                            name="name"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            required
                        />
                        <label>Title Project</label>
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

export default UpdTaskModal;