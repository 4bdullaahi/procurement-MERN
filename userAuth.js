import react,{useState,createContext,useContext} from 'react';

const usercontext=createContext();
export const Authentication=({children})=>{

    const [ispermitted,setispermitted]=useState(()=>{
        return localStorage.getItem('email')!==null;
    })

    const login=()=>setispermitted(true);

    const logout=()=>{
        localStorage.removeItem('username');
        localStorage.removeItem('ID');
        setispermitted(false);
    }
 return (
    <usercontext.Provider value={{ispermitted,login,logout}}>
        {children}
    </usercontext.Provider>
 )


}

export const userOuth=()=>{
    return useContext(usercontext);
}