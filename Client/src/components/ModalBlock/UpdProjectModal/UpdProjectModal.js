import ReactModal from 'react-modal';
import React, {useState} from "react";
import '../Modal.css'
import Cookies from "js-cookie";
function UpdProjectModal(props) {
    const {isOpen, onClose} = props
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}projects/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`,
        },
        body: JSON.stringify({
          name,
          description,
          'project_id': props.id
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      window.location.href = '/';

    } catch (error) {
      console.error(error);
    }
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
              value={name}
              onChange={(event) => setName(event.target.value)}
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
          <button type="submit" className="d-flex justify-content-center">
            Submit
          </button>
        </form>
      </div>
    </ReactModal>
  );
}

export default UpdProjectModal;