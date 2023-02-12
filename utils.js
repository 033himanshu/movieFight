const debounceInput=(func,delay=500)=>{
    let timeoutId
    return (...args)=>{
        clearTimeout(timeoutId)
        timeoutId=setTimeout(()=>{
            func.apply(null,args)
        },delay)
    }
}