export default function SlashMenu({onSelect})
{
    const style="p-2 hover:bg-gray-200 hover:dark:bg-gray-700 cursor-pointer rounded-md transition";

    return(
        <div className="bg-gray-100 dark:bg-gray-800 shadow-lg rounded-xl p-2 border border-gray-200 dark:border-gray-700 w-48 text-gray-900 dark:text-gray-100">

            <div
            onClick={()=>onSelect("text")}
            className={style}>Text</div>

            <div
            onClick={()=>onSelect("heading")}
            className={style}>Heading</div>

            <div
            onClick={()=>onSelect("image")}
            className={style}>Image</div>

            <div
            onClick={()=>onSelect("todo")}
            className={style}>To-do</div>
            
            <div
            onClick={()=>onSelect("divider")}
            className={style}>Divider</div>

        </div>
    );
}