function getSizeF(byteSize)
{
    let size = byteSize;
    let unit = "BKMGT";
    let time = 0;
    //convert byteSize into human readable format
    while(size >= 1000)
    {
        size /= 1000;
        time++;
    }
    size = size.toFixed(1).toString();
    if(size[size.length - 1] == '0')
    {
        size = size.substr(0, size.length - 2);
    }
    size += unit[time];
    //or we can use result = Math.floor.(Math.log10(byteSize)/3); => size += unit[unit.indexOf(result)]
    return [size, byteSize];
}

module.exports = getSizeF;