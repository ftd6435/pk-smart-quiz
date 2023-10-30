import { useEffect } from "react";

function useTimer(seconds, onDispatch){
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;

    useEffect(function(){
        const id = setInterval(() => {
            onDispatch({type: 'tick'});
        }, 1000);

        return () => clearInterval(id);
    }, [onDispatch]);

    return {min, sec};
}

export default useTimer;