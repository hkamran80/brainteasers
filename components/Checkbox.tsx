import { v4 as uuidv4 } from "uuid";

const Checkbox = ({
    label,
    state,
    setState,
}: {
    label: string;
    state: boolean;
    setState: (value: boolean) => void;
}) => {
    const uniqueId = uuidv4();

    return (
        <div className="relative items-center">
            <input
                type="checkbox"
                id={uniqueId}
                className="invisible peer"
                defaultChecked={state}
                onClick={() => setState(!state)}
            />

            <label
                htmlFor={uniqueId}
                className="border-2 border-solid border-black rounded-[50%] cursor-pointer h-[24px] left-0 absolute top-0 w-[24px] peer-checked:bg-sky-500 peer-checked:border-sky-500"
            />

            <span className="relative ml-8">{label}</span>
        </div>
    );
};

export default Checkbox;
