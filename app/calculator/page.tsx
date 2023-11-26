"use client"

import CalculatorButton from "@/components/CalculatorButton";
import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import { useRouter } from "next/navigation"

const ALL_OPERATION = ["+", "-", "*", "/"];
const ALL_COMMAND = ["DELETE", "ENTER", "CLEAR"]

// used for displaying and calculating
interface ICalculatable {
  num1?: string,
  op?: string,
  num2?: string,
  calculatable: boolean
}

const Calculator = () => {
  const [buffer, setBuffer] = useState<string[]>([]);
  const [displayText, setDisplayText] = useState<string>("");
  const router = useRouter();

  const calculate = async (calculatable: ICalculatable) => {
    // invoke calculation and input result into the buffer
    if (!calculatable.num1 || !calculatable.num2) return;
    return invoke<number>("calculator", { num1: parseInt(calculatable.num1), num2: parseInt(calculatable.num2), op: calculatable.op })
      .then(result => {
        setBuffer(result.toString().split(""))
      })
      .catch(console.error)
  }

  const pushToBuffer = (symbol: string) => {
    // push the symbol to the buffer
    setBuffer(arr => {
      const newArr = [...arr];
      newArr.push(symbol);
      return newArr;
    })
  }

  const updateDisplay = (calcable: ICalculatable) => {
    setDisplayText(calcable.num1 + " " + calcable.op + " " + calcable.num2)
  }

  const onCommmandPress = (symbol: string) => {
    switch (symbol) {
      case "DELETE":
        setBuffer(prev => {
          const newArr = [...prev];
          return newArr.slice(0, newArr.length - 1);
        });
        break;
      case "ENTER":
        calculate(translateBufferToCalcable(buffer));
        break;
      case "CLEAR":
        setBuffer([]);
        break;
    }
  }

  const translateBufferToCalcable = (inputBuffer: string[]): ICalculatable => {
    // get the intended buffer and transform into the calculatable value
    let numOperator = 0;
    const displayTemp: string[][] = [[], [], []]
    for (let i of inputBuffer) {
      let isOperator = false;
      if (ALL_OPERATION.includes(i)) {
        numOperator += 1;
        isOperator = true;
      }

      switch (numOperator) {
        case 0:
          displayTemp[0].push(i);
          break;
        case 1:
          if (isOperator) {
            displayTemp[1].push(i);
          } else {
            displayTemp[2].push(i);
          }
          break;
      }
    }

    return {
      num1: displayTemp[0].join(""),
      num2: displayTemp[2].join(""),
      op: displayTemp[1].join(""),
      calculatable: displayTemp[0].length != 0 && displayTemp[1].length != 0 && displayTemp[2].length != 0
    }
  }

  useEffect(() => {
    const countOperator = () => {
      let numOperator = 0;
      for (let i of buffer) {
        if (ALL_OPERATION.includes(i)) {
          numOperator += 1;
        }
      }

      return numOperator;
    }

    (async () => {
      let lastOperator: string | null = null
      let currentBuffer = buffer
      let requireCalculation = false;

      if (countOperator() > 1) {
        requireCalculation = true;
        lastOperator = buffer[buffer.length - 1];
        currentBuffer = buffer.slice(0, buffer.length - 2);
      }

      const calcable = translateBufferToCalcable(buffer);
      if (requireCalculation && calcable.calculatable) {
        await calculate(calcable)
        setBuffer(prev => {
          const newArr = [...prev];
          if (lastOperator) {
            newArr.push(lastOperator);
          }
          return newArr
        })
      }

      updateDisplay(calcable);
    })()
  }, [buffer])

  return (
    <div className="flex flex-col h-screen">
      <button className="btn btn-neutral mx-4 mt-4" onClick={() => router.push("/")}>
        {"<"} Back
      </button>
      <div className="w-full h-1/4 p-4">
        <div className="w-full flex h-full border-4 border-accent rounded-lg justify-end">
          <h1 className="font-bold text-white text-6xl my-auto mx-3">
            {displayText}
          </h1>
        </div>
      </div>
      <div className="w-full h-3/4 p-4 pt-0">
        <div className="w-full flex h-full border-4 border-neutral rounded-lg">
          <div className="grid grid-cols-3 m-3 mr-0 w-3/5 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((sym) =>
              <CalculatorButton key={sym.toString()} symbol={sym.toString()} onPressCallback={pushToBuffer} isNumber={true}></CalculatorButton>
            )}
          </div>
          <div className="grid grid-cols-2 m-3 w-2/5 gap-2">
            {ALL_OPERATION.map((sym) =>
              <CalculatorButton key={sym} symbol={sym} onPressCallback={pushToBuffer} isNumber={false}></CalculatorButton>
            )}
            {ALL_COMMAND.map((sym) =>
              <CalculatorButton key={sym} symbol={sym} onPressCallback={onCommmandPress} isNumber={false}></CalculatorButton>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calculator;
