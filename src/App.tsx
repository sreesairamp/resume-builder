import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResumeList from './components/ResumeList';
import ResumeForm from './components/ResumeForm';
import ResumeView from './components/ResumeView';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<ResumeList />} />
          <Route path="/create" element={<ResumeForm />} />
          <Route path="/edit/:id" element={<ResumeForm />} />
          <Route path="/view/:id" element={<ResumeView />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;
