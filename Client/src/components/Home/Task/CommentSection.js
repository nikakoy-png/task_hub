import React, {useEffect, useState} from 'react';
import './CommentSection.css';
import thumbsUpIcon from './icon/thumbsUpIcon.svg';
import thumbsDownIcon from './icon/thunbsDownIcon.svg';
import Cookies from "js-cookie";
import UserByID from "../../User/UserByID";

const CommentSection = (props) => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [content, setContent] = useState('');
    const [comments, setComments] = useState([]);

    const fetchComments = () => {
        fetch(`${process.env.REACT_APP_API_URL}comment/${props.task_id}/team/${props.team_id}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${Cookies.get('token')}`,
            },
        })
            .then(res => res.json())
            .then(
                (commentsResult) => {
                    setIsLoaded(true);
                    const commentRequests = commentsResult.map((comment) => {
                        return fetch(`${process.env.REACT_APP_API_URL}comment/${comment.id}/reaction/${props.team_id}/`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${Cookies.get('token')}`,
                            },
                        })
                            .then(res => res.json())
                            .then(
                                (reactionResult) => {
                                    return {
                                        ...comment,
                                        reaction: reactionResult,
                                    };
                                },
                                (error) => {
                                    return {
                                        ...comment,
                                        reaction: {
                                            count_like: 0,
                                            count_dislike: 0,
                                            user_reaction: null,
                                        },
                                        error: error,
                                    };
                                }
                            );
                    });
                    Promise.all(commentRequests)
                        .then((combinedResults) => {
                            setComments(combinedResults);
                            console.log(combinedResults)
                        })
                        .catch((error) => {
                            setError(error);
                        });
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }
    useEffect(() => {
        fetchComments();
    }, []);

    const handleCommentSubmit = (event) => {
        event.preventDefault();
        try {
            const response = fetch(`${process.env.REACT_APP_API_URL}comment/${props.task_id}/team/${props.team_id}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`,
                },
                body: JSON.stringify({
                    "content": content,
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error(error);
        }
        setContent('');
        fetchComments();
    };

    const handleCommentChange = (event) => {
        setContent(event.target.value);
    };

    const handleReplySubmit = (commentIndex, reply) => {
        const updatedComments = [...comments];
        updatedComments[commentIndex].replies.push(reply);
        setComments(updatedComments);
    };

    const handleReaction = (commentIndex, reaction_type) => {
        try {
            const response = fetch(`${process.env.REACT_APP_API_URL}comment/${commentIndex}/reaction/${props.team_id}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`,
                },
                body: JSON.stringify({
                    "reaction_type": reaction_type,
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error(error);
        }
        fetchComments();
    };

    return (
        <div className="comment-section">
            <form onSubmit={handleCommentSubmit}>
                <textarea
                    value={content}
                    onChange={handleCommentChange}
                    placeholder="Оставить комментарий"
                    required
                />
                <button type="submit">Отправить</button>
            </form>
            <h3>{comments.length} комментариев</h3>
            <ul>
                {comments.map((comment) => (
                    <li key={comment.id}>
                        <div className="comment">
                            <p>
                                <div style={{
                                    backgroundColor: 'black',
                                    borderRadius: '10px',
                                    paddingLeft: '5px',
                                    paddingRight: '5px',
                                    margin: '0 auto',
                                }}><UserByID ID={comment.commenter}/></div>
                                {comment.content}</p>
                            <div className="like-dislike-container">
                                <button className="like-button" onClick={() => handleReaction(comment.id,
                                    "like")}>
                                    <img style={{width: '15px', marginRight: '10px'}} src={thumbsUpIcon} alt="Like"/>
                                    <span>{comment.reaction.count_like}</span>
                                </button>
                                <button className="dislike-button" onClick={() => handleReaction(comment.id,
                                    "dislike")}>
                                    <img style={{width: '15px', marginRight: '10px'}} src={thumbsDownIcon}
                                         alt="Dislike"/>
                                    <span>{comment.reaction.count_dislike}</span>
                                </button>
                            </div>
                        </div>
                        {/*<ReplySection*/}
                        {/*    commentIndex={comment.id}*/}
                        {/*    replies={comment.replies}*/}
                        {/*    onReplySubmit={handleReplySubmit}*/}
                        {/*/>*/}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const ReplySection = ({commentIndex, replies, onReplySubmit}) => {
    const [newReply, setNewReply] = useState('');

    const handleReplySubmit = (event) => {
        event.preventDefault();
        onReplySubmit(commentIndex, newReply);
        setNewReply('');
    };

    const handleReplyChange = (event) => {
        setNewReply(event.target.value);
    };

    return (
        <div className="reply-section">
            <form onSubmit={handleReplySubmit}>
                <textarea
                    value={newReply}
                    onChange={handleReplyChange}
                    placeholder="Ответить"
                    required
                />
                <button type="submit">Отправить</button>
            </form>
            <ul>
                {/*{replies.map((reply, index) => (*/}
                {/*    <li key={index}>*/}
                {/*        <p>{reply}</p>*/}
                {/*    </li>*/}
                {/*))}*/}
            </ul>
        </div>
    );
};

export default CommentSection;
