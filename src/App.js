import { useReducer } from "react"
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import './App.css';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OP: 'choose-op',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete_digit'
}

function reducer(state, { type, payload }) {
  switch (type) {

    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOp: payload.digit
        }
      }
      if (payload.digit === 0 && state.currentOp === "0") return state
      if (payload.digit === "." && state.currentOp === undefined) return state
      if (payload.digit === "." && state.currentOp.includes("."))
        return state
      return {
        ...state,
        currentOp: `${state.currentOp || ""}${payload.digit}`,
      }

    case ACTIONS.CLEAR:
      return {}


    case ACTIONS.EVALUATE:
      if (state.operation == null || state.prevOp == null || state.currentOp == null) {
        return state
      }

      if (state.operation !== null || state.prevOp !== null || state.currentOp !== null) {
        return {
          ...state,
          currentOp: evaluate(state),
          prevOp: null,
          operation: null,
          overwrite: true
        }
      }

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {}
      }
      if (state.currentOp == null) return state
      if (state.currentOp.length === 1) {
        return {
          ...state,
          currentOp: null
        }
      }
      return {
        ...state, 
        currentOp: state.currentOp.slice(0, -1)
      }

    case ACTIONS.CHOOSE_OP:
      if (state.currentOp == null && state.prevOp == null) {
        return state
      }

      if (state.prevOp == null) {
        return {
          ...state,
          operation: payload.operation,
          prevOp: state.currentOp,
          currentOp: null
        }
      }

      if (state.currentOp == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }

      return {
        ...state,
        prevOp: evaluate(state),
        operation: payload.operation,
        currentOp: null
      }
  }
}


function evaluate({ prevOp, currentOp, operation }) {
  const previous = parseFloat(prevOp)
  const current = parseFloat(currentOp)
  if (isNaN(previous) || isNaN(current)) return ""
  let compute = ""
  switch (operation) {
    case "+":
      compute = previous + current
      break
    case "-":
      compute = previous - current
      break
    case "*":
      compute = previous * current
      break
    case "÷":
      compute = previous / current
      break
    
  }

  return compute.toString()
}



function App() {
  const [{ currentOp = 0, prevOp, operation }, dispatch] = useReducer(reducer, {})
  return (
    <div className="calculator-grid">
      <div className="calculator-output">
        <div className="prev-number">{prevOp} {operation}</div>
        <div className="current-number">{currentOp} </div>
      </div>
      <div className="box">
      <button className="size-two grey" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button className="grey" onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT } )}> DEL </button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit={1} dispatch={dispatch}></DigitButton>
      <DigitButton digit={2} dispatch={dispatch}></DigitButton>
      <DigitButton digit={3} dispatch={dispatch}></DigitButton>
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit={4} dispatch={dispatch}></DigitButton>
      <DigitButton digit={5} dispatch={dispatch}></DigitButton>
      <DigitButton digit={6} dispatch={dispatch}></DigitButton>
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit={7} dispatch={dispatch}></DigitButton>
      <DigitButton digit={8} dispatch={dispatch}></DigitButton>
      <DigitButton digit={9} dispatch={dispatch}></DigitButton>
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit={"."} dispatch={dispatch}></DigitButton>
      <DigitButton digit={0} dispatch={dispatch}></DigitButton>
      <button className="size-two red" onClick={() => dispatch({type: ACTIONS.EVALUATE } )}> = </button>
      </div>

    </div>
  );
}

export default App;
