import { Result } from "@/interfaces";

interface Props {
    isOpen: boolean;
    isExecuting: boolean;
    isCompleted: boolean;
    result: Result | null;
    onClickCancel: () => void; 
}

function ResultModal({isOpen, isExecuting, isCompleted, result, onClickCancel}: Props) {

    if(!isOpen) return null;

    console.log('result', result);

    return (
        <div className="dialog-container absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-black p-4 rounded-lg bg-white shadow-lg">
            <div className="dialog">
                <p>OutPut:</p>
                <div className="border-r-4">
                    <pre className='mt-4'>
                        nodeCount: {result?.nodeCount}
                        <br></br>
                        elementCount: {result?.elementCount}
                    </pre>
                </div>

                {isExecuting && (
                    <div className="buttons py-2 flex justify-between">Working....</div>
                )}

                {isCompleted && (
                    <div className="buttons py-2 flex justify-between">
                    <button onClick={onClickCancel}>cancel</button>
                </div>
                )}     
            </div>
        </div>
    )
}

export default ResultModal;