import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";
import Loading from "../../Loading/Loading";
import UserByID from "../../User/UserByID";
import DeleteTaskModal from "../../ModalBlock/DeleteProjectModal/DeleteTaskModal";
import UpdTaskModal from "../../ModalBlock/UpdProjectModal/UpdTaskModal";
import CommentSection from "./CommentSection";

const Project = (props) => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [task, setTask] = useState([]);

    const today = new Date();
    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};

    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [isModalDelOpen, setIsModalDelOpen] = useState(false);
    const [isModalUpdOpen, setIsModalUpdOpen] = useState(false);

    const openDelModal = () => {
        setIsModalDelOpen(true);
    };
    const openUpdModal = () => {
        setIsModalUpdOpen(true);
    };

    const closeDelModal = () => {
        setIsModalDelOpen(false);
    };
    const closeUpdModal = () => {
        setIsModalUpdOpen(false);
    };


    const fetchTasks = () => {
        fetch(`${process.env.REACT_APP_API_URL}task/${props.id}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${Cookies.get('token')}`,
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setTask(result);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }
    useEffect(() => {
        fetchTasks();
    }, []);


    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <Loading/>;
    } else {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="projects-section">
                            <div className="projects-section-header">
                                <p>{props.title} \ Tasks </p>
                                <p className="time">{today.toLocaleDateString('en-US', options)}</p>
                            </div>
                            <div className="projects-section-line">
                                <div className="projects-section-header">
                                    <p style={{color: '#ffffff'}}>Status task: {task.status} \ Due
                                        date: {task.due_date}</p>
                                </div>
                                <div className="view-actions">
                                    <button onClick={openUpdModal} className="view-btn list-view"
                                            title="Delete Project">
                                        <svg className="icon icon-edit" height="24" viewBox="0 0 24 24" width="24"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                                                fill="#fff">
                                            </path>
                                        </svg>
                                    </button>
                                    <UpdTaskModal isOpen={isModalUpdOpen}
                                                  onClose={closeUpdModal}
                                                  onUpdateProjects={fetchTasks}
                                                  title={task.title}
                                                  description={task.description}
                                                  id={task.id}
                                                  project_id={task.project}
                                                  team={props.team}/>
                                    <button onClick={openDelModal} className="view-btn list-view"
                                            title="Delete Project">
                                        <svg className="icon icon-delete" height="24" viewBox="0 0 24 24" width="24"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                                                fill="#fff"></path>
                                        </svg>
                                    </button>
                                    <DeleteTaskModal isOpen={isModalDelOpen}
                                                     onClose={closeDelModal}
                                                     onUpdateTasks={fetchTasks}
                                                     title={props.title}
                                                     id={props.id}
                                                     project_id={task.project}/>
                                </div>
                            </div>
                                <div className="projects-section">
                                    <div className="projects-section-header">
                                        <p>Description: {task.description}</p>
                                    </div>
                                    <div className="projects-section-header">
                                        <h6>Accountable User: <UserByID ID={task.accountable}/></h6>
                                    </div>
                                    <div className="projects-section-header">
                                        <h6>Created at: {task.created_at}</h6>
                                    </div>
                                    <div className="projects-section-header">
                                        <CommentSection task_id={task.id}
                                                        team_id={props.team}/>
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};

export default Project;