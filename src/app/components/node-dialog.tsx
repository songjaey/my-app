import { useState } from "react";

interface Props {
    title: string;
    isOpen: boolean;
    onClickOK: (x: number, y: number, z: number) => void;
    onClickCancel: () => void;
}

function NodeDialog({title, isOpen, onClickOK, onClickCancel}: Props) {
    const [x, setX] = useState<number>(0);
    const [y, setY] = useState<number>(0);
    const [z, setZ] = useState<number>(0);

    if(!isOpen) return null;

    const handleSubmit = () => {
        onClickOK(x, y, z);
    }
    const xChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setX(Number(e.target.value));
    };
    const yChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setY(Number(e.target.value));
    };
    const zChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setZ(Number(e.target.value));
    };

    return (
        <div className="dialog-container absolute top-36 left-5 border border-black">
            <div className="dialog">
                <h2 className="text">{title}</h2>
                <p>Position</p>
                <div className="py-2">
                    <label className="px-2">X</label>
                    <input className="" type="number" value={x} onChange={xChange}/>
                </div>
                <div className="py-2">
                    <label className="px-2">Y</label>
                    <input className="" type="number" value={y} onChange={yChange}/>
                </div>
                <div>
                    <label className="px-2">Z</label>
                    <input className="" type="number" value={z} onChange={zChange}/>
                </div>
                <div className="buttons py-2 flex justify-between">
                    <button onClick={onClickCancel}>cancel</button>
                    <button onClick={handleSubmit}>create</button>
                </div>
            </div>
        </div>
    );
};

export default NodeDialog;