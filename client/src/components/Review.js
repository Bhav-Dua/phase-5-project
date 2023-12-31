import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBooks } from '../features/books/booksSlice';
import { login } from '../features/user/userSlice';

function Review({ id, content, rating, username, userId, bookId }) {
  const user = useSelector(state => state.user.data);
  const inventory = useSelector(state => state.books.inventory);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [editedRating, setEditedRating] = useState(rating);
  const [errors, setErrors] = useState([]);

  function handleEdit() {
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setIsEditing(false);
    setEditedContent(content);
    setEditedRating(rating);
    setErrors([]);
  }

  function handleSave() {
    fetch(`/reviews/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: editedContent,
        rating: editedRating,
      }),
    }).then(r => {
      if (r.ok) {
        r.json().then(saveUpdatedReview);
        setIsEditing(false);
      } else {
        r.json().then(r => setErrors(r.errors));
      }
    });
  }

  function saveUpdatedReview(updatedReview) {
    const updatedBooks = inventory.map(book => {
      if (book.id === updatedReview.book_id) {
        const updatedReviews = book.reviews.map(review => {
          if (review.id === updatedReview.id) {
            return updatedReview;
          }
          return review;
        });
        return { ...book, reviews: updatedReviews };
      }
      return book;
    });
    const updatedUserReviews = user.reviews.map(review => {
      if (review.id === updatedReview.id) {
        return updatedReview;
      }
      return review;
    });
    const updatedUser = { ...user, reviews: updatedUserReviews };
    dispatch(setBooks(updatedBooks));
    dispatch(login(updatedUser));
  }

  function handleDelete() {
    fetch(`/reviews/${id}`, {
      method: 'DELETE',
    }).then(r => {
      if (r.ok) {
        deleteReview();
      } else {
        r.json().then(r => setErrors(r.errors));
      }
    });
  }

  function deleteReview() {
    const updatedBooks = inventory.map(book => {
      if (book.id === bookId) {
        const updatedReviews = book.reviews.filter(review => review.id !== id);
        return { ...book, reviews: updatedReviews };
      }
      return book;
    });
    const updatedUserReviews = user.reviews.filter(review => review.id !== id);
    const updatedUser = { ...user, reviews: updatedUserReviews };
    dispatch(setBooks(updatedBooks));
    dispatch(login(updatedUser));
  }

  return (
    <div className='item'>
      <div className='content'>
        <h3 className='header'>{username}</h3>
        {isEditing ? (
          <>
            <textarea value={editedContent} onChange={e => setEditedContent(e.target.value)} />
            <div>
              Rating:{' '}
              <input
                type='number'
                value={editedRating}
                onChange={e => setEditedRating(e.target.value)}
              />
            </div>
          </>
        ) : (
          <>
            <h4 className='description'>{content}</h4>
            <div className='rating' style={{ marginTop: '10px' }}>
              Rating: {rating}
            </div>
          </>
        )}
      </div>
      {user && user.id == userId ? (
        <div className='ui buttons'>
          {isEditing ? (
            <>
              <div className='ui button' onClick={handleCancelEdit}>
                Cancel
              </div>
              <div className='ui button' onClick={handleSave}>
                Save
              </div>
            </>
          ) : (
            <>
              <div className='ui button' onClick={handleEdit}>
                Edit
              </div>
              <div className='ui button' onClick={handleDelete}>
                Delete
              </div>
            </>
          )}
        </div>
      ) : (
        <></>
      )}
      <div className='errors' style={{ paddingLeft: '1rem' }}>
        {errors.map(error => (
          <p>{error}</p>
        ))}
      </div>
    </div>
  );
}

export default Review;
