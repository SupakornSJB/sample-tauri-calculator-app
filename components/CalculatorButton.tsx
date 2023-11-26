import React from "react";

interface ButtonProps {
  symbol: string,
  onPressCallback: (symbol: string) => void
  isNumber: boolean
}

const CalculatorButton: React.FC<ButtonProps> = (props) => {
  return (
    <button className={`btn ${props.isNumber ? "btn-primary" : "btn-secondary"} rounded-lg h-full`} onClick={() => props.onPressCallback(props.symbol)}>
      <h1 className="text-white font-bold">
        {props.symbol}
      </h1>
    </button>
  )
}

export default CalculatorButton
