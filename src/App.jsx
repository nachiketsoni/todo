import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login.jsx";
import Signup from "./components/SignUp.jsx";
import Todo from "./components/Todo.jsx"; // Create a simple Todo component or mock
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/todo"
        element={
          <ProtectedRoute>
            <Todo />
          </ProtectedRoute>
        }
      />
      {/* Add a default route or catch-all */}
      <Route path="/" element={<Login />} />
    </Routes>
  );
};

export default App;
