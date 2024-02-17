import React, { useState } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";
import axios from "axios";
import { axiosWithAuth } from "../axios";

const articlesUrl = "http://localhost:9000/api/articles";
const loginUrl = "http://localhost:9000/api/login";

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState(null);
  const [spinnerOn, setSpinnerOn] = useState(false);

  console.log(articles);
  console.log(currentArticleId);

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate();
  const redirectToLogin = () => {
    /* ✨ implement */
    navigate("/");
  };

  const redirectToArticles = () => {
    /* ✨ implement */
    navigate("/articles");
  };

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    localStorage.clear();
    setMessage("Goodbye!");
    redirectToLogin();
  };

  const login = async ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    try {
      setMessage(""); // Clear previous message
      setSpinnerOn(true); // Turn on spinner
      const response = await axios.post(loginUrl, {
        username,
        password,
      });
      setMessage(response.data.message);
      localStorage.setItem("token", response.data.token);
      redirectToArticles();
    } catch (error) {
      console.error("Login error:", error);
      setMessage("An error occurred during login.");
    } finally {
      setSpinnerOn(false); // Turn off spinner
    }
  };

  const getArticles = async () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    try {
      setMessage(""); // Clear previous message
      setSpinnerOn(true); // Turn on spinner
      const response = await axiosWithAuth().get(articlesUrl);
      setMessage(response.data.message);
      setArticles(response.data.articles);
    } catch (error) {
      console.error("Fetch articles error:", error);
      if (error.response && error.response.status === 401) {
        redirectToLogin();
      }
    } finally {
      setSpinnerOn(false); // Turn off spinner
    }
  };

  const postArticle = async (article) => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    try {
      setMessage(""); // Clear previous message
      setSpinnerOn(true); // Turn on spinner
      const response = await axiosWithAuth().post(articlesUrl, article); // Post article data
      setMessage(response.data.message); // Set message from server response
      setArticles([...articles, response.data.article]); // Update articles state with the new article
    } catch (error) {
      console.error("Post article error:", error);
      if (error.response && error.response.status === 401) {
        redirectToLogin();
      }
    } finally {
      setSpinnerOn(false); // Turn off spinner
    }
  };

  const updateArticle = async ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    const response = await axiosWithAuth().put(`http://localhost:9000/api/articles/${article_id}`, article);
    setMessage(response.data.message);
    const articlesCopy = [...articles];
    const indexOfArticleToChange = articlesCopy.findIndex(art => art.article_id === article_id);
    articlesCopy[indexOfArticleToChange] = response.data.article;
    setArticles(articlesCopy);
    setCurrentArticleId(undefined);
  };

  const deleteArticle = async (article_id) => {
    // ✨ implement
  try {
    const response = await axiosWithAuth().delete(`http://localhost:9000/api/articles/${article_id}`);
    console.log(response.data);
    setMessage(response.data.message);
    setArticles(prevArticles => prevArticles.filter(art => art.article_id !== article_id));
  } catch (error) {
    console.error("Delete article error:", error);
    if (error.response && error.response.status === 401) {
      redirectToLogin();
    }
  }
};

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        {" "}
        {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>
        <Routes>
  <Route path="/" element={<LoginForm login={login} />} />
  <Route
    path="articles"
    element={
      <>
        <ArticleForm
          updateArticle={updateArticle}
          postArticle={postArticle}
          setCurrentArticleId={setCurrentArticleId}
          setCurrentArticleIdUndefined={() => setCurrentArticleId(undefined)}
          article={articles.find((art) => art.article_id === currentArticleId)}
        />
        <Articles
          deleteArticle={deleteArticle}
          setCurrentArticleId={setCurrentArticleId}
          currentArticleId={currentArticleId}
          articles={articles}
          getArticles={getArticles}
        />
      </>
    }
  />
</Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  );
}
