import ReactModal from 'react-modal';
import '../Modal.css'
import Cookies from "js-cookie";
function DeleteProjectModal(props) {
    const {isOpen, onClose, onUpdateTasks} = props


      const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}projects/`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Cookies.get('token')}`,
            },
            body: JSON.stringify({
                'project_id': props.id
            })
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          onUpdateTasks();

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
            <h2>Are you sure you want to delete "{props.title}"</h2>
            <form onSubmit={handleSubmit}>
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
                <button onClick={() => onClose()}  className="btn btn-secondary">
                    Cancel
                </button>
            </form>
          </div>
        </ReactModal>
      );
    }

export default DeleteProjectModal;