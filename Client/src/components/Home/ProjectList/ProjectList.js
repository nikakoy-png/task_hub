import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";
import Loading from "../../Loading/Loading";
import AddProjectModal from "../../ModalBlock/AddProjectModal/AddProjectModal";
import UserByID from "../../User/UserByID";

const ProjectList = (props) => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [projects, setProjects] = useState([[]]);

    const today = new Date();
    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const fetchProjects = () => {
        fetch(`${process.env.REACT_APP_API_URL}projects/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${Cookies.get('token')}`,
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result)
                    setIsLoaded(true);
                    setProjects(result);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleShowProject = (num, title, team) => {
        props.showProject(num, title, team);
    }

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
                                <p>Projects</p>
                                <p className="time">{today.toLocaleDateString('en-US', options)}</p>
                            </div>
                            <div className="projects-section-line">
                                <div className="projects-status">
                                    <div className="item-status">
                                        <span className="status-number">0</span>
                                        <span className="status-type">In Progress</span>
                                    </div>
                                    <div className="item-status">
                                        <span className="status-number">0</span>
                                        <span className="status-type">Completed</span>
                                    </div>
                                    <div className="item-status">
                                        <span className="status-number">{projects.length}</span>
                                        <span className="status-type">Total Projects</span>
                                    </div>
                                </div>
                                <div className="view-actions">
                                    <button onClick={openModal} className="view-btn list-view" title="Create Project">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 24 24" fill="none"
                                             stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                             strokeLinejoin="round"
                                             className="feather feather-list">
                                            <path d="M12 5v14M5 12h14"></path>
                                        </svg>
                                    </button>
                                    <AddProjectModal isOpen={isModalOpen}
                                                     onClose={closeModal}
                                                     onUpdateProjects={fetchProjects}/>
                                </div>
                            </div>
                            <div className="project-boxes jsGridView">
                                {projects.map((project) => (
                                    <div className="project-box-wrapper" key={project.name}>
                                        <a onClick={() => handleShowProject(project.id, project.name, project.team)}>
                                            <div className="project-box" style={{backgroundColor: '#8155f3'}}>
                                                <div className="project-box-header">
                                                    <span>{project.created_at}</span>
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
                                                    <p className="box-content-header">{project.name}</p>
                                                    <p className="box-content-subheader">{project.description}</p>
                                                </div>
                                                <div className="box-progress-wrapper">
                                                    <div className="progress d-flex">
                                                        <div className="progress-bar progress-bar-striped"
                                                             role="progressbar" style={{
                                                            width: '100%',
                                                            backgroundColor: '#f52b2b',
                                                        }} aria-valuenow="100"
                                                             color={'#000000'}
                                                             aria-valuemin="0" aria-valuemax="100">Done
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="project-box-footer" style={{marginTop: '2vh'}}>
                                                    <div className="participants">
                                                        <UserByID ID={project.owner}/>
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

export default ProjectList;