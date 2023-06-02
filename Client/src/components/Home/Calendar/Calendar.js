import React, {useEffect, useState} from "react";
import Calendar from "react-calendar";
import "./Calendar.scss";
import Cookies from "js-cookie";
import ReactPaginate from "react-paginate";
import * as displayedTasks from "react-bootstrap/ElementChildren";


const CalendarWithTasks = () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [tasksOnDate, setTasksOnDate] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // текущая страница
    const [tasksPerPage] = useState(3); // количество задач на странице
    const PER_PAGE = 3;
    const pageCount = Math.ceil(tasksOnDate.length / PER_PAGE);
    const displayedTasks = tasksOnDate.slice(
        currentPage * PER_PAGE,
        (currentPage + 1) * PER_PAGE
    );

    const fetchProjectsAndTasks = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}projects/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`,
                },
            });
            const projectsData = await res.json();
            setProjects(projectsData);

            const taskPromises = projectsData.map((project) =>
                fetch(
                    `${process.env.REACT_APP_API_URL}projects/${project.id}/tasks/`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${Cookies.get("token")}`,
                        },
                    }
                ).then((res) => res.json())
            );
            const tasksArrays = await Promise.all(taskPromises);
            const tasks = tasksArrays.flat();
            setTasks(tasks);
            console.log(tasks)
        } catch (error) {
            setIsLoaded(true);
            setError(error);
        }
    };

    useEffect(() => {
        fetchProjectsAndTasks();
    }, []);

    const handleClickDay = (date) => {
        const tasksOnDate = tasks.filter(
            (task) =>
                new Date(task.created_at).getDate() === date.getDate() &&
                new Date(task.created_at).getMonth() === date.getMonth() &&
                new Date(task.created_at).getFullYear() === date.getFullYear()
        );
        setSelectedDate(date);
        setSelectedTask(null);
        setTasksOnDate(tasksOnDate);
        setCurrentPage(1);
    };

    const handleClickTask = (task) => {
        setSelectedTask(task);
    };

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = tasksOnDate.slice(indexOfFirstTask, indexOfLastTask);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(tasksOnDate.length / tasksPerPage); i++) {
        pageNumbers.push(i);
    }
    const handlePageChange = ({selected}) => {
        setCurrentPage(selected);
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <div className="projects-section">
                        <Calendar className="react-calendar" onClickDay={handleClickDay}/>
                        {selectedDate && (
                            <>
                                <div className="tasks-container">
                                    <h2 className="tasks-header">
                                        Задачи на {selectedDate.toLocaleDateString()}
                                    </h2>
                                    {tasksOnDate.length > PER_PAGE && (
                                        <ReactPaginate
                                            previousLabel={'<'}
                                            nextLabel={'>'}
                                            pageCount={pageCount}
                                            onPageChange={handlePageChange}
                                            containerClassName={'pagination'}
                                            activeClassName={'active'}
                                        />
                                    )}

                                    <ul className="tasks-list">
                                        {displayedTasks.map((task) => (
                                            <li key={task.id} className="tasks-list-item">
                                                <button
                                                    className="tasks-list-item-btn"
                                                    onClick={() => handleClickTask(task)}
                                                >
                                                    {task.title}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarWithTasks;