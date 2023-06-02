import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";
import Loading from "../../Loading/Loading";
import AddTaskModal from "../../ModalBlock/AddTaskModal/AddTaskModal";
import DeleteProjectModal from "../../ModalBlock/DeleteProjectModal/DeleteProjectModal";
import UpdProjectModal from "../../ModalBlock/UpdProjectModal/UpdProjectModal";

const Project = (props) => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [tasks, setTasks] = useState([[]]);

    const today = new Date();
    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};

    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [isModalDelOpen, setIsModalDelOpen] = useState(false);
    const [isModalUpdOpen, setIsModalUpdOpen] = useState(false);

    const openDelModal = () => {
        setIsModalDelOpen(true);
    };
    const openAddModal = () => {
        setIsModalAddOpen(true);
    };
    const openUpdModal = () => {
        setIsModalUpdOpen(true);
    };

    const closeDelModal = () => {
        setIsModalDelOpen(false);
    };
    const closeAddModal = () => {
        setIsModalAddOpen(false);
    };
    const closeUpdModal = () => {
        setIsModalUpdOpen(false);
    };

    const handleShowTask = (num, title, team) => {
        props.showTask(num, title, team);
    }

    const fetchTasks = () => {
        fetch(`${process.env.REACT_APP_API_URL}projects/${props.id}/tasks/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${Cookies.get('token')}`,
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setTasks(result);
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
                                <div className="projects-status">
                                    <div className="item-status">
                                        <span
                                            className="status-number">{(tasks.filter(item => item.completed === false)).length}</span>
                                        <span className="status-type">In Progress</span>
                                    </div>
                                    <div className="item-status">
                                        <span
                                            className="status-number">{(tasks.filter(item => item.completed === true)).length}</span>
                                        <span className="status-type">Completed</span>
                                    </div>
                                    <div className="item-status">
                                        <span className="status-number">{tasks.length}</span>
                                        <span className="status-type">Total Tasks</span>
                                    </div>
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
                                    <UpdProjectModal isOpen={isModalUpdOpen}
                                                     onClose={closeUpdModal}
                                                     onUpdateProjects={fetchTasks}
                                                     title={props.title}
                                                     description={props.description}
                                                     id={props.id}/>
                                    <button onClick={openDelModal} className="view-btn list-view"
                                            title="Delete Project">
                                        <svg className="icon icon-delete" height="24" viewBox="0 0 24 24" width="24"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                                                fill="#fff"></path>
                                        </svg>
                                    </button>
                                    <DeleteProjectModal isOpen={isModalDelOpen}
                                                        onClose={closeDelModal}
                                                        onUpdateTasks={fetchTasks}
                                                        title={props.title}
                                                        id={props.id}/>
                                    <button onClick={openAddModal} className="view-btn list-view"
                                            title="Create Project">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 24 24" fill="none"
                                             stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                             strokeLinejoin="round"
                                             className="feather feather-list">
                                            <path d="M12 5v14M5 12h14"></path>
                                        </svg>
                                    </button>
                                    <AddTaskModal isOpen={isModalAddOpen}
                                                  onClose={closeAddModal}
                                                  onUpdateTasks={fetchTasks}
                                                  id={props.id}
                                                  team={props.team}/>
                                </div>
                            </div>
                            <div className="project-boxes jsGridView">
                                {tasks.map((task) => (
                                    <div className="project-box-wrapper" key={task.name}>
                                        <a onClick={() => handleShowTask(task.id, task.name, props.team)}>
                                            <div className="project-box" style={{
                                                backgroundColor: task.priority === '1' ? '#62aad9' :
                                                    task.priority === '2' ? '#ff7545' : '#fa3b3b'
                                            }}>
                                                <div className="project-box-header">
                                                    <span>{task.created_at}</span>
                                                    <div className="more-wrapper">
                                                        <button className="project-btn-more">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24"
                                                                 viewBox="0 0 24 24"
                                                                 fill="none" stroke="currentColor" strokeWidth="2"
                                                                 strokeLinecap="round"
                                                                 strokeLinejoin="round"
                                                                 className="feather feather-more-vertical">
                                                                <circle cx="12" cy="12" r="1"></circle>
                                                                <circle cx="12" cy="5" r="1"></circle>
                                                                <circle cx="12" cy="19" r="1"></circle>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="project-box-content-header">
                                                    <p className="box-content-header">{task.title}</p>
                                                    <p className="box-content-subheader">{task.description}</p>
                                                </div>
                                                <div className="progress-bar progress-bar-striped"
                                                     role="progressbar" style={{
                                                         // replace percent
                                                    width: '100%',
                                                    backgroundColor: task.priority === '1' ? '#ff352e' :
                                                                  task.priority === '2' ? '#055a8d' : '#ff662e',
                                                }} aria-valuenow="100"
                                                     color={'#000000'}
                                                     aria-valuemin="0" aria-valuemax="100">{task.status}
                                                </div>
                                                {/*<div className="box-progress-wrapper">*/}
                                                {/*    <p className="box-progress-header">In progress</p>*/}
                                                {/*    <div className="box-progress-bar">*/}
                                                {/*    <span className="box-progress"*/}
                                                {/*          style={{*/}
                                                {/*              width: 60,*/}
                                                {/*              backgroundColor: task.priority === '1' ? '#ff352e' :*/}
                                                {/*                  task.priority === '2' ? '#055a8d' : '#ff662e'*/}
                                                {/*          }}></span>*/}
                                                {/*    </div>*/}
                                                {/*    /!*<p className="box-progress-percentage">80%</p>*!/*/}
                                                {/*</div>*/}
                                                <div className="project-box-footer" style={{marginTop: '2vh'}}>
                                                    <div className="participants">
                                                        <img
                                                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=2550&amp;q=80"
                                                            alt="participant"></img>
                                                        <img
                                                            src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTB8fG1hbnxlbnwwfHwwfA%3D%3D&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=900&amp;q=60"
                                                            alt="participant"></img>
                                                        <button className="add-participant" style={{color: '#ff942e'}}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="12"
                                                                 height="12"
                                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                                 strokeWidth="3"
                                                                 strokeLinecap="round" strokeLinejoin="round"
                                                                 className="feather feather-plus">
                                                                <path d="M12 5v14M5 12h14"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <div className="days-left" style={{color: '#ff942e'}}>
                                                        2 Days Left
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};

export default Project;