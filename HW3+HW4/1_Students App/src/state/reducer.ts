import { IStudent } from "../types";

interface IState {
  students: IStudent[];
  totalAbsents: number;
  filteredList: IStudent[];
}

type Action =
  | { type: "INIT_DATA"; payload: IStudent[] }
  | { type: "ABSENT_CHANGE"; payload: { id: string; change: number } }
  | { type: "ADD_STUDENT"; payload: IStudent }
  | { type: "REMOVE_FIRST" }
  | {
      type: "Filter";
      payload: { query?: string; graduated?: string; courses?: string[]; minAbs?: number; maxAbs?: number};
    };
const studentReducer = (state: IState, action: Action): IState => {
  switch (action.type) {
    case "INIT_DATA": {
      const totalAbsents = action.payload.reduce(
        (sum, student) => sum + student.absents,
        0
      );
      return {
        students: action.payload,
        totalAbsents,
        filteredList: action.payload,
      };
    }
    case "ABSENT_CHANGE": {
      const { id, change } = action.payload;
      const updatedStudents = state.students.map((student) =>
        student.id === id
          ? { ...student, absents: student.absents + change }
          : student
      );
      return {
        students: updatedStudents,
        totalAbsents: state.totalAbsents + change,
        filteredList: state.filteredList.map((student) =>
          student.id === id
            ? { ...student, absents: student.absents + change }
            : student
        ),
      };
    }
    case "ADD_STUDENT": {
      return {
        students: [action.payload, ...state.students],
        totalAbsents: state.totalAbsents + action.payload.absents,
        filteredList: [action.payload, ...state.filteredList],
      };
    }
    case "REMOVE_FIRST": {
      const newList = [...state.students];
      const removed = state.students[0];
      newList.shift();
      return {
        students: newList,
        totalAbsents: state.totalAbsents - removed?.absents || 0,
        filteredList: state.filteredList.filter((_, index) => index !== 0),
      };
    }

    case "Filter": {
      const { query = "", graduated = "grad", courses = [], minAbs=0, maxAbs=0 } = action.payload;
      let filteredList = state.students;
      if (query) {
        filteredList = filteredList.filter((std) =>
          std.name.toLowerCase().includes(query.toLowerCase())
        );
      }
      if (graduated === "grad") {
        filteredList = filteredList.filter((std) => std.isGraduated);
      } else if (graduated === "non-grad") {
        filteredList = filteredList.filter((std) => !std.isGraduated);
      }

      if (courses.length) {
        filteredList = filteredList.filter((std) =>
          courses.every((course) => std.coursesList.includes(course))
        );
      }

       filteredList=filteredList.filter((std)=>std.absents>=minAbs && std.absents<=maxAbs)

      return { ...state, filteredList };
    }
    default: {
      return state;
    }
  }
};
export default studentReducer;
