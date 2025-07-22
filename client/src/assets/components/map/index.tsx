import { useEffect, useState } from "react"
import { useMatrix } from "../../context/matrixContext"

export default function Map(){
    const {matrix, setMatrix} = useMatrix()

    const getMap=()=>{

    }
    
    const getField=(x:number, y:number)=>{
        if(matrix[x][y] === 1) {
            return <div
                key={`spot-${x}-${y}`}
                className="bg-[url('/public/wallBrick.svg')] bg-cover w-[50px] h-[50px]"
            >
            </div>
        } if(matrix[x][y] === 2) {
            return <div
                key={`spot-${x}-${y}`}
                className="bg-[url('/public/wallBrick.svg')] bg-cover w-[50px] h-[50px]"
            >
            </div>
        } if(matrix[x][y] === 3) {
            return <div
                key={`spot-${x}-${y}`}
                className="bg-[url('/public/brick.svg')] bg-cover w-[50px] h-[50px]"
            >
            </div>
        } else {
            return <div
                key={`spot-${x}-${y}`}
                className="w-[50px] h-[50px]"
            >
            </div>
        }
    }


    return (
        <div className="absolute z-0 bg-lime-500 grayscale-30 mx-auto grid grid-rows-17 grid-cols-1">
            {matrix.map((row, x) => (
                <div key={`row-${x}`} className="flex">
                    {row.map((col, y) => {
                        return getField(x, y)
                    })}
                </div>
            ))}
        </div>
    )
}

function spot(matrix:number[][], x:number, y:number){
    const [coords, setCoords] = useState({ x: x, y: y });
    
    useEffect(()=>{

    }, [])

    const getField=(x:number, y:number)=>{
        if(matrix[x][y] === 1) {
            return <div
                key={`spot-${x}-${y}`}
                className="bg-[url('/public/wallBrick.svg')] bg-cover w-[50px] h-[50px]"
            >
            </div>
        } if(matrix[x][y] === 2) {
            return <div
                key={`spot-${x}-${y}`}
                className="bg-[url('/public/wallBrick.svg')] bg-cover w-[50px] h-[50px]"
            >
            </div>
        } if(matrix[x][y] === 3) {
            return <div
                key={`spot-${x}-${y}`}
                className="bg-[url('/public/brick.svg')] bg-cover w-[50px] h-[50px]"
            >
            </div>
        } else {
            return <div
                key={`spot-${x}-${y}`}
                className="w-[50px] h-[50px]"
            >
            </div>
        }
    }

    return (
        <div>
            {getField(x, y)}
        </div>
    )
}