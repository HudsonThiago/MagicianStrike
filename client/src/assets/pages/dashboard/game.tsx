import type { Game } from '../../models/Game';
import { useMatrix } from '../../context/matrixContext';
import { useEffect, useState } from 'react';

export interface chat {
    username:string
    message:string
}

export default function Game(){
    const {matrix, setMatrix} = useMatrix()
    const [coords, setCoords] = useState({ x: 1, y: 1 });
    const [absolutePosition, setAbsolutePosition] = useState({ top: 50, left: 50 });
    //const [move, setMove] = useState<boolean>(true)
    
    useEffect(()=>{
        console.log(matrix)
    }, [])

    let move = true
    let row = 1
    let col = 1

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if(move===true){
                move = false

                setAbsolutePosition((prev) => {
                    let top = prev.top;
                    let left = prev.left;

                    row = Math.floor(left/50)
                    col = Math.floor(top/50)

                    console.log(matrix[row][col])

                    if (event.key === 'w' || event.key === 'W') {
                        if(!(matrix[row][col-1] !== 0 && matrix[row][col-1] !== 9)){
                            top -= 50;
                        }
                    }
                    if (event.key === 'a' || event.key === 'A') {
                        if(!(matrix[row-1][col] !== 0 && matrix[row-1][col] !== 9)){
                            left -= 50;
                        }
                    }
                    if (event.key === 's' || event.key === 'S') {
                        if(!(matrix[row][col+1] !== 0 && matrix[row][col+1] !== 9)){
                            top += 50;
                        }
                    }
                    if (event.key === 'd' || event.key === 'D') {
                        if(!(matrix[row+1][col] !== 0 && matrix[row+1][col] !== 9)){
                            left += 50;
                        }
                    }

                    setCoords({x:row, y:col})

                    setTimeout(()=>{
                        move = true
                    }, 200)
                
                    //console.log({ top, left });
                    return { top, left };
                });
            }
        };
        
            window.addEventListener("keydown", handleKeyDown);

            return () => {
                window.removeEventListener("keydown", handleKeyDown);
            };
    }, []);

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
        <div className="w-full h-full flex justify-center items-center">
            <div className='relative w-[850px] h-[850px]'>
                <div className='absolute z-10 bg-red-200 w-[50px] h-[50px] transition-all duration-200 ease-linear' 
                    style={{
                    position: "absolute",
                    top: `${absolutePosition.top}px`,
                    left: `${absolutePosition.left}px`,
                }}>

                </div>
                <div className='absolute z-10 bg-blue-200 w-[50px] h-[50px] top-[50px] left-[750px]'>

                </div>
                <div className="absolute z-0 bg-lime-500 grayscale-30 mx-auto grid grid-rows-17 grid-cols-1">
                    {matrix.map((row, x) => (
                        <div key={`row-${x}`} className="flex">
                            {row.map((col, y) => {
                                return getField(x, y)
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
