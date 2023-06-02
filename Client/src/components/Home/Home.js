import React, { useState } from 'react';
import './Home.scss'
import ProjectList from "./ProjectList/ProjectList.js";
import Sidebar from "./Sidebar/Sidebar.js";
import Project from "./Project/Project.js";
import CalendarWithTasks from "./Calendar/Calendar";
import Task from "./Task/Task";


const Home = () => {
    const [selectedMenu, setSelectedMenu] = useState("projects");
    const [selectedProject, setSelectedProject] = useState()
    const [selectedTask, setSelectedTask] = useState()
    const [titleSelectedProject, setTitleSelectedProject] = useState()
    const [selectedTeam, setTeam] = useState()
    const handleSelectMenu = (name) => {
        setSelectedMenu(name);
    };

    const handleShowProject = (num, title, team) => {
        setSelectedProject(num);
        setTeam(team)
        setSelectedMenu("project");
        setTitleSelectedProject(title);

    };

    const handleShowTask = (num, title, team) => {
        setSelectedTask(num);
        setSelectedMenu("task");
        setTitleSelectedProject(title);
        setTeam(team)
    };

    return (
      <div className="app-container">
          <div className="app-content">
              <Sidebar showMenu={handleSelectMenu}/>
              {selectedMenu === "projects" && <ProjectList showProject={handleShowProject} />}
              {selectedMenu === "project" && <Project showTask={handleShowTask}
                                                      id={selectedProject}
                                                      title={titleSelectedProject}
                                                      team={selectedTeam} />}
              {selectedMenu === "calendar" && <CalendarWithTasks />}
              {selectedMenu === "task" && <Task id={selectedTask}
                                                title={titleSelectedProject}
                                                team={selectedTeam}/>}
          </div>
      </div>
    );
};

export default Home;