import 'semantic-ui-css/semantic.min.css';
import './App.css';
import { useDispatch } from 'react-redux';
import { login } from '../features/user/userSlice';
import { setBooks } from '../features/books/booksSlice';
import { useEffect } from 'react';
import NavBar from './NavBar';
import { Route, Switch } from 'react-router-dom/cjs/react-router-dom.min';
import LoginForm from './LoginForm';
import SignUpForm from './SignupForm';
import BookList from './BookList';
import BookPage from './BookPage';
import MyBooks from './MyBooks';
import MyReviews from './MyReviews';
import BookForm from './BookForm';
import HomePage from './HomePage';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = 'BookStore';
  });

  useEffect(() => {
    fetch('/me').then(r => {
      if (r.ok) {
        r.json().then(r => dispatch(login(r)));
      }
    });
  }, []);

  useEffect(() => {
    fetch('/books')
      .then(r => r.json())
      .then(r => dispatch(setBooks(r)));
  }, []);

  return (
    <div className='App'>
      <NavBar />
      <Switch>
        <Route path='/login'>
          <LoginForm />
        </Route>
        <Route path='/signup'>
          <SignUpForm />
        </Route>
        <Route path='/newBook'>
          <BookForm />
        </Route>
        <Route path='/books/:id'>
          <BookPage />
        </Route>
        <Route path='/myBooks'>
          <MyBooks />
        </Route>
        <Route path='/myReviews'>
          <MyReviews />
        </Route>
        <Route path='/books'>
          <BookList />
        </Route>
        <Route exact path='/'>
          <HomePage />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
