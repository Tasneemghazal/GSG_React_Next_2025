import { useEffect, useReducer, useRef} from "react";
import Student from "../components/student/student.component";
import { IStudent } from "../types";

import { useSearchParams } from "react-router-dom";
import React from "react";
import studentReducer from "../state/reducer";

interface IProps {
  totalAbsents: number;
  studentsList: IStudent[];
  onAbsent: (id: string, change: number) => void;
  onRemove: () => void;
}

const COURSES_FILTERS = ["Math", "HTML", "CSS", "OOP"];

const Main = (props: IProps) => {
  const { totalAbsents, studentsList } = props;
  const [params, setParams] = useSearchParams();
  const [state, dispatch] = useReducer(studentReducer, {
    students: studentsList,
    totalAbsents: totalAbsents,
    filteredList: studentsList,
  });
  const lastStdRef = useRef<HTMLDivElement>(null);

  const scrollToLast = () => {
    if (lastStdRef.current) {
      lastStdRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const query = params.get("q") || "";
    const graduated = params.get("graduated") || "all";
    const courses = params.getAll("courses");
    const minAbs = Number(params.get('minAbs')) || 0;
    const maxAbs = Number(params.get('maxAbs')) || 100;

    dispatch({ type: "Filter", payload: { query, graduated, courses, minAbs, maxAbs } });
  }, [params, studentsList]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    if (query.length) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    setParams(params);
  };

  const handleGardFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const v = event.target.value;
    if (v === "all") {
      params.delete("graduated");
    } else {
      params.set("graduated", v);
    }
    setParams(params);
  };

  const handleCourseFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const course = event.target.value;
    const checked = event.target.checked;
    if (checked) {
      params.append("courses", course);
    } else {
      params.delete("courses", course);
    }
    setParams(params);
  };

  const handleAbsFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    if(value){
      params.set(name, value);
    }else{
      params.delete(name);
    }
    setParams(params);
  }

  if (props.studentsList.length === 0) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="main-screen">
      <h2>Students List</h2>
      <div className="stats">
        <button onClick={props.onRemove}>POP Student</button>
        <button onClick={scrollToLast}>Scroll to Last</button>
        <b style={{ fontSize: "12px", fontWeight: 100, color: "gray" }}>
          Total Absents {totalAbsents}
        </b>
      </div>
      <div className="filter">
        <input
          type="search"
          placeholder="Search"
          onChange={handleSearch}
          value={params.get("q") || ""}
        />
        <select
          value={params.get("graduated") || "all"}
          onChange={handleGardFilter}
        >
          <option value="all">All</option>
          <option value="grad">Graduated</option>
          <option value="non-grad">Not Graduated</option>
        </select>
        <label htmlFor="minAbs">minAbs</label>
        <input type="number" id="minAbs" name="minAbs" min="0" onChange={handleAbsFilter} value={params.get('minAbs')||'0'}/>
        <label htmlFor="maxAbs">maxAbs</label>
        <input type="number" id="maxAbs" name="maxAbs" max="100" onChange={handleAbsFilter} value={params.get('maxAbs')||'100'}/>
        <div>
          {COURSES_FILTERS.map((c) => (
            <React.Fragment key={c}>
              <input
                id={c}
                type="checkbox"
                value={c}
                onChange={handleCourseFilter}
                checked={params.getAll("courses").includes(c)}
              />
              <label htmlFor={c}>{c}</label>&nbsp;&nbsp;
            </React.Fragment>
          ))}
        </div>
      </div>
      {state.filteredList.length ? (
        <div className="list">
          {state.filteredList.map((student) => (
            <Student
              key={student.id}
              id={student.id}
              name={student.name}
              age={student.age}
              absents={student.absents}
              isGraduated={student.isGraduated}
              coursesList={student.coursesList}
              onAbsentChange={props.onAbsent}
              mode="list"
            />
          ))}
        </div>
      ) : (
        <h3>No results found!</h3>
      )}
      <div ref={lastStdRef}></div>
    </div>
  );
};

export default Main;
