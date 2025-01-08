import { IStudent } from "../types";

interface IState {
  students: IStudent[];
  totalAbsents: number;
}

type Action =
  | { type: "INIT_DATA"; payload: IStudent[] }
  | { type: "ABSENT_CHANGE"; payload: { id: string; change: number } }
  | { type: "ADD_STUDENT"; payload: IStudent }
  | { type: "REMOVE_FIRST"};
const studentReducer = (state: IState, action: Action) :IState=> {
  switch (action.type) {
    case "INIT_DATA": {
      const totalAbsents = action.payload.reduce(
        (sum, student) => sum + student.absents,
        0
      );
      return {students:action.payload, totalAbsents}
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
            totalAbsents: state.totalAbsents + change
        }
    }
    case "ADD_STUDENT": {
        return {
            students: [action.payload, ...state.students],
            totalAbsents: state.totalAbsents + action.payload.absents,
          };
    }
    case "REMOVE_FIRST": {
      const newList = [...state.students];
      const removed = state.students[0];
      newList.shift();
      return { students: newList, totalAbsents: state.totalAbsents - removed?.absents||0};
    }
    default: {
      return state;
    }
  }
};
export default studentReducer;
