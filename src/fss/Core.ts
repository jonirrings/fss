enum FSS {
    FRONT = 0,
    BACK = 1,
    DOUBLE = 2,
    SVGNS = 'http://www.w3.org/2000/svg'
}

function isNumber(value:any):boolean{
     return !isNaN(parseFloat(value)) && isFinite(value);
}
