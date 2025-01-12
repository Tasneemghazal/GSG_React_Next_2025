import './App.css'
import Main from './screens/Main.screen';
import About from './screens/About.screen';
import NotFound from './screens/NotFound.screen';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import StudentDetails from './screens/StudentDetails.screen';
import { useEffect, useReducer} from 'react';
import useLocalStorage from './hooks/local-storage.hook';
import { IStudent } from './types';
import AddStudent from './screens/AddStudent.screen';
import studentReducer from './state/reducer';

function App() {
  const h1Style = { color: '#69247C', fontSize: '24px' };

  const [state, dispatch] = useReducer(studentReducer, { students: [], totalAbsents: 0, filteredList:[]});
  const { storedData } = useLocalStorage(state.students, 'students-list');
  const location = useLocation();


  useEffect(() => {
    dispatch({type: "INIT_DATA", payload:storedData ||[]});
  }, [storedData]);

  const removeFirst = () => {
    dispatch({type: "REMOVE_FIRST"})
  }

  const handleAbsentChange = (id: string, change: number) => {
    dispatch({type: "ABSENT_CHANGE", payload: {id, change}})
  }

  const handleAddStudent = (newStudent: IStudent) => {
    dispatch({type: 'ADD_STUDENT', payload: newStudent})
  }

  return (
    <div className="main wrapper">
      <h1 style={h1Style}>Welcome to GSG React/Next Course</h1>
      <nav>
        <Link to='/' className={location.pathname === '/' ? 'active' : ''}>Home Page</Link>
        <Link to='/add' className={location.pathname === '/add' ? 'active' : ''}>Add Student</Link>
        <Link to='/about' className={location.pathname === '/about' ? 'active' : ''}>About App</Link>
      </nav>
      <Routes>
        <Route path='/' element={
          <Main
            studentsList={state.students}
            totalAbsents={state.totalAbsents}
            onAbsent={handleAbsentChange}
            onRemove={removeFirst}
          />
        } />
        <Route path='/add' element={<AddStudent onAdd={handleAddStudent} />} />
        <Route path='/about' element={<About />} />
        <Route path='/student/:id' element={<StudentDetails />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App;